/**
 * pmgix — Header utilities (Deloitte-style)
 * Combined location/language selector (visual) and full-header search mode.
 */

const SEARCH_INDEX = [
  { title: 'Home', href: 'index.html', keywords: 'home pmgix' },
  { title: 'Company Overview', href: 'pages/company-overview.html', keywords: 'about who we are company' },
  { title: 'Services', href: 'pages/services.html', keywords: 'services advisory' },
  { title: 'Strategic Advisory', href: 'pages/strategic-advisory.html', keywords: 'strategy advisory' },
  { title: 'Corporate Finance & M&A', href: 'pages/corporate-finance-and-ma.html', keywords: 'mna mergers acquisitions finance' },
  { title: 'Project Finance', href: 'pages/project-finance.html', keywords: 'project finance infrastructure' },
  { title: 'Structured Finance', href: 'pages/structured-finance.html', keywords: 'structured finance' },
  { title: 'Transaction Advisory', href: 'pages/transaction-advisory.html', keywords: 'transaction deal advisory' },
  { title: 'Financial Modeling', href: 'pages/financial-modeling.html', keywords: 'modeling excel valuation' },
  { title: 'Executive Finance', href: 'pages/executive-finance.html', keywords: 'cfo executive finance' },
  { title: 'Risk & Governance', href: 'pages/risk-and-governance.html', keywords: 'risk governance compliance' },
  { title: 'Portfolio Performance', href: 'pages/portfolio-performance.html', keywords: 'portfolio performance' },
  { title: 'Renewable Energy Finance', href: 'pages/renewable-energy-finance.html', keywords: 'renewable energy green' },
  { title: 'Infrastructure & PPP', href: 'pages/infrastructure-and-ppp.html', keywords: 'ppp infrastructure public private' },
  { title: 'Restructuring & Turnaround', href: 'pages/restructuring-and-turnaround.html', keywords: 'restructuring turnaround distress' },
  { title: 'Legal & Documentation', href: 'pages/legal-and-documentation.html', keywords: 'legal documentation contracts' },
  { title: 'Tax', href: 'pages/tax.html', keywords: 'tax taxation' },
  { title: 'Industries', href: 'pages/industries.html', keywords: 'industries sectors' },
  { title: 'Energy & Renewables', href: 'pages/energy-and-renewables.html', keywords: 'energy renewables power' },
  { title: 'Infrastructure', href: 'pages/infrastructure.html', keywords: 'infrastructure assets' },
  { title: 'Financial Institutions', href: 'pages/financial-institutions.html', keywords: 'banks financial institutions' },
  { title: 'Manufacturing', href: 'pages/industrials-and-manufacturing.html', keywords: 'manufacturing industrials' },
  { title: 'Real Assets', href: 'pages/real-assets-and-property.html', keywords: 'real estate property assets' },
  { title: 'Technology & Digital Infrastructure', href: 'pages/technology-and-digital-infrastructure.html', keywords: 'technology digital data centers' },
  { title: 'Transport & Logistics', href: 'pages/transport-and-logistics.html', keywords: 'transport logistics shipping' },
  { title: 'Utilities', href: 'pages/utilities.html', keywords: 'utilities power water' },
  { title: 'Public Sector & PPP', href: 'pages/public-sector-and-ppp.html', keywords: 'public sector government' },
  { title: 'Healthcare & Life Sciences', href: 'pages/healthcare-and-life-sciences.html', keywords: 'healthcare pharma life sciences' },
  { title: 'Retail', href: 'pages/consumer-and-retail.html', keywords: 'retail consumer' },
  { title: 'Mining', href: 'pages/natural-resources-and-mining.html', keywords: 'mining natural resources' },
  { title: 'Investors', href: 'pages/financial-sponsors-and-investors.html', keywords: 'private equity sponsors investors' },
  { title: 'Experience', href: 'pages/experience-led-credibility.html', keywords: 'experience credibility case studies' },
  { title: 'Contact', href: 'pages/contact.html', keywords: 'contact get in touch' },
];

function getBasePath() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

function resolveHref(href) {
  return `${getBasePath()}${href}`;
}

function normalizeQuery(value) {
  return value.trim().toLowerCase();
}

function searchPages(query) {
  const q = normalizeQuery(query);
  if (!q) return [];

  return SEARCH_INDEX.filter((item) => {
    const haystack = `${item.title} ${item.keywords}`.toLowerCase();
    return haystack.includes(q);
  }).slice(0, 8);
}

function setExpanded(button, isExpanded) {
  if (!button) return;
  button.setAttribute('aria-expanded', String(isExpanded));
}

function hideOverlay(state) {
  state.utilityOverlay?.setAttribute('hidden', '');
  state.utilityOverlay?.classList.remove('overlay--visible');
  state.utilityOverlay?.setAttribute('aria-hidden', 'true');
}

function showOverlay(state) {
  state.utilityOverlay?.removeAttribute('hidden');
  state.utilityOverlay?.classList.add('overlay--visible');
  state.utilityOverlay?.setAttribute('aria-hidden', 'false');
}

function closeLocalePanel(state) {
  state.localePanel?.setAttribute('hidden', '');
  setExpanded(state.localeToggle, false);
  state.localeToggle?.classList.remove('header__utility-btn--active');
}

function isSearchActive(state) {
  return state.header?.classList.contains('header--search-active');
}

