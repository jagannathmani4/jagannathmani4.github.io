<?php
require_once __DIR__ . '/config/db.php';

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_login(url('auth/login.php'));

    if (!verify_csrf()) {
        $errors[] = 'Invalid form submission. Please try again.';
    } else {
        $subject = trim($_POST['subject'] ?? '');
        $message = trim($_POST['message'] ?? '');

        if ($subject === '') $errors[] = 'Subject is required.';
        if ($message === '') $errors[] = 'Message cannot be empty.';

        if (!$errors) {
            $user = current_user();
            $stmt = $pdo->prepare(
                'INSERT INTO messages (user_id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)'
            );
            $stmt->execute([$user['id'], $user['name'], $user['email'], $subject, $message]);

            set_flash('success', 'Your message has been sent. I\'ll get back to you soon!');
            redirect(url('contact.php'));
        }
    }
}

$pageTitle = 'Contact';
include __DIR__ . '/includes/header.php';
include __DIR__ . '/includes/navbar.php';
?>

<section class="pt-5">
  <div class="container" style="max-width: 700px;">
    <h2 class="section-title">Get In Touch</h2>
    <p class="section-subtitle">Have a project in mind or just want to say hello? Send me a message below.</p>

    <?php if ($errors): ?>
      <div class="alert alert-danger">
        <ul class="mb-0 ps-3">
          <?php foreach ($errors as $e): ?><li><?= clean($e) ?></li><?php endforeach; ?>
        </ul>
      </div>
    <?php endif; ?>

    <?php if (is_logged_in()): ?>
      <div class="card-surface p-4 p-md-5">
        <form method="post">
          <?= csrf_field() ?>
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label">Your name</label>
              <input type="text" class="form-control" value="<?= clean(current_user()['name']) ?>" disabled>
            </div>
            <div class="col-md-6">
              <label class="form-label">Your email</label>
              <input type="email" class="form-control" value="<?= clean(current_user()['email']) ?>" disabled>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Subject</label>
            <input type="text" name="subject" class="form-control" required>
          </div>
          <div class="mb-4">
            <label class="form-label">Message</label>
            <textarea name="message" rows="5" class="form-control" required></textarea>
          </div>
          <button type="submit" class="btn btn-accent">Send Message</button>
        </form>
      </div>
    <?php else: ?>
      <div class="card-surface p-4 p-md-5 text-center">
        <i class="bi bi-lock-fill fs-1 text-secondary mb-3"></i>
        <h5>Please log in to send a message</h5>
        <p class="text-secondary small mb-4">This keeps the inbox spam-free and lets me reply to a verified account.</p>
        <div class="d-flex gap-3 justify-content-center">
          <a href="<?= url('auth/login.php') ?>" class="btn btn-accent">Log In</a>
          <a href="<?= url('auth/register.php') ?>" class="btn btn-outline-accent">Register</a>
        </div>
      </div>
    <?php endif; ?>
  </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
