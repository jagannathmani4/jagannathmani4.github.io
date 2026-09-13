<?php
require_once __DIR__ . '/config/db.php';

$notes = $pdo->query('SELECT id, title, category, is_public, created_at FROM notes ORDER BY created_at DESC')->fetchAll();

$pageTitle = 'Notes';
include __DIR__ . '/includes/header.php';
include __DIR__ . '/includes/navbar.php';
?>

<section class="pt-5">
  <div class="container">
    <h2 class="section-title">Notes</h2>
    <p class="section-subtitle">
      Study notes and write-ups I've collected. Public notes are open to everyone —
      the rest need a free account to unlock.
      <?php if (!is_logged_in()): ?>
        <a href="<?= url('auth/register.php') ?>">Register free</a> to see them all.
      <?php endif; ?>
    </p>

    <div class="row g-4 mt-2">
      <?php if (!$notes): ?>
        <p class="text-secondary">No notes published yet.</p>
      <?php endif; ?>
      <?php foreach ($notes as $n): ?>
        <div class="col-md-6 col-lg-4">
          <div class="card-surface note-card h-100 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="tech-pill mb-0"><?= clean($n['category']) ?></span>
              <?php if (!$n['is_public']): ?>
                <span class="badge badge-lock text-secondary"><i class="bi bi-lock-fill"></i> Login required</span>
              <?php else: ?>
                <span class="badge badge-lock text-secondary"><i class="bi bi-unlock-fill"></i> Public</span>
              <?php endif; ?>
            </div>
            <h5 class="mb-2 flex-grow-1"><?= clean($n['title']) ?></h5>
            <p class="text-secondary small mb-3"><?= date('M j, Y', strtotime($n['created_at'])) ?></p>
            <?php if ($n['is_public'] || is_logged_in()): ?>
              <a href="<?= url('note-view.php?id=' . $n['id']) ?>" class="btn btn-outline-accent btn-sm mt-auto">Read Note</a>
            <?php else: ?>
              <a href="<?= url('auth/login.php') ?>" class="btn btn-outline-accent btn-sm mt-auto"><i class="bi bi-lock-fill me-1"></i>Login to Read</a>
            <?php endif; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
