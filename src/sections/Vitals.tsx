import { useSelector } from '@tanstack/react-store';

import { Readout } from '../components/Readout';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { Trace } from '../components/Trace';
import { MODEL, THROUGHPUT } from '../data/model';
import { appStore } from '../store/appStore';

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

  for (let index = 0; index < MODEL.parameters.total; index += 1) {
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
      className='size-full'
      viewBox={`0 0 ${columns} ${rows}`}
      role='img'
      aria-label={`A field of ${MODEL.parameters.total} expert marks, of which ${MODEL.parameters.active} light up for any given token.`}
      preserveAspectRatio='xMidYMid meet'>
      {cells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x + 0.12}
          y={cell.y + 0.12}
          width={0.76}
          height={0.76}
          rx={0.28}
          className={cell.active ? 'fill-brand-rose opacity-100' : 'fill-line-strong opacity-55'}
        />
      ))}
    </svg>
  );
}

export function Vitals() {
  const effort = useSelector(appStore, (state) => state.effort);

  return (
    <section id='vitals' className='py-section scroll-mt-20' aria-labelledby='vitals-title'>
      <div className='max-w-shell px-gutter mx-auto'>
        <Reveal>
          <SectionHeader
            id='vitals-title'
            index='02'
            title='Vitals'
            blurb='What the model actually is, in the numbers MiniMax publishes — and what those numbers do not tell you.'
          />
        </Reveal>

        <div className='grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start gap-7 max-[960px]:grid-cols-1 max-[960px]:gap-6'>
          <Reveal>
            <div className='grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-x-5 gap-y-6'>
              <Readout
                label='Total parameters'
                value={`${MODEL.parameters.total}${MODEL.parameters.unit}`}
                unit='mixture of experts'
                note='Every expert is available to the model. Not every expert runs.'
              />
              <Readout
                label='Active parameters'
                value={`${MODEL.parameters.active}${MODEL.parameters.unit}`}
                unit='per token'
                note='The path a single token actually takes through the network.'
                tone='signal'
              />
              <Readout
                label='Context window'
                value='1M'
                unit='tokens'
                note={`${MODEL.context.pages}. Up to ${MODEL.context.maxOutputTokens.toLocaleString()} tokens of output.`}
              />
              <Readout
                label='Input modalities'
                value='3'
                unit='text, image, video'
                note='Text out. Video in is a genuine capability, not a roadmap item.'
                tone='reason'
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <figure className='border-line bg-surface m-0 rounded-md border p-5'>
              <div className='aspect-[22/20] w-full'>
                <MoeField />
              </div>
              <figcaption className='text-ink-3 mt-4 flex flex-col gap-2 text-xs'>
                <span className='inline-flex items-center gap-2'>
                  <span
                    className='bg-brand-rose inline-block size-[10px] rounded-[3px] opacity-100'
                    aria-hidden='true'
                  />
                  active on a given token
                </span>
                <span className='inline-flex items-center gap-2'>
                  <span
                    className='bg-line-strong inline-block size-[10px] rounded-[3px] opacity-55'
                    aria-hidden='true'
                  />
                  available
                </span>
                <span className='text-ink-2 mt-1 leading-[1.5]'>
                  {MODEL.parameters.total} experts, {MODEL.parameters.active} lit. Sparse activation
                  is the reason the model is affordable to run.
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className='border-line mt-7 grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-6 border-t pt-6 max-[860px]:grid-cols-1'>
            <div>
              <h3 className='font-display text-ink mb-2 text-lg font-normal'>
                Against the previous generation
              </h3>
              <p className='font-editorial text-ink-2 max-w-[68ch]'>
                {MODEL.predecessor.difference}
              </p>
            </div>
            <div className='h-[84px]'>
              <Trace bars={28} seed={23} tone='reason' intensity={0.6} strokeWidth={2} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className='border-line mt-7 border-t pt-6'>
            <h3 className='font-display text-ink mb-2 text-lg font-normal'>
              Speed, latency and verbosity
            </h3>
            <div className='mt-5 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-x-5 gap-y-6'>
              {THROUGHPUT.map((item) => (
                <Readout
                  key={item.id}
                  label={item.label}
                  value={item.value}
                  unit={item.unit}
                  note={item.detail}
                  source={item.source}
                  size='sm'
                  tone={item.source === 'measured' ? 'throughput' : 'ink'}
                />
              ))}
            </div>
          </div>
        </Reveal>

        <p className='sr-only' aria-live='polite'>
          Current thinking depth: {effort}.
        </p>
      </div>
    </section>
  );
}
