/**
 * pmgix — Navigation Module
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
  strategicAdvisory: 'pages/strategic-advisory.html',
  corporateFinanceMna: 'pages/corporate-finance-and-ma.html',
  projectFinance: 'pages/project-finance.html',
  structuredFinance: 'pages/structured-finance.html',
  transactionAdvisory: 'pages/transaction-advisory.html',
  financialModeling: 'pages/financial-modeling.html',
  executiveFinance: 'pages/executive-finance.html',
  riskGovernance: 'pages/risk-and-governance.html',
  portfolioPerformance: 'pages/portfolio-performance.html',
  renewableEnergyFinance: 'pages/renewable-energy-finance.html',
  infrastructurePpp: 'pages/infrastructure-and-ppp.html',
  restructuringTurnaround: 'pages/restructuring-and-turnaround.html',
  legalDocumentation: 'pages/legal-and-documentation.html',
  tax: 'pages/tax.html',
  industries: 'pages/industries.html',
  energyRenewables: 'pages/energy-and-renewables.html',
  industryInfrastructure: 'pages/infrastructure.html',
  financialInstitutions: 'pages/financial-institutions.html',
  industrialsManufacturing: 'pages/industrials-and-manufacturing.html',
  realAssetsProperty: 'pages/real-assets-and-property.html',
  technologyDigitalInfrastructure: 'pages/technology-and-digital-infrastructure.html',
  transportLogistics: 'pages/transport-and-logistics.html',
  utilities: 'pages/utilities.html',
  publicSectorPpp: 'pages/public-sector-and-ppp.html',
  healthcareLifeSciences: 'pages/healthcare-and-life-sciences.html',
  consumerRetail: 'pages/consumer-and-retail.html',
  naturalResourcesMining: 'pages/natural-resources-and-mining.html',
  financialSponsorsInvestors: 'pages/financial-sponsors-and-investors.html',
  insights: 'pages/insights.html',
  pmgixPerspectives: 'pages/pmgix-perspectives.html',
  globalEconomy: 'pages/global-economy.html',
  sectorInsights: 'pages/sector-insights.html',
  climateSustainability: 'pages/climate-and-sustainability.html',
  aiTechnology: 'pages/ai-and-technology.html',
  riskRegulations: 'pages/risk-and-regulations.html',
  academy: 'pages/academy.html',
  executiveEducation: 'pages/executive-education.html',
  corporateTraining: 'pages/corporate-training.html',
  certifications: 'pages/certifications.html',
  workshops: 'pages/workshops.html',
  careers: 'pages/careers.html',
  openPositions: 'pages/open-positions.html',
  lifeAtPmgix: 'pages/life-at-pmgix.html',
  earlyCareers: 'pages/early-careers.html',
  experiencedProfessionals: 'pages/experienced-professionals.html',
  contact: 'pages/contact.html',
  location: 'pages/location.html',
  submitRfp: 'pages/submit-rfp.html',
  privacyPolicy: 'pages/privacy-policy.html',
  cookiePolicy: 'pages/cookie-policy.html',
  termsOfUse: 'pages/terms-of-use.html',
  dataProtectionRights: 'pages/data-protection-rights.html',
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
    img.src = `${base}assets/images/background-removed.svg`;
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
