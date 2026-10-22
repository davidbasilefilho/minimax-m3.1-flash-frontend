/**
 * Base Web themes, rebuilt on the MiniMax brand system.
 *
 * Base Web derives semantic and component colour tokens from a handful of
 * foundation colours, then deep-merges any overrides on top. By setting the
 * foundation hues we get the whole component library on-brand for free, and
 * by overriding the surface ramp we get our own instrument-panel surfaces.
 *
 * Brand palette source: MiniMax Brand Book
 * https://www.minimax.io/brand-vi
 */

import { createDarkTheme, createLightTheme } from 'baseui/themes';
import type { Theme } from 'baseui/styles';

/* ── The six brand hues, plus the two supporting brand colours ─────────── */

const ROSE = '#ff3763';
const CORAL = '#ff6452';
const ORANGE = '#ff7038';
const VIOLET = '#7a27ff';
const LILAC = '#a36aff';
const CYAN = '#38cdff';

/* ── Type ──────────────────────────────────────────────────────────────── */

const FONTS = {
  primaryFontFamily: '"DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
  secondaryFontFamily: '"Outfit", "DM Sans", system-ui, sans-serif',
  monoFontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace',
} as const;

/* ── Radii: rounded, always. Pills for controls, 14px for surfaces. ────── */

const RADII = {
  radius100: '6px',
  radius200: '8px',
  radius300: '14px',
  radius400: '22px',
  radius500: '999px',
  buttonBorderRadius: '999px',
  buttonBorderRadiusMini: '999px',
  checkboxBorderRadius: '6px',
  surfaceBorderRadius: '14px',
  inputBorderRadius: '10px',
  inputBorderRadiusMini: '8px',
  popoverBorderRadius: '14px',
  tagBorderRadius: '999px',
} as const;

/* ── A single hairline weight, as the mark dictates ────────────────────── */

const BORDER = {
  borderColor: 'currentColor',
  borderStyle: 'solid',
  borderWidth: '1px',
} as const;

const BORDERS = {
  border100: { ...BORDER, borderWidth: '1px' },
  border200: { ...BORDER, borderWidth: '1px' },
  border300: { ...BORDER, borderWidth: '1px' },
  border400: { ...BORDER, borderWidth: '1px' },
  border500: { ...BORDER, borderWidth: '2px' },
  border600: { ...BORDER, borderWidth: '2px' },
  ...RADII,
} as const;

/**
 * Re-point every typography token at the brand families.
 * Base Web bakes `fontFamily` into each token at build time, so overriding
 * `fonts` alone is not enough — the tokens have to be rewritten.
 */
function withBrandFonts<T extends Theme>(theme: T): T {
  const typography = { ...theme.typography };

  for (const key of Object.keys(typography) as Array<keyof typeof typography>) {
    const token = typography[key];
    if (!token || typeof token !== 'object') continue;

    const family = key.startsWith('Mono')
      ? FONTS.monoFontFamily
      : key.startsWith('Heading') || key.startsWith('Display')
        ? FONTS.secondaryFontFamily
        : FONTS.primaryFontFamily;

    typography[key] = { ...token, fontFamily: family } as never;
  }

  return { ...theme, typography, fonts: FONTS } as T;
}

/* ── chamber ───────────────────────────────────────────────────────────── */

const CHAMBER_MONO = {
  mono100: '#0a0713',
  mono200: '#120d20',
  mono300: '#1a1330',
  mono400: '#2a2145',
  mono500: '#3d3163',
  mono600: '#5a4a86',
  mono700: '#7e74a0',
  mono800: '#b9b0d0',
  mono900: '#dcd6ee',
  mono1000: '#f4f1fa',
} as const;

