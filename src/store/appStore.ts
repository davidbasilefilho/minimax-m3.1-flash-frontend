/**
 * Global application state.
 *
 * A single TanStack Store holds everything the page needs to remember:
 * theme, motion preference, the selected thinking-effort level, the cost
 * calculator inputs, which notices the reader has dismissed, and which
 * section is currently in view.
 *
 * TanStack Store is the right tool here because several unrelated parts of
 * the tree need to react to the same slice — the effort level drives the
 * hero trace, the vitals panel and the cost calculator simultaneously.
 */

import { Store } from '@tanstack/react-store';
import type { Effort } from '../data/model';

export type ThemeName = 'chamber' | 'daylight';
export type MotionMode = 'live' | 'calm';

export type AppState = {
  theme: ThemeName;
  motion: MotionMode;
  effort: Effort;
  /** Cost calculator inputs, in tokens. */
  inputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
  /** Notice ids the reader has dismissed. */
  dismissedNotices: string[];
  /** Id of the section currently in view. */
  activeSection: string;
  /** Whether the field-notes log is expanded to full height. */
  notesExpanded: boolean;
};

const STORAGE_KEY = 'signal.m31f.prefs';

function readStoredPrefs(): Partial<AppState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * URL overrides, so a link can carry a preference.
 *   ?theme=daylight   ?theme=chamber
 *   ?motion=calm      ?motion=live
 */
function readUrlPrefs(): Partial<AppState> {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get('theme');
    const motion = params.get('motion');
    const out: Partial<AppState> = {};
    if (theme === 'chamber' || theme === 'daylight') out.theme = theme;
    if (motion === 'calm' || motion === 'live') out.motion = motion;
    return out;
  } catch {
    return {};
  }
}

const stored = readStoredPrefs();
const urlPrefs = readUrlPrefs();

const initialState: AppState = {
  theme: urlPrefs.theme ?? (stored.theme === 'daylight' ? 'daylight' : 'chamber'),
  motion:
    urlPrefs.motion ??
    (stored.motion === 'calm' || stored.motion === 'live'
      ? stored.motion
      : prefersReducedMotion()
        ? 'calm'
        : 'live'),
  effort: stored.effort ?? 'max',
  inputTokens: stored.inputTokens ?? 12_000,
  cachedInputTokens: stored.cachedInputTokens ?? 8_000,
  outputTokens: stored.outputTokens ?? 2_400,
  dismissedNotices: Array.isArray(stored.dismissedNotices) ? stored.dismissedNotices : [],
  activeSection: stored.activeSection ?? 'hero',
  notesExpanded: stored.notesExpanded ?? false,
};

export const appStore = new Store<AppState>(initialState);

function persist(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        theme: state.theme,
        motion: state.motion,
        effort: state.effort,
        inputTokens: state.inputTokens,
        cachedInputTokens: state.cachedInputTokens,
        outputTokens: state.outputTokens,
        dismissedNotices: state.dismissedNotices,
        activeSection: state.activeSection,
        notesExpanded: state.notesExpanded,
      }),
    );
  } catch {
    /* storage unavailable — preferences simply do not survive the session */
  }
}

appStore.subscribe((state) => persist(state));

export const actions = {
  setTheme(theme: ThemeName) {
    appStore.setState((prev) => ({ ...prev, theme }));
  },
  toggleTheme() {
    appStore.setState((prev) => ({
      ...prev,
      theme: prev.theme === 'chamber' ? 'daylight' : 'chamber',
    }));
  },
  setMotion(motion: MotionMode) {
    appStore.setState((prev) => ({ ...prev, motion }));
  },
  toggleMotion() {
    appStore.setState((prev) => ({
      ...prev,
      motion: prev.motion === 'live' ? 'calm' : 'live',
    }));
  },
  setEffort(effort: Effort) {
    appStore.setState((prev) => ({ ...prev, effort }));
  },
  setTokens(key: 'inputTokens' | 'cachedInputTokens' | 'outputTokens', value: number) {
    appStore.setState((prev) => ({ ...prev, [key]: Math.max(0, Math.round(value)) }));
  },
  dismissNotice(id: string) {
    appStore.setState((prev) => ({
      ...prev,
      dismissedNotices: prev.dismissedNotices.includes(id)
        ? prev.dismissedNotices
        : [...prev.dismissedNotices, id],
    }));
  },
  restoreNotices() {
    appStore.setState((prev) => ({ ...prev, dismissedNotices: [] }));
  },
  setActiveSection(id: string) {
    appStore.setState((prev) => (prev.activeSection === id ? prev : { ...prev, activeSection: id }));
  },
  setNotesExpanded(expanded: boolean) {
    appStore.setState((prev) => ({ ...prev, notesExpanded: expanded }));
  },
} as const;
