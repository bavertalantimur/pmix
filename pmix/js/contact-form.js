/**
 * pmgix — Contact form client validation & submit feedback
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @param {HTMLFormElement} form
 */
function getInvalidFields(form) {
  const fields = Array.from(form.querySelectorAll('input, select, textarea'));
  return fields.filter((field) => {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) {
      return false;
    }
    if (field.type === 'email' && field.value.trim() && !EMAIL_PATTERN.test(field.value.trim())) {
      return true;
    }
    return !field.checkValidity();
  });
}

/**
 * @param {HTMLElement} field
 * @param {boolean} isInvalid
 */
function setFieldState(field, isInvalid) {
  const wrapper = field.closest('.contact-form__field, .contact-form__consent');
  if (!wrapper) return;
  wrapper.classList.toggle('contact-form__field--invalid', isInvalid);
  field.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
}

/**
 * @param {HTMLElement} statusEl
 * @param {'success' | 'error'} type
 * @param {string} message
 */
function showStatus(statusEl, type, message) {
  statusEl.hidden = false;
  statusEl.textContent = message;
  statusEl.classList.remove('contact-form__status--success', 'contact-form__status--error');
  statusEl.classList.add(type === 'success' ? 'contact-form__status--success' : 'contact-form__status--error');
}

/**
 * Initialize contact form behavior on the contact page.
 */
export function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-form-status');
  if (!(form instanceof HTMLFormElement) || !(statusEl instanceof HTMLElement)) return;

  const fields = form.querySelectorAll('input, select, textarea');
  fields.forEach((field) => {
    field.addEventListener('input', () => setFieldState(field, false));
    field.addEventListener('blur', () => {
      if (field instanceof HTMLInputElement && field.type === 'email' && field.value.trim()) {
        setFieldState(field, !EMAIL_PATTERN.test(field.value.trim()));
        return;
      }
      setFieldState(field, !field.checkValidity());
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    statusEl.hidden = true;

    const invalid = getInvalidFields(form);
    fields.forEach((field) => setFieldState(field, false));
    invalid.forEach((field) => setFieldState(field, true));

    if (invalid.length > 0) {
      const first = invalid[0];
      first.focus();
      showStatus(
        statusEl,
        'error',
        'Please complete all required fields before submitting.'
      );
      return;
    }

    form.reset();
    fields.forEach((field) => setFieldState(field, false));
    showStatus(
      statusEl,
      'success',
      'Thank you. Your inquiry has been received. Our team will be in touch shortly.'
    );
  });
}
