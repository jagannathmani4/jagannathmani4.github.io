const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
const GOOGLE_FORM_FIELDS = {
  email: 'entry.1234567890',
  phone: 'entry.0987654321'
};

const LOCAL_KEYS = {
  users: 'portfolioUsers',
  products: 'portfolioProducts',
  productRequests: 'portfolioProductRequests',
  currentUser: 'portfolioCurrentUser',
  pendingVerification: 'portfolioPendingVerification'
};

const portfolioDB = {
  heroTechs: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Tailwind', 'Git'],
  skills: [
    { label: 'HTML', level: 95 },
    { label: 'CSS', level: 90 },
    { label: 'JavaScript', level: 90 },
    { label: 'React.js', level: 85 },
    { label: 'Next.js', level: 80 },
    { label: 'TypeScript', level: 85 },
    { label: 'Node.js', level: 80 },
    { label: 'Tailwind CSS', level: 90 },
    { label: 'Git', level: 85 }
  ],
  projects: [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with modern UI/UX and checkout flow.',
      tech: ['React', 'Node.js', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Task Management App',
      description: 'Collaborative task management application with boards and analytics.',
      tech: ['Next.js', 'TypeScript', 'Firebase'],
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Crypto Dashboard',
      description: 'Real-time cryptocurrency tracking dashboard with interactive charts.',
      tech: ['React', 'Chart.js', 'API'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'
    }
  ],
  suggestedProducts: [
    {
      name: 'Pro Headphones',
      price: '$149',
      image: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Smart Desk Lamp',
      price: '$89',
      image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Wireless Charger',
      price: '$39',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80'
    }
  ],
  initialUsers: [
    {
      id: 1,
      email: 'jagannathmani4@gmail.com',
      password: 'admin123',
      displayName: 'Jagannath',
      isAdmin: true,
      verified: true,
      createdAt: '2026-07-05'
    }
  ]
};

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  const users = readStorage(LOCAL_KEYS.users);
  if (!users) {
    writeStorage(LOCAL_KEYS.users, portfolioDB.initialUsers);
    return [...portfolioDB.initialUsers];
  }
  return users;
}

function saveUsers(users) {
  writeStorage(LOCAL_KEYS.users, users);
}

function getProducts() {
  const stored = readStorage(LOCAL_KEYS.products);
  if (!stored) {
    writeStorage(LOCAL_KEYS.products, portfolioDB.suggestedProducts);
    return [...portfolioDB.suggestedProducts];
  }
  return stored;
}

function saveProducts(products) {
  writeStorage(LOCAL_KEYS.products, products);
}

function getProductRequests() {
  const stored = readStorage(LOCAL_KEYS.productRequests);
  if (!stored) {
    writeStorage(LOCAL_KEYS.productRequests, portfolioDB.suggestedProductRequests);
    return [...portfolioDB.suggestedProductRequests];
  }
  return stored;
}

function saveProductRequests(requests) {
  writeStorage(LOCAL_KEYS.productRequests, requests);
}

function getCurrentUser() {
  return readStorage(LOCAL_KEYS.currentUser);
}

function saveCurrentUser(user) {
  writeStorage(LOCAL_KEYS.currentUser, user);
}

function clearCurrentUser() {
  localStorage.removeItem(LOCAL_KEYS.currentUser);
}

function setPendingVerification(email) {
  localStorage.setItem(LOCAL_KEYS.pendingVerification, email);
}

function getPendingVerification() {
  return localStorage.getItem(LOCAL_KEYS.pendingVerification);
}

function clearPendingVerification() {
  localStorage.removeItem(LOCAL_KEYS.pendingVerification);
}

function makeVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function showAuthMessage(containerId, message, type = 'success') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="alert alert-${type} py-2" role="alert">${message}</div>`;
}

function renderAuthSection() {
  const authSection = document.getElementById('auth-section');
  if (!authSection) return;

  const currentUser = getCurrentUser();
  const pendingEmail = getPendingVerification();
  if (currentUser) {
    authSection.innerHTML = `
      <div class="glass-card p-4 mb-4 auth-card">
        <h3 class="mb-3">Welcome back, ${currentUser.displayName || currentUser.email}</h3>
        <p class="text-muted mb-3">
          ${currentUser.isAdmin ? 'You are an admin. You can add products and manage users.' : 'You are logged in as a verified user. Admins can add products.'}
        </p>
        <div class="d-flex gap-3 flex-wrap">
          <button class="btn btn-outline-light" id="logout-btn">Logout</button>
        </div>
      </div>
    `;
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      clearCurrentUser();
      renderAuthSection();
      renderAdminPanel();
    });
    return;
  }

  authSection.innerHTML = `
    <div class="glass-card p-4 auth-card">
      <div class="row g-4">
        <div class="col-lg-6">
          <h4>Login</h4>
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
            <button type="submit" class="btn btn-primary w-100">Login</button>
          </form>
        </div>
        <div class="col-lg-6">
          <h4>Register</h4>
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

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const verifyForm = document.getElementById('verify-form');

  loginForm?.addEventListener('submit', handleLogin);
  registerForm?.addEventListener('submit', handleRegister);
  verifyForm?.addEventListener('submit', handleVerify);
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value.trim();
  const users = getUsers();
  const user = users.find((item) => item.email === email);

  if (!user || user.password !== password) {
    showAuthMessage('login-message', 'Invalid email or password.', 'danger');
    return;
  }

  if (!user.verified) {
    setPendingVerification(user.email);
    saveUsers(users);
    renderAuthSection();
    showAuthMessage('login-message', 'Your email is not verified. Check the code sent to your email.', 'warning');
    return;
  }

  saveCurrentUser(user);
  renderAuthSection();
  renderAdminPanel();
}

function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById('register-email').value.trim().toLowerCase();
  const password = document.getElementById('register-password').value.trim();
  const users = getUsers();

  if (users.some((item) => item.email === email)) {
    showAuthMessage('register-message', 'That email is already registered. Please login instead.', 'danger');
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
  saveUsers(users);
  setPendingVerification(email);
  renderAuthSection();
  showAuthMessage('verify-message', `Your account has been created. Use code ${verificationCode} to verify your email.`, 'success');
}

function handleVerify(event) {
  event.preventDefault();
  const code = document.getElementById('verify-code').value.trim();
  const pendingEmail = getPendingVerification();
  const users = getUsers();
  const user = users.find((item) => item.email === pendingEmail);

  if (!user) {
    showAuthMessage('verify-message', 'No pending verification was found. Please register again.', 'danger');
    return;
  }

  if (user.verificationCode !== code) {
    showAuthMessage('verify-message', 'The verification code is incorrect.', 'danger');
    return;
  }

  user.verified = true;
  delete user.verificationCode;
  saveUsers(users);
  clearPendingVerification();
  saveCurrentUser(user);
  renderAuthSection();
  renderAdminPanel();
}

