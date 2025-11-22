/**
 * Scroll-triggered footer behavior
 * Shows footer only when user reaches bottom of page
 * Hides footer when scrolling back up
 */
(function () {
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
      return;
    }


    // Get footer height for calculations
    footerHeight = footer.offsetHeight;


    // Set initial state
    footer.parentElement.setAttribute('aria-hidden', 'true');

    // Check if page is scrollable immediately
    const isScrollable = isPageScrollable();

    // Show footer based on scroll position only (no immediate show on load)
    if (!isScrollable) {
    }

    // Enable footer behavior after initial delay
    setTimeout(() => {
      isFooterEnabled = true;


      // Check if page is scrollable
      checkIfPageIsScrollable();

      // Initial check in case page is already at bottom on load
      checkScrollPosition();

      // Add scroll event listener with passive option for performance
      window.addEventListener('scroll', onScroll, { passive: true });

      // Also listen for window resize to recalculate dimensions
      window.addEventListener('resize', onResize, { passive: true });
      footer.parentElement.style.visibility = 'visible';
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

    // Force recalculation of scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = getDocumentHeight();

    // Check if user is near bottom of page
    const isAtBottom = (windowHeight + scrollTop) >= (documentHeight - SCROLL_THRESHOLD);

    // If at bottom, explicitly show the footer
    if (isAtBottom) {
      showFooter(true);
    } else {
      // Otherwise use normal scroll position check
      checkScrollPosition();
    }
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
      setContentPadding(false);
      showFooter(true);
      return;
    }
    // If scrollable, always set content padding
    setContentPadding(true);
    // Use scroll position logic
    checkScrollPosition();
  }

  /**
   * Check if user has scrolled to bottom of page
   */
  function checkScrollPosition() {
    if (!isFooterEnabled) return;
    // If not scrollable, always show and skip toggling logic
    if (!isPageScrollable()) {
      setContentPadding(false);
      showFooter(true);
      return;
    }
    setContentPadding(true);
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
   * Set or remove bottom padding on content for scrollable pages
   * @param {boolean} enable - true to set, false to remove
   */
  function setContentPadding(enable) {
    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
      if (enable) {
        contentWrapper.style.paddingBottom = (footerHeight + 60) + 'px';
      } else {
        contentWrapper.style.paddingBottom = '';
      }
    }
    if (enable) {
      document.body.style.paddingBottom = (footerHeight + 60) + 'px';
    } else {
      document.body.style.paddingBottom = '';
    }
  }

  /**
   * Show the footer
   * @param {boolean} force - If true, force the footer to be visible regardless of other conditions
   */
  function showFooter(force = false) {
    if (!footer.classList.contains('footer-visible') || force) {
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
    // Get the document height using multiple methods for cross-browser compatibility
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );


    return height;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollFooter);
  } else {
    initScrollFooter();
  }
})();
