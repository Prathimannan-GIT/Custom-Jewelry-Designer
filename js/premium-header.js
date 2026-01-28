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
    this.navLinks.forEach(navLink => navLink.classList.remove('active'));
    this.mobileNavLinks.forEach(navLink => navLink.classList.remove('active'));
    
    link.classList.add('active');
    
    localStorage.setItem('activePage', link.getAttribute('href'));
  }

  setActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const activePage = localStorage.getItem('activePage') || currentPage;
    
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === activePage || 
          (activePage === '' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
      }
    });

    this.mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === activePage || 
          (activePage === '' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  handleScroll() {
    let lastScrollTop = 0;
    const header = document.querySelector('.premium-header');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
    });
  }

  handleResize() {
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PremiumHeader();
});
