/**
 * PMGIX — Navigation Module
 * Mobile menu, overlay, active states, and route resolution.
 */

const ROUTES = {
  home: 'index.html',
  about: 'pages/about.html',
  services: 'pages/services.html',
  industries: 'pages/industries.html',
  issues: 'pages/issues.html',
  academy: 'pages/academy.html',
  careers: 'pages/careers.html',
  contact: 'pages/contact.html',
};

const SELECTORS = {
  menuToggle: '[data-menu-toggle]',
  mobileNav: '[data-mobile-nav]',
  navOverlay: '[data-nav-overlay]',
  navLink: '[data-nav]',
};

function isSubPage() {
  return window.location.pathname.includes('/pages/');
}

function getBasePath() {
  return isSubPage() ? '../' : '';
}

/**
 * Resolve route href for current page depth.
 * @param {string} key
 * @returns {string}
 */
function resolveRoute(key) {
  const route = ROUTES[key];
  if (!route) return '#';

  if (isSubPage()) {
    if (key === 'home') return '../index.html';
    return route.replace('pages/', '');
  }

  return route;
}

/**
 * Initialize navigation (call after header is in the DOM).
 */
export function initNavigation() {
  const base = getBasePath();

  document.querySelectorAll('[data-logo-img]').forEach((img) => {
    img.src = `${base}assets/images/image.png`;
  });

  document.querySelectorAll(SELECTORS.navLink).forEach((link) => {
    const key = link.getAttribute('data-nav');
    if (key) link.href = resolveRoute(key);
  });

  const logoLink = document.querySelector('.header__logo-link');
  if (logoLink) logoLink.href = resolveRoute('home');

  const currentPage = document.body.dataset.page;
  if (currentPage) {
    document.querySelectorAll(SELECTORS.navLink).forEach((link) => {
      const isActive = link.getAttribute('data-nav') === currentPage;
      link.classList.toggle('header__nav-link--active', isActive);
      link.classList.toggle('header__mobile-nav-link--active', isActive);
    });
  }

  const toggle = document.querySelector(SELECTORS.menuToggle);
  const mobileNav = document.querySelector(SELECTORS.mobileNav);
  const overlay = document.querySelector(SELECTORS.navOverlay);

  if (!toggle || !mobileNav) return;

  const openMenu = () => {
    toggle.classList.add('header__menu-toggle--open');
    mobileNav.classList.add('header__mobile-nav--open');
    mobileNav.removeAttribute('hidden');
    overlay?.classList.add('overlay--visible');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    toggle.classList.remove('header__menu-toggle--open');
    mobileNav.classList.remove('header__mobile-nav--open');
    mobileNav.setAttribute('hidden', '');
    overlay?.classList.remove('overlay--visible');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    toggle.classList.contains('header__menu-toggle--open') ? closeMenu() : openMenu();
  });

  overlay?.addEventListener('click', closeMenu);

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}
