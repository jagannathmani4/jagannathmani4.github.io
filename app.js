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
  setupContactForm();
  animateCounters();
});
