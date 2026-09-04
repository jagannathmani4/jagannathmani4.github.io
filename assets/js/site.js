// site.js — renders the public portfolio page from Firestore data.
import { firebaseConfig, FIRESTORE_DOC_PATH } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);

function renderHero(hero = {}) {
  $("hero-name").textContent = hero.name || "Your Name";
  $("hero-role").innerHTML = `Hi, I'm <span class="accent">${escapeHtml(hero.name || "Your Name")}</span> 👋`;
  $("hero-desc").textContent = hero.description || "";
  $("hero-cta").textContent = (hero.ctaText || "Contact Me") + " →";
  $("hero-cta").href = hero.ctaLink || "#contact";
  if (hero.cvUrl) $("hero-cv").href = hero.cvUrl;
  if (hero.profileImageUrl) $("hero-photo").src = hero.profileImageUrl;

  // Subtitle line ("Full-Stack Developer & UI/UX Enthusiast")
  const subtitle = document.createElement("p");
  subtitle.className = "hero-subtitle";
  subtitle.textContent = hero.title || "";
  $("hero-desc").insertAdjacentElement("beforebegin", subtitle);

  const statsWrap = $("hero-stats");
  statsWrap.innerHTML = "";
  (hero.stats || []).forEach((s) => {
    const el = document.createElement("div");
    el.innerHTML = `<div class="stat-value">${escapeHtml(s.value)}</div><div class="stat-label">${escapeHtml(s.label)}</div>`;
    statsWrap.appendChild(el);
  });
}

function renderServices(services = []) {
  const grid = $("services-grid");
  grid.innerHTML = "";
  if (!services.length) {
    grid.innerHTML = `<p class="state-note">Services will appear here once added in the admin panel.</p>`;
    return;
  }
  services.forEach((s) => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <div class="service-icon">${escapeHtml(s.icon || "★")}</div>
      <h3>${escapeHtml(s.title || "")}</h3>
      <p>${escapeHtml(s.description || "")}</p>`;
    grid.appendChild(card);
  });
}

function renderAbout(about = {}) {
  $("about-role").textContent = about.subtitle || "";
  $("about-desc").textContent = about.description || "";
  $("about-badge").textContent = about.experienceBadge || "";

  const gallery = $("about-gallery");
  const badge = $("about-badge");
  gallery.innerHTML = "";
  (about.galleryImages || []).forEach((url) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Work sample";
    gallery.appendChild(img);
  });
  gallery.appendChild(badge);

  const stackWrap = $("about-stack");
  stackWrap.innerHTML = "";
  const stacks = [
    ["Frontend", about.frontend],
    ["Backend", about.backend],
    ["Design", about.design],
    ["Tools", about.tools]
  ];
  stacks.forEach(([label, value]) => {
    if (!value) return;
    const el = document.createElement("div");
    el.innerHTML = `<h4>${label}</h4><p>${escapeHtml(value)}</p>`;
    stackWrap.appendChild(el);
  });
}

function renderSkills(skills = {}) {
  if (skills.intro) $("skills-intro").textContent = skills.intro;

  const grid = $("skills-grid");
  grid.innerHTML = "";
  (skills.items || []).forEach((s) => {
    const pct = Math.max(0, Math.min(100, Number(s.percent) || 0));
    const el = document.createElement("div");
    el.className = "skill-bar";
    el.innerHTML = `
      <div class="row"><span>${escapeHtml(s.name || "")}</span><span>${pct}%</span></div>
      <div class="skill-track"><div class="skill-fill" style="width:${pct}%"></div></div>`;
    grid.appendChild(el);
  });

  const timeline = $("experience-timeline");
  timeline.innerHTML = "";
  (skills.experience || []).forEach((e) => {
    const el = document.createElement("div");
    el.className = "timeline-item";
    el.innerHTML = `
      <div class="period">${escapeHtml(e.period || "")}</div>
      <h4>${escapeHtml(e.role || "")}${e.company ? " · " + escapeHtml(e.company) : ""}</h4>
      <p>${escapeHtml(e.description || "")}</p>`;
    timeline.appendChild(el);
  });
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function loadPortfolio() {
  try {
    const ref = doc(db, FIRESTORE_DOC_PATH.collection, FIRESTORE_DOC_PATH.doc);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.warn("No portfolio document found yet — add content via /admin.php");
      return;
    }
    const data = snap.data();
    renderHero(data.hero);
    renderServices(data.services);
    renderAbout(data.about);
    renderSkills(data.skills);
  } catch (err) {
    console.error("Failed to load portfolio content:", err);
  }
}

loadPortfolio();
