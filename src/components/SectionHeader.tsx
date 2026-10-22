import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

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
    <header className='border-line mb-7 flex items-end justify-between gap-6 border-b pb-5 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-4'>
      <div className='flex min-w-0 items-start gap-5'>
        <span
          className='font-display text-ink-3 after:bg-line relative shrink-0 pt-[0.45rem] text-xs font-medium tracking-[0.08em] after:absolute after:top-[1.05rem] after:right-[-1rem] after:left-0 after:h-px max-[720px]:after:hidden'
          aria-hidden='true'>
          {index}
        </span>
        <div className='min-w-0'>
          <h2
            id={id}
            className='font-display text-ink mb-3 text-[clamp(1.75rem,3.6vw,2.6rem)] leading-tight font-light tracking-[-0.03em]'>
            {reduce ? (
              title
            ) : (
              <motion.span
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                viewport={{ once: true, amount: 0.9 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'inline-block' }}>
                {title}
              </motion.span>
            )}
          </h2>
          {blurb ? <p className='text-md text-ink-2 max-w-[68ch]'>{blurb}</p> : null}
        </div>
      </div>
      {aside ? <div className='shrink-0'>{aside}</div> : null}
    </header>
  );
}
