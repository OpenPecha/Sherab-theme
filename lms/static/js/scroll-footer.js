/**
 * LMS footer columns: accordions on small screens, always open above 600px.
 */
(function () {
  function initFooterAccordion() {
    var cols = Array.prototype.slice.call(document.querySelectorAll('.site-footer .ft-col'));
    if (!cols.length || !window.matchMedia) {
      return;
    }

    var narrowQuery = window.matchMedia('(max-width: 600px)');

    function sync() {
      cols.forEach(function (col) {
        var open = narrowQuery.matches ? col.getAttribute('data-open') === '1' : true;
        col.classList.toggle('is-open', open);
        var title = col.querySelector('.ft-col-title');
        if (title) {
          title.setAttribute('aria-expanded', String(open));
        }
      });
    }

    cols.forEach(function (col) {
      col.setAttribute('data-open', '0');
      var title = col.querySelector('.ft-col-title');
      if (!title) {
        return;
      }
      title.addEventListener('click', function () {
        if (!narrowQuery.matches) {
          return;
        }
        col.setAttribute(
          'data-open',
          col.getAttribute('data-open') === '1' ? '0' : '1'
        );
        sync();
      });
    });

    if (narrowQuery.addEventListener) {
      narrowQuery.addEventListener('change', sync);
    } else if (narrowQuery.addListener) {
      narrowQuery.addListener(sync);
    }

    sync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterAccordion);
  } else {
    initFooterAccordion();
  }
})();
