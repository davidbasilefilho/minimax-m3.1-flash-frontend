import { useSelector } from '@tanstack/react-store';

import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';
import { Readout } from '../components/Readout';
import { Trace } from '../components/Trace';
import { MODEL, THROUGHPUT } from '../data/model';
import { appStore } from '../store/appStore';
import './vitals.css';

const TOTAL = MODEL.parameters.total;
const ACTIVE = MODEL.parameters.active;

/**
 * The mixture-of-experts field.
 *
 * One mark per billion parameters — 428 of them. The active subset, 23 of
 * them, is lit. The ratio is the whole shape of the model, so it is worth
 * showing rather than stating.
 */
function MoeField() {
  const columns = 22;
  const rows = 20;
  const cells: { x: number; y: number; active: boolean }[] = [];

  for (let index = 0; index < TOTAL; index += 1) {
    if (index >= columns * rows) break;
    cells.push({
      x: index % columns,
      y: Math.floor(index / columns),
      // Every 19th expert is on the active path for a given token.
      active: index % 19 === 0,
    });
  }

  return (
    <svg
      className="mm-vitals__field"
      viewBox={`0 0 ${columns} ${rows}`}
      role="img"
      aria-label={`A field of ${TOTAL} expert marks, of which ${ACTIVE} light up for any given token.`}
      preserveAspectRatio="xMidYMid meet"
    >
      {cells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x + 0.12}
          y={cell.y + 0.12}
          width={0.76}
          height={0.76}
          rx={0.28}
          className={cell.active ? 'mm-vitals__cell is-active' : 'mm-vitals__cell'}
        />
      ))}
    </svg>
  );
}

export function Vitals() {
  const effort = useSelector(appStore, (state) => state.effort);

  return (
    <section id="vitals" className="mm-section" aria-labelledby="vitals-title">
      <div className="mm-shell">
        <Reveal>
          <SectionHeader
            id="vitals-title"
            index="02"
            title="Vitals"
            blurb="What the model actually is, in the numbers MiniMax publishes — and what those numbers do not tell you."
          />
        </Reveal>

        <div className="mm-section__split">
          <Reveal>
            <div className="mm-vitals__readouts">
              <Readout
                label="Total parameters"
                value={`${TOTAL}${MODEL.parameters.unit}`}
                unit="mixture of experts"
                note="Every expert is available to the model. Not every expert runs."
              />
              <Readout
                label="Active parameters"
                value={`${ACTIVE}${MODEL.parameters.unit}`}
                unit="per token"
                note="The path a single token actually takes through the network."
                tone="signal"
              />
              <Readout
                label="Context window"
                value="1M"
                unit="tokens"
                note={`${MODEL.context.pages}. Up to ${MODEL.context.maxOutputTokens.toLocaleString()} tokens of output.`}
              />
              <Readout
                label="Input modalities"
                value="3"
                unit="text, image, video"
                note="Text out. Video in is a genuine capability, not a roadmap item."
                tone="reason"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <figure className="mm-vitals__figure">
              <div className="mm-vitals__field-wrap">
                <MoeField />
              </div>
              <figcaption className="mm-vitals__caption">
                <span className="mm-vitals__caption-key">
                  <span className="mm-vitals__swatch is-active" aria-hidden="true" />
                  active on a given token
                </span>
                <span className="mm-vitals__caption-key">
                  <span className="mm-vitals__swatch" aria-hidden="true" />
                  available
                </span>
                <span className="mm-vitals__caption-note">
                  {TOTAL} experts, {ACTIVE} lit. Sparse activation is the reason the model is
                  affordable to run.
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mm-vitals__predecessor">
            <div className="mm-vitals__predecessor-text">
              <h3 className="mm-vitals__predecessor-title">Against the previous generation</h3>
              <p className="mm-editorial">{MODEL.predecessor.difference}</p>
            </div>
            <div className="mm-vitals__predecessor-trace">
              <Trace bars={28} seed={23} tone="reason" intensity={0.6} strokeWidth={2} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mm-vitals__throughput">
            <h3 className="mm-vitals__subhead">Speed, latency and verbosity</h3>
            <div className="mm-vitals__throughput-grid">
              {THROUGHPUT.map((item) => (
                <Readout
                  key={item.id}
                  label={item.label}
                  value={item.value}
                  unit={item.unit}
                  note={item.detail}
                  source={item.source}
                  size="sm"
                  tone={item.source === 'measured' ? 'throughput' : 'ink'}
                />
              ))}
            </div>
          </div>
        </Reveal>

        <p className="mm-visually-hidden" aria-live="polite">
          Current thinking depth: {effort}.
        </p>
      </div>
    </section>
  );
}
