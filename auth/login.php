<?php
require_once __DIR__ . '/../config/db.php';

if (is_logged_in()) {
    redirect(url('index.php'));
}

$errors = [];
$oldEmail = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        $errors[] = 'Invalid form submission. Please try again.';
    } else {
        $oldEmail = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$oldEmail]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            $errors[] = 'Invalid email or password.';
        } elseif ($user['status'] === 'banned') {
            $errors[] = 'This account has been suspended. Contact the site owner.';
        } else {
            $_SESSION['user'] = [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role'],
            ];
            set_flash('success', 'Welcome back, ' . $user['name'] . '!');
            redirect($user['role'] === 'admin' ? url('admin/index.php') : url('index.php'));
        }
    }
}

$pageTitle = 'Login';
include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/navbar.php';
?>

<div class="auth-wrapper">
  <div class="auth-card">
    <h3 class="mb-1">Welcome back</h3>
    <p class="text-secondary small mb-4">Log in to access notes and contact me.</p>

    <?php if ($errors): ?>
      <div class="alert alert-danger">
        <ul class="mb-0 ps-3">
          <?php foreach ($errors as $e): ?><li><?= clean($e) ?></li><?php endforeach; ?>
        </ul>
      </div>
    <?php endif; ?>

    <form method="post" novalidate>
      <?= csrf_field() ?>
      <div class="mb-3">
        <label class="form-label">Email address</label>
        <input type="email" name="email" class="form-control" value="<?= clean($oldEmail) ?>" required>
      </div>
      <div class="mb-4">
        <label class="form-label">Password</label>
        <div class="input-group">
          <input type="password" id="login-password" name="password" class="form-control" required>
          <button class="btn btn-outline-accent" type="button" data-toggle-password="login-password"><i class="bi bi-eye"></i></button>
        </div>
      </div>
      <button type="submit" class="btn btn-accent w-100">Log in</button>
    </form>

    <p class="text-center text-secondary small mt-4 mb-0">
      Don't have an account? <a href="<?= url('auth/register.php') ?>">Register</a>
    </p>
    <p class="text-center text-secondary small mt-2 mb-0">
      <a href="<?= url('admin/login.php') ?>"><i class="bi bi-shield-lock me-1"></i>Admin login</a>
    </p>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
