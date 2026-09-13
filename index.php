<?php
require_once __DIR__ . '/config/db.php';

$featured = $pdo->query('SELECT * FROM projects ORDER BY featured DESC, created_at DESC LIMIT 3')->fetchAll();

$pageTitle = 'Home';
include __DIR__ . '/includes/header.php';
include __DIR__ . '/includes/navbar.php';
?>

<header class="hero">
  <div class="container">
    <div class="row align-items-center gy-5">
      <div class="col-lg-7">
        <p class="eyebrow mb-3">// Full-stack developer</p>
        <h1 class="mb-3">Hi, I'm <?= clean(SITE_NAME) ?>.<br>I build clean, functional web experiences.</h1>
        <p class="lead mb-4">I design and build web applications end-to-end — from database schema to polished UI. Explore my projects, read my notes, or get in touch below.</p>
        <div class="d-flex gap-3 flex-wrap">
          <a href="<?= url('projects.php') ?>" class="btn btn-accent">View Projects</a>
          <a href="<?= url('contact.php') ?>" class="btn btn-outline-accent">Get In Touch</a>
        </div>
      </div>
      <div class="col-lg-5 text-center">
        <img src="https://api.dicebear.com/7.x/initials/svg?seed=<?= urlencode(SITE_NAME) ?>&backgroundColor=161d2e&textColor=5ee6c4" alt="Profile" class="hero-avatar">
      </div>
    </div>
  </div>
</header>

<section id="about" class="border-top" style="border-color: var(--border-subtle) !important;">
  <div class="container">
    <h2 class="section-title">About Me</h2>
    <p class="section-subtitle">A quick introduction to who I am and what I do.</p>
    <div class="row gy-4">
      <div class="col-md-8">
        <p class="text-secondary">
          I'm a developer who enjoys turning ideas into working products — from designing the database schema
          to shipping a polished, responsive interface. This site itself is one such project: a PHP + Bootstrap
          portfolio with authentication, a notes section, and an admin panel for managing content and API
          configuration.
        </p>
      </div>
      <div class="col-md-4">
        <div class="card-surface p-4">
          <h6 class="text-uppercase small text-secondary mb-3">Currently exploring</h6>
          <span class="tech-pill">PHP</span>
          <span class="tech-pill">MySQL</span>
          <span class="tech-pill">Bootstrap 5</span>
          <span class="tech-pill">Supabase</span>
          <span class="tech-pill">Firebase</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="border-top" style="border-color: var(--border-subtle) !important;">
  <div class="container">
    <div class="d-flex justify-content-between align-items-end flex-wrap mb-2">
      <div>
        <h2 class="section-title mb-1">Featured Projects</h2>
        <p class="section-subtitle mb-0">A few things I've recently built.</p>
      </div>
      <a href="<?= url('projects.php') ?>" class="text-nowrap">View all &rarr;</a>
    </div>
    <div class="row g-4 mt-2">
      <?php if (!$featured): ?>
        <p class="text-secondary">No projects added yet — check back soon!</p>
      <?php endif; ?>
      <?php foreach ($featured as $p): ?>
        <div class="col-md-4">
          <div class="card-surface project-card h-100">
            <img src="<?= $p['image'] ? clean(PROJECT_UPLOAD_URL . $p['image']) : 'https://placehold.co/500x300/161d2e/5ee6c4?text=Project' ?>" alt="<?= clean($p['title']) ?>">
            <div class="card-body">
              <h5 class="mb-2"><?= clean($p['title']) ?></h5>
              <p class="text-secondary small mb-3"><?= clean(mb_strimwidth($p['description'], 0, 100, '...')) ?></p>
              <a href="<?= url('project-details.php?id=' . $p['id']) ?>" class="small">Read more &rarr;</a>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
