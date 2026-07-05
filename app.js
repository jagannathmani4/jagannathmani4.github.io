const portfolioData = {
  projects: [
    {
      title: 'Aurora Commerce',
      tech: ['Laravel', 'Vue', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Neural Studio',
      tech: ['React', 'Python', 'FastAPI'],
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Northstar CRM',
      tech: ['Laravel', 'React', 'Tailwind'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'
    }
  ]
};

const projectGrid = document.getElementById('projects-grid');

function renderProjects() {
  if (!projectGrid) return;

  const cards = portfolioData.projects.map((project) => `
    <div class="col-lg-4 col-md-6">
      <article class="project-card h-100">
        <img src="${project.image}" alt="${project.title}" />
        <div class="project-body">
          <h3 class="h5">${project.title}</h3>
          <div class="tech-tags mt-3">
            ${project.tech.map((item) => `<span>${item}</span>`).join('')}
          </div>
        </div>
      </article>
    </div>
  `);

  projectGrid.innerHTML = cards.join('');
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

    requestAnimationFrame(step);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  animateCounters();
});
