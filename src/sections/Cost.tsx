import { useSelector } from '@tanstack/react-store';
import { Slider } from 'baseui/slider';

import { CostBeam } from '../components/CostBeam';
import { Readout } from '../components/Readout';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import {
  ALE_RUN,
  computeCost,
  computePredecessorCost,
  formatTokens,
  formatUsd,
  PREDECESSOR_PRICING,
  PRICING,
} from '../data/pricing';
import { actions, appStore } from '../store/appStore';

const SLIDER_OVERRIDES = {
  Root: { style: { width: '100%' } },
  Track: { style: { backgroundColor: 'var(--color-surface-3)' } },
  // `background`, not `backgroundColor` — Styletron renders atomically and
  // mixing the shorthand with the longhand produces a broken track.
  InnerTrack: { style: { background: 'var(--color-brand-rose)' } },
  Thumb: {
    style: {
      backgroundColor: 'var(--color-brand-rose)',
      borderColor: 'var(--color-canvas)',
      borderWidth: '2px',
    },
  },
  Tick: { style: { fontFamily: 'var(--font-body)', fontSize: '10px' } },
} as const;

type TokenFieldProps = {
  label: string;
  hint: string;
  value: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
};

function TokenField({ label, hint, value, max, step, onChange, format }: TokenFieldProps) {
  return (
    <div>
      <div className='mb-2 flex items-baseline justify-between gap-3'>
        <span className='text-ink-2 text-sm'>{label}</span>
        <output className='font-display text-ink text-lg font-normal tabular-nums'>
          {format(value)}
        </output>
      </div>
      <Slider
        value={[value]}
        min={0}
        max={max}
        step={step}
        onChange={({ value: next }) => onChange(next[0] ?? 0)}
        overrides={SLIDER_OVERRIDES}
        aria-label={label}
      />
      <p className='text-ink-3 mt-2 text-xs'>{hint}</p>
    </div>
  );
}

export function Cost() {
  const inputTokens = useSelector(appStore, (state) => state.inputTokens);
  const cachedInputTokens = useSelector(appStore, (state) => state.cachedInputTokens);
  const outputTokens = useSelector(appStore, (state) => state.outputTokens);

  const cost = computeCost({ inputTokens, cachedInputTokens, outputTokens });
  const previous = computePredecessorCost({ inputTokens, cachedInputTokens, outputTokens });
  const saving = previous > 0 ? (1 - cost.total / previous) * 100 : 0;

  const segments = [
    {
      id: 'input',
      label: 'Input',
      value: cost.input,
      share: cost.total > 0 ? cost.input / cost.total : 0,
      colour: 'var(--color-brand-rose)',
    },
    {
      id: 'cached',
      label: 'Cached input',
      value: cost.cached,
      share: cost.total > 0 ? cost.cached / cost.total : 0,
      colour: 'var(--color-brand-cyan)',
    },
    {
      id: 'output',
      label: 'Output',
      value: cost.output,
      share: cost.total > 0 ? cost.output / cost.total : 0,
      colour: 'var(--color-brand-orange)',
    },
  ];

  return (
    <section id='cost' className='py-section scroll-mt-20' aria-labelledby='cost-title'>
      <div className='max-w-shell px-gutter mx-auto'>
        <Reveal>
          <SectionHeader
            id='cost-title'
            index='05'
            title='Cost'
            blurb='Flat rates, no long-context surcharge, and a 90% discount on a reused prompt prefix. Move the sliders to price a request of your own.'
          />
        </Reveal>

        <div className='grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start gap-7 max-[960px]:grid-cols-1 max-[960px]:gap-6'>
          <Reveal>
            <div className='border-line bg-surface rounded-md border'>
              <div className='border-line flex flex-wrap items-baseline justify-between gap-4 border-b px-5 py-4'>
                <span className='font-display text-md text-ink'>Price a request</span>
                <span className='text-ink-3 text-xs tabular-nums'>
                  ${PRICING.input} in · ${PRICING.output} out · ${PRICING.cachedInput} cached
                </span>
              </div>

              <div className='flex flex-col gap-5 p-5'>
                <TokenField
                  label='input'
                  hint='Fresh prompt tokens. Billed at $0.15 per million.'
                  value={inputTokens}
                  max={200_000}
                  step={1_000}
                  onChange={(value) => actions.setTokens('inputTokens', value)}
                  format={formatTokens}
                />
                <TokenField
                  label='cached'
                  hint='Reused prompt prefix. Billed at $0.015 per million — a 90% discount.'
                  value={cachedInputTokens}
                  max={200_000}
                  step={1_000}
                  onChange={(value) => actions.setTokens('cachedInputTokens', value)}
                  format={formatTokens}
                />
                <TokenField
                  label='output'
                  hint='Generated tokens, including reasoning tokens. Billed at $0.60 per million.'
                  value={outputTokens}
                  max={100_000}
                  step={100}
                  onChange={(value) => actions.setTokens('outputTokens', value)}
                  format={formatTokens}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className='border-line bg-surface flex flex-col gap-5 rounded-md border p-5'>
              <div className='flex flex-col gap-[0.2rem]' aria-live='polite'>
                <span className='text-ink-3 text-xs'>This request costs</span>
                <span className='font-display text-ink text-[clamp(2.6rem,6vw,3.6rem)] leading-none font-extralight tracking-[-0.03em] tabular-nums'>
                  {formatUsd(cost.total)}
                </span>
                <span className='text-brand-rose-text mt-1 text-sm'>
                  {formatUsd(previous)} on {PREDECESSOR_PRICING.id} — {saving.toFixed(0)}% less
                </span>
              </div>

              <CostBeam segments={segments} total={cost.total} />

              <p className='border-line text-ink-3 border-t pt-4 text-xs'>
                Computed locally in your browser from the published flat rates. Nothing is sent
                anywhere and no MiniMax account is involved.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.14}>
          <div className='border-line mt-7 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-5 gap-y-6 border-t pt-6'>
            <Readout
              label='Blended rate'
              value='$0.10'
              unit='per 1M tokens'
              note='At a 7:2:1 blend of cache hit, input and output.'
              source='measured'
              tone='throughput'
            />
            <Readout
              label='Cache discount'
              value='90%'
              unit='off fresh input'
              note='Only applies to a reused prompt prefix.'
            />
            <Readout
              label='A full ALE run'
              value={formatUsd(ALE_RUN.totalCostUsd, 0)}
              unit={`${ALE_RUN.tasks} tasks`}
              note={ALE_RUN.note}
              tone='signal'
            />
            <Readout
              label='Long-context surcharge'
              value='None'
              unit='at 1M tokens'
              note={`${PREDECESSOR_PRICING.id} doubles above 512K input tokens. M3.1 Flash does not.`}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
