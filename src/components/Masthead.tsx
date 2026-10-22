import { Button } from 'baseui/button';
import { Switch } from 'baseui/switch';
import { Tooltip } from 'baseui/tooltip';
import { useSelector } from '@tanstack/react-store';
import { motion, useScroll, useSpring } from 'motion/react';

import { MmLogo } from './MmLogo';
import { SECTIONS } from '../data/sections';
import { appStore, actions } from '../store/appStore';
import { scrollToIdAndFocus } from '../lib/scroll';
import './masthead.css';

export function Masthead() {
  const theme = useSelector(appStore, (state) => state.theme);
  const motionMode = useSelector(appStore, (state) => state.motion);
  const activeSection = useSelector(appStore, (state) => state.activeSection);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  return (
    <header className="mm-masthead">
      <div className="mm-masthead__inner mm-shell">
        <a
          className="mm-masthead__brand"
          href="#hero"
          onClick={(event) => {
            event.preventDefault();
            scrollToIdAndFocus('hero');
          }}
        >
          <MmLogo height={22} />
          <span className="mm-masthead__model">M3.1 Flash</span>
        </a>

        <nav className="mm-masthead__nav" aria-label="Sections">
          <ul>
            {SECTIONS.map((section) => {
              const current = activeSection === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`mm-masthead__link${current ? ' is-active' : ''}`}
                    aria-current={current ? 'true' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToIdAndFocus(section.id);
                    }}
                  >
                    <span className="mm-masthead__link-index" aria-hidden="true">
                      {section.index}
                    </span>
                    <span>{section.short}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mm-masthead__controls">
          <Tooltip
            content={theme === 'chamber' ? 'Switch to the daylight theme' : 'Switch to the chamber theme'}
            placement="bottom"
          >
            <Button
              size="compact"
              kind="tertiary"
              aria-label={theme === 'chamber' ? 'Switch to the daylight theme' : 'Switch to the chamber theme'}
              onClick={actions.toggleTheme}
              className="mm-masthead__icon-button"
            >
              <span aria-hidden="true">
                {theme === 'chamber' ? (
                  <svg viewBox="0 0 16 16" width="14" height="14" focusable="false">
                    <path
                      d="M13.5 10.4A6 6 0 0 1 5.6 2.5a6 6 0 1 0 7.9 7.9Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16" width="14" height="14" focusable="false">
                    <circle
                      cx="8"
                      cy="8"
                      r="3.2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <line
                        key={angle}
                        x1="8"
                        y1="1.4"
                        x2="8"
                        y2="3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        transform={`rotate(${angle} 8 8)`}
                      />
                    ))}
                  </svg>
                )}
              </span>
            </Button>
          </Tooltip>

          <label className="mm-masthead__motion">
            <span className="mm-masthead__motion-label">Motion</span>
            <Switch
              checked={motionMode === 'live'}
              onChange={(checked) => actions.setMotion(checked ? 'live' : 'calm')}
              aria-label="Enable motion"
            />
          </label>
        </div>
      </div>

      <motion.div
        className="mm-masthead__progress"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
    </header>
  );
}
