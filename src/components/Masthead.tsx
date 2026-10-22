import { useSelector } from '@tanstack/react-store';
import { Button } from 'baseui/button';
import { Switch } from 'baseui/switch';
import { Tooltip } from 'baseui/tooltip';
import { motion, useScroll, useSpring } from 'motion/react';

import { SECTIONS } from '../data/sections';
import { scrollToIdAndFocus } from '../lib/scroll';
import { actions, appStore } from '../store/appStore';
import { MmLogo } from './MmLogo';

export function Masthead() {
  const theme = useSelector(appStore, (state) => state.theme);
  const motionMode = useSelector(appStore, (state) => state.motion);
  const activeSection = useSelector(appStore, (state) => state.activeSection);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  return (
    <header className='border-line bg-canvas/88 sticky top-0 z-200 border-b backdrop-blur-[10px] backdrop-saturate-[140%]'>
      <div className='max-w-shell px-gutter mx-auto flex h-[4.25rem] items-center gap-5'>
        <a
          className='flex shrink-0 items-center gap-3 rounded-sm no-underline'
          href='#hero'
          onClick={(event) => {
            event.preventDefault();
            scrollToIdAndFocus('hero');
          }}>
          <MmLogo height={22} />
          <span className='font-display text-ink-2 text-sm font-medium tracking-[0.04em] whitespace-nowrap'>
            M3.1 Flash
          </span>
        </a>

        <nav
          className='min-w-0 flex-1 [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden'
          aria-label='Sections'
          style={{
            maskImage:
              'linear-gradient(to right, transparent, #000 1.5rem, #000 calc(100% - 1.5rem), transparent)',
          }}>
          <ul className='flex items-center gap-[0.15rem]'>
            {SECTIONS.map((section) => {
              const current = activeSection === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`ease-out-expo inline-flex items-baseline gap-[0.35rem] rounded-sm px-[0.6rem] py-[0.4rem] text-xs whitespace-nowrap no-underline transition-colors duration-150 ${
                      current
                        ? 'bg-surface-2 text-ink'
                        : 'text-ink-3 hover:bg-surface-2 hover:text-ink'
                    }`}
                    aria-current={current ? 'true' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToIdAndFocus(section.id);
                    }}>
                    <span
                      className={`font-display text-[10px] tabular-nums ${
                        current ? 'text-brand-rose-text opacity-100' : 'opacity-70'
                      }`}
                      aria-hidden='true'>
                      {section.index}
                    </span>
                    <span>{section.short}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className='flex shrink-0 items-center gap-4'>
          <Tooltip
            content={
              theme === 'chamber' ? 'Switch to the daylight theme' : 'Switch to the chamber theme'
            }
            placement='bottom'>
            <Button
              size='compact'
              kind='tertiary'
              aria-label={
                theme === 'chamber' ? 'Switch to the daylight theme' : 'Switch to the chamber theme'
              }
              onClick={() => actions.toggleTheme()}
              className='min-w-8 px-0! text-base leading-none'>
              <span aria-hidden='true'>
                {theme === 'chamber' ? (
                  <svg viewBox='0 0 16 16' width='14' height='14' focusable='false'>
                    <path
                      d='M13.5 10.4A6 6 0 0 1 5.6 2.5a6 6 0 1 0 7.9 7.9Z'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinejoin='round'
                    />
                  </svg>
                ) : (
                  <svg viewBox='0 0 16 16' width='14' height='14' focusable='false'>
                    <circle
                      cx='8'
                      cy='8'
                      r='3.2'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.5'
                    />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <line
                        key={angle}
                        x1='8'
                        y1='1.4'
                        x2='8'
                        y2='3'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        transform={`rotate(${angle} 8 8)`}
                      />
                    ))}
                  </svg>
                )}
              </span>
            </Button>
          </Tooltip>

          <label className='flex cursor-pointer items-center gap-2' htmlFor='mm-motion-toggle'>
            <span className='text-ink-3 text-xs max-[1080px]:hidden'>Motion</span>
            <Switch
              id='mm-motion-toggle'
              checked={motionMode === 'live'}
              onChange={(event) => actions.setMotion(event.currentTarget.checked ? 'live' : 'calm')}
              aria-label='Enable motion'
            />
          </label>
        </div>
      </div>

      <motion.div
        className='bg-signal absolute inset-x-0 -bottom-px h-0.5 origin-left'
        style={{ scaleX: progress }}
        aria-hidden='true'
      />
    </header>
  );
}
