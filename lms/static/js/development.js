$(document).ready(function(){
    $('.partner-slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        speed: 300,
        infinite: true,
        autoplaySpeed: 5000,
        autoplay: false,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 980,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });
    $('.events__trigger').click(function() {
        $('.events__tabs').toggleClass('-open');
    });

    $('.events__tab').click(function(e) {
        e.preventDefault();

        var thisTabId = $(this).attr('data-tabcontent');
        var thisTabContent = $('#' + thisTabId);

        $('.events__tab').removeClass('-active');
        $(this).addClass('-active');
        $('.events__list').removeClass('-active');
        thisTabContent.addClass('-active');
        $('.events__tabs').removeClass('-open');
    });
});


// Language selection fix for mobile view
var Language = (function() {
    'use strict';

    var $settings_language_selector,
        self = null;
    return {
        init: function() {
            $settings_language_selector = $('#settings-language-value, #settings-language-value-mobile');
            self = this;
            this.listenForLanguagePreferenceChange();
        },

        /**
             * Listener on changing language from selector.
             * Send an ajax request to save user language preferences.
             */
        listenForLanguagePreferenceChange: function() {
            $settings_language_selector.change(function(event) {
                var language = this.value,
                    url = $('.url-endpoint').val(),
                    is_user_authenticated = JSON.parse($('.url-endpoint').data('user-is-authenticated'));
                event.preventDefault();
                self.submitAjaxRequest(language, url, function() {
                    if (is_user_authenticated) {
                        // User language preference has been set successfully
                        // Now submit the form in success callback.
                        $('#language-settings-form').submit();
                    } else {
                        self.refresh();
                    }
                });
            });
        },

        /**
             * Send an ajax request to set user language preferences.
             * Also sets a cookie for MFEs to read the language preference.
             */
        submitAjaxRequest: function(language, url, callback) {
            // Set a cookie for MFEs to read the language preference
            // Use path=/ to make it available across the entire domain
            // Set expiry to 1 year (365 days)
            var expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + (365 * 24 * 60 * 60 * 1000));
            
            // Set the 'openedx-language-preference' cookie that MFEs will read
            document.cookie = 'openedx-language-preference=' + language + '; path=/; expires=' + expiryDate.toUTCString();
            
            // Also set the Django language cookie for consistency
            document.cookie = 'django_language=' + language + '; path=/; expires=' + expiryDate.toUTCString();
            
            $.ajax({
                type: 'PATCH',
                data: JSON.stringify({'pref-lang': language}),
                url: url,
                dataType: 'json',
                contentType: 'application/merge-patch+json',
                notifyOnError: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRFToken', $.cookie('csrftoken'));
                }
            }).done(function() {
                callback();
            }).fail(function() {
                self.refresh();
            });
        },

        /**
             * refresh the page.
             */
        refresh: function() {
            // reloading the page so we can get the latest state of released languages from model
            location.reload();
        }

    };
}());
$(document).ready(function() {
    'use strict';

    Language.init();
});


// Dynamic size of language selector
document.addEventListener("DOMContentLoaded", function () {
    const desktopSelect = document.getElementById("settings-language-value");
    const mobileSelect = document.getElementById("settings-language-value-mobile");

    function resizeSelectWidth(select) {
        if (!select) return;
        
        const tempSelect = document.createElement("select");
        const tempOption = document.createElement("option");

        tempOption.textContent = select.options[select.selectedIndex].text;
        tempSelect.appendChild(tempOption);

        // Copy styles to get accurate width
        tempSelect.style.visibility = "hidden";
        tempSelect.style.position = "absolute";
        tempSelect.style.font = window.getComputedStyle(select).font;
        document.body.appendChild(tempSelect);

        select.style.width = `${tempSelect.offsetWidth + 30}px`;

        document.body.removeChild(tempSelect);
    }

    // Initialize both selectors
    if (desktopSelect) {
        resizeSelectWidth(desktopSelect);
        desktopSelect.addEventListener("change", function() {
            resizeSelectWidth(desktopSelect);
        });
    }
    
    if (mobileSelect) {
        resizeSelectWidth(mobileSelect);
        mobileSelect.addEventListener("change", function() {
            resizeSelectWidth(mobileSelect);
        });
    }
});