export const chamberTheme = withBrandFonts(
  createDarkTheme({
    name: 'signal-chamber',
    fonts: FONTS,
    borders: BORDERS,
    colors: {
      /* foundation — these cascade into every semantic + component token */
      primary: ROSE,
      primaryA: ROSE,
      primaryB: ORANGE,
      primary50: '#fff0f4',
      primary100: '#ffe0e8',
      primary200: '#ffc2d0',
      primary300: '#ff9db5',
      primary400: '#ff6f95',
      primary500: ROSE,
      primary600: '#e51e4c',
      primary700: '#b60f39',

      accent: VIOLET,
      accentA: VIOLET,
      accentB: LILAC,
      accent50: '#f4ecff',
      accent100: '#e8dbff',
      accent200: '#d2bcff',
      accent300: '#b28fff',
      accent400: '#9160f0',
      accent500: VIOLET,
      accent600: '#6413d9',
      accent700: '#4f0fb3',

      positive: CYAN,
      positive50: '#e6f8ff',
      positive100: '#c5f0ff',
      positive200: '#92e2ff',
      positive300: '#5fd2ff',
      positive400: '#38cdff',
      positive500: CYAN,
      positive600: '#0ea3d4',
      positive700: '#0b7fa6',

      warning: ORANGE,
      warning50: '#fff2ea',
      warning100: '#ffdfcd',
      warning200: '#ffbfa3',
      warning300: '#ff9d72',
      warning400: '#ff8049',
      warning500: ORANGE,
      warning600: '#d94f1c',
      warning700: '#a83a12',

      negative: CORAL,
      negative50: '#fff1ef',
      negative100: '#ffdcd7',
      negative200: '#ffb8ae',
      negative300: '#ff8e80',
      negative400: '#ff6452',
      negative500: CORAL,
      negative600: '#d93a26',
      negative700: '#a82516',

      /* surfaces — the instrument panel */
      ...CHAMBER_MONO,
      backgroundPrimary: '#0a0713',
      backgroundSecondary: '#120d20',
      backgroundTertiary: '#1a1330',
      backgroundInversePrimary: '#f4f1fa',
      backgroundInverseSecondary: '#b9b0d0',
      contentPrimary: '#f4f1fa',
      contentSecondary: '#b9b0d0',
      contentTertiary: '#7e74a0',
      contentInversePrimary: '#0a0713',
      contentInverseSecondary: '#4a4166',
      contentInverseTertiary: '#6f6590',
      borderOpaque: '#2a2145',
      borderTransparent: 'transparent',
      borderSelected: ROSE,
      borderInverseOpaque: '#4a4166',
      borderInverseTransparent: 'transparent',
      borderInverseSelected: '#0a0713',
    },
  }),
);

/* ── daylight ──────────────────────────────────────────────────────────── */

const DAYLIGHT_MONO = {
  mono100: '#ffffff',
  mono200: '#f7f6fb',
  mono300: '#f0eef7',
  mono400: '#e2deef',
  mono500: '#c8c1e0',
  mono600: '#a89fc6',
  mono700: '#8b81ab',
  mono800: '#6f6590',
  mono900: '#4a4166',
  mono1000: '#120d20',
} as const;

export const daylightTheme = withBrandFonts(
  createLightTheme({
    name: 'signal-daylight',
    fonts: FONTS,
    borders: BORDERS,
    colors: {
      primary: ROSE,
      primaryA: ROSE,
      primaryB: ORANGE,
      primary50: '#fff0f4',
      primary100: '#ffe0e8',
      primary200: '#ffc2d0',
      primary300: '#ff9db5',
      primary400: '#ff6f95',
      primary500: ROSE,
      primary600: '#c21742',
      primary700: '#94102f',

      accent: VIOLET,
      accentA: VIOLET,
      accentB: LILAC,
      accent50: '#f4ecff',
      accent100: '#e8dbff',
      accent200: '#d2bcff',
      accent300: '#b28fff',
      accent400: '#9160f0',
      accent500: VIOLET,
      accent600: '#5a17c4',
      accent700: '#4a0f9e',

      positive: '#0a6f9c',
      positive50: '#e6f8ff',
      positive100: '#c5f0ff',
      positive200: '#92e2ff',
      positive300: '#5fd2ff',
      positive400: '#38cdff',
      positive500: '#0a6f9c',
      positive600: '#085a7e',
      positive700: '#064760',

      warning: '#a8410f',
      warning50: '#fff2ea',
      warning100: '#ffdfcd',
      warning200: '#ffbfa3',
      warning300: '#ff9d72',
      warning400: '#ff8049',
      warning500: '#a8410f',
      warning600: '#8a350c',
      warning700: '#6b2909',

      negative: '#b02318',
      negative50: '#fff1ef',
      negative100: '#ffdcd7',
      negative200: '#ffb8ae',
      negative300: '#ff8e80',
      negative400: '#ff6452',
      negative500: '#b02318',
      negative600: '#8f1c13',
      negative700: '#6d150e',

      ...DAYLIGHT_MONO,
      backgroundPrimary: '#f7f6fb',
      backgroundSecondary: '#ffffff',
      backgroundTertiary: '#f0eef7',
      backgroundInversePrimary: '#120d20',
      backgroundInverseSecondary: '#4a4166',
      contentPrimary: '#120d20',
      contentSecondary: '#4a4166',
      contentTertiary: '#6f6590',
      contentInversePrimary: '#f4f1fa',
      contentInverseSecondary: '#b9b0d0',
      contentInverseTertiary: '#7e74a0',
      borderOpaque: '#e2deef',
      borderTransparent: 'transparent',
      borderSelected: ROSE,
      borderInverseOpaque: '#c8c1e0',
      borderInverseTransparent: 'transparent',
      borderInverseSelected: '#ffffff',
    },
  }),
);

export const THEMES = {
  chamber: chamberTheme,
  daylight: daylightTheme,
} as const;

export type ThemeName = keyof typeof THEMES;
