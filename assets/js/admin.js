// admin.js — powers admin.php
import { firebaseConfig, supabaseConfig, FIRESTORE_DOC_PATH, ADMIN_ALLOWED_EMAILS } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

const $ = (id) => document.getElementById(id);

// In-memory copy of the Firestore document while editing
let data = { hero: {}, services: [], about: {}, skills: { items: [], experience: [] } };

/* ============================== AUTH ============================== */

$("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("login-email").value.trim();
  const password = $("login-password").value;
  const msg = $("login-msg");
  const btn = $("login-btn");
  msg.textContent = "";
  btn.disabled = true;
  btn.textContent = "Signing in…";
  try {
    if (ADMIN_ALLOWED_EMAILS.length && !ADMIN_ALLOWED_EMAILS.includes(email)) {
      throw new Error("This account is not authorized for admin access.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    msg.textContent = friendlyAuthError(err);
  } finally {
    btn.disabled = false;
    btn.textContent = "Sign in";
  }
});

$("logout-btn").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, async (user) => {
  if (user && (!ADMIN_ALLOWED_EMAILS.length || ADMIN_ALLOWED_EMAILS.includes(user.email))) {
    $("login-screen").hidden = true;
    $("dashboard").hidden = false;
    $("user-email").textContent = user.email;
    await loadData();
  } else {
    if (user) await signOut(auth); // signed in but not an allowed admin
    $("dashboard").hidden = true;
    $("login-screen").hidden = false;
  }
});

function friendlyAuthError(err) {
  const code = err?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "Incorrect email or password.";
  }
  return err.message || "Sign-in failed. Please try again.";
}

/* ============================ SIDEBAR NAV ============================ */

document.querySelectorAll(".side-link[data-panel]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".side-link[data-panel]").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".panel-section").forEach((p) => (p.hidden = true));
    btn.classList.add("active");
    $(btn.dataset.panel).hidden = false;
  });
});

/* ============================ LOAD DATA ============================ */

async function loadData() {
  const ref = doc(db, FIRESTORE_DOC_PATH.collection, FIRESTORE_DOC_PATH.doc);
  const snap = await getDoc(ref);
  data = snap.exists()
    ? { hero: {}, services: [], about: {}, skills: { items: [], experience: [] }, ...snap.data() }
    : { hero: {}, services: [], about: {}, skills: { items: [], experience: [] } };

  data.hero.stats = data.hero.stats || [];
  data.services = data.services || [];
  data.about.galleryImages = data.about.galleryImages || [];
  data.skills.items = data.skills.items || [];
  data.skills.experience = data.skills.experience || [];

  fillHeroForm();
  renderStats();
  renderServices();
  fillAboutForm();
  renderGallery();
  fillSkillsForm();
  renderSkillItems();
  renderExperience();
}

/* ============================== HERO ============================== */

function fillHeroForm() {
  $("hero-name").value = data.hero.name || "";
  $("hero-title").value = data.hero.title || "";
  $("hero-description").value = data.hero.description || "";
  $("hero-cta-text").value = data.hero.ctaText || "";
  $("hero-cta-link").value = data.hero.ctaLink || "";
  const preview = $("hero-photo-preview");
  if (data.hero.profileImageUrl) {
    preview.src = data.hero.profileImageUrl;
    preview.hidden = false;
  }
  $("hero-cv-current").textContent = data.hero.cvUrl ? "Current file: " + data.hero.cvUrl.split("/").pop() : "No CV uploaded yet.";
}

$("hero-photo-file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = await uploadToSupabase(file, "hero-photo");
  if (url) {
    data.hero.profileImageUrl = url;
    $("hero-photo-preview").src = url;
    $("hero-photo-preview").hidden = false;
  }
});

$("hero-cv-file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = await uploadToSupabase(file, "cv");
  if (url) {
    data.hero.cvUrl = url;
    $("hero-cv-current").textContent = "Current file: " + file.name;
  }
});

