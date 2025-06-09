document.addEventListener('DOMContentLoaded', function () {
  const input = document.querySelector('.search-input');
  const icon = document.querySelector('.search-button .icon');

  if (input && icon) {
    const updateIconColor = () => {
      icon.style.color = input.value.trim() !== '' ? '#FC6B23' : '#FFAF66';
    };

    input.addEventListener('input', updateIconColor);

    updateIconColor();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const heading = document.querySelector('.home > header .title > .heading-group h1');
  if (!heading) return;

  const originalText = heading.textContent;

  function updateHeading() {
    if (window.innerWidth <= 500) {
      heading.innerHTML = originalText.replace(/,\s*/g, ',<br>');
    } else {
      heading.textContent = originalText;
    }
  }

  // Run on load and on resize
  updateHeading();
  window.addEventListener('resize', updateHeading);
});
