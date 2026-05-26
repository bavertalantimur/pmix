/**

 * PMGIX — Hero video scroll reveal

 * Plays background video when section enters viewport.

 */



const SELECTOR = '[data-hero-video]';

const VIDEO_SELECTOR = '[data-hero-video-player]';

const VISIBLE_CLASS = 'is-visible';

const ROOT_MARGIN = '0px 0px -8% 0px';

const THRESHOLD = 0.15;



/**

 * @param {HTMLElement} section

 */

function initHeroVideo(section) {

  const video = section.querySelector(VIDEO_SELECTOR);



  if (!(video instanceof HTMLVideoElement)) return;



  const prefersReducedMotion = window.matchMedia(

    '(prefers-reduced-motion: reduce)'

  ).matches;



  const reveal = () => {

    section.classList.add(VISIBLE_CLASS);

    if (!prefersReducedMotion) {

      video.play().catch(() => {});

    }

  };



  const hide = () => {

    if (!section.classList.contains(VISIBLE_CLASS)) return;

    video.pause();

  };



  const observer = new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          reveal();

        } else if (entry.boundingClientRect.top > 0) {

          hide();

        }

      });

    },

    { rootMargin: ROOT_MARGIN, threshold: THRESHOLD }

  );



  observer.observe(section);



  if (prefersReducedMotion) {

    reveal();

  }

}



/**

 * Initialize all hero video sections on the page.

 */

export function initHeroVideoReveal() {

  document.querySelectorAll(SELECTOR).forEach((el) => {

    if (el instanceof HTMLElement) initHeroVideo(el);

  });

}

