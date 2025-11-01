(function() {
    'use strict';

    if (typeof gettext !== 'function') {
        // eslint-disable-next-line no-global-assign
        gettext = function(text) {
            return text;
        };
    }

    function inputIdForField(fieldName) {
        return 'contact-' + fieldName.replace(/_/g, '-');
    }

    function errorIdForField(fieldName) {
        return fieldName + '-error';
    }

    function clearErrors(form) {
        var errorElements = form.querySelectorAll('.field-error');
        errorElements.forEach(function(element) {
            element.textContent = '';
            element.style.display = 'none';
        });

        var fieldInputs = form.querySelectorAll('.field-input');
        fieldInputs.forEach(function(input) {
            input.classList.remove('error');
        });
    }

    function clearFeedback(feedback) {
        feedback.textContent = '';
        feedback.className = 'form-feedback';
    }

    function setLoadingState(button, isLoading) {
        var btnText = button.querySelector('.btn-text');
        var btnLoading = button.querySelector('.btn-loading');

        if (isLoading) {
            button.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        } else {
            button.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    function showSuccess(feedback, message) {
        feedback.textContent = message;
        feedback.className = 'form-feedback success';
        feedback.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }

    function showError(feedback, message) {
        feedback.textContent = message;
        feedback.className = 'form-feedback error';
        feedback.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }

    function showFieldErrors(errors) {
        Object.keys(errors).forEach(function(fieldName) {
            var errorElement = document.getElementById(errorIdForField(fieldName));
            var fieldInput = document.getElementById(inputIdForField(fieldName));

            if (errorElement && fieldInput) {
                errorElement.textContent = errors[fieldName].join(', ');
                errorElement.style.display = 'block';
                fieldInput.classList.add('error');
            }
        });
    }

    function validateField(field) {
        var errorElement = document.getElementById(errorIdForField(field.name));
        if (!errorElement) {
            return true;
        }

        var isValid = true;
        var errorMessage = '';

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = gettext('This field is required.');
        }

        if (field.type === 'email' && field.value.trim()) {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                errorMessage = gettext('Please enter a valid email address.');
            }
        }

        if (field.name === 'name' && field.value.trim() && field.value.trim().length < 2) {
            isValid = false;
            errorMessage = gettext('Name must be at least 2 characters long.');
        }

        if (isValid) {
            field.classList.remove('error');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        } else {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        }

        return isValid;
    }

    function initializeForm() {
        var form = document.getElementById('howitworks-contact-form');
        if (!form) {
            return;
        }

        var feedback = document.getElementById('contact-form-feedback');
        var submitButton = form.querySelector('.contact-submit-btn');

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            clearErrors(form);
            clearFeedback(feedback);
            setLoadingState(submitButton, true);

            var formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    setLoadingState(submitButton, false);

                    if (data.success) {
                        showSuccess(feedback, data.message);
                        form.reset();
                    } else {
                        if (data.errors) {
                            showFieldErrors(data.errors);
                        }
                        showError(feedback, data.message || gettext('Please correct the errors below.'));
                    }
                })
                .catch(function() {
                    setLoadingState(submitButton, false);
                    showError(feedback, gettext('Sorry, there was a problem submitting your request. Please try again later.'));
                });
        });

        var requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(function(field) {
            field.addEventListener('blur', function() {
                validateField(field);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', initializeForm);
}());