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
    if (!footer) return;
    
    // Get footer height for calculations
    footerHeight = footer.offsetHeight;
    
    // Set initial state
    footer.parentElement.setAttribute('aria-hidden', 'true');
    
    // Enable footer behavior after initial delay
    setTimeout(() => {
      isFooterEnabled = true;
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
    checkScrollPosition();
  }
  
  /**
   * Check if user has scrolled to bottom of page
   */
  function checkScrollPosition() {
    if (!isFooterEnabled) return;
    
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
   */
  function showFooter() {
    if (!footer.classList.contains('footer-visible')) {
      footer.classList.add('footer-visible');
      footer.parentElement.setAttribute('aria-hidden', 'false');
    }
  }
  
  /**
   * Hide the footer
   */
  function hideFooter() {
    if (footer.classList.contains('footer-visible')) {
      footer.classList.remove('footer-visible');
      footer.parentElement.setAttribute('aria-hidden', 'true');
    }
  }
  
  /**
   * Get the total height of the document
   * Cross-browser compatible method
   */
  function getDocumentHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollFooter);
  } else {
    initScrollFooter();
  }
})();
