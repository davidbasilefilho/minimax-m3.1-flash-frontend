import { useEffect } from 'react';
import Lenis from 'lenis';
import { useSelector } from '@tanstack/react-store';

import { appStore } from '../store/appStore';
import { registerLenis } from '../lib/scroll';

/**
 * Smooth scrolling.
 *
 * Only runs when motion is live. Turning motion off destroys the instance
 * immediately, which hands scrolling straight back to the browser.
 */
export function useLenis(): void {
  const motion = useSelector(appStore, (state) => state.motion);

  useEffect(() => {
    if (motion !== 'live') {
      registerLenis(null);
      return;
    }

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      registerLenis(null);
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      // Touch scrolling stays native. Synthesising touch inertia breaks
      // native momentum and makes the page feel wrong on a phone.
      syncTouch: false,
      duration: 1.15,
      wheelMultiplier: 0.95,
      anchors: true,
    });

    registerLenis(lenis);
    return () => {
      lenis.destroy();
      registerLenis(null);
    };
  }, [motion]);
}
