<nav class="navbar navbar-expand-lg navbar-dark site-navbar sticky-top">
  <div class="container">
    <a class="navbar-brand fw-bold" href="<?= url('index.html') ?>">
      <span class="brand-accent">&lt;</span>Jagannath<span class="brand-accent">/&gt;</span>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
        <li class="nav-item"><a class="nav-link" href="<?= url('index.html') ?>#about">About</a></li>
        <li class="nav-item"><a class="nav-link" href="<?= url('projects.php') ?>">Projects</a></li>
        <li class="nav-item"><a class="nav-link" href="<?= url('notes.php') ?>">Notes</a></li>
        <li class="nav-item"><a class="nav-link" href="<?= url('contact.php') ?>">Contact</a></li>

        <?php if (is_logged_in()): ?>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <i class="bi bi-person-circle me-1"></i><?= clean(current_user()['name']) ?>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="<?= url('profile.php') ?>"><i class="bi bi-person me-2"></i>Profile</a></li>
              <?php if (is_admin()): ?>
                <li><a class="dropdown-item" href="<?= url('admin/index.php') ?>"><i class="bi bi-speedometer2 me-2"></i>Admin Panel</a></li>
              <?php endif; ?>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="<?= url('auth/logout.php') ?>"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
            </ul>
          </li>
        <?php else: ?>
          <li class="nav-item"><a class="nav-link" href="<?= url('auth/login.php') ?>">Login</a></li>
          <li class="nav-item">
            <a class="btn btn-accent btn-sm ms-lg-2" href="<?= url('auth/register.php') ?>">Register</a>
          </li>
        <?php endif; ?>
      </ul>
    </div>
  </div>
</nav>

<?php if ($flash = get_flash()): ?>
  <div class="container mt-3">
    <div class="alert alert-<?= clean($flash['type']) ?> alert-dismissible fade show" role="alert">
      <?= clean($flash['message']) ?>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  </div>
<?php endif; ?>
