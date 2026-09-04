<?php
// admin.php
// Firebase-Authentication-gated dashboard for editing the portfolio's
// personal data (stored in Firestore) and media (stored in Supabase
// Storage). This file only lays out the shell — all logic lives in
// assets/js/admin.js.
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin · DevPortfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/admin.css">
</head>
<body>

<!-- ======================= LOGIN SCREEN ======================= -->
<div class="login-screen" id="login-screen">
  <div class="login-card">
    <h1>Admin sign in</h1>
    <p class="sub">Manage your portfolio's content and media.</p>
    <form id="login-form">
      <label for="login-email">Email</label>
      <input type="email" id="login-email" required autocomplete="username">
      <label for="login-password">Password</label>
      <input type="password" id="login-password" required autocomplete="current-password">
      <p class="msg error" id="login-msg"></p>
      <button type="submit" class="btn btn-solid btn-block" id="login-btn">Sign in</button>
    </form>
  </div>
</div>

<!-- ======================= DASHBOARD ======================= -->
<div class="dashboard" id="dashboard" hidden>
  <aside class="sidebar">
    <div class="brand">Dev<span>Portfolio</span> Admin</div>
    <button class="side-link active" data-panel="panel-hero">Hero</button>
    <button class="side-link" data-panel="panel-services">Services</button>
    <button class="side-link" data-panel="panel-about">About Me</button>
    <button class="side-link" data-panel="panel-skills">Skills &amp; Experience</button>
    <a class="side-link" href="index.php" target="_blank" rel="noopener">View live site ↗</a>
    <div class="user-email" id="user-email"></div>
    <button class="side-link" id="logout-btn">Sign out</button>
  </aside>

  <main class="content">

    <!-- ---------------- HERO ---------------- -->
    <section id="panel-hero" class="panel-section">
      <h2>Hero section</h2>
      <p class="sub">The introduction visitors see first.</p>
      <div class="panel">
        <label for="hero-name">Name</label>
        <input type="text" id="hero-name" placeholder="Mary">
        <label for="hero-title">Title / role</label>
        <input type="text" id="hero-title" placeholder="Full-Stack Developer & UI/UX Enthusiast">
        <label for="hero-description">Description</label>
        <textarea id="hero-description" placeholder="I craft digital solutions that combine cutting-edge technology with beautiful design..."></textarea>
        <div class="field-row">
          <div>
            <label for="hero-cta-text">Primary button text</label>
            <input type="text" id="hero-cta-text" placeholder="Contact Me">
          </div>
          <div>
            <label for="hero-cta-link">Primary button link</label>
            <input type="text" id="hero-cta-link" placeholder="#contact">
          </div>
        </div>

        <label>Profile photo</label>
        <img class="thumb-preview" id="hero-photo-preview" hidden>
        <input type="file" id="hero-photo-file" accept="image/*">
        <p class="hint">Uploads to Supabase Storage and saves the public URL.</p>

        <label>CV / résumé (PDF)</label>
        <div id="hero-cv-current"></div>
        <input type="file" id="hero-cv-file" accept="application/pdf">

        <div class="panel-head" style="margin-top:20px;">
          <h3>Stats (e.g. 50+ Projects)</h3>
          <button type="button" class="btn btn-outline" id="add-stat-btn">+ Add stat</button>
        </div>
        <div class="repeat-list" id="stats-list"></div>

        <button type="button" class="btn btn-solid" id="save-hero-btn">Save changes</button>
        <p class="msg" id="hero-msg"></p>
      </div>
    </section>

    <!-- ---------------- SERVICES ---------------- -->
    <section id="panel-services" class="panel-section" hidden>
      <h2>Services</h2>
      <p class="sub">The cards shown in "My Services".</p>
      <div class="panel">
        <div class="panel-head">
          <h3>Service list</h3>
          <button type="button" class="btn btn-outline" id="add-service-btn">+ Add service</button>
        </div>
        <div class="repeat-list" id="services-list"></div>
        <button type="button" class="btn btn-solid" id="save-services-btn">Save changes</button>
        <p class="msg" id="services-msg"></p>
      </div>
    </section>

    <!-- ---------------- ABOUT ---------------- -->
    <section id="panel-about" class="panel-section" hidden>
      <h2>About Me</h2>
      <p class="sub">Bio, tech stack, and gallery images.</p>
      <div class="panel">
        <label for="about-subtitle">Subtitle</label>
        <input type="text" id="about-subtitle" placeholder="Full-Stack Developer & UI/UX Designer">
        <label for="about-description">Description</label>
        <textarea id="about-description"></textarea>

        <div class="field-row">
          <div>
            <label for="about-frontend">Frontend</label>
            <input type="text" id="about-frontend" placeholder="Vue.js, React, JavaScript, TypeScript, Tailwind CSS">
          </div>
          <div>
            <label for="about-backend">Backend</label>
            <input type="text" id="about-backend" placeholder="Node.js, Express, MongoDB, PostgreSQL, REST APIs">
          </div>
        </div>
        <div class="field-row">
          <div>
            <label for="about-design">Design</label>
            <input type="text" id="about-design" placeholder="UI/UX Design, Figma, Responsive Design, Prototyping">
          </div>
          <div>
            <label for="about-tools">Tools</label>
            <input type="text" id="about-tools" placeholder="Git, Docker, AWS, VS Code, Webpack">
          </div>
        </div>

        <label for="about-badge">Experience badge text</label>
        <input type="text" id="about-badge" placeholder="3+ Years Experience">

        <div class="panel-head" style="margin-top:10px;">
          <h3>Gallery images (up to 4)</h3>
        </div>
        <div class="repeat-list" id="gallery-list"></div>
        <input type="file" id="gallery-file" accept="image/*">
        <p class="hint">Uploads a new gallery image to Supabase Storage.</p>

        <button type="button" class="btn btn-solid" id="save-about-btn" style="margin-top:10px;">Save changes</button>
        <p class="msg" id="about-msg"></p>
      </div>
    </section>

    <!-- ---------------- SKILLS & EXPERIENCE ---------------- -->
    <section id="panel-skills" class="panel-section" hidden>
      <h2>Skills &amp; Experience</h2>
      <p class="sub">Skill bars and your work timeline.</p>
      <div class="panel">
        <label for="skills-intro">Section intro line</label>
        <input type="text" id="skills-intro" placeholder="My technical expertise and professional journey">

        <div class="panel-head">
          <h3>Skills</h3>
          <button type="button" class="btn btn-outline" id="add-skill-btn">+ Add skill</button>
        </div>
        <div class="repeat-list" id="skills-list"></div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h3>Experience timeline</h3>
          <button type="button" class="btn btn-outline" id="add-exp-btn">+ Add entry</button>
        </div>
        <div class="repeat-list" id="experience-list"></div>
        <button type="button" class="btn btn-solid" id="save-skills-btn">Save changes</button>
        <p class="msg" id="skills-msg"></p>
      </div>
    </section>

  </main>
</div>

<script type="module" src="assets/js/admin.js"></script>
</body>
</html>
