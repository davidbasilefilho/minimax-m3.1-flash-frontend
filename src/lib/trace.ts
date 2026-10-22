/**
 * Geometry for the trace.
 *
 * The MiniMax mark is a single monoline: vertical strokes joined by
 * rounded elbows, alternating above and below a centre line, with rounded
 * caps at each free end. This module reproduces that construction exactly,
 * so every trace on the page is the same mark at a different scale.
 *
 * All functions here are pure. They are called from a motion-value transform,
 * which runs outside the React render cycle, so they must not touch React
 * state.
 */

export type TraceGeometry = {
  width: number;
  height: number;
  bars: number;
};

export const TRACE_GEOMETRY: TraceGeometry = { width: 1000, height: 120, bars: 34 };

/**
 * The profile of the mark itself: a short hook, then progressively taller
 * strokes, then a fall back down. `shape` is scaled and jittered per bar.
 */
const MARK_PROFILE = [0.34, 0.58, 0.86, 1, 0.92, 0.7, 0.46] as const;

/**
 * Deterministic pseudo-random in [0, 1). A fixed seed keeps the trace
 * identical between renders and between reloads.
 */
function seeded(seed: number): () => number {
  let state = (seed >>> 0) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0xffffffff;
  };
}

/**
 * The resting shape of the trace: the mark profile, tiled and jittered.
 * Values are normalised to [0, 1] where 1 is the full half-height.
 */
export function buildBaseAmplitudes(bars: number, seed: number): number[] {
  const random = seeded(seed);
  const profile = MARK_PROFILE;
  const out: number[] = [];

  for (let i = 0; i < bars; i += 1) {
    const centre = profile[i % profile.length];
    const jitter = (random() - 0.5) * 0.22;
    // Taper the far ends so the trace fades into the page rather than
    // stopping dead.
    const edge = Math.min(i, bars - 1 - i) / Math.max(1, bars * 0.22);
    const taper = 0.45 + 0.55 * Math.min(1, edge);
    out.push(Math.max(0.12, Math.min(1, (centre + jitter) * taper)));
  }

  return out;
}

/**
 * Live amplitudes for a given phase. Two travelling waves with different
 * speeds beat against each other so the motion never visibly repeats.
 */
export function liveAmplitudes(
  base: number[],
  phase: number,
  intensity: number,
): number[] {
  const speed = 1.35;
  return base.map((value, index) => {
    const primary = Math.sin(phase * speed + index * 0.42);
    const secondary = Math.sin(phase * speed * 0.63 - index * 0.19);
    const pulse = 0.72 + 0.28 * (primary * 0.65 + secondary * 0.35);
    return Math.max(0.06, Math.min(1, value * pulse * intensity));
  });
}

/**
 * Build the SVG path for a set of amplitudes.
 *
 * Bars sit at even intervals. Consecutive bars are joined by a semicircular
 * elbow of exactly the bar spacing, so the curve is tangent to both strokes
 * and the stroke weight never appears to change. Connectors alternate above
 * and below the centre line, which is what gives the mark its wave.
 */
export function buildTracePath(
  amplitudes: number[],
  geometry: TraceGeometry = TRACE_GEOMETRY,
): string {
  const { width, height, bars } = geometry;
  const count = Math.min(amplitudes.length, bars);
  if (count < 2) return '';

  const mid = height / 2;
  const spacing = width / (count - 1);
  const radius = spacing / 2;

  // Connector heights: even connectors are high points, odd are low points.
  const connectors: number[] = [];
  for (let i = 0; i < count - 1; i += 1) {
    const amplitude = amplitudes[i] * mid;
    connectors.push(i % 2 === 0 ? mid - amplitude : mid + amplitude);
  }

  // The free end of the first stroke curls down; the free end of the last
  // stroke curls to whichever side its connector is not.
  const firstFree = mid + amplitudes[0] * mid;
  const lastAmplitude = amplitudes[count - 1] * mid;
  const lastConnector = connectors[count - 2];
  const lastFree = lastConnector < mid ? mid + lastAmplitude : mid - lastAmplitude;

  const parts: string[] = [`M 0 ${firstFree.toFixed(2)}`];

  for (let i = 0; i < count - 1; i += 1) {
    const x = i * spacing;
    const nextX = (i + 1) * spacing;
    const y = connectors[i];
    // sweep 1 bulges the elbow upward, sweep 0 downward.
    const sweep = y < mid ? 1 : 0;
    const nextLevel = i + 1 < count - 1 ? connectors[i + 1] : lastFree;

    parts.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
    parts.push(`A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 0 ${sweep} ${nextX.toFixed(2)} ${y.toFixed(2)}`);
    parts.push(`L ${nextX.toFixed(2)} ${nextLevel.toFixed(2)}`);
  }

  return parts.join(' ');
}
