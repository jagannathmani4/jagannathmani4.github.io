import * as db from './firebase-service.js';

const state = { currentUser: null };

window.addEventListener('DOMContentLoaded', () => {
  renderAuthSection();
  initializeData().catch((error) => console.error('Admin page init failed', error));
});

async function initializeData() {
  try {
    await db.getUsersFromDb();
    await loadAdminOverview();
  } catch (error) {
    console.error('Firestore unavailable', error);
  }
}

function renderAuthSection() {
  const el = document.getElementById('auth-section');
  if (!el) return;
  el.innerHTML = `
    <div class="auth-card p-3 mb-4">
      <div class="d-flex flex-column flex-md-row gap-2">
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
  await loadAdminOverview();
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
