<?php
// index.php
// Thin PHP shell for the public portfolio page. All personal content
// (hero text, services, about, skills, experience, images, CV link) is
// pulled live from Firestore by assets/js/site.js, so this file rarely
// needs to change — update content through /admin.php instead.
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DevPortfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<nav class="navbar">
  <div class="container">
    <div class="brand">Dev<span>Portfolio</span></div>
    <ul class="nav-links">
      <li><a href="#services">Services</a></li>
      <li><a href="#about">About Me</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <a href="#contact" class="btn btn-solid">Let's Talk</a>
  </div>
</nav>

<header class="hero container">
  <div>
    <p class="hero-eyebrow" id="hero-greeting">Hi, I'm <span class="accent" id="hero-name">...</span> 👋</p>
    <h1 id="hero-title-wrap"><span id="hero-role"></span></h1>
    <p class="hero-desc" id="hero-desc"></p>
    <div class="hero-actions">
      <a href="#contact" class="btn btn-solid" id="hero-cta">Contact Me →</a>
      <a href="#" class="btn btn-outline" id="hero-cv" download>↓ Download CV</a>
    </div>
    <div class="hero-stats" id="hero-stats"></div>
  </div>
  <div class="hero-portrait">
    <img id="hero-photo" src="" alt="Portrait">
  </div>
</header>

<section class="section" id="services">
  <div class="container">
    <div class="section-head">
      <h2>My <span class="accent">Services</span></h2>
      <p>Comprehensive digital solutions tailored to your business needs</p>
    </div>
    <div class="services-grid" id="services-grid"></div>
    <div class="section-actions">
      <a href="#" class="btn btn-solid">View All Projects →</a>
      <a href="#contact" class="btn btn-outline">Get in Touch 💬</a>
    </div>
  </div>
</section>

<section class="section" id="about">
  <div class="container about">
    <div class="gallery-grid" id="about-gallery">
      <div class="gallery-badge" id="about-badge">3+ Years Experience</div>
    </div>
    <div>
      <h2>About <span class="accent">Me</span></h2>
      <p class="about-role" id="about-role"></p>
      <p class="about-desc" id="about-desc"></p>
      <div class="about-grid" id="about-stack"></div>
      <div class="hero-actions">
        <a href="#" class="btn btn-solid">→ View Portfolio</a>
        <a href="#contact" class="btn btn-outline">✉ Contact Me</a>
      </div>
    </div>
  </div>
</section>

<section class="section" id="skills">
  <div class="container">
    <div class="section-head">
      <h2>Skills <span class="accent">&amp; Experience</span></h2>
      <p id="skills-intro">My technical expertise and professional journey</p>
    </div>
    <div class="skills-grid" id="skills-grid"></div>
    <div class="timeline" id="experience-timeline"></div>
  </div>
</section>

<footer class="footer" id="contact">
  <div class="container">
    <p>© <span id="year"></span> DevPortfolio. Content managed via the admin panel.</p>
  </div>
</footer>

<script type="module" src="assets/js/site.js"></script>
<script>document.getElementById('year').textContent = new Date().getFullYear();</script>
</body>
</html>