function renderAdminPanel() {
  const panel = document.getElementById('admin-panel');
  if (!panel) return;

  const currentUser = getCurrentUser();
  const productRequests = getProductRequests();
  const pendingRequests = productRequests.filter((request) => request.status === 'pending');

  if (!currentUser) {
    panel.innerHTML = `
      <div class="glass-card p-4 auth-card">
        <h4 class="mb-3">Product Access</h4>
        <p class="text-muted">Register and verify your email to suggest products and access admin approvals.</p>
      </div>
    `;
    return;
  }

  if (!currentUser.isAdmin) {
    const userRequests = productRequests.filter((request) => request.suggestedBy === currentUser.email);
    const userRows = userRequests
      .map(
        (request) => `
          <tr>
            <td>${request.name}</td>
            <td>${request.price}</td>
            <td>${request.status === 'pending' ? '<span class="badge bg-warning">Pending</span>' : '<span class="badge bg-success">Approved</span>'}</td>
          </tr>
        `
      )
      .join('');

    panel.innerHTML = `
      <div class="glass-card p-4 auth-card mb-4">
        <h4 class="mb-3">Suggest a Product</h4>
        <div id="suggest-message"></div>
        <form id="suggest-product-form">
          <div class="mb-3">
            <label class="form-label">Product Name</label>
            <input class="form-control" id="product-name" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Price</label>
            <input class="form-control" id="product-price" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Image URL</label>
            <input class="form-control" id="product-image" required />
          </div>
          <button class="btn btn-primary w-100" type="submit">Submit Suggestion</button>
        </form>
      </div>
      <div class="glass-card p-4 auth-card">
        <h4 class="mb-3">Your Suggestions</h4>
        ${userRequests.length ? `
          <div class="table-responsive">
            <table class="table table-dark table-striped align-middle mb-0 user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${userRows}
              </tbody>
            </table>
          </div>
        ` : '<p class="text-muted mb-0">No suggestions submitted yet. Use the form above to suggest a product.</p>'}
      </div>
    `;

    document.getElementById('suggest-product-form')?.addEventListener('submit', handleSuggestProduct);
    return;
  }

  const users = getUsers();
  const userRows = users
    .map((user) => `
      <tr>
        <td>${user.email}</td>
        <td>${user.verified ? '<span class="badge bg-success">Verified</span>' : '<span class="badge bg-warning">Pending</span>'}</td>
        <td>${user.isAdmin ? '<span class="badge bg-primary">Admin</span>' : '<span class="badge bg-secondary">User</span>'}</td>
        <td>${user.isAdmin ? '-' : `<button class="btn btn-sm btn-outline-light promote-btn" data-email="${user.email}">Promote</button>`}</td>
      </tr>
    `)
    .join('');

  const requestRows = pendingRequests
    .map((request) => `
      <tr>
        <td>${request.name}</td>
        <td>${request.price}</td>
        <td>${request.suggestedBy}</td>
        <td>
          <button class="btn btn-sm btn-success approve-btn" data-id="${request.id}">Approve</button>
          <button class="btn btn-sm btn-outline-light reject-btn ms-2" data-id="${request.id}">Reject</button>
        </td>
      </tr>
    `)
    .join('');

  panel.innerHTML = `
    <div class="glass-card p-4 auth-card mb-4">
      <h4 class="mb-3">Admin Product Tools</h4>
      <form id="add-product-form">
        <div class="mb-3">
          <label class="form-label">Product Name</label>
          <input class="form-control" id="product-name" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Price</label>
          <input class="form-control" id="product-price" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Image URL</label>
          <input class="form-control" id="product-image" required />
        </div>
        <button class="btn btn-primary w-100" type="submit">Add Product</button>
      </form>
    </div>
    <div class="glass-card p-4 auth-card mb-4">
      <h4 class="mb-3">Pending Product Suggestions</h4>
      ${pendingRequests.length ? `
        <div class="table-responsive">
          <table class="table table-dark table-striped align-middle mb-0 user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Suggested By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${requestRows}
            </tbody>
          </table>
        </div>
      ` : '<p class="text-muted mb-0">No pending suggestions at the moment.</p>'}
    </div>
    <div class="glass-card p-4 auth-card">
      <h4 class="mb-3">Manage Users</h4>
      <div class="table-responsive">
        <table class="table table-dark table-striped align-middle mb-0 user-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${userRows}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('add-product-form')?.addEventListener('submit', handleAddProduct);
  document.querySelectorAll('.approve-btn').forEach((button) => {
    button.addEventListener('click', () => handleApproveRequest(button.getAttribute('data-id')));
  });
  document.querySelectorAll('.reject-btn').forEach((button) => {
    button.addEventListener('click', () => handleRejectRequest(button.getAttribute('data-id')));
  });
  document.querySelectorAll('.promote-btn').forEach((button) => {
    button.addEventListener('click', () => handlePromoteUser(button.getAttribute('data-email')));
  });
}

function handleSuggestProduct(event) {
  event.preventDefault();
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.verified) {
    return;
  }

  const name = document.getElementById('product-name').value.trim();
  const price = document.getElementById('product-price').value.trim();
  const image = document.getElementById('product-image').value.trim();

  if (!name || !price || !image) return;

  const requests = getProductRequests();
  requests.unshift({
    id: Date.now().toString(),
    name,
    price,
    image,
    suggestedBy: currentUser.email,
    status: 'pending',
    createdAt: new Date().toISOString()
  });

  saveProductRequests(requests);
  document.getElementById('suggest-product-form')?.reset();
  renderAdminPanel();
  showAuthMessage('suggest-message', 'Product suggestion submitted. Admin will review it soon.', 'success');
}

function handleApproveRequest(requestId) {
  const requests = getProductRequests();
  const requestIndex = requests.findIndex((item) => item.id === requestId);
  if (requestIndex === -1) return;

  const request = requests[requestIndex];
  const products = getProducts();
  products.unshift({ name: request.name, price: request.price, image: request.image });
  saveProducts(products);

  requests.splice(requestIndex, 1);
  saveProductRequests(requests);

  renderSuggestedProducts();
  renderAdminPanel();
}

function handleRejectRequest(requestId) {
  const requests = getProductRequests();
  const updated = requests.filter((item) => item.id !== requestId);
  saveProductRequests(updated);
  renderAdminPanel();
}

function handleAddProduct(event) {
  event.preventDefault();
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.isAdmin) return;

  const name = document.getElementById('product-name').value.trim();
  const price = document.getElementById('product-price').value.trim();
  const image = document.getElementById('product-image').value.trim();

  if (!name || !price || !image) return;

  const products = getProducts();
  products.unshift({ name, price, image });
  saveProducts(products);
  renderSuggestedProducts();
  event.target.reset();
}

function handlePromoteUser(email) {
  const users = getUsers();
  const user = users.find((item) => item.email === email);
  if (!user) return;

  user.isAdmin = true;
  saveUsers(users);
  renderAdminPanel();
  renderAuthSection();
}

function renderSuggestedProducts() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;

  const products = getProducts();
  productsGrid.innerHTML = products
    .map(
      (product) => `
      <div class="col-lg-6">
        <article class="project-card h-100">
          <img src="${product.image}" alt="${product.name}" />
          <div class="project-body">
            <h3 class="h5 mt-3">${product.name}</h3>
            <p class="text-muted mt-2">${product.price}</p>
          </div>
        </article>
      </div>
    `
    )
    .join('');
}

function renderHeroTechs() {
  const techContainer = document.getElementById('hero-techs');
  if (!techContainer) return;

  techContainer.innerHTML = portfolioDB.heroTechs
    .map((tech) => `<span>${tech}</span>`)
    .join('');
}

function renderSkills() {
  const skillsList = document.getElementById('skills-list');
  if (!skillsList) return;

  skillsList.innerHTML = portfolioDB.skills
    .map(
      (skill) => `
      <div class="col-md-6 col-lg-4">
        <div class="glass-card skill-preview">
          <div class="skill-title">
            <span>${skill.label}</span>
            <span>${skill.level}%</span>
          </div>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${skill.level}%" aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      </div>
      `
    )
    .join('');
}

function renderProjects() {
  const projectGrid = document.getElementById('projects-grid');
  if (!projectGrid) return;

  projectGrid.innerHTML = portfolioDB.projects
    .map(
      (project, index) => `
      <div class="col-lg-4 col-md-6">
        <article class="project-card h-100">
          <img src="${project.image}" alt="${project.title}" />
          <div class="project-body">
            <span class="eyebrow">0${index + 1}</span>
            <h3 class="h5 mt-3">${project.title}</h3>
            <p class="text-muted mt-2">${project.description}</p>
            <div class="tech-tags mt-3">
              ${project.tech.map((item) => `<span>${item}</span>`).join('')}
            </div>
            <a href="#" class="btn btn-outline-light btn-sm mt-4">View Project</a>
          </div>
        </article>
      </div>
    `
    )
    .join('');
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  const messageBox = document.getElementById('contact-message');
  if (!form || !messageBox) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    messageBox.textContent = 'Thanks! Your message has been received. I’ll reply soon.';
    messageBox.classList.remove('d-none');
    form.reset();
  });
}

function setupCvRequestForm() {
  const form = document.getElementById('cv-request-form');
  const messageBox = document.getElementById('cv-request-message');
  const downloadCvBtn = document.getElementById('download-cv-btn');
  const modalElement = document.getElementById('downloadCvModal');
  const modal = modalElement ? new bootstrap.Modal(modalElement) : null;

  downloadCvBtn?.addEventListener('click', () => modal?.show());

  if (!form || !messageBox) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('cv-email').value;
    const phone = document.getElementById('cv-phone').value;

    const payload = new URLSearchParams();
    payload.append(GOOGLE_FORM_FIELDS.email, email);
    payload.append(GOOGLE_FORM_FIELDS.phone, phone);

    try {
      await fetch(GOOGLE_FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: payload.toString()
      });

      form.reset();
      messageBox.textContent = 'Your CV request has been sent. I will follow up shortly.';
      messageBox.classList.remove('d-none');
    } catch (error) {
      messageBox.textContent = 'There was a problem sending your request. Please try again later.';
      messageBox.classList.remove('d-none');
    }
  });
}

function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1200;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = `${value}${target === 97 ? '%' : '+'}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = `${target}${target === 97 ? '%' : '+'}`;
      }
    };

    if (target > 0) {
      requestAnimationFrame(step);
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderHeroTechs();
  renderSkills();
  renderProjects();
  renderSuggestedProducts();
  renderAuthSection();
  renderAdminPanel();
  setupContactForm();
  setupCvRequestForm();
  animateCounters();
});
