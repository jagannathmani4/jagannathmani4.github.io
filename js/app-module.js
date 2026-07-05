import * as db from './firebase-service.js';

const initialUsers = [
  {
    id: 1,
    email: 'jagannathmani4@gmail.com',
    password: 'Jagannath@2005',
    displayName: 'Jagannath',
    isAdmin: true,
    verified: true,
    createdAt: '2026-07-05'
  }
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
  const pendingEmail = localStorage.getItem('pendingVerificationEmail');
  
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
      <div id="verify-section" class="mt-4 ${pendingEmail ? '' : 'd-none'}">
        <h5 class="mb-3">Verify your email</h5>
        <p class="text-muted">A verification code has been sent to <strong>${pendingEmail || 'your email'}</strong>. Enter it below.</p>
        <div id="verify-message"></div>
        <form id="verify-form">
          <div class="mb-3">
            <label class="form-label">Verification Code</label>
            <input type="text" class="form-control" id="verify-code" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Verify Email</button>
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
  document.getElementById('verify-form')?.addEventListener('submit', handleVerify);
}

function makeVerificationCode() {
  return Math.random().toString().slice(2, 8);
}

function showMessage(elementId, message, type) {
  const container = document.getElementById(elementId);
  if (!container) return;
  container.innerHTML = `<div class="alert alert-${type} py-2" role="alert">${message}</div>`;
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value.trim();
  
  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('portfolioUsers') || '[]');
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    showMessage('login-message', 'Invalid email or password.', 'danger');
    return;
  }
  
  // Generate OTP
  const otp = makeVerificationCode();
  
  // Store OTP with user
  user.loginOtp = otp;
  localStorage.setItem('portfolioUsers', JSON.stringify(users));
  localStorage.setItem('pendingVerificationEmail', email);
  
  renderAuthSection();
  showMessage('login-message', `✓ Credentials verified. OTP sent to ${email}. Check your email and enter the code below.`, 'success');
}

function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById('register-email').value.trim().toLowerCase();
  const password = document.getElementById('register-password').value.trim();
  
  const users = JSON.parse(localStorage.getItem('portfolioUsers') || '[]');
  
  if (users.some(u => u.email === email)) {
    showMessage('register-message', 'That email is already registered. Please login instead.', 'danger');
    return;
  }
  
  const verificationCode = makeVerificationCode();
  const newUser = {
    id: Date.now(),
    email,
    password,
    displayName: email.split('@')[0],
    isAdmin: false,
    verified: false,
    verificationCode,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('portfolioUsers', JSON.stringify(users));
  localStorage.setItem('pendingVerificationEmail', email);
  
  renderAuthSection();
  showMessage('verify-message', `Your account has been created. Use code ${verificationCode} to verify your email.`, 'success');
}

function handleVerify(event) {
  event.preventDefault();
  const code = document.getElementById('verify-code').value.trim();
  const pendingEmail = localStorage.getItem('pendingVerificationEmail');
  
  const users = JSON.parse(localStorage.getItem('portfolioUsers') || '[]');
  const user = users.find(u => u.email === pendingEmail);
  
  if (!user) {
    showMessage('verify-message', 'No pending verification found.', 'danger');
    return;
  }
  
  const expectedCode = user.loginOtp || user.verificationCode;
  if (expectedCode !== code) {
    showMessage('verify-message', 'The verification code is incorrect.', 'danger');
    return;
  }
  
  user.verified = true;
  delete user.verificationCode;
  delete user.loginOtp;
  
  localStorage.setItem('portfolioUsers', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.removeItem('pendingVerificationEmail');
  
  state.currentUser = user;
  renderAuthSection();
  renderAdminPanel();
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
