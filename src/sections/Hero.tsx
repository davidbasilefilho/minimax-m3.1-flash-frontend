import { useSelector } from '@tanstack/react-store';
import { Button } from 'baseui/button';
import { motion, useReducedMotion } from 'motion/react';

import { MmLogo } from '../components/MmLogo';
import { Readout } from '../components/Readout';
import { Slogan } from '../components/Slogan';
import { Trace } from '../components/Trace';
import { EFFORT_ORDER, EFFORTS, HERO_READOUTS, MODEL } from '../data/model';
import { scrollToIdAndFocus } from '../lib/scroll';
import { appStore } from '../store/appStore';

const GRADIENT_OVERRIDES = {
  BaseButton: {
    style: {
      backgroundImage: 'var(--gradient-signal)',
      backgroundColor: 'transparent',
      color: '#ffffff',
      ':hover': { backgroundImage: 'var(--gradient-signal)', filter: 'brightness(1.08)' },
      ':active': { backgroundImage: 'var(--gradient-signal)', filter: 'brightness(0.94)' },
    },
  },
} as const;

export function Hero() {
  const effort = useSelector(appStore, (state) => state.effort);
  const reduce = useReducedMotion();

  const level = EFFORTS.find((entry) => entry.id === effort) ?? EFFORTS.at(-1)!;
  const intensity = 0.5 + (EFFORT_ORDER.indexOf(effort) / (EFFORT_ORDER.length - 1)) * 0.5;

  return (
    <section
      id='hero'
      className='relative isolate overflow-hidden py-[clamp(3.5rem,8vw,6.5rem)] pb-[clamp(3rem,6vw,5rem)]'
      aria-labelledby='hero-title'>
      <div className='mm-graticule mm-graticule--major' aria-hidden='true' />
      <div
        className='bg-signal pointer-events-none absolute -top-[34%] -right-[14%] z-[-1] size-[44rem] rounded-full opacity-10 blur-[130px]'
        aria-hidden='true'
      />

      <div className='max-w-shell px-gutter relative mx-auto flex flex-col gap-6'>
        <div className='flex flex-col items-start gap-5'>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <MmLogo height={40} />
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}>
            <Slogan />
          </motion.div>
        </div>

        <motion.h1
          id='hero-title'
          className='font-display text-ink mt-2 text-[clamp(3.4rem,11vw,8.5rem)] leading-[0.92] font-extralight tracking-[-0.045em]'
          initial={reduce ? false : { opacity: 0, y: 26, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          M3.1 Flash
        </motion.h1>

        <motion.p
          className='text-ink-2 max-w-[60ch] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.55]'
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}>
          A 428B mixture-of-experts model with a million-token memory. Reasoning never switches off
          — you tune its depth instead, from a fast{' '}
          <strong className='text-ink font-medium'>low</strong> to an exhaustive{' '}
          <strong className='text-ink font-medium'>max</strong>.
        </motion.p>

        <motion.div
          className='mt-4 h-[clamp(90px,13vw,170px)]'
          initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.25, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}>
          <Trace bars={48} seed={11} intensity={intensity} tone='signal' strokeWidth={2.5} />
        </motion.div>

        <motion.div
          className='text-ink-3 flex flex-wrap items-baseline gap-3 text-xs'
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}>
          <span className='tracking-[0.02em]'>Signal</span>
          <span className='font-display text-brand-rose-text font-medium capitalize tabular-nums'>
            {level.label}
          </span>
          <span>amplitude follows the selected thinking depth</span>
        </motion.div>

        <motion.div
          className='border-line grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-x-5 gap-y-6 border-t pt-5 max-[720px]:grid-cols-2'
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          {HERO_READOUTS.map((readout) => (
            <Readout
              key={readout.label}
              label={readout.label}
              value={readout.value}
              unit={readout.unit}
              size='lg'
            />
          ))}
          <Readout
            label='Cost per 1M input tokens'
            value='$0.15'
            unit='cached input $0.015'
            size='lg'
            tone='signal'
          />
        </motion.div>

        <motion.div
          className='flex flex-wrap items-center gap-4 pt-2'
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}>
          <Button
            kind='primary'
            shape='round'
            size='large'
            overrides={GRADIENT_OVERRIDES}
            className='mm-focus-halo'
            onClick={() => scrollToIdAndFocus('notices')}>
            Read the notices first
          </Button>
          <Button
            kind='tertiary'
            shape='round'
            size='large'
            onClick={() => scrollToIdAndFocus('benchmarks')}>
            See the benchmark matrix
          </Button>
          <p className='text-ink-3 text-xs tabular-nums'>
            {MODEL.status} · {MODEL.released}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
