// Dashboard JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize dashboard functionality
  initDashboard();
});

function initDashboard() {
  // Section switching functionality
  initSectionSwitching();
  
  // Mobile sidebar toggle
  initMobileSidebar();
  
  // Role switcher
  initRoleSwitcher();
  
  // Theme toggle
  initThemeToggle();
  
  // Interactive elements
  initInteractiveElements();
}

function initSectionSwitching() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.dashboard-section');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get target section
      const targetSection = this.getAttribute('data-section');
      if (!targetSection) return;
      
      // Remove active class from all nav items and sections
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(section => section.classList.remove('active'));
      
      // Add active class to clicked nav item and corresponding section
      this.classList.add('active');
      const targetElement = document.getElementById(targetSection);
      if (targetElement) {
        targetElement.classList.add('active');
        
        // Scroll to top of content area for better visibility
        const dashboardContent = document.querySelector('.dashboard-content');
        if (dashboardContent) {
          dashboardContent.scrollTop = 0;
        }
        
        // Smooth scroll to section if it's not immediately visible
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }, 100);
      }
      
      // Close mobile sidebar after selection
      if (window.innerWidth <= 768) {
        closeMobileSidebar();
      }
    });
  });
}

function initMobileSidebar() {
  const mobileToggle = document.getElementById('mobileDashToggle');
  const sidebar = document.getElementById('dashSidebar');
  const overlay = document.getElementById('dashOverlay');
  
  if (mobileToggle && sidebar && overlay) {
    mobileToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });
    
    overlay.addEventListener('click', function() {
      closeMobileSidebar();
    });
    
    // Close sidebar when clicking outside on desktop
    document.addEventListener('click', function(e) {
      if (window.innerWidth > 768) {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
          // Optional: Add any desktop click-outside behavior here
        }
      }
    });
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('dashSidebar');
  const overlay = document.getElementById('dashOverlay');
  
  if (sidebar && overlay) {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }
}

function initRoleSwitcher() {
  const roleSwitch = document.getElementById('roleSwitch');
  const roleLabel = document.getElementById('roleLabel');
  const htmlElement = document.documentElement;
  
  if (roleSwitch && roleLabel) {
    roleSwitch.addEventListener('change', function() {
      const isDesigner = this.checked;
      
      // Update label
      roleLabel.textContent = isDesigner ? 'Designer Workspace' : 'Client Workspace';
      
      // Update data-role attribute
      htmlElement.setAttribute('data-role', isDesigner ? 'designer' : 'client');
      
      // Optional: Add role-specific content changes
      updateContentForRole(isDesigner);
    });
  }
}

function updateContentForRole(isDesigner) {
  // This function can be expanded to show/hide role-specific content
  const statCards = document.querySelectorAll('.stat-card');
  const statValues = document.querySelectorAll('.stat-value');
  
  if (isDesigner) {
    // Designer-specific stats
    if (statValues[0]) statValues[0].textContent = '8'; // Active Designs
    if (statValues[1]) statValues[1].textContent = '12'; // Messages
    if (statValues[2]) statValues[2].textContent = '$15,230.00'; // Earnings
    
    // Update other stats if needed
    if (statValues[3]) statValues[3].textContent = '5'; // Pending Reviews
    if (statValues[4]) statValues[4].textContent = '47'; // Completed Projects
    if (statValues[5]) statValues[5].textContent = '$124,500'; // Total Earnings
  } else {
    // Client-specific stats
    if (statValues[0]) statValues[0].textContent = '3'; // Active Designs
    if (statValues[1]) statValues[1].textContent = '5'; // Messages
    if (statValues[2]) statValues[2].textContent = '$2,450.00'; // Account Balance
    
    // Update other stats if needed
    if (statValues[3]) statValues[3].textContent = '2'; // Pending Approvals
    if (statValues[4]) statValues[4].textContent = '12'; // Completed Projects
    if (statValues[5]) statValues[5].textContent = '$18,750'; // Total Spent
  }
}

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Update theme
      htmlElement.setAttribute('data-theme', newTheme);
      
      // Update icon
      const icon = this.querySelector('i');
      if (icon) {
        icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
      
      // Save preference to localStorage
      localStorage.setItem('theme', newTheme);
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    
    // Update icon based on saved theme
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }
}

function initInteractiveElements() {
  // Design card clicks
  const designCards = document.querySelectorAll('.design-card');
  designCards.forEach(card => {
    card.addEventListener('click', function() {
      // Add click animation
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
      
      // Optional: Navigate to design details
      console.log('Design card clicked:', this.querySelector('.design-title').textContent);
    });
  });
  
  // Message item clicks
  const messageItems = document.querySelectorAll('.message-item');
  messageItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove unread indicator
      const unreadIndicator = this.querySelector('.unread-indicator');
      if (unreadIndicator) {
        unreadIndicator.style.display = 'none';
      }
      
      // Optional: Open message modal or navigate
      console.log('Message clicked:', this.querySelector('.message-sender').textContent);
    });
  });
  
  // Notification item clicks
  const notificationItems = document.querySelectorAll('.notification-item');
  notificationItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove unread state
      this.classList.remove('unread');
      
      // Optional: Handle notification action
      console.log('Notification clicked:', this.querySelector('.notification-title').textContent);
    });
  });
  
  // Approval button clicks
  const approvalButtons = document.querySelectorAll('.approval-actions .btn');
  approvalButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      
      const isApprove = this.classList.contains('btn-primary');
      const approvalCard = this.closest('.approval-card');
      const title = approvalCard.querySelector('h4').textContent;
      
      if (isApprove) {
        // Handle approval
        console.log('Approved:', title);
        approvalCard.style.opacity = '0.5';
        setTimeout(() => {
          approvalCard.style.display = 'none';
        }, 300);
      } else {
        // Handle view action
        console.log('Viewing:', title);
      }
    });
  });
  
  // Add hover effects to stat cards
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(-2px)';
    });
  });
}

// Handle window resize
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    closeMobileSidebar();
  }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  // Escape key closes mobile sidebar
  if (e.key === 'Escape') {
    closeMobileSidebar();
  }
  
  // Arrow key navigation for menu items (optional enhancement)
  if (e.altKey) {
    const navItems = document.querySelectorAll('.nav-item');
    const activeItem = document.querySelector('.nav-item.active');
    const currentIndex = Array.from(navItems).indexOf(activeItem);
    
    if (e.key === 'ArrowDown' && currentIndex < navItems.length - 1) {
      navItems[currentIndex + 1].click();
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      navItems[currentIndex - 1].click();
    }
  }
});

// Initialize tooltips and other enhancements (optional)
function initTooltips() {
  // Add tooltip functionality if needed
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.getAttribute('data-tooltip');
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    });
    
    element.addEventListener('mouseleave', function() {
      const tooltip = document.querySelector('.tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    });
  });
}

// Performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced resize handler
const debouncedResize = debounce(function() {
  // Handle resize-specific logic
  if (window.innerWidth <= 768) {
    // Mobile-specific adjustments
  } else {
    // Desktop-specific adjustments
  }
}, 250);

window.addEventListener('resize', debouncedResize);

// Export functions for potential external use
window.Dashboard = {
  switchSection: function(sectionId) {
    const navItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (navItem) {
      navItem.click();
    }
  },
  toggleTheme: function() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.click();
    }
  },
  toggleRole: function() {
    const roleSwitch = document.getElementById('roleSwitch');
    if (roleSwitch) {
      roleSwitch.checked = !roleSwitch.checked;
      roleSwitch.dispatchEvent(new Event('change'));
    }
  }
};
