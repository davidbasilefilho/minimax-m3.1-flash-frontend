import { Button } from 'baseui/button';
import { useSelector } from '@tanstack/react-store';
import { motion, useReducedMotion } from 'motion/react';

import { MmLogo } from '../components/MmLogo';
import { Slogan } from '../components/Slogan';
import { Trace } from '../components/Trace';
import { Readout } from '../components/Readout';
import { EFFORTS, EFFORT_ORDER, HERO_READOUTS, MODEL } from '../data/model';
import { appStore } from '../store/appStore';
import { scrollToIdAndFocus } from '../lib/scroll';
import './hero.css';

const GRADIENT_OVERRIDES = {
  BaseButton: {
    style: {
      backgroundImage: 'var(--mm-grad-signal)',
      backgroundColor: 'transparent',
      color: '#ffffff',
      ':hover': { backgroundImage: 'var(--mm-grad-signal)', filter: 'brightness(1.08)' },
      ':active': { backgroundImage: 'var(--mm-grad-signal)', filter: 'brightness(0.94)' },
    },
  },
} as const;

export function Hero() {
  const effort = useSelector(appStore, (state) => state.effort);
  const reduce = useReducedMotion();

  const level = EFFORTS.find((entry) => entry.id === effort) ?? EFFORTS[EFFORTS.length - 1];
  const intensity = 0.5 + (EFFORT_ORDER.indexOf(effort) / (EFFORT_ORDER.length - 1)) * 0.5;

  return (
    <section id="hero" className="mm-hero" aria-labelledby="hero-title">
      <div className="mm-graticule mm-graticule--major" aria-hidden="true" />
      <div
        className="mm-hero__bloom"
        style={{ background: 'var(--mm-grad-signal)' }}
        aria-hidden="true"
      />

      <div className="mm-shell mm-hero__inner">
        <div className="mm-hero__lockup">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <MmLogo height={40} />
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <Slogan />
          </motion.div>        </div>

        <motion.h1
          id="hero-title"
          className="mm-hero__title mm-display"
          initial={reduce ? false : { opacity: 0, y: 26, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          M3.1 Flash
        </motion.h1>

        <motion.p
          className="mm-hero__lede mm-measure"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          A 428B mixture-of-experts model with a million-token memory. Reasoning never switches
          off — you tune its depth instead, from a fast{' '}
          <strong>low</strong> to an exhaustive <strong>max</strong>.
        </motion.p>

        <motion.div
          className="mm-hero__trace"
          initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.25, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <Trace bars={48} seed={11} intensity={intensity} tone="signal" strokeWidth={2.5} />
        </motion.div>

        <motion.div
          className="mm-hero__trace-caption"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <span className="mm-hero__trace-label">Signal</span>
          <span className="mm-hero__trace-value mm-num">{level.label}</span>
          <span className="mm-hero__trace-detail">
            amplitude follows the selected thinking depth
          </span>
        </motion.div>

        <motion.div
          className="mm-hero__readouts"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {HERO_READOUTS.map((readout) => (
            <Readout
              key={readout.label}
              label={readout.label}
              value={readout.value}
              unit={readout.unit}
              size="lg"
            />
          ))}
          <Readout
            label="Cost per 1M input tokens"
            value="$0.15"
            unit="cached input $0.015"
            size="lg"
            tone="signal"
          />
        </motion.div>

        <motion.div
          className="mm-hero__actions"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            kind="primary"
            shape="round"
            size="large"
            overrides={GRADIENT_OVERRIDES}
            className="mm-focus-halo"
            onClick={() => scrollToIdAndFocus('notices')}
          >
            Read the notices first
          </Button>
          <Button
            kind="tertiary"
            shape="round"
            size="large"
            onClick={() => scrollToIdAndFocus('benchmarks')}
          >
            See the benchmark matrix
          </Button>
          <p className="mm-hero__stamp">
            {MODEL.status} · {MODEL.released}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