function renderStats() {
  const list = $("stats-list");
  list.innerHTML = "";
  data.hero.stats.forEach((stat, i) => {
    const item = document.createElement("div");
    item.className = "repeat-item";
    item.innerHTML = `
      <button type="button" class="remove-btn" data-i="${i}">✕ remove</button>
      <div class="field-row">
        <div><label>Value</label><input type="text" data-field="value" placeholder="50+"></div>
        <div><label>Label</label><input type="text" data-field="label" placeholder="Projects"></div>
      </div>`;
    item.querySelector('[data-field="value"]').value = stat.value || "";
    item.querySelector('[data-field="label"]').value = stat.label || "";
    item.querySelector('[data-field="value"]').addEventListener("input", (e) => (data.hero.stats[i].value = e.target.value));
    item.querySelector('[data-field="label"]').addEventListener("input", (e) => (data.hero.stats[i].label = e.target.value));
    item.querySelector(".remove-btn").addEventListener("click", () => {
      data.hero.stats.splice(i, 1);
      renderStats();
    });
    list.appendChild(item);
  });
}

$("add-stat-btn").addEventListener("click", () => {
  data.hero.stats.push({ value: "", label: "" });
  renderStats();
});

$("save-hero-btn").addEventListener("click", async () => {
  data.hero.name = $("hero-name").value.trim();
  data.hero.title = $("hero-title").value.trim();
  data.hero.description = $("hero-description").value.trim();
  data.hero.ctaText = $("hero-cta-text").value.trim();
  data.hero.ctaLink = $("hero-cta-link").value.trim();
  await saveSection("hero", $("hero-msg"));
});

/* ============================== SERVICES ============================== */

function renderServices() {
  const list = $("services-list");
  list.innerHTML = "";
  data.services.forEach((svc, i) => {
    const item = document.createElement("div");
    item.className = "repeat-item";
    item.innerHTML = `
      <button type="button" class="remove-btn" data-i="${i}">✕ remove</button>
      <div class="field-row">
        <div><label>Icon (emoji or symbol)</label><input type="text" data-field="icon" placeholder="</>"></div>
        <div><label>Title</label><input type="text" data-field="title" placeholder="Web Development"></div>
      </div>
      <label>Description</label>
      <textarea data-field="description" placeholder="Custom web applications built with modern technologies..."></textarea>`;
    item.querySelector('[data-field="icon"]').value = svc.icon || "";
    item.querySelector('[data-field="title"]').value = svc.title || "";
    item.querySelector('[data-field="description"]').value = svc.description || "";
    item.querySelectorAll("[data-field]").forEach((el) => {
      el.addEventListener("input", (e) => (data.services[i][e.target.dataset.field] = e.target.value));
    });
    item.querySelector(".remove-btn").addEventListener("click", () => {
      data.services.splice(i, 1);
      renderServices();
    });
    list.appendChild(item);
  });
}

$("add-service-btn").addEventListener("click", () => {
  data.services.push({ icon: "", title: "", description: "" });
  renderServices();
});

$("save-services-btn").addEventListener("click", async () => {
  await saveSection("services", $("services-msg"));
});

/* ============================== ABOUT ============================== */

function fillAboutForm() {
  $("about-subtitle").value = data.about.subtitle || "";
  $("about-description").value = data.about.description || "";
  $("about-frontend").value = data.about.frontend || "";
  $("about-backend").value = data.about.backend || "";
  $("about-design").value = data.about.design || "";
  $("about-tools").value = data.about.tools || "";
  $("about-badge").value = data.about.experienceBadge || "";
}

function renderGallery() {
  const list = $("gallery-list");
  list.innerHTML = "";
  data.about.galleryImages.forEach((url, i) => {
    const item = document.createElement("div");
    item.className = "repeat-item";
    item.innerHTML = `
      <button type="button" class="remove-btn" data-i="${i}">✕ remove</button>
      <img class="thumb-preview" src="${url}">`;
    item.querySelector(".remove-btn").addEventListener("click", () => {
      data.about.galleryImages.splice(i, 1);
      renderGallery();
    });
    list.appendChild(item);
  });
  if (!data.about.galleryImages.length) {
    list.innerHTML = `<p class="hint">No gallery images yet — add one below.</p>`;
  }
}

$("gallery-file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (data.about.galleryImages.length >= 4) {
    alert("Maximum of 4 gallery images. Remove one first.");
    e.target.value = "";
    return;
  }
  const url = await uploadToSupabase(file, "gallery");
  if (url) {
    data.about.galleryImages.push(url);
    renderGallery();
  }
  e.target.value = "";
});

