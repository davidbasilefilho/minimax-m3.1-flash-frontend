import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';
import { Readout } from '../components/Readout';
import { THROUGHPUT } from '../data/model';
import './throughput.css';

type SpeedBar = {
  id: string;
  label: string;
  value: number;
  display: string;
  kind: 'vendor' | 'measured' | 'class';
  note: string;
};

const SPEED_BARS: SpeedBar[] = [
  {
    id: 'peak',
    label: 'Vendor peak',
    value: 200,
    display: '200+',
    kind: 'vendor',
    note: 'MiniMax states everyday output speeds can reach 200+ tokens per second.',
  },
  {
    id: 'p50',
    label: 'Vendor median',
    value: 170,
    display: '170+',
    kind: 'vendor',
    note: 'MiniMax states P50 output speed consistently reaches 170+ tokens per second.',
  },
  {
    id: 'class',
    label: 'Class median',
    value: 108.4,
    display: '108.4',
    kind: 'class',
    note: 'The median across comparable models in the same price tier.',
  },
  {
    id: 'measured',
    label: 'Measured',
    value: 92.8,
    display: '92.8',
    kind: 'measured',
    note: 'Artificial Analysis, measured on the MiniMax API. Slower than the class median.',
  },
];

const KIND_COLOUR = {
  vendor: 'var(--mm-rose)',
  measured: 'var(--mm-cyan)',
  class: 'var(--mm-ink-3)',
} as const;

export function Throughput() {
  const max = 210;

  return (
    <section id="throughput" className="mm-section" aria-labelledby="throughput-title">
      <div className="mm-shell">
        <Reveal>
          <SectionHeader
            id="throughput-title"
            index="06"
            title="Throughput"
            blurb="The vendor number and the measured number are not the same number, and the gap is large enough that a reader should see both. Time to first token, by contrast, is better than average."
          />
        </Reveal>

        <div className="mm-section__split">
          <Reveal>
            <div className="mm-speed">
              <div className="mm-speed__head">
                <h3 className="mm-speed__title">Output speed</h3>
                <span className="mm-speed__unit">tokens per second</span>
              </div>

              <ul className="mm-speed__list">
                {SPEED_BARS.map((bar) => (
                  <li key={bar.id} className="mm-speed__item">
                    <span className="mm-speed__label">{bar.label}</span>
                    <span className="mm-speed__track">
                      <span
                        className="mm-speed__fill"
                        style={{
                          width: `${(bar.value / max) * 100}%`,
                          background: KIND_COLOUR[bar.kind],
                        }}
                      />
                    </span>
                    <span className="mm-speed__value mm-num">{bar.display}</span>
                    <span className="mm-speed__note">{bar.note}</span>
                  </li>
                ))}
              </ul>

              <p className="mm-speed__caveat">
                MiniMax attributes its speed-up to more aggressive sparsity in inference, and
                reports close to three times faster online inference than M3. The independent
                measurement was taken on the MiniMax API, so it includes everything the API adds —
                which is the number a caller actually experiences.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mm-speed__readouts">
              {THROUGHPUT.filter((item) => item.id === 'ttft' || item.id === 'faster').map((item) => (
                <Readout
                  key={item.id}
                  label={item.label}
                  value={item.value}
                  unit={item.unit}
                  note={item.detail}
                  source={item.source}
                  size="md"
                  tone={item.source === 'measured' ? 'throughput' : 'ink'}
                />
              ))}

              <div className="mm-speed__latency">
                <h3 className="mm-speed__latency-title">Time to first token</h3>
                <div className="mm-speed__latency-bars">
                  <div className="mm-speed__latency-row">
                    <span className="mm-speed__latency-label">M3.1 Flash</span>
                    <span className="mm-speed__latency-track">
                      <span
                        className="mm-speed__latency-fill"
                        style={{ width: `${(1.43 / 3) * 100}%`, background: 'var(--mm-cyan)' }}
                      />
                    </span>
                    <span className="mm-speed__latency-value mm-num">1.43s</span>
                  </div>
                  <div className="mm-speed__latency-row">
                    <span className="mm-speed__latency-label">Class median</span>
                    <span className="mm-speed__latency-track">
                      <span
                        className="mm-speed__latency-fill"
                        style={{
                          width: `${(1.69 / 3) * 100}%`,
                          background: 'var(--mm-ink-3)',
                        }}
                      />
                    </span>
                    <span className="mm-speed__latency-value mm-num">1.69s</span>
                  </div>
                </div>
                <p className="mm-speed__caveat">
                  Better than the 1.69s median for the price class. Always-on reasoning still
                  sets a floor: the thinking time is counted here.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
