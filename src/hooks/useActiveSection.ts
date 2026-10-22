import { useSelector } from '@tanstack/react-store';
import { useEffect } from 'react';

import { actions, appStore } from '../store/appStore';

/**
 * Track which section is in view.
 *
 * A thin band across the middle of the viewport acts as the trigger, so the
 * active section is the one the reader is actually looking at rather than
 * the one that merely occupies the most pixels.
 */
export function useActiveSection(ids: readonly string[]): void {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return () => {};
    }

    const visible = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry);
          } else {
            visible.delete(entry.target.id);
          }
        }

        if (visible.size === 0) return;

        let closest: string | null = null;
        let closestDistance = Number.POSITIVE_INFINITY;

        for (const [id, entry] of visible) {
          const distance = Math.abs(entry.boundingClientRect.top - window.innerHeight * 0.4);
          if (distance < closestDistance) {
            closestDistance = distance;
            closest = id;
          }
        }

        if (closest) actions.setActiveSection(closest);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.01, 0.5, 1] },
    );

    for (const id of ids) {
      const element = document.querySelector<HTMLElement>(`[id="${id}"]`);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [ids]);
}

/** Keep the document theme attribute in step with the store. */
export function useThemeAttribute(): void {
  const theme = useSelector(appStore, (state) => state.theme);
  const motion = useSelector(appStore, (state) => state.motion);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'chamber' ? '#0a0713' : '#f7f6fb');
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.motion = motion;
  }, [motion]);
}
