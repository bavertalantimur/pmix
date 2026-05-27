/**
 * pmgix — Application Entry Point
 * Loads header/footer components and initializes navigation.
 */

import { initNavigation } from './navigation.js';
import { initHeroVideoReveal } from './hero-video.js';
import { initHeaderUtilities } from './header-utilities.js';

const COMPONENT_ATTR = 'data-component';

/**
 * Base path for assets (root vs pages/).
 * @returns {string}
 */
function getBasePath() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

/**
 * Fetch and inject HTML partials.
 */
async function loadComponents() {
  const base = getBasePath();
  const targets = document.querySelectorAll(`[${COMPONENT_ATTR}]`);

  await Promise.all(
    Array.from(targets).map(async (target) => {
      const name = target.getAttribute(COMPONENT_ATTR);
      const url = `${base}components/${name}.html`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${name}: ${response.status}`);
        target.innerHTML = await response.text();
      } catch (error) {
        console.error('[pmgix] Component load failed:', error);
      }
    })
  );
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadComponents();
  initNavigation();
  initHeaderUtilities();
  initHeroVideoReveal();
});
