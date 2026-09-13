<?php
require_once __DIR__ . '/../config/db.php';
require_admin();

$currentAdminId = current_user()['id'];

if (isset($_GET['ban']) || isset($_GET['unban'])) {
    $id = (int)($_GET['ban'] ?? $_GET['unban']);
    if ($id === $currentAdminId) {
        set_flash('danger', "You can't change the status of your own account.");
    } else {
        $newStatus = isset($_GET['ban']) ? 'banned' : 'active';
        $pdo->prepare('UPDATE users SET status = ? WHERE id = ?')->execute([$newStatus, $id]);
        set_flash('success', 'User status updated.');
    }
    redirect(url('admin/manage-users.php'));
}

if (isset($_GET['promote']) || isset($_GET['demote'])) {
    $id = (int)($_GET['promote'] ?? $_GET['demote']);
    if ($id === $currentAdminId) {
        set_flash('danger', "You can't change your own role.");
    } else {
        $newRole = isset($_GET['promote']) ? 'admin' : 'user';
        $pdo->prepare('UPDATE users SET role = ? WHERE id = ?')->execute([$newRole, $id]);
        set_flash('success', 'User role updated.');
    }
    redirect(url('admin/manage-users.php'));
}

if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    if ($id === $currentAdminId) {
        set_flash('danger', "You can't delete your own account.");
    } else {
        $pdo->prepare('DELETE FROM users WHERE id = ?')->execute([$id]);
        set_flash('success', 'User deleted.');
    }
    redirect(url('admin/manage-users.php'));
}

$users = $pdo->query('SELECT * FROM users ORDER BY created_at DESC')->fetchAll();

$pageTitle = 'Manage Users';
$activePage = 'users';
include __DIR__ . '/includes/admin-header.php';
?>

<div class="card-surface p-4">
  <h6 class="mb-3">All Users (<?= count($users) ?>)</h6>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th></th></tr></thead>
      <tbody>
      <?php foreach ($users as $u): ?>
        <tr>
          <td><?= clean($u['name']) ?><?= $u['id'] === $currentAdminId ? ' <span class="text-secondary small">(you)</span>' : '' ?></td>
          <td><?= clean($u['email']) ?></td>
          <td><span class="tech-pill"><?= clean(ucfirst($u['role'])) ?></span></td>
          <td>
            <span class="badge <?= $u['status'] === 'active' ? 'badge-status-active' : 'badge-status-banned' ?>">
              <?= clean(ucfirst($u['status'])) ?>
            </span>
          </td>
          <td class="text-secondary small"><?= date('M j, Y', strtotime($u['created_at'])) ?></td>
          <td class="text-end">
            <?php if ($u['id'] !== $currentAdminId): ?>
              <?php if ($u['role'] === 'user'): ?>
                <a href="<?= url('admin/manage-users.php?promote=' . $u['id']) ?>" class="btn btn-sm btn-outline-accent me-1" title="Promote to admin"><i class="bi bi-arrow-up-circle"></i></a>
              <?php else: ?>
                <a href="<?= url('admin/manage-users.php?demote=' . $u['id']) ?>" class="btn btn-sm btn-outline-accent me-1" title="Demote to user"><i class="bi bi-arrow-down-circle"></i></a>
              <?php endif; ?>

              <?php if ($u['status'] === 'active'): ?>
                <a href="<?= url('admin/manage-users.php?ban=' . $u['id']) ?>" class="btn btn-sm btn-outline-danger me-1" title="Ban user"><i class="bi bi-slash-circle"></i></a>
              <?php else: ?>
                <a href="<?= url('admin/manage-users.php?unban=' . $u['id']) ?>" class="btn btn-sm btn-outline-accent me-1" title="Unban user"><i class="bi bi-check-circle"></i></a>
              <?php endif; ?>

              <a href="<?= url('admin/manage-users.php?delete=' . $u['id']) ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this user permanently?');" title="Delete"><i class="bi bi-trash"></i></a>
            <?php else: ?>
              <span class="text-secondary small">—</span>
            <?php endif; ?>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include __DIR__ . '/includes/admin-footer.php'; ?>
