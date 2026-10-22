import { MmLogo } from '../components/MmLogo';
import { Trace } from '../components/Trace';
import { scrollToIdAndFocus } from '../lib/scroll';

const FOOTER_LINKS = [
  { id: 'notices', label: 'Notices' },
  { id: 'benchmarks', label: 'Benchmarks' },
  { id: 'cost', label: 'Cost' },
  { id: 'integration', label: 'Integration' },
  { id: 'system', label: 'Design system' },
] as const;

export function Footer() {
  return (
    <footer className='border-line bg-canvas-deep relative overflow-hidden border-t pt-7'>
      <div
        className='pointer-events-none absolute inset-x-0 top-0 h-[90px] [mask-image:linear-gradient(to_bottom,#000,transparent)] opacity-50'
        aria-hidden='true'>
        <Trace bars={52} seed={41} tone='spectrum' intensity={0.45} strokeWidth={2} pulse={false} />
      </div>

      <div className='max-w-shell px-gutter relative mx-auto grid grid-cols-[minmax(0,1fr)_auto] gap-x-7 gap-y-6 pb-7 max-[720px]:grid-cols-[minmax(0,1fr)]'>
        <div className='flex flex-col items-start gap-3'>
          <MmLogo height={26} />
          <p className='text-ink-2 max-w-[46ch] text-sm'>
            An unofficial design-system showcase and model dossier for MiniMax M3.1 Flash.
          </p>
        </div>

        <nav aria-label='Footer'>
          <ul className='flex flex-col gap-[0.35rem]'>
            {FOOTER_LINKS.map((item) => (
              <li key={item.id}>
                <a
                  className='text-ink-3 ease-out-expo hover:text-ink rounded-xs text-xs no-underline transition-colors duration-150 hover:underline hover:underline-offset-[3px]'
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToIdAndFocus(item.id);
                  }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className='border-line col-span-full flex max-w-[88ch] flex-col gap-3 border-t pt-5'>
          <p className='text-ink-3 text-xs leading-[1.65]'>
            The MiniMax name, wordmark, symbol, slogan lockup and brand imagery are the property of
            their respective rights holders and are used here for identification only, per the
            MiniMax Brand Book. This project is not affiliated with, endorsed by, or operated by
            MiniMax, and is a front-end demonstration built for design and engineering testing.
          </p>
          <p className='text-ink-3 text-xs leading-[1.65]'>
            Benchmark scores are vendor reported. Model weights were scheduled for release on
            2026-10-23; self-hosting requirements and licence terms were not published at launch.
            Every number on this page is static, sourced data — no API calls are made and no MiniMax
            account or API key is involved.
          </p>
          <p className='text-ink-3 font-mono text-[11px] leading-[1.65] opacity-75'>
            Sources: minimax.io/blog/minimax-m31f · platform.minimax.io/docs · agent.minimax.io ·
            artificialanalysis.ai · llm-stats.com
          </p>
        </div>
      </div>
    </footer>
  );
}
