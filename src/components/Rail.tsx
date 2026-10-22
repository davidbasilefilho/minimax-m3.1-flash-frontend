import { useSelector } from '@tanstack/react-store';

import { SECTIONS } from '../data/sections';
import { scrollToIdAndFocus } from '../lib/scroll';
import { appStore } from '../store/appStore';

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
    <aside
      className='sticky top-24 flex w-max flex-col gap-5 self-start pt-2 max-[1199px]:hidden'
      aria-label='Section index'>
      <nav>
        <ul className='border-line flex flex-col gap-[0.1rem] border-l'>
          {SECTIONS.map((section) => {
            const current = activeSection === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`ease-out-expo -ml-px flex items-baseline gap-3 border-l-2 py-[0.35rem] pr-0 pl-[0.85rem] text-xs no-underline transition-colors duration-150 ${
                    current
                      ? 'border-l-brand-rose text-ink'
                      : 'text-ink-3 hover:border-l-line-strong hover:text-ink border-l-transparent'
                  }`}
                  aria-current={current ? 'true' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToIdAndFocus(section.id);
                  }}>
                  <span
                    className='font-display shrink-0 text-[10px] tabular-nums opacity-75'
                    aria-hidden='true'>
                    {section.index}
                  </span>
                  <span className='whitespace-nowrap'>{section.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className='border-line flex flex-col gap-[0.2rem] border-t pt-4' aria-live='polite'>
        <span className='text-ink-3 text-[10px] tracking-[0.05em]'>Thinking depth</span>
        <span className='font-display text-md text-brand-rose-text capitalize tabular-nums'>
          {effort}
        </span>
      </div>
    </aside>
  );
}
