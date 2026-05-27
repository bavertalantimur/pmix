/**
 * PMGIX — Navigation Module
 * Route resolution, desktop nav active states, and simple mobile drawer behavior.
 */

const ROUTES = {
  home: 'index.html',
  about: 'pages/about.html',
  companyOverview: 'pages/company-overview.html',
  purpose: 'pages/about.html#purpose',
  capabilities: 'index.html#advisory-capabilities',
  experienceLedCredibility: 'pages/experience-led-credibility.html',
  strategicPositioning: 'index.html#strategic-positioning',
  valuePromise: 'index.html#value-promise',
  commercialProof: 'index.html#commercial-proof',
  partnership: 'index.html#partnership',
  services: 'pages/services.html',
  industries: 'pages/industries.html',
  renewableEnergy: 'pages/industries.html#renewable-energy',
  powerUtilities: 'pages/industries.html#power-utilities',
  infrastructureTransport: 'pages/industries.html#infrastructure-transport',
  realEstateConstruction: 'pages/industries.html#real-estate-construction',
  industrialsManufacturing: 'pages/industries.html#industrials-manufacturing',
  miningMetals: 'pages/industries.html#mining-metals',
  financialInstitutions: 'pages/industries.html#financial-institutions',
  privateCapital: 'pages/industries.html#private-capital',
  retail: 'pages/industries.html#retail',
  healthcare: 'pages/industries.html#healthcare',
  publicSector: 'pages/industries.html#public-sector',
  education: 'pages/industries.html#education',
  digitalInfrastructure: 'pages/industries.html#digital-infrastructure',
  issues: 'pages/issues.html',
  academy: 'pages/academy.html',
  careers: 'pages/careers.html',
  contact: 'pages/contact.html',
};

const SELECTORS = {
  menuToggle: '[data-menu-toggle]',
  mobileNav: '[data-mobile-nav]',
  navOverlay: '[data-nav-overlay]',
  routeLink: '[data-nav]',
  desktopNavLink: '.header__nav-link[data-nav]',
  desktopFlyout: '[data-mega-flyout]',
  desktopFlyoutToggle: '[data-mega-flyout-toggle]',
  desktopFlyoutMenu: '[data-mega-flyout-menu]',
  mobileNavLink: '.header__mobile-nav-link[data-nav]',
  mobileAccordionToggle: '[data-mobile-accordion-toggle]',
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
    if (route.startsWith('pages/')) return route.replace('pages/', '');
    return `../${route}`;
  }

  return route;
}

function setActiveLinkStates() {
  const currentPage = document.body.dataset.page;
  if (!currentPage) return;

  document.querySelectorAll(SELECTORS.desktopNavLink).forEach((link) => {
    const isActive = link.getAttribute('data-nav') === currentPage;
    link.classList.toggle('header__nav-link--active', isActive);
  });

  document.querySelectorAll(SELECTORS.mobileNavLink).forEach((link) => {
    const isActive = link.getAttribute('data-nav') === currentPage;
    link.classList.toggle('header__mobile-nav-link--active', isActive);
  });
}

function resetMobileAccordions(root) {
  root.querySelectorAll(SELECTORS.mobileAccordionToggle).forEach((button) => {
    const controls = button.getAttribute('aria-controls');
    const panel = controls ? document.getElementById(controls) : null;

    button.setAttribute('aria-expanded', 'false');
    button.classList.remove('header__mobile-nav-link--expanded');

    if (panel) panel.hidden = true;
  });
}

function initMobileAccordions(root) {
  root.querySelectorAll(SELECTORS.mobileAccordionToggle).forEach((button) => {
    button.addEventListener('click', () => {
      const controls = button.getAttribute('aria-controls');
      const panel = controls ? document.getElementById(controls) : null;
      if (!panel) return;

      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      button.classList.toggle('header__mobile-nav-link--expanded', !isExpanded);
      panel.hidden = isExpanded;
    });
  });
}

