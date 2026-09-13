<?php
require_once __DIR__ . '/config/db.php';

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare('SELECT * FROM projects WHERE id = ? LIMIT 1');
$stmt->execute([$id]);
$project = $stmt->fetch();

if (!$project) {
    set_flash('danger', 'Project not found.');
    redirect(url('projects.php'));
}

$pageTitle = $project['title'];
include __DIR__ . '/includes/header.php';
include __DIR__ . '/includes/navbar.php';
?>

<section class="pt-5">
  <div class="container" style="max-width: 900px;">
    <a href="<?= url('projects.php') ?>" class="small text-secondary"><i class="bi bi-arrow-left me-1"></i>Back to projects</a>

    <div class="card-surface mt-3 overflow-hidden">
      <img src="<?= $project['image'] ? clean(PROJECT_UPLOAD_URL . $project['image']) : 'https://placehold.co/900x400/161d2e/5ee6c4?text=Project' ?>" alt="<?= clean($project['title']) ?>" class="w-100" style="max-height: 420px; object-fit: cover;">
      <div class="p-4 p-md-5">
        <h2 class="mb-3"><?= clean($project['title']) ?></h2>
        <div class="mb-4">
          <?php foreach (array_filter(array_map('trim', explode(',', $project['tech_stack'] ?? ''))) as $tech): ?>
            <span class="tech-pill"><?= clean($tech) ?></span>
          <?php endforeach; ?>
        </div>
        <p class="text-secondary" style="white-space: pre-line;"><?= clean($project['description']) ?></p>

        <div class="d-flex gap-3 mt-4 flex-wrap">
          <?php if (!empty($project['github_url'])): ?>
            <a href="<?= clean($project['github_url']) ?>" target="_blank" rel="noopener" class="btn btn-outline-accent"><i class="bi bi-github me-2"></i>Source Code</a>
          <?php endif; ?>
          <?php if (!empty($project['live_url'])): ?>
            <a href="<?= clean($project['live_url']) ?>" target="_blank" rel="noopener" class="btn btn-accent"><i class="bi bi-box-arrow-up-right me-2"></i>Live Demo</a>
          <?php endif; ?>
        </div>
      </div>
    </div>
  </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
