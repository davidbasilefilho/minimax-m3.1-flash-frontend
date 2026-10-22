import { useSelector } from '@tanstack/react-store';

import { NoticeCard } from '../components/NoticeCard';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { NOTICES } from '../data/notices';
import { actions, appStore } from '../store/appStore';

export function Notices() {
  const dismissed = useSelector(appStore, (state) => state.dismissedNotices);
  const visible = NOTICES.filter((notice) => !dismissed.includes(notice.id));
  const hiddenCount = NOTICES.length - visible.length;

  return (
    <section
      id='notices'
      className='mm-section--tinted py-section scroll-mt-20'
      aria-labelledby='notices-title'>
      <div className='max-w-shell px-gutter mx-auto'>
        <Reveal>
          <SectionHeader
            id='notices-title'
            index='01'
            title='Notices'
            blurb='Nine things to know before you trust anything else on this page. Each notice states a limitation, a provenance caveat or a legal constraint — not a disclaimer in the abstract.'
            aside={
              hiddenCount > 0 ? (
                <button
                  type='button'
                  className='rounded-pill border-line bg-surface-2 text-ink-2 ease-out-expo hover:border-line-strong hover:text-ink cursor-pointer border px-[0.9rem] py-[0.4rem] text-xs transition-colors duration-150'
                  onClick={() => actions.restoreNotices()}>
                  Show {hiddenCount} dismissed
                </button>
              ) : null
            }
          />
        </Reveal>

        <div className='grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-stretch gap-4'>
          {visible.map((notice, index) => (
            <Reveal key={notice.id} delay={index * 0.04} amount={0.12}>
              <NoticeCard notice={notice} onDismiss={(id) => actions.dismissNotice(id)} />
            </Reveal>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className='flex max-w-[52ch] flex-col items-start gap-4 py-7'>
            <p className='font-editorial text-ink-2'>
              Every notice is dismissed. The claims they qualify are still on this page.
            </p>
            <button
              type='button'
              className='rounded-pill border-line bg-surface-2 text-ink-2 ease-out-expo hover:border-line-strong hover:text-ink cursor-pointer border px-[0.9rem] py-[0.4rem] text-xs transition-colors duration-150'
              onClick={() => actions.restoreNotices()}>
              Bring them back
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
