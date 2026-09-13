<?php
require_once __DIR__ . '/../config/db.php';
require_admin();

if (isset($_GET['mark_read'])) {
    $pdo->prepare('UPDATE messages SET status = "read" WHERE id = ?')->execute([(int)$_GET['mark_read']]);
    redirect(url('admin/manage-messages.php'));
}
if (isset($_GET['mark_replied'])) {
    $pdo->prepare('UPDATE messages SET status = "replied" WHERE id = ?')->execute([(int)$_GET['mark_replied']]);
    redirect(url('admin/manage-messages.php'));
}
if (isset($_GET['delete'])) {
    $pdo->prepare('DELETE FROM messages WHERE id = ?')->execute([(int)$_GET['delete']]);
    set_flash('success', 'Message deleted.');
    redirect(url('admin/manage-messages.php'));
}

$messages = $pdo->query('SELECT * FROM messages ORDER BY created_at DESC')->fetchAll();

$pageTitle = 'Messages';
$activePage = 'messages';
include __DIR__ . '/includes/admin-header.php';
?>

<div class="card-surface p-4">
  <h6 class="mb-3">Inbox (<?= count($messages) ?>)</h6>
  <?php if (!$messages): ?>
    <p class="text-secondary small mb-0">No messages received yet.</p>
  <?php endif; ?>
  <div class="accordion" id="messagesAccordion">
    <?php foreach ($messages as $i => $m): ?>
      <div class="accordion-item bg-transparent" style="border-color: var(--border-subtle);">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed bg-transparent text-light" type="button" data-bs-toggle="collapse" data-bs-target="#msg<?= $m['id'] ?>">
            <span class="me-3">
              <?php if ($m['status'] === 'unread'): ?><span class="badge bg-warning text-dark">New</span>
              <?php elseif ($m['status'] === 'replied'): ?><span class="badge bg-success">Replied</span>
              <?php else: ?><span class="badge bg-secondary">Read</span><?php endif; ?>
            </span>
            <strong class="me-2"><?= clean($m['subject']) ?></strong>
            <span class="text-secondary small">from <?= clean($m['name']) ?> &middot; <?= date('M j, Y', strtotime($m['created_at'])) ?></span>
          </button>
        </h2>
        <div id="msg<?= $m['id'] ?>" class="accordion-collapse collapse" data-bs-parent="#messagesAccordion">
          <div class="accordion-body">
            <p class="text-secondary small mb-2"><?= clean($m['email']) ?></p>
            <p style="white-space: pre-line;"><?= clean($m['message']) ?></p>
            <div class="d-flex gap-2 mt-3">
              <a href="mailto:<?= clean($m['email']) ?>?subject=Re: <?= urlencode($m['subject']) ?>" class="btn btn-sm btn-accent">Reply via Email</a>
              <a href="<?= url('admin/manage-messages.php?mark_read=' . $m['id']) ?>" class="btn btn-sm btn-outline-accent">Mark Read</a>
              <a href="<?= url('admin/manage-messages.php?mark_replied=' . $m['id']) ?>" class="btn btn-sm btn-outline-accent">Mark Replied</a>
              <a href="<?= url('admin/manage-messages.php?delete=' . $m['id']) ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this message?');">Delete</a>
            </div>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</div>

<?php include __DIR__ . '/includes/admin-footer.php'; ?>
