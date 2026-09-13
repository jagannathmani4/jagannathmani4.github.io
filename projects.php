<?php
require_once __DIR__ . '/config/db.php';

$projects = $pdo->query('SELECT * FROM projects ORDER BY featured DESC, created_at DESC')->fetchAll();

$pageTitle = 'Projects';
include __DIR__ . '/includes/header.php';
include __DIR__ . '/includes/navbar.php';
?>

<section class="pt-5">
  <div class="container">
    <h2 class="section-title">My Projects</h2>
    <p class="section-subtitle">Everything I've built, from side experiments to full applications.</p>

    <div class="row g-4 mt-2">
      <?php if (!$projects): ?>
        <p class="text-secondary">No projects added yet — check back soon!</p>
      <?php endif; ?>
      <?php foreach ($projects as $p): ?>
        <div class="col-md-6 col-lg-4">
          <div class="card-surface project-card h-100 d-flex flex-column">
            <img src="<?= $p['image'] ? clean(PROJECT_UPLOAD_URL . $p['image']) : 'https://placehold.co/500x300/161d2e/5ee6c4?text=Project' ?>" alt="<?= clean($p['title']) ?>">
            <div class="card-body d-flex flex-column flex-grow-1">
              <h5 class="mb-2"><?= clean($p['title']) ?></h5>
              <p class="text-secondary small mb-3 flex-grow-1"><?= clean(mb_strimwidth($p['description'], 0, 110, '...')) ?></p>
              <div class="mb-3">
                <?php foreach (array_filter(array_map('trim', explode(',', $p['tech_stack'] ?? ''))) as $tech): ?>
                  <span class="tech-pill"><?= clean($tech) ?></span>
                <?php endforeach; ?>
              </div>
              <a href="<?= url('project-details.php?id=' . $p['id']) ?>" class="btn btn-outline-accent btn-sm mt-auto">View Details</a>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
