import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import './sectionHeader.css';

export type SectionHeaderProps = {
  /** Two-digit index, as on an instrument panel. */
  index: string;
  title: string;
  blurb?: string;
  /** Right-hand slot for a control or a readout. */
  aside?: ReactNode;
  id: string;
};

/**
 * The section header.
 *
 * The index is part of the structure, not decoration: the sections are an
 * ordered reading of the model, from identity to integration.
 */
export function SectionHeader({ index, title, blurb, aside, id }: SectionHeaderProps) {
  const reduce = useReducedMotion();

  return (
    <header className="mm-section-header">
      <div className="mm-section-header__main">
        <span className="mm-section-header__index mm-num" aria-hidden="true">
          {index}
        </span>
        <div className="mm-section-header__text">
          <h2 id={id} className="mm-section-header__title mm-display">
            {reduce ? (
              title
            ) : (
              <motion.span
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                viewport={{ once: true, amount: 0.9 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'inline-block' }}
              >
                {title}
              </motion.span>
            )}
          </h2>
          {blurb ? <p className="mm-section-header__blurb mm-measure">{blurb}</p> : null}
        </div>
      </div>
      {aside ? <div className="mm-section-header__aside">{aside}</div> : null}
    </header>
  );
}
