import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';
import { Trace } from '../components/Trace';
import { MmLogo } from '../components/MmLogo';
import { Slogan } from '../components/Slogan';
import './designSystem.css';

const BRAND_HUES = [
  { name: 'Rose', hex: '#FF3763', role: 'primary' },
  { name: 'Coral', hex: '#FF6452', role: 'negative' },
  { name: 'Orange', hex: '#FF7038', role: 'warning' },
  { name: 'Violet', hex: '#7A27FF', role: 'accent' },
  { name: 'Lilac', hex: '#A36AFF', role: 'accent light' },
  { name: 'Azure', hex: '#1BA4FF', role: 'throughput' },
  { name: 'Cyan', hex: '#38CDFF', role: 'positive' },
  { name: 'Deep red', hex: '#9A0010', role: 'negative shade' },
] as const;

const GRADIENTS = [
  { id: 'signal', name: 'g-signal', use: 'The logo gradient. Rose to orange, always left to right.' },
  { id: 'reason', name: 'g-reason', use: 'Reasoning depth. Violet to lilac.' },
  { id: 'throughput', name: 'g-throughput', use: 'Speed and cost. Azure to cyan.' },
  { id: 'spectrum', name: 'g-spectrum', use: 'The data scale. A score’s position becomes its colour.' },
] as const;

const COMPONENTS = [
  { name: 'Trace', use: 'The mark redrawn as a live monoline. Hero, spine, divider, loader.' },
  { name: 'Graticule', use: 'Scope-screen backdrop. Structure, not decoration.' },
  { name: 'SpectralBar', use: 'A score on the brand scale, with a ruler showing where it sits.' },
  { name: 'CostBeam', use: 'Input, cached input and output as one proportional beam.' },
  { name: 'Readout', use: 'Label, value, unit, and whether the number is vendor or measured.' },
  { name: 'ChipRadio', use: 'Single-select filters, built on Base Web radio semantics.' },
  { name: 'Notice', use: 'Branded notice strips, on Base Web notifications.' },
  { name: 'Masthead', use: 'Sticky header with a scroll-progress spine and theme controls.' },
] as const;

const MOTION = [
  { token: '--mm-ease-out-expo', value: 'cubic-bezier(.16, 1, .3, 1)', use: 'entrances' },
  { token: '--mm-ease-in-out-quint', value: 'cubic-bezier(.83, 0, .17, 1)', use: 'morphs' },
  { token: '--mm-ease-signal', value: 'cubic-bezier(.34, 1.56, .64, 1)', use: 'overshoot' },
  { token: '--mm-dur-1 / 2 / 3 / 4', value: '140 / 280 / 620 / 1200 ms', use: 'micro to hero' },
] as const;

