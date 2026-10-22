/**
 * The spectral scale.
 *
 * The brand gradient system runs violet → rose → orange. On this page that
 * gradient is not a wash: it is a SCALE. A score of 0 sits at the violet end,
 * 50 at rose, 100 at orange. So a bar's colour carries its value.
 */

export type Rgb = [number, number, number];

const VIOLET: Rgb = [0x7a, 0x27, 0xff];
const ROSE: Rgb = [0xff, 0x37, 0x63];
const ORANGE: Rgb = [0xff, 0x70, 0x38];

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function toHex(rgb: Rgb): string {
  return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * The colour a given position on the scale resolves to.
 * `position` runs 0–100.
 */
export function spectrumColor(position: number): string {
  const p = Math.max(0, Math.min(100, position));
  if (p <= 50) return toHex(mix(VIOLET, ROSE, p / 50));
  return toHex(mix(ROSE, ORANGE, (p - 50) / 50));
}

/** The three stops, for building a CSS gradient in JS. */
export const SPECTRUM_STOPS = { violet: toHex(VIOLET), rose: toHex(ROSE), orange: toHex(ORANGE) };

/**
 * Map a raw benchmark score onto the 0–100 scale.
 *
 * Scores are not all percentages — Terminal Bench 4.0 tops out around 51.8,
 * Automation-Bench around 62.8, HLE around 55.6. Comparing them on a raw
 * 0–100 axis would flatten the interesting differences, so each benchmark
 * is normalised against the best score any model achieved on it. The
 * normalisation is stated in the interface so the number is never
 * mistaken for the raw score.
 */
export function normalisedPosition(score: number, best: number, worst: number): number {
  if (best === worst) return 50;
  const t = (score - worst) / (best - worst);
  return Math.max(0, Math.min(100, t * 100));
}
