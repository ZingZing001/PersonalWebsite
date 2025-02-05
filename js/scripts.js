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
