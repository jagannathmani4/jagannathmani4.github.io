import * as db from './firebase-service.js';
import { DEFAULT_ADMIN_USER, ensureDefaultAdminUser } from './admin-account.js';

const initialUsers = [
  DEFAULT_ADMIN_USER
];

const state = { 
  currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
  authMode: 'login'
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize users in localStorage if not already done
  if (!localStorage.getItem('portfolioUsers')) {
    localStorage.setItem('portfolioUsers', JSON.stringify(initialUsers));
  }
  ensureDefaultAdminUser();
  state.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  // Ensure auth UI renders even if Firestore has issues.
  renderAuthSection();
  renderAdminPanel();
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
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  if (currentUser) {
    // Hide auth section when logged in
    el.innerHTML = '';
    return;
  }

  el.innerHTML = `
    <div class="glass-card p-4 auth-card">
      <div class="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-4">
        <h4 class="mb-0">${state.authMode === 'register' ? 'Register' : 'Sign In'}</h4>
        <button type="button" class="btn btn-outline-light btn-sm" id="toggle-auth-mode">
          ${state.authMode === 'register' ? 'Sign In' : 'Register'}
        </button>
      </div>
      <div class="${state.authMode === 'register' ? 'd-none' : ''}">
          <div id="login-message"></div>
          <form id="login-form">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" id="login-email" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" id="login-password" required />
            </div>
            <button type="submit" class="btn btn-primary w-100">Sign In</button>
          </form>
      </div>
      <div class="${state.authMode === 'register' ? '' : 'd-none'}">
          <div id="register-message"></div>
          <form id="register-form">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" id="register-email" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" id="register-password" required />
            </div>
            <button type="submit" class="btn btn-outline-light w-100">Register</button>
          </form>
      </div>
    </div>
  `;

  document.getElementById('toggle-auth-mode')?.addEventListener('click', () => {
    state.authMode = state.authMode === 'register' ? 'login' : 'register';
    renderAuthSection();
  });
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('register-form')?.addEventListener('submit', handleRegister);
}

function showMessage(elementId, message, type) {
  const container = document.getElementById(elementId);
  if (!container) return;
  container.innerHTML = `<div class="alert alert-${type} py-2" role="alert">${message}</div>`;
}

function upsertLocalUser(userData) {
  const users = JSON.parse(localStorage.getItem('portfolioUsers') || '[]');
  const index = users.findIndex(u => u.email === userData.email);

  if (index >= 0) {
    users[index] = { ...users[index], ...userData };
  } else {
    users.push(userData);
  }

  localStorage.setItem('portfolioUsers', JSON.stringify(users));
  return index >= 0 ? users[index] : userData;
}

function buildLocalUser(firebaseUser, password) {
  const isAdmin = firebaseUser.email === DEFAULT_ADMIN_USER.email;
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    password,
    displayName: isAdmin ? DEFAULT_ADMIN_USER.displayName : firebaseUser.email.split('@')[0],
    isAdmin,
    role: isAdmin ? 'admin' : 'user',
    verified: firebaseUser.emailVerified,
    createdAt: new Date().toISOString()
  };
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value.trim();

  try {
    const firebaseUser = await db.signInWithFirebaseEmail(email, password);

    if (!firebaseUser.emailVerified) {
      await db.sendFirebaseVerificationEmail(firebaseUser);
      await db.signOutFirebaseUser();
      showMessage('login-message', `Please verify your email first. Firebase sent a verification link to ${email}.`, 'warning');
      return;
    }

    const user = upsertLocalUser(buildLocalUser(firebaseUser, password));
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.removeItem('pendingVerificationEmail');
    state.currentUser = user;
    renderAuthSection();
    renderAdminPanel();
  } catch (error) {
    if (email === DEFAULT_ADMIN_USER.email && password === DEFAULT_ADMIN_USER.password) {
      try {
        await db.createFirebaseUserAndSendVerification(email, password);
        await db.signOutFirebaseUser();
        showMessage('login-message', `Admin account created in Firebase. Verification link sent to ${email}. Verify it, then sign in again.`, 'success');
        return;
      } catch (createError) {
        console.error('Admin Firebase account creation failed', createError);
        showMessage('login-message', db.getFirebaseAuthErrorMessage(createError), 'danger');
        return;
      }
    }

    console.error('Firebase sign in failed', error);
    showMessage('login-message', db.getFirebaseAuthErrorMessage(error), 'danger');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById('register-email').value.trim().toLowerCase();
  const password = document.getElementById('register-password').value.trim();

  try {
    const firebaseUser = await db.createFirebaseUserAndSendVerification(email, password);
    upsertLocalUser(buildLocalUser(firebaseUser, password));
    await db.signOutFirebaseUser();
    state.authMode = 'login';
    renderAuthSection();
    showMessage('login-message', `Account created. Firebase sent a verification link to ${email}. Verify it, then sign in.`, 'success');
  } catch (error) {
    console.error('Firebase registration failed', error);
    showMessage('register-message', db.getFirebaseAuthErrorMessage(error), 'danger');
  }
}

async function renderAdminPanel() {
  const panel = document.getElementById('admin-panel');
  if (!panel) return;
  
  const currentUser = state.currentUser || JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  if (!currentUser) {
    panel.innerHTML = `<div class="auth-card p-3">Login to suggest or approve products.</div>`;
    return;
  }
  
  if (currentUser.email === 'jagannathmani4@gmail.com') {
    const requests = JSON.parse(localStorage.getItem('portfolioProductRequests') || '[]');
    const pending = requests.filter(r => r.status === 'pending').length;
    panel.innerHTML = `
      <div class="auth-card p-3">
        <h5>Admin Dashboard</h5>
        <p class="text-muted">${pending} pending requests</p>
        <button id="logout-btn" class="btn btn-outline-light btn-sm mt-3">Logout</button>
      </div>
    `;
  } else {
    panel.innerHTML = `
      <div class="auth-card p-3">
        <h5>Welcome, ${currentUser.displayName || currentUser.email}</h5>
        <p class="text-muted">Verified user</p>
        <button id="logout-btn" class="btn btn-outline-light btn-sm mt-3">Logout</button>
      </div>
    `;
  }
  
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    state.currentUser = null;
    renderAuthSection();
    renderAdminPanel();
  });
}

export { renderAuthSection, renderAdminPanel };
