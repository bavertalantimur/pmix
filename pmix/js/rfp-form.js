/**
 * pmgix — RFP form validation & file label
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
 * @param {string} value
 */
function isValidWebsite(value) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`);
    return Boolean(url.hostname.includes('.'));
  } catch {
    return false;
  }
}

/**
 * @param {HTMLFormElement} form
 */
function getInvalidFields(form) {
  const fields = Array.from(form.querySelectorAll('input, select, textarea'));
  return fields.filter((field) => {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) {
      return false;
    }
    if (field.type === 'file') return false;
    if (field.type === 'email' && field.value.trim() && !EMAIL_PATTERN.test(field.value.trim())) {
      return true;
    }
    if (field.id === 'rfp-website' && field.value.trim() && !isValidWebsite(field.value)) {
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
  if (field.id === 'rfp-terms') {
    const consent = field.closest('.rfp-form__consent');
    if (consent) consent.classList.toggle('rfp-form__consent--invalid', isInvalid);
    field.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
    return;
  }

  const wrapper = field.closest('.rfp-form__field');
  if (!wrapper) return;
  wrapper.classList.toggle('rfp-form__field--invalid', isInvalid);
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
  statusEl.classList.remove('rfp-form__status--success', 'rfp-form__status--error');
  statusEl.classList.add(type === 'success' ? 'rfp-form__status--success' : 'rfp-form__status--error');
}

/**
 * @param {HTMLInputElement} fileInput
 */
function bindFileLabel(fileInput) {
  const labelEl = document.querySelector('[data-file-label]');
  if (!labelEl) return;

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    labelEl.textContent = file ? file.name : 'Choose File';
  });
}

export function initRfpForm() {
  const form = document.getElementById('rfp-form');
  const statusEl = document.getElementById('rfp-form-status');
  if (!(form instanceof HTMLFormElement) || !(statusEl instanceof HTMLElement)) return;

  const fileInput = document.getElementById('rfp-attachment');
  if (fileInput instanceof HTMLInputElement) bindFileLabel(fileInput);

  const fields = form.querySelectorAll('input, select, textarea');
  fields.forEach((field) => {
    field.addEventListener('input', () => setFieldState(field, false));
    field.addEventListener('change', () => setFieldState(field, false));
    field.addEventListener('blur', () => {
      if (field instanceof HTMLInputElement && field.type === 'email' && field.value.trim()) {
        setFieldState(field, !EMAIL_PATTERN.test(field.value.trim()));
        return;
      }
      if (field.id === 'rfp-website' && field.value.trim()) {
        setFieldState(field, !isValidWebsite(field.value));
        return;
      }
      if (field.type !== 'file') setFieldState(field, !field.checkValidity());
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    statusEl.hidden = true;

    const invalid = getInvalidFields(form);
    fields.forEach((field) => {
      if (field.type !== 'file') setFieldState(field, false);
    });
    invalid.forEach((field) => setFieldState(field, true));

    if (invalid.length > 0) {
      invalid[0].focus();
      showStatus(statusEl, 'error', 'Please complete all required fields before submitting.');
      return;
    }

    form.reset();
    if (fileInput instanceof HTMLInputElement) {
      const labelEl = document.querySelector('[data-file-label]');
      if (labelEl) labelEl.textContent = 'Choose File';
    }
    fields.forEach((field) => {
      if (field.type !== 'file') setFieldState(field, false);
    });
    showStatus(
      statusEl,
      'success',
      'Thank you. Your RFP has been received. Our team will review your submission and respond shortly.'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
