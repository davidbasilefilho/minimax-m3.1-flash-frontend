import { Radio, RadioGroup } from 'baseui/radio';
import { useSelector } from '@tanstack/react-store';
import { motion } from 'motion/react';

import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';
import { Trace } from '../components/Trace';
import { EFFORTS, EFFORT_ORDER, MODEL } from '../data/model';
import { appStore, actions } from '../store/appStore';
import './thinking.css';

/**
 * The effort curve.
 *
 * Score against thinking depth, with the selected level marked. Two of these
 * sit side by side: the flat one is Automation-Bench, the steep one is
 * DeepSWE. The shape is the argument — most of the cost buys most of the
 * score early, and the last stretch is where the money goes.
 */
function EffortCurve({
  title,
  source,
  points,
  activeIndex,
  unit = '%',
}: {
  title: string;
  source: string;
  points: { effort: string; score: number }[];
  activeIndex: number;
  unit?: string;
}) {
  const width = 420;
  const height = 190;
  const padLeft = 44;
  const padBottom = 34;
  const padTop = 16;
  const padRight = 20;

  const scores = points.map((point) => point.score);
  const min = Math.min(...scores) - 3;
  const max = Math.max(...scores) + 2;

  const x = (index: number) =>
    padLeft + (index / Math.max(1, points.length - 1)) * (width - padLeft - padRight);
  const y = (score: number) =>
    height - padBottom - ((score - min) / (max - min)) * (height - padBottom - padTop);

  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(point.score)}`).join(' ');
  const area = `${line} L ${x(points.length - 1)} ${height - padBottom} L ${x(0)} ${height - padBottom} Z`;

  return (
    <figure className="mm-thinking__curve">
      <figcaption className="mm-thinking__curve-head">
        <span className="mm-thinking__curve-title">{title}</span>
        <span className="mm-thinking__curve-source">{source}</span>
      </figcaption>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mm-thinking__curve-svg"
        role="img"
        aria-label={`${title}. ${points
          .map((point) => `${point.effort} ${point.score}${unit}`)
          .join(', ')}.`}
      >
        <defs>
          <linearGradient id={`curve-${title.replace(/\W/g, '')}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--mm-violet)" />
            <stop offset="100%" stopColor="var(--mm-orange)" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((ratio) => {
          const value = min + ratio * (max - min);
          return (
            <g key={ratio}>
              <line
                x1={padLeft}
                x2={width - padRight}
                y1={y(value)}
                y2={y(value)}
                stroke="var(--mm-line)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={padLeft - 8}
                y={y(value) + 3}
                textAnchor="end"
                className="mm-thinking__tick"
              >
                {value.toFixed(0)}
              </text>
            </g>
          );
        })}

        <path d={area} fill="url(#curve-Signal)" opacity="0.08" />
        <path
          d={line}
          fill="none"
          stroke={`url(#curve-${title.replace(/\W/g, '')})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {points.map((point, index) => {
          const active = index === activeIndex;
          return (
            <g key={point.effort}>
              <circle
                cx={x(index)}
                cy={y(point.score)}
                r={active ? 6 : 3.5}
                fill={active ? 'var(--mm-rose)' : 'var(--mm-surface)'}
                stroke={active ? 'var(--mm-rose)' : 'var(--mm-line-strong)'}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={x(index)}
                y={height - padBottom + 16}
                textAnchor="middle"
                className={`mm-thinking__tick${active ? ' is-active' : ''}`}
              >
                {point.effort}
              </text>
              {active ? (
                <motion.text
                  x={x(index)}
                  y={y(point.score) - 14}
                  textAnchor="middle"
                  className="mm-thinking__value"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {point.score}
                  {unit}
                </motion.text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export function Thinking() {
  const effort = useSelector(appStore, (state) => state.effort);
  const activeIndex = EFFORT_ORDER.indexOf(effort);
  const level = EFFORTS[activeIndex];

  const intensity = 0.5 + (activeIndex / (EFFORT_ORDER.length - 1)) * 0.5;

  return (
    <section id="thinking" className="mm-section" aria-labelledby="thinking-title">
      <div className="mm-shell">
        <Reveal>
          <SectionHeader
            id="thinking-title"
            index="03"
            title="Thinking depth"
            blurb="M3.1 Flash reasons before it answers, and it cannot be told not to. What you control is how long it thinks — and that choice moves the score, the cost and the latency together."
          />
        </Reveal>

        <div className="mm-section__split">
          <Reveal>
            <div className="mm-thinking__dial">
              <fieldset className="mm-thinking__fieldset">
                <legend className="mm-thinking__legend">Thinking depth</legend>
                <RadioGroup
                  name="mm-effort"
                  value={effort}
                  onChange={(event) => actions.setEffort(event.target.value as typeof effort)}
                  align="horizontal"
                  overrides={{
                    RadioGroupRoot: {
                      style: { display: 'flex', gap: 'var(--mm-space-2)', flexWrap: 'wrap' },
                    },
                  }}
                >
                  {EFFORTS.map((entry) => (
                    <Radio
                      key={entry.id}
                      value={entry.id}
                      checked={effort === entry.id}
                      overrides={{
                        Root: {
                          style: ({ $checked }: { $checked?: boolean }) => ({
                            borderRadius: 'var(--mm-radius-pill)',
                            border: `1px solid ${$checked ? 'var(--mm-rose)' : 'var(--mm-line)'}`,
                            backgroundColor: $checked
                              ? 'color-mix(in srgb, var(--mm-rose) 14%, var(--mm-surface))'
                              : 'var(--mm-surface)',
                            color: $checked ? 'var(--mm-ink)' : 'var(--mm-ink-2)',
                            paddingLeft: '1rem',
                            paddingRight: '1rem',
                            paddingTop: '0.45rem',
                            paddingBottom: '0.45rem',
                            marginTop: 0,
                            marginBottom: 0,
                            transition:
                              'border-color var(--mm-dur-2) var(--mm-ease-out-expo), background-color var(--mm-dur-2) var(--mm-ease-out-expo)',
                          }),
                        },
                        Label: {
                          style: {
                            fontFamily: 'var(--mm-font-display)',
                            fontSize: 'var(--mm-text-sm)',
                            fontWeight: '500',
                            color: 'inherit',
                          },
                        },
                        RadioMarkOuter: {
                          style: {
                            display: 'none',
                          },
                        },
                        RadioMarkInner: { style: { backgroundColor: 'var(--mm-rose)' } },
                      }}
                    >
                      {entry.label}
                    </Radio>
                  ))}
                </RadioGroup>
              </fieldset>

              <p className="mm-thinking__note">{level.note}</p>

              <div className="mm-thinking__readout">
                <div>
                  <span className="mm-thinking__readout-label">Automation-Bench v1.0.6</span>
                  <span className="mm-thinking__readout-value mm-num">
                    {level.automationBench}
                    <span className="mm-thinking__readout-unit">%</span>
                  </span>
                </div>
                <div>
                  <span className="mm-thinking__readout-label">Cost per task</span>
                  <span className="mm-thinking__readout-value mm-num">
                    ${level.costPerTask.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mm-thinking__visual">
              <div className="mm-thinking__trace">
                <Trace
                  bars={36}
                  seed={5}
                  intensity={intensity}
                  tone="reason"
                  strokeWidth={2.5}
                  label={`Reasoning trace at ${level.label} effort`}
                />
              </div>
              <p className="mm-thinking__trace-caption">
                The trace is the model thinking. Its amplitude is the depth you selected.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="mm-thinking__curves">
            <EffortCurve
              title="Automation-Bench"
              source="v1.0.6 · vendor reported"
              points={EFFORTS.map((entry) => ({ effort: entry.id, score: entry.automationBench }))}
              activeIndex={activeIndex}
            />
            <EffortCurve
              title="DeepSWE"
              source="v1.1 · leaderboard as of 2026-09-22"
              points={[
                { effort: 'low', score: 67.3 },
                { effort: 'high', score: 68.1 },
                { effort: 'xhigh', score: 72.1 },
                { effort: 'max', score: 73.7 },
              ]}
              activeIndex={Math.max(0, activeIndex - 1)}
            />
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mm-thinking__warning">
            <div className="mm-thinking__warning-head">
              <span className="mm-thinking__warning-code mm-num">400</span>
              <div>
                <h3 className="mm-thinking__warning-title">Thinking cannot be turned off</h3>
                <p className="mm-thinking__warning-body">
                  Sending <code>thinking: {'{"type": "disabled"}'}</code> or{' '}
                  <code>effort: "none"</code> returns an error. Lower the effort level instead.
                </p>
              </div>
            </div>
            <pre className="mm-thinking__error" aria-label="Example error response">
              <code>{MODEL.reasoning.disableAttempt}</code>
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
