document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalCode = document.getElementById('modal-code');
  const closeModal = document.querySelector('.close-modal');

  function addModalEventListeners() {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        const code = card.querySelector('.project-link[href*="github"]').href;

        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalCode.href = code;

        modal.style.display = 'flex';
      });
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  // Pagination logic
  const pageButtons = document.querySelectorAll('.page-btn');
  const projectsPerPage = 6; // Number of projects per page

  pageButtons.forEach(button => {
    button.addEventListener('click', () => {
      pageButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const page = parseInt(button.getAttribute('data-page'));
      const projectCards = document.querySelectorAll('.project-card');

      projectCards.forEach((card, index) => {
        if (index >= (page - 1) * projectsPerPage && index < page * projectsPerPage) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Initialize to show the first page only if buttons exist
  if (pageButtons.length > 0) {
    pageButtons[0].click();
  }

  // Project filtering and dynamic loading
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectContainer = document.querySelector('.project-cards');

  function applyFilter(filter) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.style.display = 'block';
      } else if (filter === 'other' && card.getAttribute('data-category') !== 'web' && card.getAttribute('data-category') !== 'data') {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Add event listeners to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.getAttribute('data-filter');
      applyFilter(filter);
    });
  });

  // Fetch project data and initialize cards
  fetch('json/projectCards.json')
    .then(response => response.json())
    .then(data => {
      projectContainer.innerHTML = ''; // Clear any existing content

      data.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-card');
        projectCard.setAttribute('data-category', project.category);

        projectCard.innerHTML = `
          <img src="${project.image}" alt="${project.title}" class="project-image">
          <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-links">
              <!-- GitHub Button -->
              <a href="${project.code}" target="_blank" class="github-button">
                <i class="fab fa-github"></i> View Code on GitHub
              </a>
            </div>
          </div>
        `;

        projectContainer.appendChild(projectCard);
      });

      // Add modal listeners to dynamically added cards
      addModalEventListeners();

      // Reapply the current filter (default to 'all')
      const activeFilter = document.querySelector('.filter-btn.active');
      if (activeFilter) {
        applyFilter(activeFilter.getAttribute('data-filter'));
      }

      // Reinitialize animations and pagination
      handleScrollAnimation();
      if (pageButtons.length > 0) {
        pageButtons[0].click();
      }
    })
    .catch(error => console.error('Error loading projects:', error));
});