import { Readout } from '../components/Readout';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { THROUGHPUT } from '../data/model';

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
  vendor: 'var(--color-brand-rose)',
  measured: 'var(--color-brand-cyan)',
  class: 'var(--color-ink-3)',
} as const;

export function Throughput() {
  const max = 210;

  return (
    <section id='throughput' className='py-section scroll-mt-20' aria-labelledby='throughput-title'>
      <div className='max-w-shell px-gutter mx-auto'>
        <Reveal>
          <SectionHeader
            id='throughput-title'
            index='06'
            title='Throughput'
            blurb='The vendor number and the measured number are not the same number, and the gap is large enough that a reader should see both. Time to first token, by contrast, is better than average.'
          />
        </Reveal>

        <div className='grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start gap-7 max-[960px]:grid-cols-1 max-[960px]:gap-6'>
          <Reveal>
            <div className='border-line bg-surface rounded-md border p-5'>
              <div className='mb-5 flex items-baseline justify-between gap-3'>
                <h3 className='font-display text-ink text-lg font-normal'>Output speed</h3>
                <span className='text-ink-3 text-xs'>tokens per second</span>
              </div>

              <ul className='flex flex-col gap-4'>
                {SPEED_BARS.map((bar) => (
                  <li
                    key={bar.id}
                    className='row-gap-[0.25rem] grid grid-cols-[108px_minmax(0,1fr)_64px] items-center gap-3 max-[640px]:grid-cols-[92px_minmax(0,1fr)_56px]'>
                    <span className='text-ink-2 text-sm'>{bar.label}</span>
                    <span className='rounded-pill bg-surface-2 h-[10px] overflow-hidden'>
                      <span
                        className='rounded-pill block h-full'
                        style={{
                          width: `${(bar.value / max) * 100}%`,
                          background: KIND_COLOUR[bar.kind],
                        }}
                      />
                    </span>
                    <span className='font-display text-md text-ink text-right tabular-nums'>
                      {bar.display}
                    </span>
                    <span className='text-ink-3 col-span-2 col-start-2 text-xs leading-[1.5] max-[640px]:col-span-3 max-[640px]:col-start-1'>
                      {bar.note}
                    </span>
                  </li>
                ))}
              </ul>

              <p className='border-line text-ink-3 mt-5 border-t pt-4 text-xs leading-[1.6]'>
                MiniMax attributes its speed-up to more aggressive sparsity in inference, and
                reports close to three times faster online inference than M3. The independent
                measurement was taken on the MiniMax API, so it includes everything the API adds —
                which is the number a caller actually experiences.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className='flex flex-col gap-6'>
              {THROUGHPUT.filter((item) => item.id === 'ttft' || item.id === 'faster').map(
                (item) => (
                  <Readout
                    key={item.id}
                    label={item.label}
                    value={item.value}
                    unit={item.unit}
                    note={item.detail}
                    source={item.source}
                    size='md'
                    tone={item.source === 'measured' ? 'throughput' : 'ink'}
                  />
                ),
              )}

              <div className='border-line bg-surface rounded-md border p-5'>
                <h3 className='font-display text-md text-ink mb-4'>Time to first token</h3>
                <div className='flex flex-col gap-3'>
                  <div className='grid grid-cols-[110px_minmax(0,1fr)_56px] items-center gap-3'>
                    <span className='text-ink-2 text-sm'>M3.1 Flash</span>
                    <span className='rounded-pill bg-surface-2 h-[10px] overflow-hidden'>
                      <span
                        className='rounded-pill bg-brand-cyan block h-full'
                        style={{ width: `${(1.43 / 3) * 100}%` }}
                      />
                    </span>
                    <span className='font-display text-ink text-right text-sm tabular-nums'>
                      1.43s
                    </span>
                  </div>
                  <div className='grid grid-cols-[110px_minmax(0,1fr)_56px] items-center gap-3'>
                    <span className='text-ink-2 text-sm'>Class median</span>
                    <span className='rounded-pill bg-surface-2 h-[10px] overflow-hidden'>
                      <span
                        className='rounded-pill bg-ink-3 block h-full'
                        style={{ width: `${(1.69 / 3) * 100}%` }}
                      />
                    </span>
                    <span className='font-display text-ink text-right text-sm tabular-nums'>
                      1.69s
                    </span>
                  </div>
                </div>
                <p className='border-line text-ink-3 mt-5 border-t pt-4 text-xs leading-[1.6]'>
                  Better than the 1.69s median for the price class. Always-on reasoning still sets a
                  floor: the thinking time is counted here.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
