<?php
require_once __DIR__ . '/../config/db.php';
require_admin();

$stats = [
    'users'    => $pdo->query('SELECT COUNT(*) FROM users WHERE role = "user"')->fetchColumn(),
    'projects' => $pdo->query('SELECT COUNT(*) FROM projects')->fetchColumn(),
    'notes'    => $pdo->query('SELECT COUNT(*) FROM notes')->fetchColumn(),
    'messages' => $pdo->query('SELECT COUNT(*) FROM messages WHERE status = "unread"')->fetchColumn(),
];

$recentMessages = $pdo->query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 5')->fetchAll();
$recentUsers = $pdo->query('SELECT * FROM users WHERE role = "user" ORDER BY created_at DESC LIMIT 5')->fetchAll();

$pageTitle = 'Dashboard';
$activePage = 'dashboard';
include __DIR__ . '/includes/admin-header.php';
?>

<div class="row g-3 mb-4">
  <div class="col-6 col-lg-3">
    <div class="stat-card">
      <div class="text-secondary small mb-1"><i class="bi bi-people me-1"></i>Registered Users</div>
      <h3 class="mb-0"><?= (int)$stats['users'] ?></h3>
    </div>
  </div>
  <div class="col-6 col-lg-3">
    <div class="stat-card">
      <div class="text-secondary small mb-1"><i class="bi bi-kanban me-1"></i>Projects</div>
      <h3 class="mb-0"><?= (int)$stats['projects'] ?></h3>
    </div>
  </div>
  <div class="col-6 col-lg-3">
    <div class="stat-card">
      <div class="text-secondary small mb-1"><i class="bi bi-journal-text me-1"></i>Notes</div>
      <h3 class="mb-0"><?= (int)$stats['notes'] ?></h3>
    </div>
  </div>
  <div class="col-6 col-lg-3">
    <div class="stat-card">
      <div class="text-secondary small mb-1"><i class="bi bi-envelope me-1"></i>Unread Messages</div>
      <h3 class="mb-0"><?= (int)$stats['messages'] ?></h3>
    </div>
  </div>
</div>

<div class="row g-4">
  <div class="col-lg-6">
    <div class="card-surface p-4">
      <h6 class="mb-3">Recent Messages</h6>
      <?php if (!$recentMessages): ?>
        <p class="text-secondary small mb-0">No messages yet.</p>
      <?php else: ?>
        <ul class="list-unstyled mb-0">
          <?php foreach ($recentMessages as $m): ?>
            <li class="d-flex justify-content-between border-bottom py-2" style="border-color: var(--border-subtle) !important;">
              <div>
                <div class="fw-semibold small"><?= clean($m['subject']) ?></div>
                <div class="text-secondary small"><?= clean($m['name']) ?> &middot; <?= clean($m['email']) ?></div>
              </div>
              <span class="text-secondary small"><?= date('M j', strtotime($m['created_at'])) ?></span>
            </li>
          <?php endforeach; ?>
        </ul>
        <a href="<?= url('admin/manage-messages.php') ?>" class="small d-block mt-3">View all messages &rarr;</a>
      <?php endif; ?>
    </div>
  </div>
  <div class="col-lg-6">
    <div class="card-surface p-4">
      <h6 class="mb-3">Newest Users</h6>
      <?php if (!$recentUsers): ?>
        <p class="text-secondary small mb-0">No users registered yet.</p>
      <?php else: ?>
        <ul class="list-unstyled mb-0">
          <?php foreach ($recentUsers as $u): ?>
            <li class="d-flex justify-content-between border-bottom py-2" style="border-color: var(--border-subtle) !important;">
              <div>
                <div class="fw-semibold small"><?= clean($u['name']) ?></div>
                <div class="text-secondary small"><?= clean($u['email']) ?></div>
              </div>
              <span class="text-secondary small"><?= date('M j', strtotime($u['created_at'])) ?></span>
            </li>
          <?php endforeach; ?>
        </ul>
        <a href="<?= url('admin/manage-users.php') ?>" class="small d-block mt-3">Manage all users &rarr;</a>
      <?php endif; ?>
    </div>
  </div>
</div>

<?php include __DIR__ . '/includes/admin-footer.php'; ?>
