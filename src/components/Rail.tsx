import { useSelector } from '@tanstack/react-store';

import { SECTIONS } from '../data/sections';
import { appStore } from '../store/appStore';
import { scrollToIdAndFocus } from '../lib/scroll';
import './rail.css';

/**
 * The left rail.
 *
 * A persistent index of the page and a live reading of where you are. It is
 * a navigation aid first and a status display second, so it works with the
 * keyboard alone.
 */
export function Rail() {
  const activeSection = useSelector(appStore, (state) => state.activeSection);
  const effort = useSelector(appStore, (state) => state.effort);

  return (
    <aside className="mm-rail" aria-label="Section index">
      <nav>
        <ul>
          {SECTIONS.map((section) => {
            const current = activeSection === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`mm-rail__link${current ? ' is-active' : ''}`}
                  aria-current={current ? 'true' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToIdAndFocus(section.id);
                  }}
                >
                  <span className="mm-rail__index" aria-hidden="true">
                    {section.index}
                  </span>
                  <span className="mm-rail__label">{section.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mm-rail__reading" aria-live="polite">
        <span className="mm-rail__reading-label">Thinking depth</span>
        <span className="mm-rail__reading-value mm-num">{effort}</span>
      </div>
    </aside>
  );
}
