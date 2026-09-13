<?php
// Expects $pageTitle and $activePage to be set by the including admin page.
$pageTitle = $pageTitle ?? 'Admin';
$activePage = $activePage ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= clean($pageTitle) ?> | Admin Panel</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="<?= asset('assets/css/style.css') ?>">
</head>
<body>
<div class="d-flex">
  <nav class="admin-sidebar p-3" style="width: 250px; flex-shrink: 0;">
    <a href="<?= url('admin/index.php') ?>" class="d-block mb-4 text-decoration-none">
      <h5 class="fw-bold text-light mb-0"><span class="brand-accent">&lt;</span>Admin<span class="brand-accent">/&gt;</span></h5>
    </a>
    <ul class="nav nav-pills flex-column gap-1">
      <li class="nav-item"><a class="nav-link <?= $activePage === 'dashboard' ? 'active' : '' ?>" href="<?= url('admin/index.php') ?>"><i class="bi bi-speedometer2 me-2"></i>Dashboard</a></li>
      <li class="nav-item"><a class="nav-link <?= $activePage === 'projects' ? 'active' : '' ?>" href="<?= url('admin/manage-projects.php') ?>"><i class="bi bi-kanban me-2"></i>Projects</a></li>
      <li class="nav-item"><a class="nav-link <?= $activePage === 'notes' ? 'active' : '' ?>" href="<?= url('admin/manage-notes.php') ?>"><i class="bi bi-journal-text me-2"></i>Notes</a></li>
      <li class="nav-item"><a class="nav-link <?= $activePage === 'messages' ? 'active' : '' ?>" href="<?= url('admin/manage-messages.php') ?>"><i class="bi bi-envelope me-2"></i>Messages</a></li>
      <li class="nav-item"><a class="nav-link <?= $activePage === 'users' ? 'active' : '' ?>" href="<?= url('admin/manage-users.php') ?>"><i class="bi bi-people me-2"></i>Users</a></li>
      <li class="nav-item"><a class="nav-link <?= $activePage === 'settings' ? 'active' : '' ?>" href="<?= url('admin/api-settings.php') ?>"><i class="bi bi-key me-2"></i>API Settings</a></li>
      <li class="nav-item mt-4"><a class="nav-link" href="<?= url('index.php') ?>"><i class="bi bi-globe me-2"></i>View Site</a></li>
      <li class="nav-item"><a class="nav-link text-danger" href="<?= url('admin/logout.php') ?>"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
    </ul>
  </nav>

  <main class="flex-grow-1 p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0"><?= clean($pageTitle) ?></h3>
      <span class="text-secondary small"><i class="bi bi-person-circle me-1"></i><?= clean(current_user()['name'] ?? 'Admin') ?></span>
    </div>

    <?php if ($flash = get_flash()): ?>
      <div class="alert alert-<?= clean($flash['type']) ?> alert-dismissible fade show" role="alert">
        <?= clean($flash['message']) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    <?php endif; ?>
