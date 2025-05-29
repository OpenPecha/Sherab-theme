/**
 * Scroll-triggered footer behavior
 * Shows footer only when user reaches bottom of page
 * Hides footer when scrolling back up
 */
(function() {
  // Configuration
  const SCROLL_THRESHOLD = 100; // Buffer in pixels from bottom to trigger footer
  const INITIAL_DELAY = 500;    // Delay before enabling footer on page load (ms)
  
  // DOM elements
  let footer;
  let footerHeight;
  let isFooterEnabled = false;
  let lastScrollTop = 0;
  let ticking = false;
  
  /**
   * Initialize the scroll footer
   */
  function initScrollFooter() {
    footer = document.getElementById('scroll-footer');
    if (!footer) {
      console.error('Footer element not found. Make sure the ID "scroll-footer" exists.');
      return;
    }
    
    console.log('Footer initialized');
    
    // Get footer height for calculations
    footerHeight = footer.offsetHeight;
    console.log('Footer height:', footerHeight);
    
    // Set initial state
    footer.parentElement.setAttribute('aria-hidden', 'true');
    
    // Check if page is scrollable immediately
    const isScrollable = isPageScrollable();
    console.log('Is page scrollable:', isScrollable);
    
    // Show footer immediately on non-scrollable pages
    // Don't wait for the delay
    if (!isScrollable) {
      console.log('Page is not scrollable, showing footer immediately');
      showFooter();
    }
    
    // Enable footer behavior after initial delay
    setTimeout(() => {
      isFooterEnabled = true;
      console.log('Footer behavior enabled');
      
      // Check if page is scrollable
      checkIfPageIsScrollable();
      
      // Initial check in case page is already at bottom on load
      checkScrollPosition();
      
      // Add scroll event listener with passive option for performance
      window.addEventListener('scroll', onScroll, { passive: true });
      
      // Also listen for window resize to recalculate dimensions
      window.addEventListener('resize', onResize, { passive: true });
    }, INITIAL_DELAY);
  }
  
  /**
   * Handle scroll events with throttling
   */
  function onScroll() {
    if (!ticking) {
      // Use requestAnimationFrame to throttle scroll events
      window.requestAnimationFrame(() => {
        checkScrollPosition();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  /**
   * Handle window resize events
   */
  function onResize() {
    // Recalculate footer height in case of responsive changes
    footerHeight = footer.offsetHeight;
    
    // Check if page became scrollable or non-scrollable after resize
    checkIfPageIsScrollable();
    checkScrollPosition();
  }
  
  /**
   * Check if the page is scrollable
   * @returns {boolean} true if page can be scrolled, false otherwise
   */
  function isPageScrollable() {
    const windowHeight = window.innerHeight;
    const documentHeight = getDocumentHeight();
    
    // Add a small buffer (1px) to account for rounding errors
    return documentHeight > (windowHeight + 1);
  }
  
  /**
   * Check if the page is scrollable and show footer if it's not
   */
  function checkIfPageIsScrollable() {
    if (!isFooterEnabled) return;
    
    const isScrollable = isPageScrollable();
    if (!isScrollable) {
      // If not scrollable, always show footer and skip toggling logic
      showFooter(true);
      return;
    }
    // If scrollable, use scroll position logic
    checkScrollPosition();
  }
  
  /**
   * Check if user has scrolled to bottom of page
   */
  function checkScrollPosition() {
    if (!isFooterEnabled) return;
    // If not scrollable, always show and skip toggling logic
    if (!isPageScrollable()) {
      showFooter(true);
      return;
    }
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = getDocumentHeight();
    // Check if user is near bottom of page
    const isAtBottom = (windowHeight + scrollTop) >= (documentHeight - SCROLL_THRESHOLD);
    // Check scroll direction
    const isScrollingDown = scrollTop > lastScrollTop;
    lastScrollTop = scrollTop;
    // Update footer visibility
    if (isAtBottom && isScrollingDown) {
      showFooter();
    } else {
      hideFooter();
    }
  }
  
  /**
   * Show the footer
   * @param {boolean} force - If true, force the footer to be visible regardless of other conditions
   */
  function showFooter(force = false) {
    console.log('Showing footer, force =', force);
    
    if (!footer.classList.contains('footer-visible') || force) {
      // Add padding to the main content container to prevent footer from blocking content
      const contentWrapper = document.querySelector('.content-wrapper');
      if (contentWrapper) {
        contentWrapper.style.paddingBottom = `${footerHeight + 20}px`; // Add extra padding
      }
      
      footer.classList.add('footer-visible');
      footer.parentElement.setAttribute('aria-hidden', 'false');
      console.log('Footer is now visible');
    }
  }
  
  /**
   * Hide the footer
   */
  function hideFooter() {
    if (footer.classList.contains('footer-visible')) {
      // Remove the extra padding from content when footer is hidden
      const contentWrapper = document.querySelector('.content-wrapper');
      if (contentWrapper) {
        contentWrapper.style.paddingBottom = '';
      }
      
      footer.classList.remove('footer-visible');
      footer.parentElement.setAttribute('aria-hidden', 'true');
    }
  }
  
  /**
   * Get the total height of the document
   * Cross-browser compatible method
   */
  function getDocumentHeight() {
    // Get the document height using multiple methods for cross-browser compatibility
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    
    console.log('Document height:', height, 'Window height:', window.innerHeight);
    return height;
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollFooter);
    // Also add a direct call after a delay to ensure the footer shows up
    setTimeout(() => {
      const footer = document.getElementById('scroll-footer');
      if (footer && !isPageScrollable()) {
        console.log('Forcing footer visibility on non-scrollable page');
        showFooter(true);
      }
    }, 1000);
  } else {
    initScrollFooter();
    // Also add a direct call after a delay to ensure the footer shows up
    setTimeout(() => {
      const footer = document.getElementById('scroll-footer');
      if (footer && !isPageScrollable()) {
        console.log('Forcing footer visibility on non-scrollable page');
        showFooter(true);
      }
    }, 1000);
  }
})();
