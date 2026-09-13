<?php
require_once __DIR__ . '/../config/db.php';

if (is_admin()) {
    redirect(url('admin/index.php'));
}

$errors = [];
$oldEmail = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        $errors[] = 'Invalid form submission. Please try again.';
    } else {
        $oldEmail = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? AND role = "admin" LIMIT 1');
        $stmt->execute([$oldEmail]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($password, $admin['password'])) {
            $errors[] = 'Invalid admin credentials.';
        } elseif ($admin['status'] === 'banned') {
            $errors[] = 'This admin account has been suspended.';
        } else {
            $_SESSION['user'] = [
                'id'    => $admin['id'],
                'name'  => $admin['name'],
                'email' => $admin['email'],
                'role'  => $admin['role'],
            ];
            redirect(url('admin/index.php'));
        }
    }
}

$pageTitle = 'Admin Login';
include __DIR__ . '/../includes/header.php';
?>
<div class="auth-wrapper">
  <div class="auth-card">
    <div class="text-center mb-3">
      <i class="bi bi-shield-lock fs-1" style="color: var(--accent);"></i>
    </div>
    <h3 class="mb-1 text-center">Admin Login</h3>
    <p class="text-secondary small mb-4 text-center">Restricted area. Authorized personnel only.</p>

    <?php if ($errors): ?>
      <div class="alert alert-danger">
        <ul class="mb-0 ps-3"><?php foreach ($errors as $e): ?><li><?= clean($e) ?></li><?php endforeach; ?></ul>
      </div>
    <?php endif; ?>

    <form method="post" novalidate>
      <?= csrf_field() ?>
      <div class="mb-3">
        <label class="form-label">Admin email</label>
        <input type="email" name="email" class="form-control" value="<?= clean($oldEmail) ?>" required>
      </div>
      <div class="mb-4">
        <label class="form-label">Password</label>
        <input type="password" name="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-accent w-100">Log in as Admin</button>
    </form>
    <p class="text-center text-secondary small mt-4 mb-0">
      <a href="<?= url('index.php') ?>"><i class="bi bi-arrow-left me-1"></i>Back to site</a>
    </p>
  </div>
</div>
<?php include __DIR__ . '/../includes/footer.php'; ?>
