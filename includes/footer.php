  <footer class="site-footer py-5 mt-5">
    <div class="container">
      <div class="row gy-4">
        <div class="col-md-4">
          <h5 class="fw-bold mb-3"><span class="brand-accent">&lt;</span>Jagannath<span class="brand-accent">/&gt;</span></h5>
          <p class="text-secondary small mb-0">Building things for the web, one project at a time.</p>
        </div>
        <div class="col-md-4">
          <h6 class="text-uppercase fw-semibold small mb-3">Quick Links</h6>
          <ul class="list-unstyled footer-links">
            <li><a href="<?= url('projects.php') ?>">Projects</a></li>
            <li><a href="<?= url('notes.php') ?>">Notes</a></li>
            <li><a href="<?= url('contact.php') ?>">Contact</a></li>
          </ul>
        </div>
        <div class="col-md-4">
          <h6 class="text-uppercase fw-semibold small mb-3">Connect</h6>
          <div class="d-flex gap-3 fs-5">
            <a href="#" class="text-light"><i class="bi bi-github"></i></a>
            <a href="#" class="text-light"><i class="bi bi-linkedin"></i></a>
            <a href="mailto:<?= clean(ADMIN_EMAIL) ?>" class="text-light"><i class="bi bi-envelope-fill"></i></a>
          </div>
        </div>
      </div>
      <hr class="border-secondary my-4">
      <p class="text-center text-secondary small mb-0">&copy; <?= date('Y') ?> <?= clean(SITE_NAME) ?>. All rights reserved.</p>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="<?= asset('assets/js/script.js') ?>"></script>
</body>
</html>
