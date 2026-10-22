import { MmLogo } from '../components/MmLogo';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { Slogan } from '../components/Slogan';
import { Trace } from '../components/Trace';

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
  {
    id: 'signal',
    name: 'g-signal',
    use: 'The logo gradient. Rose to orange, always left to right.',
  },
  { id: 'reason', name: 'g-reason', use: 'Reasoning depth. Violet to lilac.' },
  { id: 'throughput', name: 'g-throughput', use: 'Speed and cost. Azure to cyan.' },
  {
    id: 'spectrum',
    name: 'g-spectrum',
    use: 'The data scale. A score’s position becomes its colour.',
  },
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
  { token: '--ease-out-expo', value: 'cubic-bezier(.16, 1, .3, 1)', use: 'entrances' },
  { token: '--ease-in-out-quint', value: 'cubic-bezier(.83, 0, .17, 1)', use: 'morphs' },
  { token: '--ease-signal', value: 'cubic-bezier(.34, 1.56, .64, 1)', use: 'overshoot' },
  { token: 'durations', value: '140 / 280 / 620 / 1200 ms', use: 'micro to hero' },
] as const;

const RULES = [
  {
    title: 'One stroke weight',
    body: 'Two weights exist: a 1px hairline for structure and a 2px signal weight for anything live. Nothing between.',
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
] as const;

export function DesignSystem() {
  return (
    <section
      id='system'
      className='mm-section--tinted py-section scroll-mt-20'
      aria-labelledby='system-title'>
      <div className='max-w-shell px-gutter mx-auto'>
        <Reveal>
          <SectionHeader
            id='system-title'
            index='09'
            title='Design system'
            blurb='SIGNAL — a small system built from the MiniMax brand book rather than from a template. The mark is a monoline oscilloscope trace, so the trace became the grammar of the interface.'
          />
        </Reveal>

        <Reveal>
          <div className='mb-7 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4'>
            {RULES.map((rule) => (
              <div key={rule.title} className='border-line bg-surface rounded-md border p-4'>
                <h3 className='font-display text-md text-ink mb-2 font-medium'>{rule.title}</h3>
                <p className='text-ink-2 text-sm leading-[1.55]'>{rule.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className='border-line mt-6 border-t pt-6'>
            <h3 className='font-display text-ink mb-2 text-lg font-normal'>Colour</h3>
            <p className='text-ink-2 max-w-[70ch] text-sm leading-[1.6]'>
              Eight brand hues, used verbatim from the MiniMax Brand Book. Text-safe variants exist
              per theme so contrast holds in both.
            </p>
            <ul className='mt-5 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3'>
              {BRAND_HUES.map((hue) => (
                <li
                  key={hue.hex}
                  className='border-line bg-surface grid grid-cols-[34px_minmax(0,1fr)] grid-rows-[auto_auto] items-center gap-x-3 rounded-sm border p-3'>
                  <span
                    className='row-span-2 size-[34px] rounded-lg shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]'
                    style={{ background: hue.hex }}
                    aria-hidden='true'
                  />
                  <span className='text-ink text-sm font-medium'>{hue.name}</span>
                  <span className='font-display text-ink-3 col-start-2 text-[11px] tabular-nums'>
                    {hue.hex}
                  </span>
                </li>
              ))}
            </ul>

            <ul className='mt-5 flex flex-col gap-3'>
              {GRADIENTS.map((gradient) => (
                <li
                  key={gradient.id}
                  className='grid grid-cols-[180px_140px_minmax(0,1fr)] items-center gap-4 max-[780px]:grid-cols-[minmax(0,1fr)] max-[780px]:gap-2'>
                  <span
                    className='rounded-pill h-[22px]'
                    style={{ background: `var(--gradient-${gradient.id})` }}
                    aria-hidden='true'
                  />
                  <span className='text-ink-2 font-mono text-xs'>{gradient.name}</span>
                  <span className='text-ink-3 text-xs'>{gradient.use}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className='border-line mt-6 border-t pt-6'>
            <h3 className='font-display text-ink mb-2 text-lg font-normal'>Type</h3>
            <p className='text-ink-2 max-w-[70ch] text-sm leading-[1.6]'>
              The brand book’s own three families, self-hosted. Outfit for display, DM Sans for body
              and interface, Libre Baskerville for the editorial voice.
            </p>
            <div className='mt-5 flex flex-col gap-5'>
              <div className='border-line grid grid-cols-[190px_minmax(0,1fr)] items-baseline gap-5 border-b pb-4 max-[780px]:grid-cols-[minmax(0,1fr)] max-[780px]:gap-2'>
                <span className='text-ink-3 text-xs'>Outfit · display</span>
                <p className='font-display text-ink m-0 text-[clamp(1.8rem,4vw,2.6rem)] leading-none font-extralight tracking-[-0.03em]'>
                  M3.1 Flash
                </p>
              </div>
              <div className='border-line grid grid-cols-[190px_minmax(0,1fr)] items-baseline gap-5 border-b pb-4 max-[780px]:grid-cols-[minmax(0,1fr)] max-[780px]:gap-2'>
                <span className='text-ink-3 text-xs'>DM Sans · body</span>
                <p className='text-md text-ink-2 m-0 max-w-[62ch] leading-[1.6]'>
                  Reasoning arrives on its own field. Read it there, not by parsing the answer.
                </p>
              </div>
              <div className='border-line grid grid-cols-[190px_minmax(0,1fr)] items-baseline gap-5 border-b pb-4 max-[780px]:grid-cols-[minmax(0,1fr)] max-[780px]:gap-2'>
                <span className='text-ink-3 text-xs'>Libre Baskerville · editorial</span>
                <p className='font-editorial text-ink m-0 max-w-[60ch] text-lg leading-[1.6]'>
                  Thinking cannot be turned off. Lower the effort level instead of trying to disable
                  it.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className='border-line mt-6 border-t pt-6'>
            <h3 className='font-display text-ink mb-2 text-lg font-normal'>Motion</h3>
            <ul className='my-4 flex flex-col gap-2'>
              {MOTION.map((entry) => (
                <li
                  key={entry.token}
                  className='border-line grid grid-cols-[200px_240px_minmax(0,1fr)] items-baseline gap-4 border-b pb-2 max-[780px]:grid-cols-[minmax(0,1fr)] max-[780px]:gap-2'>
                  <span className='text-ink font-mono text-xs'>{entry.token}</span>
                  <span className='text-ink-2 font-mono text-xs'>{entry.value}</span>
                  <span className='text-ink-3 text-xs'>{entry.use}</span>
                </li>
              ))}
            </ul>
            <p className='text-ink-2 max-w-[70ch] text-sm leading-[1.6]'>
              One orchestrated moment on load, then stillness until you act. Every duration
              collapses to 1ms under{' '}
              <code className='bg-surface-2 rounded-xs px-[0.3em] py-[0.05em] font-mono text-[0.92em]'>
                prefers-reduced-motion
              </code>
              , and the masthead switch does the same thing on demand.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className='border-line mt-6 border-t pt-6'>
            <h3 className='font-display text-ink mb-2 text-lg font-normal'>Components</h3>
            <ul className='mt-4 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-2'>
              {COMPONENTS.map((component) => (
                <li
                  key={component.name}
                  className='border-line flex flex-col gap-[0.15rem] border-b py-3'>
                  <span className='font-display text-ink text-sm font-medium'>
                    {component.name}
                  </span>
                  <span className='text-ink-3 text-xs'>{component.use}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <div className='border-line mt-6 border-t pt-6'>
            <h3 className='font-display text-ink mb-2 text-lg font-normal'>Logo usage</h3>
            <div className='my-5 flex flex-wrap items-center gap-7'>
              <div className='border-line bg-surface rounded-md border p-4'>
                <MmLogo height={30} />
              </div>
              <div className='border-line bg-surface rounded-md border p-4'>
                <Slogan />
              </div>
            </div>
            <ul className='flex max-w-[78ch] flex-col gap-2'>
              {[
                'The official lockup is used unmodified. It is never filtered, recoloured, cropped or given a shadow.',
                'The wordmark is black, so on a dark surface it rests on a solid white plate rather than being inverted.',
                'The slogan follows the brand construction: three lines, Libre Baskerville Bold, the stylised w and the filled disc.',
                'Brand assets remain the property of their rights holders. See the notices section for the full terms.',
              ].map((rule) => (
                <li
                  key={rule}
                  className='text-ink-2 before:bg-brand-rose relative pl-4 text-sm leading-[1.6] before:absolute before:top-[0.65em] before:left-0 before:size-1.5 before:rounded-full'>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <div className='mt-7 h-[120px]'>
            <Trace bars={44} seed={31} tone='spectrum' intensity={0.8} strokeWidth={2.5} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
