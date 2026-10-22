import { motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useId, useRef } from 'react';

import { buildBaseAmplitudes, buildTracePath, liveAmplitudes, TRACE_GEOMETRY } from '../lib/trace';

export type TraceTone = 'signal' | 'reason' | 'throughput' | 'spectrum';

export type TraceProps = {
  /** How many strokes the trace is drawn with. */
  bars?: number;
  /** Changes the resting shape. Same seed, same shape, every time. */
  seed?: number;
  /** 0..1 — how loud the trace is. Driven by the effort level in the hero. */
  intensity?: number;
  /** Animate the trace. */
  animate?: boolean;
  /** Marching highlight along the stroke. */
  pulse?: boolean;
  /** Stroke weight in px. The system has exactly one signal weight. */
  strokeWidth?: number;
  /** Which brand gradient the stroke takes. */
  tone?: TraceTone;
  /** Decorative by default. Supply a label to expose it to assistive tech. */
  label?: string;
  className?: string;
};

const TONE_GRADIENTS: Record<TraceTone, [string, string]> = {
  signal: ['var(--color-brand-rose)', 'var(--color-brand-orange)'],
  reason: ['var(--color-brand-violet)', 'var(--color-brand-lilac)'],
  throughput: ['var(--color-brand-azure)', 'var(--color-brand-cyan)'],
  spectrum: ['var(--color-brand-violet)', 'var(--color-brand-orange)'],
};

/**
 * The trace — the structural element the whole page is built from.
 *
 * It is the mark, redrawn at whatever scale the layout needs: the hero
 * signal, the section divider, the scroll spine, the loading state.
 *
 * Animation runs entirely through a motion value, so the path morphs at
 * display refresh rate without ever re-rendering React.
 */
export function Trace({
  bars = TRACE_GEOMETRY.bars,
  seed = 7,
  intensity = 1,
  animate = true,
  pulse = true,
  strokeWidth = 2,
  tone = 'signal',
  label,
  className,
}: TraceProps) {
  const gradientId = useId();
  const phase = useMotionValue(0);
  const phaseRef = useRef(phase);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (!animate) {
      return () => {};
    }

    let frame = 0;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      // `??=` would read better, but logical assignment operators are not
      // supported by the React Compiler yet and would drop this component
      // out of compilation.
      start = start ?? timestamp;
      phaseRef.current.set((timestamp - start) / 1000);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  const base = buildBaseAmplitudes(bars, seed);
  const [from, to] = TONE_GRADIENTS[tone];

  const path = useTransform(phase, (value) =>
    buildTracePath(liveAmplitudes(base, value, intensity), { ...TRACE_GEOMETRY, bars }),
  );

  const gradientRef = `${gradientId}-grad`;

  return (
    <svg
      className={`block size-full overflow-visible ${className ?? ''}`}
      viewBox={`0 0 ${TRACE_GEOMETRY.width} ${TRACE_GEOMETRY.height}`}
      preserveAspectRatio='none'
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable='false'>
      <defs>
        <linearGradient id={gradientRef} x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%' stopColor={from} />
          <stop offset='100%' stopColor={to} />
        </linearGradient>
      </defs>

      <motion.path
        className='mm-trace__stroke'
        d={path}
        stroke={`url(#${gradientRef})`}
        strokeWidth={strokeWidth}
        vectorEffect='non-scaling-stroke'
        fill='none'
      />

      {pulse ? (
        <motion.path
          className='mm-trace__pulse'
          d={path}
          stroke={`url(#${gradientRef})`}
          strokeWidth={strokeWidth * 1.6}
          vectorEffect='non-scaling-stroke'
          fill='none'
        />
      ) : null}
    </svg>
  );
}
