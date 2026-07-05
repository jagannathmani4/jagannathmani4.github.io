import * as db from './firebase-service.js';

const state = { currentUser: null };

document.addEventListener('DOMContentLoaded', () => {
  // Ensure auth UI renders even if Firestore has issues.
  renderAuthSection();
  initializeData().catch(e => console.error('Init error', e));
});

async function initializeData() {
  try {
    await db.getUsersFromDb();
    await loadProducts();
  } catch (e) {
    console.error('Firestore unavailable', e);
  }
}

async function loadProducts() {
  const products = await db.getProductsFromDb();
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="col-md-6 col-lg-4">
      <div class="glass-card p-3">
        <h5>${p.title}</h5>
        <p class="text-muted">${p.description || ''}</p>
      </div>
    </div>
  `).join('');
}

function renderAuthSection() {
  const el = document.getElementById('auth-section');
  if (!el) return;
  el.innerHTML = `
    <div class="auth-card p-3 mb-4">
      <div class="d-flex gap-2">
        <input id="email-input" class="form-control" placeholder="Email" />
        <input id="phone-input" class="form-control" placeholder="Contact number" />
        <button id="login-btn" class="btn btn-primary">Login / Register</button>
      </div>
    </div>
  `;
  document.getElementById('login-btn').addEventListener('click', handleLogin);
}

async function handleLogin() {
  const email = document.getElementById('email-input').value.trim();
  const phone = document.getElementById('phone-input').value.trim();
  if (!email) return alert('Enter email');
  let user = await db.getUserByEmail(email);
  if (!user) {
    user = await db.saveUserToDb({ email, phone, role: 'user', verified: false });
    alert('Registered. Verification code sent (simulated).');
  } else {
    alert('Login link (simulated) sent');
  }
  state.currentUser = user;
  renderAdminPanel();
}

async function renderAdminPanel() {
  const panel = document.getElementById('admin-panel');
  if (!panel) return;
  if (!state.currentUser) {
    panel.innerHTML = `<div class="auth-card p-3">Login to suggest or approve products.</div>`;
    return;
  }
  if (state.currentUser.email === 'jagannathmani4@gmail.com') {
    const requests = await db.getProductRequestsFromDb();
    panel.innerHTML = `
      <div class="auth-card p-3">
        <h5>Admin</h5>
        <p class="text-muted">${requests.length} pending requests</p>
      </div>
    `;
  } else {
    panel.innerHTML = `<div class="auth-card p-3">Welcome, ${state.currentUser.email}</div>`;
  }
}

export { renderAuthSection, renderAdminPanel };
