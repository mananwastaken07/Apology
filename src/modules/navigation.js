/**
 * Floating Navigation Pill
 * Shows/hides based on scroll position, smooth scrolling, active state tracking.
 */

export class FloatingNav {
  constructor() {
    this.nav = document.getElementById('floating-nav');
    if (!this.nav) return;

    this.links = this.nav.querySelectorAll('.nav-link');
    this.sections = [];
    this.isVisible = false;

    this.init();
  }

  init() {
    // Collect sections
    this.links.forEach((link) => {
      const sectionId = link.dataset.section;
      const section = document.getElementById(sectionId);
      if (section) {
        this.sections.push({ id: sectionId, el: section, link });
      }
    });

    // Smooth scroll on click
    this.links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.section);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Track scroll for active states and visibility
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateActiveState();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  show() {
    this.nav.classList.add('visible');
    this.isVisible = true;
  }

  hide() {
    this.nav.classList.remove('visible');
    this.isVisible = false;
  }

  updateActiveState() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    let activeSection = null;

    for (const section of this.sections) {
      const rect = section.el.getBoundingClientRect();
      if (rect.top <= windowHeight * 0.4 && rect.bottom >= windowHeight * 0.2) {
        activeSection = section.id;
      }
    }

    this.links.forEach((link) => {
      if (link.dataset.section === activeSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
