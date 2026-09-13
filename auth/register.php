<?php
require_once __DIR__ . '/../config/db.php';

if (is_logged_in()) {
    redirect(url('index.html'));
}

$errors = [];
$old = ['name' => '', 'email' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        $errors[] = 'Invalid form submission. Please try again.';
    } else {
        $old['name']  = trim($_POST['name'] ?? '');
        $old['email'] = trim($_POST['email'] ?? '');
        $password     = $_POST['password'] ?? '';
        $confirm      = $_POST['confirm_password'] ?? '';

        if ($old['name'] === '') $errors[] = 'Name is required.';
        if (!filter_var($old['email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'A valid email is required.';
        if (strlen($password) < 6) $errors[] = 'Password must be at least 6 characters.';
        if ($password !== $confirm) $errors[] = 'Passwords do not match.';

        if (!$errors) {
            $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
            $stmt->execute([$old['email']]);
            if ($stmt->fetch()) {
                $errors[] = 'An account with this email already exists.';
            }
        }

        if (!$errors) {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "user")');
            $stmt->execute([$old['name'], $old['email'], $hash]);

            set_flash('success', 'Account created successfully. Please log in.');
            redirect(url('auth/login.php'));
        }
    }
}

$pageTitle = 'Register';
include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/navbar.php';
?>

<div class="auth-wrapper">
  <div class="auth-card">
    <h3 class="mb-1">Create your account</h3>
    <p class="text-secondary small mb-4">Register to access notes and contact me directly.</p>

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
        <label class="form-label">Full name</label>
        <input type="text" name="name" class="form-control" value="<?= clean($old['name']) ?>" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Email address</label>
        <input type="email" name="email" class="form-control" value="<?= clean($old['email']) ?>" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <div class="input-group">
          <input type="password" id="reg-password" name="password" class="form-control" required minlength="6">
          <button class="btn btn-outline-accent" type="button" data-toggle-password="reg-password"><i class="bi bi-eye"></i></button>
        </div>
      </div>
      <div class="mb-4">
        <label class="form-label">Confirm password</label>
        <input type="password" name="confirm_password" class="form-control" required minlength="6">
      </div>
      <button type="submit" class="btn btn-accent w-100">Create account</button>
    </form>

    <p class="text-center text-secondary small mt-4 mb-0">
      Already have an account? <a href="<?= url('auth/login.php') ?>">Log in</a>
    </p>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
