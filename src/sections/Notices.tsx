import { useSelector } from '@tanstack/react-store';

import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';
import { NoticeCard } from '../components/NoticeCard';
import { NOTICES } from '../data/notices';
import { appStore, actions } from '../store/appStore';
import './notices.css';

export function Notices() {
  const dismissed = useSelector(appStore, (state) => state.dismissedNotices);
  const visible = NOTICES.filter((notice) => !dismissed.includes(notice.id));
  const hiddenCount = NOTICES.length - visible.length;

  return (
    <section id="notices" className="mm-section mm-section--tinted" aria-labelledby="notices-title">
      <div className="mm-shell">
        <Reveal>
          <SectionHeader
            id="notices-title"
            index="01"
            title="Notices"
            blurb="Nine things to know before you trust anything else on this page. Each notice states a limitation, a provenance caveat or a legal constraint — not a disclaimer in the abstract."
            aside={
              hiddenCount > 0 ? (
                <button
                  type="button"
                  className="mm-notices__restore"
                  onClick={actions.restoreNotices}
                >
                  Show {hiddenCount} dismissed
                </button>
              ) : null
            }
          />
        </Reveal>

        <div className="mm-notices__grid">
          {visible.map((notice, index) => (
            <Reveal key={notice.id} delay={index * 0.04} amount={0.12}>
              <NoticeCard notice={notice} onDismiss={actions.dismissNotice} />
            </Reveal>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="mm-notices__empty">
            <p className="mm-editorial">
              Every notice is dismissed. The claims they qualify are still on this page.
            </p>
            <button type="button" className="mm-notices__restore" onClick={actions.restoreNotices}>
              Bring them back
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
