const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
const GOOGLE_FORM_FIELDS = {
  email: 'entry.1234567890',
  phone: 'entry.0987654321'
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
  ]
};

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

function renderSuggestedProducts() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;

  productsGrid.innerHTML = portfolioDB.suggestedProducts
    .map(
      (product) => `
      <div class="col-lg-4 col-md-6">
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
  setupContactForm();
  setupCvRequestForm();
  animateCounters();
});
