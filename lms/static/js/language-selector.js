/**
 * Language selector functionality
 * Dynamically adjusts the width of the language selector based on the selected text
 */

// Function to adjust the width of the language selector based on selected option text
function adjustLanguageSelectorWidth() {
  const selector = document.getElementById('settings-language-value');
  if (selector) {
    const selectedOption = selector.options[selector.selectedIndex];
    // Create a temporary span to measure text width
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.style.font = window.getComputedStyle(selector).font;
    tempSpan.textContent = selectedOption.textContent;
    document.body.appendChild(tempSpan);
    
    // Set width with more padding to ensure full text visibility
    const textWidth = tempSpan.offsetWidth;
    // Add more padding for mobile and tablet
    const extraPadding = window.innerWidth < 1200 ? 70 : 55;
    selector.style.width = (textWidth + extraPadding) + 'px';
    
    // Ensure text doesn't get truncated
    selector.style.textOverflow = 'clip';
    selector.style.whiteSpace = 'normal';
    selector.style.minWidth = '80px';
    
    document.body.removeChild(tempSpan);
  }
}

// Initialize the language selector functionality
document.addEventListener('DOMContentLoaded', function() {
  // Adjust width on page load
  adjustLanguageSelectorWidth();
  
  // Adjust width when language changes
  const languageSelector = document.getElementById('settings-language-value');
  if (languageSelector) {
    languageSelector.addEventListener('change', adjustLanguageSelectorWidth);
  }
  
  // Adjust width when window is resized
  window.addEventListener('resize', adjustLanguageSelectorWidth);
});
