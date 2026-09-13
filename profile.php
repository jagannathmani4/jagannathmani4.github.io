<?php
require_once __DIR__ . '/config/db.php';
require_login(url('auth/login.php'));

$user = current_user();
$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['change_password'])) {
    if (!verify_csrf()) {
        $errors[] = 'Invalid form submission. Please try again.';
    } else {
        $current = $_POST['current_password'] ?? '';
        $new     = $_POST['new_password'] ?? '';
        $confirm = $_POST['confirm_password'] ?? '';

        $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$user['id']]);
        $dbUser = $stmt->fetch();

        if (!password_verify($current, $dbUser['password'])) {
            $errors[] = 'Current password is incorrect.';
        } elseif (strlen($new) < 6) {
            $errors[] = 'New password must be at least 6 characters.';
        } elseif ($new !== $confirm) {
            $errors[] = 'New passwords do not match.';
        } else {
            $hash = password_hash($new, PASSWORD_DEFAULT);
            $update = $pdo->prepare('UPDATE users SET password = ? WHERE id = ?');
            $update->execute([$hash, $user['id']]);
            $success = 'Password updated successfully.';
        }
    }
}

$stmt = $pdo->prepare('SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC');
$stmt->execute([$user['id']]);
$myMessages = $stmt->fetchAll();

$pageTitle = 'My Profile';
include __DIR__ . '/includes/header.php';
include __DIR__ . '/includes/navbar.php';
?>

<section class="pt-5">
  <div class="container" style="max-width: 800px;">
    <h2 class="section-title">My Profile</h2>
    <p class="section-subtitle">Manage your account and view your sent messages.</p>

    <?php if ($errors): ?>
      <div class="alert alert-danger"><ul class="mb-0 ps-3"><?php foreach ($errors as $e): ?><li><?= clean($e) ?></li><?php endforeach; ?></ul></div>
    <?php endif; ?>
    <?php if ($success): ?>
      <div class="alert alert-success"><?= clean($success) ?></div>
    <?php endif; ?>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="card-surface p-4 h-100">
          <h6 class="text-uppercase small text-secondary mb-3">Account Info</h6>
          <p class="mb-1"><strong><?= clean($user['name']) ?></strong></p>
          <p class="text-secondary small mb-0"><?= clean($user['email']) ?></p>
          <span class="tech-pill mt-3"><?= clean(ucfirst($user['role'])) ?></span>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card-surface p-4 h-100">
          <h6 class="text-uppercase small text-secondary mb-3">Change Password</h6>
          <form method="post">
            <?= csrf_field() ?>
            <input type="hidden" name="change_password" value="1">
            <div class="mb-2">
              <input type="password" name="current_password" class="form-control form-control-sm" placeholder="Current password" required>
            </div>
            <div class="mb-2">
              <input type="password" name="new_password" class="form-control form-control-sm" placeholder="New password" required minlength="6">
            </div>
            <div class="mb-3">
              <input type="password" name="confirm_password" class="form-control form-control-sm" placeholder="Confirm new password" required minlength="6">
            </div>
            <button type="submit" class="btn btn-accent btn-sm w-100">Update Password</button>
          </form>
        </div>
      </div>
    </div>

    <h5 class="mt-5 mb-3">My Messages</h5>
    <?php if (!$myMessages): ?>
      <p class="text-secondary">You haven't sent any messages yet. <a href="<?= url('contact.php') ?>">Say hello</a>.</p>
    <?php else: ?>
      <div class="table-responsive card-surface p-2">
        <table class="table table-borderless align-middle mb-0">
          <thead><tr><th>Subject</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
          <?php foreach ($myMessages as $m): ?>
            <tr>
              <td><?= clean($m['subject']) ?></td>
              <td><span class="tech-pill"><?= clean(ucfirst($m['status'])) ?></span></td>
              <td class="text-secondary small"><?= date('M j, Y', strtotime($m['created_at'])) ?></td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>
  </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
