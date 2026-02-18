class PremiumHeader {
  constructor() {
    this.init();
  }

  init() {
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    this.mobileMenuClose = document.querySelector('.mobile-menu-close');
    this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    this.navLinks = document.querySelectorAll('.nav-link');

    this.isMenuOpen = false;
    this.bindEvents();
    this.setActivePage();
    this.handleScroll();
    this.initTheme();
  }

  bindEvents() {
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    if (this.mobileMenuClose) {
      this.mobileMenuClose.addEventListener('click', () => this.closeMobileMenu());
    }

    if (this.mobileMenuOverlay) {
      this.mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === this.mobileMenuOverlay) {
          this.closeMobileMenu();
        }
      });
    }

    this.mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e, link));
    });

    this.mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e, link));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    window.addEventListener('resize', () => this.handleResize());

    // Theme Toggle Event (bind to all toggle buttons)
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => this.toggleTheme());
    });
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    this.mobileMenuOverlay.classList.add('active');
    this.mobileMenuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Accessibility: Focus on close button when menu opens
    setTimeout(() => {
      if (this.mobileMenuClose) {
        this.mobileMenuClose.focus();
      }
    }, 100);
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.mobileMenuOverlay.classList.remove('active');
    this.mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleNavClick(e, link) {
    // Current behavior: just update the active page in storage
    // But if it's already on the page, we don't need to prevent default
    localStorage.setItem('activePage', link.getAttribute('href'));
  }

  setActivePage() {
    const fullPath = window.location.pathname;
    const currentPage = fullPath.substring(fullPath.lastIndexOf('/') + 1) || 'index.html';

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });

    this.mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  }

  handleScroll() {
    // Header is now fixed - no scroll behavior needed
    // Keeping this function for potential future enhancements
  }

  handleResize() {
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PremiumHeader();
});
