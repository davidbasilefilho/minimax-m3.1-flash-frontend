import { motion } from 'motion/react';

import './costBeam.css';

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
    <div className="mm-beam">
      <div
        className="mm-beam__track"
        role="img"
        aria-label={`Total request cost ${formatUsd(total)}. ${summary || 'No cost yet.'}`}
      >
        {segments.map((segment, index) => (
          <motion.span
            key={segment.id}
            className="mm-beam__segment"
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
        <ul className="mm-beam__legend">
          {segments.map((segment) => (
            <li key={segment.id} className="mm-beam__legend-item">
              <span
                className="mm-beam__swatch"
                style={{ background: segment.colour }}
                aria-hidden="true"
              />
              <span className="mm-beam__legend-label">{segment.label}</span>
              <span className="mm-beam__legend-value mm-num">{formatUsd(segment.value)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
