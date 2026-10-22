import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export type RevealProps = {
  children: ReactNode;
  /** Stagger, in seconds. */
  delay?: number;
  /** How far the content rises before settling. */
  y?: number;
  className?: string;
  /** How much of the element must be visible before it reveals. */
  amount?: number;
};

/**
 * Scroll reveal.
 *
 * One wipe-and-rise, used consistently. `once` so the reveal does not replay
 * on every pass — re-triggering reads as noise rather than craft. Under
 * reduced motion the content is simply present.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  amount = 0.3,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
