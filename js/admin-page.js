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
  currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null')
};

window.addEventListener('DOMContentLoaded', () => {
  // Initialize users in localStorage if not already done
  if (!localStorage.getItem('portfolioUsers')) {
    localStorage.setItem('portfolioUsers', JSON.stringify(initialUsers));
  }
  
  renderAuthSection();
  loadAdminOverview().catch(e => console.error('Error', e));
});

async function initializeData() {
  try {
    await db.getUsersFromDb();
  } catch (error) {
    console.error('Firestore unavailable', error);
  }
}

function makeVerificationCode() {
  return Math.random().toString().slice(2, 8);
}

function showMessage(elementId, message, type) {
  const container = document.getElementById(elementId);
  if (!container) return;
  container.innerHTML = `<div class="alert alert-${type} py-2" role="alert">${message}</div>`;
}

function renderAuthSection() {
  const el = document.getElementById('auth-section');
  if (!el) return;
  
  const currentUser = state.currentUser;
  const pendingEmail = localStorage.getItem('pendingVerificationEmail');
  
  if (currentUser) {
    // Hide auth when logged in
    el.innerHTML = '';
    return;
  }

  el.innerHTML = `
    <div class="auth-card p-3 mb-4">
      <div class="d-flex flex-column flex-md-row gap-2">
        <input id="email-input" class="form-control" placeholder="Email" />
        <input id="password-input" class="form-control" type="password" placeholder="Password" />
        <button id="login-btn" class="btn btn-primary">Login</button>
      </div>
      <div id="login-message"></div>
      <div id="verify-section" class="mt-3 ${pendingEmail ? '' : 'd-none'}">
        <input id="otp-input" class="form-control mb-2" placeholder="Enter OTP code" />
        <button id="verify-btn" class="btn btn-primary w-100">Verify OTP</button>
        <div id="verify-message"></div>
      </div>
    </div>
  `;
  
  document.getElementById('login-btn').addEventListener('click', handleLogin);
  document.getElementById('verify-btn').addEventListener('click', handleVerify);
}

function handleLogin() {
  const email = document.getElementById('email-input').value.trim().toLowerCase();
  const password = document.getElementById('password-input').value.trim();
  
  if (!email || !password) {
    showMessage('login-message', 'Please enter email and password', 'danger');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('portfolioUsers') || '[]');
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    showMessage('login-message', 'Invalid credentials', 'danger');
    return;
  }
  
  const otp = makeVerificationCode();
  user.loginOtp = otp;
  localStorage.setItem('portfolioUsers', JSON.stringify(users));
  localStorage.setItem('pendingVerificationEmail', email);
  
  renderAuthSection();
  showMessage('login-message', `OTP sent to ${email}`, 'success');
}

function handleVerify() {
  const otp = document.getElementById('otp-input').value.trim();
  const pendingEmail = localStorage.getItem('pendingVerificationEmail');
  
  const users = JSON.parse(localStorage.getItem('portfolioUsers') || '[]');
  const user = users.find(u => u.email === pendingEmail);
  
  if (!user || user.loginOtp !== otp) {
    showMessage('verify-message', 'Invalid OTP', 'danger');
    return;
  }
  
  user.verified = true;
  delete user.loginOtp;
  localStorage.setItem('portfolioUsers', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.removeItem('pendingVerificationEmail');
  
  state.currentUser = user;
  renderAuthSection();
  loadAdminOverview();
}

async function loadAdminOverview() {
  const summary = document.getElementById('admin-summary');
  const requestsList = document.getElementById('admin-request-list');
  if (!summary || !requestsList) return;

  if (!state.currentUser) {
    summary.innerHTML = '<div class="auth-card p-3">Login to view the admin dashboard.</div>';
    requestsList.innerHTML = '<div class="text-muted">No requests to display yet.</div>';
    return;
  }

  const requests = await db.getProductRequestsFromDb();
  const products = await db.getProductsFromDb();
  const isAdmin = state.currentUser.email === 'jagannathmani4@gmail.com' || state.currentUser.role === 'admin';

  summary.innerHTML = `
    <div class="request-card">
      <h4 class="h6 mb-2">Signed in as</h4>
      <p class="mb-1">${state.currentUser.email}</p>
      <p class="text-muted mb-0">${isAdmin ? 'Admin access enabled' : 'Standard user access'}</p>
    </div>
    <div class="request-card">
      <h4 class="h6 mb-2">Summary</h4>
      <p class="mb-1">${requests.length} pending request${requests.length === 1 ? '' : 's'}</p>
      <p class="text-muted mb-0">${products.length} approved product${products.length === 1 ? '' : 's'} published</p>
    </div>
  `;

  if (!isAdmin) {
    requestsList.innerHTML = '<div class="auth-card p-3">Only the site administrator can review product requests.</div>';
    return;
  }

  if (!requests.length) {
    requestsList.innerHTML = '<div class="text-muted">No pending product requests.</div>';
    return;
  }

  requestsList.innerHTML = requests.map((request) => `
    <div class="request-card">
      <div class="d-flex justify-content-between align-items-start gap-3">
        <div>
          <h4 class="h6 mb-1">${request.title || 'Untitled request'}</h4>
          <p class="text-muted mb-2">${request.description || 'No description provided.'}</p>
          <p class="small text-muted mb-0">Submitted by ${request.email || 'unknown'} • ${request.createdAt || 'recently'}</p>
        </div>
        <button class="btn btn-sm btn-primary approve-btn" data-id="${request.id}">Approve</button>
      </div>
    </div>
  `).join('');

  requestsList.querySelectorAll('.approve-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');
      await db.addProductToDb({
        title: requests.find((request) => request.id === id)?.title || 'Approved item',
        description: requests.find((request) => request.id === id)?.description || '',
        approvedBy: state.currentUser.email,
        approvedAt: new Date().toISOString()
      });
      await db.updateProductRequestStatus(id, { status: 'approved' });
      await loadAdminOverview();
    });
  });
}