function initDesktopFlyouts(root = document) {
  const flyouts = Array.from(root.querySelectorAll(SELECTORS.desktopFlyout));
  if (!flyouts.length) return;

  const closeTimers = new WeakMap();
  const closeDelay = 120;
  let activeFlyout = null;

  const clearCloseTimer = (flyout) => {
    const timerId = closeTimers.get(flyout);
    if (timerId) {
      window.clearTimeout(timerId);
      closeTimers.delete(flyout);
    }
  };

  const setFlyoutState = (flyout, isOpen) => {
    const toggle = flyout.querySelector(SELECTORS.desktopFlyoutToggle);
    if (!toggle) return;

    flyout.classList.toggle('header__mega-flyout--open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
      activeFlyout = flyout;
    } else if (activeFlyout === flyout) {
      activeFlyout = null;
    }
  };

  const closeFlyout = (flyout) => {
    clearCloseTimer(flyout);
    setFlyoutState(flyout, false);
  };

  const openFlyout = (flyout) => {
    clearCloseTimer(flyout);

    if (activeFlyout && activeFlyout !== flyout) {
      closeFlyout(activeFlyout);
    }

    setFlyoutState(flyout, true);
  };

  const scheduleClose = (flyout) => {
    clearCloseTimer(flyout);
    closeTimers.set(
      flyout,
      window.setTimeout(() => {
        closeFlyout(flyout);
      }, closeDelay)
    );
  };

  flyouts.forEach((flyout) => {
    const toggle = flyout.querySelector(SELECTORS.desktopFlyoutToggle);
    const menu = flyout.querySelector(SELECTORS.desktopFlyoutMenu);
    if (!toggle || !menu) return;

    flyout.addEventListener('pointerenter', () => openFlyout(flyout));
    flyout.addEventListener('pointerleave', () => scheduleClose(flyout));
    flyout.addEventListener('focusin', () => openFlyout(flyout));
    flyout.addEventListener('focusout', (event) => {
      if (event.relatedTarget instanceof Node && flyout.contains(event.relatedTarget)) return;
      scheduleClose(flyout);
    });

    toggle.addEventListener('click', (event) => {
      event.preventDefault();

      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeFlyout(flyout);
      } else {
        openFlyout(flyout);
      }
    });
  });

  document.addEventListener('pointerdown', (event) => {
    if (event.target instanceof Node && flyouts.some((flyout) => flyout.contains(event.target))) return;
    flyouts.forEach(closeFlyout);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !activeFlyout) return;

    const toggle = activeFlyout.querySelector(SELECTORS.desktopFlyoutToggle);
    closeFlyout(activeFlyout);
    toggle?.focus();
  });
}

/**
 * Initialize navigation (call after header is in the DOM).
 */
export function initNavigation() {
  const base = getBasePath();

  document.querySelectorAll('[data-logo-img]').forEach((img) => {
    img.src = `${base}assets/images/image.png`;
  });

  document.querySelectorAll(SELECTORS.routeLink).forEach((link) => {
    const key = link.getAttribute('data-nav');
    if (key) link.href = resolveRoute(key);
  });

  const logoLink = document.querySelector('.header__logo-link');
  if (logoLink) logoLink.href = resolveRoute('home');

  setActiveLinkStates();
  initDesktopFlyouts();

  const toggle = document.querySelector(SELECTORS.menuToggle);
  const mobileNav = document.querySelector(SELECTORS.mobileNav);
  const overlay = document.querySelector(SELECTORS.navOverlay);

  if (!toggle || !mobileNav) return;

  initMobileAccordions(mobileNav);

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
    resetMobileAccordions(mobileNav);
  };

  toggle.addEventListener('click', () => {
    toggle.classList.contains('header__menu-toggle--open') ? closeMenu() : openMenu();
  });

  overlay?.addEventListener('click', closeMenu);

  mobileNav.querySelectorAll('a[data-nav]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}