export function DesignSystem() {
  return (
    <section id="system" className="mm-section mm-section--tinted" aria-labelledby="system-title">
      <div className="mm-shell">
        <Reveal>
          <SectionHeader
            id="system-title"
            index="09"
            title="Design system"
            blurb="SIGNAL — a small system built from the MiniMax brand book rather than from a template. The mark is a monoline oscilloscope trace, so the trace became the grammar of the interface."
          />
        </Reveal>

        <Reveal>
          <div className="mm-ds__rules">
            {[
              {
                title: 'One stroke weight',
                body: 'Two weights exist: a 1px hairline for structure and a 2px signal weight for anything live. Nothing in between.',
              },
              {
                title: 'Rounded, always',
                body: 'Round caps, round elbows, pill controls, 14px panels. No sharp corners anywhere except inside the wordmark.',
              },
              {
                title: 'Continuous, not separated',
                body: 'Sections are joined by a drawn trace rather than by empty space or a rule.',
              },
              {
                title: 'The gradient carries data',
                body: 'A score’s colour is its position on the brand scale. The gradient is a reading, never a wash.',
              },
            ].map((rule) => (
              <div key={rule.title} className="mm-ds__rule">
                <h3 className="mm-ds__rule-title">{rule.title}</h3>
                <p className="mm-ds__rule-body">{rule.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mm-ds__block">
            <h3 className="mm-ds__block-title">Colour</h3>
            <p className="mm-ds__block-lede">
              Eight brand hues, used verbatim from the MiniMax Brand Book. Text-safe variants
              exist per theme so contrast holds in both.
            </p>
            <ul className="mm-ds__hues">
              {BRAND_HUES.map((hue) => (
                <li key={hue.hex} className="mm-ds__hue">
                  <span className="mm-ds__swatch" style={{ background: hue.hex }} aria-hidden="true" />
                  <span className="mm-ds__hue-name">{hue.name}</span>
                  <span className="mm-ds__hue-hex mm-num">{hue.hex}</span>
                  <span className="mm-ds__hue-role">{hue.role}</span>
                </li>
              ))}
            </ul>

            <ul className="mm-ds__gradients">
              {GRADIENTS.map((gradient) => (
                <li key={gradient.id} className="mm-ds__gradient">
                  <span
                    className="mm-ds__gradient-bar"
                    style={{ background: `var(--mm-grad-${gradient.id})` }}
                    aria-hidden="true"
                  />
                  <span className="mm-ds__gradient-name mm-mono">{gradient.name}</span>
                  <span className="mm-ds__gradient-use">{gradient.use}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mm-ds__block">
            <h3 className="mm-ds__block-title">Type</h3>
            <p className="mm-ds__block-lede">
              The brand book’s own three families, self-hosted. Outfit for display, DM Sans for
              body and interface, Libre Baskerville for the editorial voice.
            </p>
            <div className="mm-ds__type">
              <div className="mm-ds__type-row">
                <span className="mm-ds__type-meta">Outfit · display</span>
                <p className="mm-ds__specimen mm-ds__specimen--display">M3.1 Flash</p>
              </div>
              <div className="mm-ds__type-row">
                <span className="mm-ds__type-meta">DM Sans · body</span>
                <p className="mm-ds__specimen mm-ds__specimen--body">
                  Reasoning arrives on its own field. Read it there, not by parsing the answer.
                </p>
              </div>
              <div className="mm-ds__type-row">
                <span className="mm-ds__type-meta">Libre Baskerville · editorial</span>
                <p className="mm-ds__specimen mm-ds__specimen--editorial">
                  Thinking cannot be turned off. Lower the effort level instead of trying to
                  disable it.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mm-ds__block">
            <h3 className="mm-ds__block-title">Motion</h3>
            <ul className="mm-ds__motion">
              {MOTION.map((entry) => (
                <li key={entry.token} className="mm-ds__motion-row">
                  <span className="mm-ds__motion-token mm-mono">{entry.token}</span>
                  <span className="mm-ds__motion-value mm-mono">{entry.value}</span>
                  <span className="mm-ds__motion-use">{entry.use}</span>
                </li>
              ))}
            </ul>
            <p className="mm-ds__block-lede">
              One orchestrated moment on load, then stillness until you act. Every duration
              collapses to 1ms under <code>prefers-reduced-motion</code>, and the masthead switch
              does the same thing on demand.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mm-ds__block">
            <h3 className="mm-ds__block-title">Components</h3>
            <ul className="mm-ds__components">
              {COMPONENTS.map((component) => (
                <li key={component.name} className="mm-ds__component">
                  <span className="mm-ds__component-name">{component.name}</span>
                  <span className="mm-ds__component-use">{component.use}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mm-ds__block">
            <h3 className="mm-ds__block-title">Logo usage</h3>
            <div className="mm-ds__logo">
              <div className="mm-ds__logo-plate">
                <MmLogo height={30} />
              </div>
              <div className="mm-ds__logo-slogan">
                <Slogan />
              </div>
            </div>
            <ul className="mm-ds__logo-rules">
              <li>The official lockup is used unmodified. It is never filtered, recoloured, cropped or given a shadow.</li>
              <li>The wordmark is black, so on a dark surface it rests on a solid white plate rather than being inverted.</li>
              <li>The slogan follows the brand construction: three lines, Libre Baskerville Bold, the stylised w and the filled disc.</li>
              <li>Brand assets remain the property of their rights holders. See the notices section for the full terms.</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="mm-ds__trace-demo">
            <Trace bars={44} seed={31} tone="spectrum" intensity={0.8} strokeWidth={2.5} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
