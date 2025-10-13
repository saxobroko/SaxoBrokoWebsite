// Modern JavaScript to replace Skel and old jQuery patterns
class ModernWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupResponsive();
    this.setupLazyLoading();
    this.setupDarkMode();
    this.setupNavigation();
    this.setupGallery();
    this.setupSearch();
  }

  // Replace Skel breakpoints with modern CSS and JS
  setupResponsive() {
    const breakpoints = {
      mobile: '(max-width: 480px)',
      tablet: '(max-width: 768px)',
      desktop: '(min-width: 769px)'
    };

    Object.entries(breakpoints).forEach(([name, query]) => {
      const mq = window.matchMedia(query);
      this.handleBreakpoint(name, mq.matches);
      mq.addEventListener('change', (e) => this.handleBreakpoint(name, e.matches));
    });
  }

  handleBreakpoint(breakpoint, matches) {
    document.body.classList.toggle(`breakpoint-${breakpoint}`, matches);
  }

  // Modern Intersection Observer instead of scroll events
  setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Simplified dark mode without external library
  setupDarkMode() {
    const toggle = document.createElement('button');
    toggle.className = 'darkmode-toggle';
    toggle.innerHTML = '🌓';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });

    document.body.appendChild(toggle);
  }

  // Modern navigation without jQuery
  setupNavigation() {
    const nav = document.querySelector('#nav');
    const links = nav?.querySelectorAll('a[href^="#"], a[href^="/"]');
    
    links?.forEach(link => {
      if (link.href === window.location.href) {
        link.classList.add('active');
      }
    });

    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Modern gallery with event delegation
  setupGallery() {
    const galleries = document.querySelectorAll('.gallery');
    
    galleries.forEach(gallery => {
      const content = gallery.querySelector('.content');
      if (!content) return;

      // Filter functionality
      gallery.addEventListener('click', (e) => {
        const tab = e.target.closest('[data-tag]');
        if (!tab) return;

        e.preventDefault();
        
        // Update active tab
        gallery.querySelectorAll('[data-tag]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter items
        const tag = tab.dataset.tag;
        content.querySelectorAll('.media').forEach(item => {
          if (tag === 'all' || item.classList.contains(tag)) {
            item.style.display = 'block';
            item.classList.add('fade-in');
          } else {
            item.style.display = 'none';
          }
        });
      });

      // Modal/lightbox functionality
      content.addEventListener('click', (e) => {
        const link = e.target.closest('a[href*="images/"]');
        if (link && !link.classList.contains('popyoutube')) {
          e.preventDefault();
          this.openModal(link.href, link.querySelector('img')?.alt || '');
        }
      });
    });
  }

  openModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Close">&times;</button>
        <img src="${src}" alt="${alt}" loading="lazy">
      </div>
    `;

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-close')) {
        modal.remove();
      }
    });

    document.body.appendChild(modal);
    modal.offsetHeight; // Force reflow
    modal.classList.add('active');
  }

  // Enhanced search functionality
  setupSearch() {
    const searchForm = document.querySelector('.searchbox');
    const searchInput = searchForm?.querySelector('input[type="search"]');
    
    if (!searchInput) return;

    // Debounced search suggestions
    let timeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.showSearchSuggestions(e.target.value);
      }, 300);
    });

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.performSearch(searchInput.value);
    });
  }

  showSearchSuggestions(query) {
    if (query.length < 2) return;
    
    // Simple search suggestions - could be enhanced with a search API
    const suggestions = [
      'portfolio', 'games', 'tools', 'minecraft', 'chess', 'blog'
    ].filter(item => item.toLowerCase().includes(query.toLowerCase()));

    console.log('Search suggestions:', suggestions);
  }

  performSearch(query) {
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    // Core Web Vitals
    this.measureLCP();
    this.measureFID();
    this.measureCLS();
  }

  measureLCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.LCP = lastEntry.startTime;
      console.log('LCP:', this.metrics.LCP);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  measureFID() {
    new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0];
      this.metrics.FID = firstInput.processingStart - firstInput.startTime;
      console.log('FID:', this.metrics.FID);
    }).observe({ entryTypes: ['first-input'] });
  }

  measureCLS() {
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.CLS = clsValue;
      console.log('CLS:', this.metrics.CLS);
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

// Service Worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered:', registration))
      .catch(error => console.log('SW registration failed:', error));
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ModernWebsite();
    new PerformanceMonitor();
  });
} else {
  new ModernWebsite();
  new PerformanceMonitor();
}

export { ModernWebsite, PerformanceMonitor };
