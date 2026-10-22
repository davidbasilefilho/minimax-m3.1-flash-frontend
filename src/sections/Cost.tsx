import { Slider } from 'baseui/slider';
import { useSelector } from '@tanstack/react-store';

import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';
import { CostBeam } from '../components/CostBeam';
import { Readout } from '../components/Readout';
import { ALE_RUN, computeCost, computePredecessorCost, formatTokens, formatUsd, PRICING, PREDECESSOR_PRICING } from '../data/pricing';
import { appStore, actions } from '../store/appStore';
import './cost.css';

const SLIDER_OVERRIDES = {
  Root: { style: { width: '100%' } },
  Track: { style: { backgroundColor: 'var(--mm-surface-3)' } },
  // `background`, not `backgroundColor` — Styletron renders atomically and
  // mixing the shorthand with the longhand produces a broken track.
  InnerTrack: { style: { background: 'var(--mm-rose)' } },
  Thumb: {
    style: {
      backgroundColor: 'var(--mm-rose)',
      borderColor: 'var(--mm-canvas)',
      borderWidth: '2px',
    },
  },
  Tick: { style: { fontFamily: 'var(--mm-font-body)', fontSize: '10px' } },
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
    <div className="mm-cost__field">
      <div className="mm-cost__field-head">
        <span className="mm-cost__field-label">{label}</span>
        <output className="mm-cost__field-value mm-num">{format(value)}</output>
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
      <p className="mm-cost__field-hint">{hint}</p>
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
      colour: 'var(--mm-rose)',
    },
    {
      id: 'cached',
      label: 'Cached input',
      value: cost.cached,
      share: cost.total > 0 ? cost.cached / cost.total : 0,
      colour: 'var(--mm-cyan)',
    },
    {
      id: 'output',
      label: 'Output',
      value: cost.output,
      share: cost.total > 0 ? cost.output / cost.total : 0,
      colour: 'var(--mm-orange)',
    },
  ];

  return (
    <section id="cost" className="mm-section" aria-labelledby="cost-title">
      <div className="mm-shell">
        <Reveal>
          <SectionHeader
            id="cost-title"
            index="05"
            title="Cost"
            blurb="Flat rates, no long-context surcharge, and a 90% discount on a reused prompt prefix. Move the sliders to price a request of your own."
          />
        </Reveal>

        <div className="mm-section__split">
          <Reveal>
            <div className="mm-panel">
              <div className="mm-panel__head">
                <span className="mm-panel__title">Price a request</span>
                <span className="mm-cost__rates">
                  ${PRICING.input} in · ${PRICING.output} out · ${PRICING.cachedInput} cached
                </span>
              </div>

              <div className="mm-panel__body mm-cost__fields">
                <TokenField
                  label="input"
                  hint="Fresh prompt tokens. Billed at $0.15 per million."
                  value={inputTokens}
                  max={200_000}
                  step={1_000}
                  onChange={(value) => actions.setTokens('inputTokens', value)}
                  format={formatTokens}
                />
                <TokenField
                  label="cached"
                  hint="Reused prompt prefix. Billed at $0.015 per million — a 90% discount."
                  value={cachedInputTokens}
                  max={200_000}
                  step={1_000}
                  onChange={(value) => actions.setTokens('cachedInputTokens', value)}
                  format={formatTokens}
                />
                <TokenField
                  label="output"
                  hint="Generated tokens, including reasoning tokens. Billed at $0.60 per million."
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
            <div className="mm-cost__result">
              <div className="mm-cost__total" aria-live="polite">
                <span className="mm-cost__total-label">This request costs</span>
                <span className="mm-cost__total-value mm-num">{formatUsd(cost.total)}</span>
                <span className="mm-cost__total-compare">
                  {formatUsd(previous)} on {PREDECESSOR_PRICING.id} — {saving.toFixed(0)}% less
                </span>
              </div>

              <CostBeam segments={segments} total={cost.total} />

              <p className="mm-cost__disclaimer">
                Computed locally in your browser from the published flat rates. Nothing is sent
                anywhere and no MiniMax account is involved.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.14}>
          <div className="mm-cost__readouts">
            <Readout
              label="Blended rate"
              value="$0.10"
              unit="per 1M tokens"
              note="At a 7:2:1 blend of cache hit, input and output."
              source="measured"
              tone="throughput"
            />
            <Readout
              label="Cache discount"
              value="90%"
              unit="off fresh input"
              note="Only applies to a reused prompt prefix."
            />
            <Readout
              label="A full ALE run"
              value={formatUsd(ALE_RUN.totalCostUsd, 0)}
              unit={`${ALE_RUN.tasks} tasks`}
              note={ALE_RUN.note}
              tone="signal"
            />
            <Readout
              label="Long-context surcharge"
              value="None"
              unit="at 1M tokens"
              note={`${PREDECESSOR_PRICING.id} doubles above 512K input tokens. M3.1 Flash does not.`}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
