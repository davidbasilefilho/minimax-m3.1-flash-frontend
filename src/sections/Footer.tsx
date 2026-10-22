import { MmLogo } from '../components/MmLogo';
import { Trace } from '../components/Trace';
import { scrollToIdAndFocus } from '../lib/scroll';
import './footer.css';

export function Footer() {
  return (
    <footer className="mm-footer">
      <div className="mm-footer__trace" aria-hidden="true">
        <Trace bars={52} seed={41} tone="spectrum" intensity={0.45} strokeWidth={2} pulse={false} />
      </div>

      <div className="mm-shell mm-footer__inner">
        <div className="mm-footer__brand">
          <MmLogo height={26} />
          <p className="mm-footer__line">
            An unofficial design-system showcase and model dossier for MiniMax M3.1 Flash.
          </p>
        </div>

        <nav className="mm-footer__nav" aria-label="Footer">
          <ul>
            {[
              { id: 'notices', label: 'Notices' },
              { id: 'benchmarks', label: 'Benchmarks' },
              { id: 'cost', label: 'Cost' },
              { id: 'integration', label: 'Integration' },
              { id: 'system', label: 'Design system' },
            ].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToIdAndFocus(item.id);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mm-footer__legal">
          <p>
            The MiniMax name, wordmark, symbol, slogan lockup and brand imagery are the property
            of their respective rights holders and are used here for identification only, per the
            MiniMax Brand Book. This project is not affiliated with, endorsed by, or operated by
            MiniMax, and is a front-end demonstration built for design and engineering testing.
          </p>
          <p>
            Benchmark scores are vendor reported. Model weights were scheduled for release on
            2026-10-23; self-hosting requirements and licence terms were not published at launch.
            Every number on this page is static, sourced data — no API calls are made and no
            MiniMax account or API key is involved.
          </p>
          <p className="mm-footer__sources">
            Sources: minimax.io/blog/minimax-m31f · platform.minimax.io/docs · agent.minimax.io ·
            artificialanalysis.ai · llm-stats.com
          </p>
        </div>
      </div>
    </footer>
  );
}
