(function ($) {
  $(document).ready(function () {
    /* ===========================================================
       Initialize Slick Carousel
    ============================================================ */
    if ($.fn.slick) {
      $('.creators-slider')
        .not('.slick-initialized')
        .slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: false,
          arrows: true,
          infinite: true,
          responsive: [
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 583, settings: { slidesToShow: 1 } },
          ],
        });
    }

    /* ===========================================================
       HEIGHT NORMALIZATION
    ============================================================ */
    function normalizeCreatorCardHeights() {
      var maxHeight = 0;

      // Reset heights
      $('.creator-card-inner').css('height', 'auto');

      // Measure tallest card
      $('.creator-card-inner').each(function () {
        var h = $(this).outerHeight();
        if (h > maxHeight) maxHeight = h;
      });

      // Apply uniform height to all cards
      $('.creator-card-inner').css('height', maxHeight + 'px');
    }

    /* ===========================================================
       Show scroll text only if content overflows
    ============================================================ */
    function checkScrollableContent() {
      $('.creator-bio').each(function () {
        var $bio = $(this);
        var $bioText = $bio.find('.bio-text');
        var $scrollText = $bio.find('.scroll-text');

        if ($bioText.length && $scrollText.length) {
          var isScrollable = $bioText[0].scrollHeight > $bioText[0].clientHeight;
          if (isScrollable) {
            $scrollText.addClass('show');
          } else {
            $scrollText.removeClass('show');
          }
        }
      });
    }

    $('.creators-slider').on('setPosition', function () {
      normalizeCreatorCardHeights();
      checkScrollableContent();
    });

    $(window).on('resize', function () {
      setTimeout(function () {
        normalizeCreatorCardHeights();
        checkScrollableContent();
      }, 150);
    });

    setTimeout(function () {
      normalizeCreatorCardHeights();
      checkScrollableContent();
    }, 300);
  });
})(jQuery);
