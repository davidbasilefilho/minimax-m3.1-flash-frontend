import { motion } from 'motion/react';

import { normalisedPosition, spectrumColor } from '../lib/spectrum';

export type SpectralBarProps = {
  /** The raw benchmark score, as published. */
  score: number;
  /** The best score recorded on this benchmark, for normalisation. */
  best: number;
  /** The lowest score recorded on this benchmark. */
  worst: number;
  /** Whether this is the model the page is about. */
  isSubject?: boolean;
  /** The competing score to show as a ghost bar behind. */
  ghost?: number | null;
  /** Accessible description. */
  label: string;
  /** Delay for the growth animation, in seconds. */
  delay?: number;
  /** Suppress the growth animation. */
  still?: boolean;
};

/**
 * A score, drawn on the spectral scale.
 *
 * The fill colour is the score's position on the brand gradient, so the
 * colour itself is a reading. The bar length is the score normalised across
 * the published field for that benchmark.
 */
export function SpectralBar({
  score,
  best,
  worst,
  isSubject = false,
  ghost = null,
  label,
  delay = 0,
  still = false,
}: SpectralBarProps) {
  const position = normalisedPosition(score, best, worst);
  const ghostPosition = ghost === null ? null : normalisedPosition(ghost, best, worst);
  const colour = spectrumColor(position);

  return (
    <div className='flex w-full flex-col gap-[0.375rem]'>
      <div
        className={`rounded-pill bg-surface-2 relative overflow-hidden ${
          isSubject
            ? 'h-[10px] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-ink)_12%,transparent)]'
            : 'h-2'
        }`}>
        {ghostPosition === null ? null : (
          <motion.span
            className='rounded-pill absolute inset-y-0 left-0 opacity-[0.22]'
            style={{ background: spectrumColor(ghostPosition) }}
            initial={still ? false : { width: 0 }}
            animate={{ width: `${ghostPosition}%` }}
            transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
          />
        )}

        <motion.span
          className='rounded-pill absolute inset-y-0 left-0'
          style={{ background: colour }}
          initial={still ? false : { width: 0 }}
          animate={{ width: `${position}%` }}
          transition={{
            duration: 0.9,
            delay,
            ease: [0.16, 1, 0.3, 1],
            type: still ? 'tween' : 'spring',
            bounce: still ? 0 : 0.16,
          }}
        />
      </div>

      <span className='sr-only'>{label}</span>
    </div>
  );
}

/**
 * The scale legend.
 *
 * One per list rather than one per bar: the colour of a bar is only
 * meaningful if the reader can see where it sits on the spectrum.
 */
export function SpectralLegend({ low, high }: { low: string; high: string }) {
  return (
    <div className='mt-2 flex items-center gap-3'>
      <span className='text-ink-3 text-[10px] tracking-[0.04em] whitespace-nowrap'>{low}</span>
      <span className='rounded-pill bg-spectrum h-1 flex-1' aria-hidden='true' />
      <span className='text-ink-3 text-[10px] tracking-[0.04em] whitespace-nowrap'>{high}</span>
    </div>
  );
}
