// JavaScript to prevent search when input is empty
$(document).ready(function() {
    // Get references to the elements
    var $searchForm = $('.wrapper-search-input');
    var $searchInput = $('#discovery-input');
    var $searchButton = $('.discovery-submit');
    var $searchIcon = $searchButton.find('.icon.fa.fa-search');
    
    // Make sure search icon is always visible
    $searchIcon.removeClass('hidden');

    // Override the form submission
    $searchForm.on('submit', function(e) {
        // If the input is empty, prevent the form submission
        if (!$searchInput.val().trim()) {
            e.preventDefault();
            return false;
        }
        // Otherwise, allow the form to submit normally
    });
});
