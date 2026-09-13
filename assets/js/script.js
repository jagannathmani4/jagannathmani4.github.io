// Toggle password visibility on any input with a sibling [data-toggle-password]
document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var input = document.getElementById(btn.getAttribute('data-toggle-password'));
    if (!input) return;
    var isPassword = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPassword ? 'text' : 'password');
    btn.querySelector('i')?.classList.toggle('bi-eye');
    btn.querySelector('i')?.classList.toggle('bi-eye-slash');
  });
});

// Prevent forced file downloads from route buttons and redirect normally instead.
document.addEventListener('click', function (event) {
  var link = event.target.closest('a[href]');
  if (!link) return;

  var href = link.getAttribute('href');
  if (!href || href === '#') return;

  var shouldBlockDownload = link.hasAttribute('download') || link.dataset.preventDownload === 'true';
  if (!shouldBlockDownload) return;

  event.preventDefault();

  var isLikelyFile = /\.(pdf|zip|doc|docx|txt|jpg|jpeg|png|gif|webp|mp3|mp4|mov|avi|wav)(\?.*)?$/i.test(href);

  if (isLikelyFile) {
    window.open(href, '_blank', 'noopener');
    return;
  }

  window.location.href = href;
});

// Auto-dismiss flash alerts after 5s
document.querySelectorAll('.alert').forEach(function (alertEl) {
  setTimeout(function () {
    var alert = bootstrap.Alert.getOrCreateInstance(alertEl);
    alert.close();
  }, 5000);
});

// Upload selected files to Firebase Storage when a file input is configured.
document.querySelectorAll('[data-firebase-upload]').forEach(function (input) {
  input.addEventListener('change', async function () {
    if (!this.files || !this.files[0]) {
      return;
    }

    var file = this.files[0];
    var folder = this.getAttribute('data-firebase-folder') || 'portfolio-uploads';
    var target = this.getAttribute('data-firebase-target');
    var statusEl = this.closest('.mb-3, .form-group')?.querySelector('.firebase-upload-status');
    var provider = this.getAttribute('data-storage-provider') || 'supabase';

    if (!target) {
      return;
    }

    if (statusEl) {
      statusEl.textContent = 'Uploading to ' + provider + ' storage...';
    }

    try {
      var url;
      if (provider === 'firebase' && typeof window.uploadFileToFirebase === 'function') {
        url = await window.uploadFileToFirebase(file, folder + '/' + file.name);
      } else if (typeof window.uploadFileToSupabase === 'function') {
        url = await window.uploadFileToSupabase(file, folder + '/' + file.name);
      } else {
        throw new Error('No storage provider available.');
      }

      var targetInput = document.getElementById(target);
      if (targetInput) {
        targetInput.value = url;
      }
      if (statusEl) {
        statusEl.textContent = 'Uploaded successfully to ' + provider + ' storage';
      }
    } catch (error) {
      if (statusEl) {
        statusEl.textContent = 'Upload failed. Please try another file.';
      }
      console.error('Storage upload failed:', error);
    }
  });
});
