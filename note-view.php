<?php
require_once __DIR__ . '/config/db.php';

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare('SELECT * FROM notes WHERE id = ? LIMIT 1');
$stmt->execute([$id]);
$note = $stmt->fetch();

if (!$note) {
    set_flash('danger', 'Note not found.');
    redirect(url('notes.php'));
}

if (!$note['is_public']) {
    require_login(url('auth/login.php'));
}

$pageTitle = $note['title'];
include __DIR__ . '/includes/header.php';
include __DIR__ . '/includes/navbar.php';
?>

<section class="pt-5">
  <div class="container" style="max-width: 800px;">
    <a href="<?= url('notes.php') ?>" class="small text-secondary"><i class="bi bi-arrow-left me-1"></i>Back to notes</a>

    <div class="card-surface mt-3 p-4 p-md-5">
      <span class="tech-pill"><?= clean($note['category']) ?></span>
      <h2 class="mt-3 mb-2"><?= clean($note['title']) ?></h2>
      <p class="text-secondary small mb-4">Published <?= date('M j, Y', strtotime($note['created_at'])) ?></p>
      <div style="white-space: pre-line;"><?= clean($note['content']) ?></div>

      <?php if (!empty($note['file_path'])): ?>
        <!-- Keep attachment links as navigation/open-in-tab actions instead of forcing browser download. -->
        <a href="<?= clean(resolve_upload_url($note['file_path'], NOTE_UPLOAD_URL)) ?>"
           class="btn btn-outline-accent mt-4"
           data-prevent-download="true"
           target="_blank"
           rel="noopener noreferrer">
          <i class="bi bi-box-arrow-up-right me-2"></i>Open attachment
        </a>
      <?php endif; ?>
    </div>
  </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
