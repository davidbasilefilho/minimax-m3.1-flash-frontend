import { useSelector } from '@tanstack/react-store';
import { Radio, RadioGroup } from 'baseui/radio';
import { motion } from 'motion/react';

import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { Trace } from '../components/Trace';
import { EFFORT_ORDER, EFFORTS, MODEL } from '../data/model';
import { actions, appStore } from '../store/appStore';

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

  const line = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(point.score)}`)
    .join(' ');
  const area = `${line} L ${x(points.length - 1)} ${height - padBottom} L ${x(0)} ${height - padBottom} Z`;
  const gradientId = `curve-${title.replaceAll(/\W/gu, '')}`;

  return (
    <figure className='border-line bg-surface m-0 rounded-md border p-5'>
      <figcaption className='mb-3 flex flex-wrap items-baseline justify-between gap-3'>
        <span className='font-display text-md text-ink'>{title}</span>
        <span className='text-ink-3 text-xs'>{source}</span>
      </figcaption>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className='h-auto w-full overflow-visible'
        role='img'
        aria-label={`${title}. ${points
          .map((point) => `${point.effort} ${point.score}${unit}`)
          .join(', ')}.`}>
        <defs>
          <linearGradient id={gradientId} x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor='var(--color-brand-violet)' />
            <stop offset='100%' stopColor='var(--color-brand-orange)' />
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
                stroke='var(--color-line)'
                strokeWidth='1'
                vectorEffect='non-scaling-stroke'
              />
              <text
                x={padLeft - 8}
                y={y(value) + 3}
                textAnchor='end'
                className='fill-ink-3 font-body text-[10px] tabular-nums'>
                {value.toFixed(0)}
              </text>
            </g>
          );
        })}

        <path d={area} fill={`url(#${gradientId})`} opacity='0.08' />
        <path
          d={line}
          fill='none'
          stroke={`url(#${gradientId})`}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          vectorEffect='non-scaling-stroke'
        />

        {points.map((point, index) => {
          const active = index === activeIndex;
          return (
            <g key={point.effort}>
              <circle
                cx={x(index)}
                cy={y(point.score)}
                r={active ? 6 : 3.5}
                fill={active ? 'var(--color-brand-rose)' : 'var(--color-surface)'}
                stroke={active ? 'var(--color-brand-rose)' : 'var(--color-line-strong)'}
                strokeWidth='2'
                vectorEffect='non-scaling-stroke'
              />
              <text
                x={x(index)}
                y={height - padBottom + 16}
                textAnchor='middle'
                className={`font-body text-[10px] tabular-nums ${
                  active ? 'fill-brand-rose-text font-semibold' : 'fill-ink-3'
                }`}>
                {point.effort}
              </text>
              {active ? (
                <motion.text
                  x={x(index)}
                  y={y(point.score) - 14}
                  textAnchor='middle'
                  className='fill-brand-rose-text font-display text-[13px] tabular-nums'
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}>
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
    <section id='thinking' className='py-section scroll-mt-20' aria-labelledby='thinking-title'>
      <div className='max-w-shell px-gutter mx-auto'>
        <Reveal>
          <SectionHeader
            id='thinking-title'
            index='03'
            title='Thinking depth'
            blurb='M3.1 Flash reasons before it answers, and it cannot be told not to. What you control is how long it thinks — and that choice moves the score, the cost and the latency together.'
          />
        </Reveal>

        <div className='grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start gap-7 max-[960px]:grid-cols-1 max-[960px]:gap-6'>
          <Reveal>
            <div className='flex flex-col gap-4'>
              <fieldset className='m-0 border-0 p-0'>
                <legend className='text-ink-3 pb-3 text-xs'>Thinking depth</legend>
                <RadioGroup
                  name='mm-effort'
                  value={effort}
                  onChange={(event) => {
                    const next = EFFORTS.find((entry) => entry.id === event.target.value);
                    if (next) actions.setEffort(next.id);
                  }}
                  align='horizontal'
                  overrides={{
                    RadioGroupRoot: {
                      style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
                    },
                  }}>
                  {EFFORTS.map((entry) => (
                    <Radio
                      key={entry.id}
                      value={entry.id}
                      checked={effort === entry.id}
                      overrides={{
                        Root: {
                          style: ({ $checked }: { $checked?: boolean }) => ({
                            borderRadius: 'var(--radius-pill)',
                            border: `1px solid ${
                              $checked ? 'var(--color-brand-rose)' : 'var(--color-line)'
                            }`,
                            backgroundColor: $checked
                              ? 'color-mix(in srgb, var(--color-brand-rose) 14%, var(--color-surface))'
                              : 'var(--color-surface)',
                            color: $checked ? 'var(--color-ink)' : 'var(--color-ink-2)',
                            paddingLeft: '1rem',
                            paddingRight: '1rem',
                            paddingTop: '0.45rem',
                            paddingBottom: '0.45rem',
                            marginTop: 0,
                            marginBottom: 0,
                            transition:
                              'border-color 280ms var(--ease-out-expo), background-color 280ms var(--ease-out-expo)',
                          }),
                        },
                        Label: {
                          style: {
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: '500',
                            color: 'inherit',
                          },
                        },
                        RadioMarkOuter: { style: { display: 'none' } },
                        RadioMarkInner: { style: { backgroundColor: 'var(--color-brand-rose)' } },
                      }}>
                      {entry.label}
                    </Radio>
                  ))}
                </RadioGroup>
              </fieldset>

              <p className='text-md text-ink-2 max-w-[46ch]'>{level.note}</p>

              <div className='border-line flex gap-7 border-t pt-4'>
                <div className='flex flex-col gap-[0.2rem]'>
                  <span className='text-ink-3 text-xs'>Automation-Bench v1.0.6</span>
                  <span className='font-display text-ink flex items-baseline gap-[0.15rem] text-xl leading-none font-light tabular-nums'>
                    {level.automationBench}
                    <span className='font-body text-ink-3 text-sm'>%</span>
                  </span>
                </div>
                <div className='flex flex-col gap-[0.2rem]'>
                  <span className='text-ink-3 text-xs'>Cost per task</span>
                  <span className='font-display text-ink text-xl leading-none font-light tabular-nums'>
                    ${level.costPerTask.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className='border-line bg-surface rounded-md border p-5'>
              <div className='h-[150px]'>
                <Trace
                  bars={36}
                  seed={5}
                  intensity={intensity}
                  tone='reason'
                  strokeWidth={2.5}
                  label={`Reasoning trace at ${level.label} effort`}
                />
              </div>
              <p className='text-ink-3 mt-4 text-xs'>
                The trace is the model thinking. Its amplitude is the depth you selected.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className='mt-7 grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5'>
            <EffortCurve
              title='Automation-Bench'
              source='v1.0.6 · vendor reported'
              points={EFFORTS.map((entry) => ({ effort: entry.id, score: entry.automationBench }))}
              activeIndex={activeIndex}
            />
            <EffortCurve
              title='DeepSWE'
              source='v1.1 · leaderboard as of 2026-09-22'
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
          <div className='border-brand-coral/40 bg-brand-coral/7 mt-6 rounded-md border p-5'>
            <div className='flex items-start gap-4'>
              <span className='font-display text-brand-negative-text pt-[0.1rem] text-xl leading-none font-light tabular-nums'>
                400
              </span>
              <div>
                <h3 className='font-display text-md text-ink mb-2 font-medium'>
                  Thinking cannot be turned off
                </h3>
                <p className='text-ink-2 max-w-[62ch] text-sm'>
                  Sending{' '}
                  <code className='border-line bg-surface-2 text-ink rounded-xs border px-[0.35em] py-[0.05em] font-mono text-[0.92em]'>
                    thinking: {'{"type": "disabled"}'}
                  </code>{' '}
                  or{' '}
                  <code className='border-line bg-surface-2 text-ink rounded-xs border px-[0.35em] py-[0.05em] font-mono text-[0.92em]'>
                    effort: &quot;none&quot;
                  </code>{' '}
                  returns an error. Lower the effort level instead.
                </p>
              </div>
            </div>
            <pre
              className='border-line bg-canvas-deep text-brand-negative-text mt-4 overflow-x-auto rounded-sm border px-4 py-3 font-mono text-sm'
              aria-label='Example error response'>
              <code>{MODEL.reasoning.disableAttempt}</code>
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
