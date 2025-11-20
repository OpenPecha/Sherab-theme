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
          dots: true,
          arrows: true,
          infinite: false,
          responsive: [
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 583, settings: { slidesToShow: 1 } },
          ],
        });
    }

    /* ===========================================================
       HEIGHT NORMALIZATION (for collapsed state)
    ============================================================ */
    function normalizeCreatorCardHeights() {
      var maxHeight = 0;

      // Reset heights
      $('.creator-card-inner').each(function () {
        if (!$(this).hasClass('expanded-card')) {
          $(this).css('height', 'auto');
        }
      });

      // Measure tallest collapsed card
      $('.creator-card-inner').each(function () {
        if (!$(this).hasClass('expanded-card')) {
          var h = $(this).outerHeight();
          if (h > maxHeight) maxHeight = h;
        }
      });

      // Apply uniform height to collapsed cards only
      $('.creator-card-inner').each(function () {
        if (!$(this).hasClass('expanded-card')) {
          $(this).css('height', maxHeight + 'px');
        }
      });
    }

    function adjustBioPreviewHeight() {
      $('.creator-card-inner').each(function () {
        var $card = $(this);

        // Skip expanded cards
        if ($card.hasClass('expanded-card')) return;

        var cardHeight = $card.outerHeight();
        var topSectionHeight = $card.find('.creator-row-top').outerHeight(true);
        var bio = $card.find('.creator-bio');

        if (!bio.length) return;

        var preview = bio.find('.bio-preview');
        var toggle = bio.find('.bio-toggle');

        var toggleHeight = toggle.length ? toggle.outerHeight(true) : 0;

        var available = cardHeight - topSectionHeight - toggleHeight - 30; // padding offset

        if (available < 40) available = 40; // minimum 2–3 lines

        preview.css('max-height', available + 'px');
      });
    }

    function updateCollapsedFade() {
      $('.creator-bio.collapsed').each(function () {
        var bio = $(this);
        var preview = bio.find('.bio-preview');
        var toggle = bio.find('.bio-toggle'); // read more button
        var contentHeight = preview[0].scrollHeight;
        var visibleHeight = preview.outerHeight();

        // If content fits fully AND there's no Read More button -> remove fade
        if (contentHeight <= visibleHeight + 2 && toggle.length === 0) {
          preview.addClass('no-fade');
        } else {
          preview.removeClass('no-fade');
        }
      });
    }

    $('.creators-slider').on('setPosition', function () {
      normalizeCreatorCardHeights();
      adjustBioPreviewHeight();
      updateCollapsedFade();
    });

    $(window).on('resize', function () {
      setTimeout(function () {
        normalizeCreatorCardHeights();
        adjustBioPreviewHeight();
        updateCollapsedFade();
      }, 150);
    });

    setTimeout(function () {
      normalizeCreatorCardHeights();
      adjustBioPreviewHeight();
      updateCollapsedFade();
    }, 300);

    /* ===========================================================
       BIO READ MORE / READ LESS (EXPANDS ONLY THAT CARD)
    ============================================================ */
    $(document).on('click', '.bio-toggle', function (e) {
      e.stopPropagation();

      var $btn = $(this);
      var $bio = $btn.closest('.creator-bio');
      var $card = $btn.closest('.creator-card-inner');
      var fullText = $bio.data('full-bio');
      var isExpanded = $bio.hasClass('expanded');

      // Collapse all other cards
      collapseAllBios($bio);

      if (!isExpanded) {
        // FIRST: Lock current height so it doesn't shrink
        var currentHeight = $card.outerHeight();
        $card.css('height', currentHeight + 'px');

        // Expand bio
        $bio.addClass('expanded').removeClass('collapsed');
        $bio.find('.bio-preview').html(fullText);

        // Hide toggle
        $btn.hide();
      } else {
        collapseBio($bio, $card);
      }
    });

    /* ===========================================================
       Collapse specific card
    ============================================================ */
    function collapseBio($bio, $card) {
      var full = $bio.data('full-bio') || '';
      var preview = full.substring(0, 250) + (full.length > 250 ? '...' : '');

      $bio.removeClass('expanded').addClass('collapsed');
      $bio.find('.bio-preview').html(preview);
      $bio.find('.bio-toggle').text('Read more').show();

      // Reset this card back to equal-height mode
      $card.removeClass('expanded-card');

      // Re-sync heights
      normalizeCreatorCardHeights();
    }

    /* ===========================================================
       Collapse all cards except the current
    ============================================================ */
    function collapseAllBios(except) {
      $('.creator-bio.expanded').each(function () {
        if (!except || this !== except[0]) {
          collapseBio($(this), $(this).closest('.creator-card-inner'));
        }
      });
    }

    /* ===========================================================
       Clicking outside collapses expanded bios
    ============================================================ */
    $(document).on('click', function () {
      collapseAllBios();
    });

    /* Prevent closing when clicking inside card */
    $(document).on('click', '.creator-card-inner', function (e) {
      e.stopPropagation();
    });

    /* Hide scroll hint when user scrolls inside bio */
    $(document).on('scroll', '.bio-preview', function () {
      $(this).addClass('scrolled');
    });
  });
})(jQuery);