$("save-about-btn").addEventListener("click", async () => {
  data.about.subtitle = $("about-subtitle").value.trim();
  data.about.description = $("about-description").value.trim();
  data.about.frontend = $("about-frontend").value.trim();
  data.about.backend = $("about-backend").value.trim();
  data.about.design = $("about-design").value.trim();
  data.about.tools = $("about-tools").value.trim();
  data.about.experienceBadge = $("about-badge").value.trim();
  await saveSection("about", $("about-msg"));
});

/* ============================== SKILLS & EXPERIENCE ============================== */

function fillSkillsForm() {
  $("skills-intro").value = data.skills.intro || "";
}

function renderSkillItems() {
  const list = $("skills-list");
  list.innerHTML = "";
  data.skills.items.forEach((s, i) => {
    const item = document.createElement("div");
    item.className = "repeat-item";
    item.innerHTML = `
      <button type="button" class="remove-btn" data-i="${i}">✕ remove</button>
      <div class="field-row">
        <div><label>Skill name</label><input type="text" data-field="name" placeholder="React"></div>
        <div><label>Proficiency (%)</label><input type="number" min="0" max="100" data-field="percent" placeholder="85"></div>
      </div>`;
    item.querySelector('[data-field="name"]').value = s.name || "";
    item.querySelector('[data-field="percent"]').value = s.percent ?? "";
    item.querySelector('[data-field="name"]').addEventListener("input", (e) => (data.skills.items[i].name = e.target.value));
    item.querySelector('[data-field="percent"]').addEventListener("input", (e) => (data.skills.items[i].percent = Number(e.target.value)));
    item.querySelector(".remove-btn").addEventListener("click", () => {
      data.skills.items.splice(i, 1);
      renderSkillItems();
    });
    list.appendChild(item);
  });
}

$("add-skill-btn").addEventListener("click", () => {
  data.skills.items.push({ name: "", percent: 50 });
  renderSkillItems();
});

function renderExperience() {
  const list = $("experience-list");
  list.innerHTML = "";
  data.skills.experience.forEach((exp, i) => {
    const item = document.createElement("div");
    item.className = "repeat-item";
    item.innerHTML = `
      <button type="button" class="remove-btn" data-i="${i}">✕ remove</button>
      <div class="field-row">
        <div><label>Role</label><input type="text" data-field="role" placeholder="Full-Stack Developer"></div>
        <div><label>Company</label><input type="text" data-field="company" placeholder="Acme Inc."></div>
      </div>
      <label>Period</label>
      <input type="text" data-field="period" placeholder="2023 — Present">
      <label>Description</label>
      <textarea data-field="description"></textarea>`;
    ["role", "company", "period", "description"].forEach((f) => {
      item.querySelector(`[data-field="${f}"]`).value = exp[f] || "";
      item.querySelector(`[data-field="${f}"]`).addEventListener("input", (e) => (data.skills.experience[i][f] = e.target.value));
    });
    item.querySelector(".remove-btn").addEventListener("click", () => {
      data.skills.experience.splice(i, 1);
      renderExperience();
    });
    list.appendChild(item);
  });
}

$("add-exp-btn").addEventListener("click", () => {
  data.skills.experience.push({ role: "", company: "", period: "", description: "" });
  renderExperience();
});

$("save-skills-btn").addEventListener("click", async () => {
  data.skills.intro = $("skills-intro").value.trim();
  await saveSection("skills", $("skills-msg"));
});

/* ============================== SAVE / UPLOAD HELPERS ============================== */

async function saveSection(_sectionName, msgEl) {
  msgEl.className = "msg";
  msgEl.textContent = "Saving…";
  try {
    const ref = doc(db, FIRESTORE_DOC_PATH.collection, FIRESTORE_DOC_PATH.doc);
    await setDoc(ref, data, { merge: true });
    msgEl.className = "msg ok";
    msgEl.textContent = "Saved ✓";
    setTimeout(() => (msgEl.textContent = ""), 2500);
  } catch (err) {
    console.error(err);
    msgEl.className = "msg error";
    msgEl.textContent = "Failed to save: " + (err.message || "unknown error");
  }
}

async function uploadToSupabase(file, prefix) {
  const path = `${prefix}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const { error } = await supabase.storage.from(supabaseConfig.bucket).upload(path, file, { upsert: true });
  if (error) {
    alert("Upload failed: " + error.message);
    return null;
  }
  const { data: pub } = supabase.storage.from(supabaseConfig.bucket).getPublicUrl(path);
  return pub.publicUrl;
}