function closeSearch(state) {
  state.header?.classList.remove('header--search-active');
  state.searchBar?.setAttribute('hidden', '');
  state.searchBar?.setAttribute('aria-hidden', 'true');
  setExpanded(state.searchToggle, false);
  state.searchToggle?.classList.remove('header__utility-btn--active');

  if (state.searchInput) state.searchInput.value = '';
  state.searchDropdown?.setAttribute('hidden', '');
  state.searchResultsLabel?.setAttribute('hidden', '');
  state.searchHint?.removeAttribute('hidden');
  if (state.searchResultsList) state.searchResultsList.innerHTML = '';

  document.body.classList.remove('header-search-open');
}

function openSearch(state) {
  closeLocalePanel(state);
  hideOverlay(state);

  state.header?.classList.add('header--search-active');
  state.searchBar?.removeAttribute('hidden');
  state.searchBar?.setAttribute('aria-hidden', 'false');
  setExpanded(state.searchToggle, true);
  state.searchToggle?.classList.add('header__utility-btn--active');
  document.body.classList.add('header-search-open');

  window.requestAnimationFrame(() => state.searchInput?.focus());
}

function renderSearchResults(state, query) {
  const results = searchPages(query);
  const list = state.searchResultsList;
  const dropdown = state.searchDropdown;
  const label = state.searchResultsLabel;
  const hint = state.searchHint;

  if (!list || !dropdown || !hint) return;

  list.innerHTML = '';

  if (!normalizeQuery(query)) {
    dropdown.setAttribute('hidden', '');
    label?.setAttribute('hidden', '');
    hint.removeAttribute('hidden');
    return;
  }

  dropdown.removeAttribute('hidden');
  hint.setAttribute('hidden', '');

  if (results.length === 0) {
    label?.setAttribute('hidden', '');
    const empty = document.createElement('li');
    empty.className = 'header__search-empty';
    empty.textContent = 'No results found. Try another term.';
    list.appendChild(empty);
    return;
  }

  label?.removeAttribute('hidden');

  results.forEach((item) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'header__search-result-link';
    link.href = resolveHref(item.href);
    link.textContent = item.title;
    const meta = document.createElement('small');
    meta.textContent = item.href.replace('pages/', '').replace('.html', '').replace('index.html', 'home');
    link.appendChild(meta);
    li.appendChild(link);
    list.appendChild(li);
  });
}

function toggleLocalePanel(state) {
  if (isSearchActive(state)) return;

  const isOpen = !state.localePanel?.hasAttribute('hidden');

  if (isOpen) {
    closeLocalePanel(state);
    hideOverlay(state);
    return;
  }

  state.localePanel?.removeAttribute('hidden');
  setExpanded(state.localeToggle, true);
  state.localeToggle?.classList.add('header__utility-btn--active');
  showOverlay(state);
}

function selectLocale(state, option) {
  const label = option.getAttribute('data-locale-label');
  if (label && state.localeLabel) {
    state.localeLabel.textContent = label;
  }

  state.localePanel?.querySelectorAll('.header__utility-option--active').forEach((el) => {
    el.classList.remove('header__utility-option--active');
  });
  option.classList.add('header__utility-option--active');

  closeLocalePanel(state);
  hideOverlay(state);
}

/**
 * Initialize Deloitte-style header utilities.
 */
export function initHeaderUtilities() {
  const header = document.querySelector('.header');
  if (!header) return;

  const state = {
    header,
    localeToggle: document.querySelector('[data-locale-toggle]'),
    localePanel: document.querySelector('[data-locale-panel]'),
    localeLabel: document.querySelector('[data-locale-label]'),
    searchToggle: document.querySelector('[data-search-toggle]'),
    searchBar: document.querySelector('[data-search-bar]'),
    searchInput: document.querySelector('[data-search-input]'),
    searchClose: document.querySelector('[data-search-close]'),
    searchForm: document.querySelector('[data-search-form]'),
    searchDropdown: document.querySelector('[data-search-dropdown]'),
    searchResultsLabel: document.querySelector('[data-search-results-label]'),
    searchResultsList: document.querySelector('[data-search-results-list]'),
    searchHint: document.querySelector('[data-search-hint]'),
    utilityOverlay: document.querySelector('[data-utility-overlay]'),
  };

  state.localeToggle?.addEventListener('click', () => {
    toggleLocalePanel(state);
  });

  state.localePanel?.addEventListener('click', (event) => {
    const option = event.target.closest('[data-locale-value]');
    if (!option || !state.localePanel.contains(option)) return;
    selectLocale(state, option);
  });

  state.searchToggle?.addEventListener('click', () => {
    if (isSearchActive(state)) {
      closeSearch(state);
      return;
    }
    openSearch(state);
  });

  state.searchClose?.addEventListener('click', () => {
    closeSearch(state);
  });

  state.searchInput?.addEventListener('input', () => {
    renderSearchResults(state, state.searchInput.value);
  });

  state.searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    renderSearchResults(state, state.searchInput?.value || '');
    const firstLink = state.searchResultsList?.querySelector('a');
    if (firstLink) firstLink.click();
  });

  state.utilityOverlay?.addEventListener('click', () => {
    closeLocalePanel(state);
    hideOverlay(state);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    if (isSearchActive(state)) {
      closeSearch(state);
      return;
    }

    closeLocalePanel(state);
    hideOverlay(state);
  });
}
