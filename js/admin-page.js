import * as db from './firebase-service.js';
import { DEFAULT_ADMIN_USER, ensureDefaultAdminUser } from './admin-account.js';

const initialUsers = [
  DEFAULT_ADMIN_USER
];

const state = { 
  currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null')
};

window.addEventListener('DOMContentLoaded', () => {
  // Initialize users in localStorage if not already done
  if (!localStorage.getItem('portfolioUsers')) {
    localStorage.setItem('portfolioUsers', JSON.stringify(initialUsers));
  }
  ensureDefaultAdminUser();
  state.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
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

function renderAuthSection() {
  const el = document.getElementById('auth-section');
  if (!el) return;
  
  const currentUser = state.currentUser;

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
    </div>
  `;
  
  document.getElementById('login-btn').addEventListener('click', handleLogin);
}

async function handleLogin() {
  const email = document.getElementById('email-input').value.trim().toLowerCase();
  const password = document.getElementById('password-input').value.trim();
  
  if (!email || !password) {
    showMessage('login-message', 'Please enter email and password', 'danger');
    return;
  }
  
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
    loadAdminOverview();
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
