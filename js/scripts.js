// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth',
    });
  });
});

// Smooth Scrolling for Highlight Bar
document.querySelectorAll('.highlight-bar a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

// Function to check if an element is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top <= window.innerHeight && rect.bottom >= 0;
}

// Add 'visible' class and animate progress bars when elements come into view
function handleScrollAnimation() {
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => {
    if (isInViewport(el)) {
      el.classList.add('visible');

      // Animate progress bars inside the element
      const progressBars = el.querySelectorAll('.progress');
      progressBars.forEach(bar => {
        const value = bar.getAttribute('data-value');
        bar.style.width = `${value}%`;
      });
    }
  });
}

// Run the function on scroll
window.addEventListener('scroll', handleScrollAnimation);
handleScrollAnimation(); // Run initially for elements already in view

// Modal functionality
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalCode = document.getElementById('modal-code');
const modalDemo = document.getElementById('modal-demo');
const closeModal = document.querySelector('.close-modal');

function addModalEventListeners() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3').textContent;
      const description = card.querySelector('p').textContent;
      const code = card.querySelector('.project-link[href*="github"]').href;
      const demo = card.querySelector('.project-link[href*="example"]').href;

      modalTitle.textContent = title;
      modalDescription.textContent = description;
      modalCode.href = code;
      modalDemo.href = demo;

      modal.style.display = 'flex';
    });
  });
}

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', event => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

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

// Initialize to show the first page
if (pageButtons.length > 0) {
  pageButtons[0].click();

  // Project filtering and dynamic loading
  document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectContainer = document.querySelector('.project-cards');

    function applyFilter(filter) {
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
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
          const projectCard = `
          <div class="project-card" data-category="${project.category}">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              <div class="project-links">
                <a href="${project.code}" target="_blank" class="project-link">Code</a>
                <a href="${project.demo}" target="_blank" class="project-link">Live Demo</a>
              </div>
            </div>
          </div>
        `;
          projectContainer.insertAdjacentHTML('beforeend', projectCard);
        });

        // Add modal listeners to dynamically added cards
        addModalEventListeners();

        // Reapply the current filter (default to 'all')
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        applyFilter(activeFilter);

        // Reinitialize animations and pagination
        handleScrollAnimation();
        if (pageButtons.length > 0) {
          pageButtons[0].click();
        }
      })
      .catch(error => console.error('Error loading projects:', error));
  });
}