import { motion } from 'motion/react';

export type CostBeamSegment = {
  id: string;
  label: string;
  /** Share of the total, 0–1. */
  share: number;
  /** Cost in USD. */
  value: number;
  colour: string;
};

export type CostBeamProps = {
  segments: CostBeamSegment[];
  /** Total cost, for the accessible summary. */
  total: number;
  /** Show the legend. */
  legend?: boolean;
  delay?: number;
};

function formatUsd(value: number): string {
  if (value === 0) return '$0';
  if (value < 0.0001) return '<$0.0001';
  if (value < 0.01) return `$${value.toFixed(4)}`;
  if (value < 1) return `$${value.toFixed(3)}`;
  return `$${value.toFixed(2)}`;
}

/**
 * The cost of one request, as a single beam.
 *
 * Input, cached input and output are priced very differently, so the beam
 * shows the share of the bill each one represents. The proportions are
 * dominated by whichever component is largest, which is exactly the thing a
 * reader needs to see.
 */
export function CostBeam({ segments, total, legend = true, delay = 0 }: CostBeamProps) {
  const summary = segments
    .filter((segment) => segment.value > 0)
    .map((segment) => `${segment.label} ${formatUsd(segment.value)}`)
    .join(', ');

  return (
    <div className='flex w-full flex-col gap-4'>
      <div
        className='rounded-pill bg-surface-2 flex h-[14px] overflow-hidden shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-ink)_10%,transparent)]'
        role='img'
        aria-label={`Total request cost ${formatUsd(total)}. ${summary || 'No cost yet.'}`}>
        {segments.map((segment, index) => (
          <motion.span
            key={segment.id}
            className='rounded-pill min-w-[3px]'
            style={{ background: segment.colour }}
            initial={{ flexGrow: 0, opacity: 0 }}
            animate={{ flexGrow: Math.max(segment.share, 0.0001), opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: delay + index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
      </div>

      {legend ? (
        <ul className='flex flex-wrap gap-3 gap-x-5'>
          {segments.map((segment) => (
            <li key={segment.id} className='text-ink-2 flex items-center gap-2 text-sm'>
              <span
                className='size-[10px] shrink-0 rounded-[3px]'
                style={{ background: segment.colour }}
                aria-hidden='true'
              />
              <span>{segment.label}</span>
              <span className='font-display text-ink font-medium tabular-nums'>
                {formatUsd(segment.value)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
