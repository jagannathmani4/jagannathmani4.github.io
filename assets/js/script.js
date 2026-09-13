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

// Auto-dismiss flash alerts after 5s
document.querySelectorAll('.alert').forEach(function (alertEl) {
  setTimeout(function () {
    var alert = bootstrap.Alert.getOrCreateInstance(alertEl);
    alert.close();
  }, 5000);
});
