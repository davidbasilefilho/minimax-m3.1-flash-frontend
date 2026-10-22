import type Lenis from 'lenis';

/**
 * Scroll control.
 *
 * Lenis is optional: when motion is calm, or when the browser asks for
 * reduced motion, the page falls back to native scrolling and native anchor
 * behaviour. Everything on the page remains reachable either way.
 */

let instance: Lenis | null = null;

export function registerLenis(next: Lenis | null): void {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Scroll a section into view, leaving room for the sticky masthead. */
export function scrollToId(id: string, offset = -92): void {
  const target = document.getElementById(id);
  if (!target) return;

  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.1 });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/** Move focus as well as scroll, so keyboard users land where the eye goes. */
export function scrollToIdAndFocus(id: string): void {
  scrollToId(id);
  const target = document.getElementById(id);
  if (!target) return;
  const heading = target.querySelector<HTMLElement>('h1, h2, h3');
  const focusTarget = heading ?? target;
  if (!focusTarget.hasAttribute('tabindex')) {
    focusTarget.setAttribute('tabindex', '-1');
  }
  window.requestAnimationFrame(() => {
    focusTarget.focus({ preventScroll: true });
  });
}
