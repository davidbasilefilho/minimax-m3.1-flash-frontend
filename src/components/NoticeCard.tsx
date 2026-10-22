import { Button } from 'baseui/button';

import { NOTICE_KIND_LABEL } from '../data/notices';
import type { Notice } from '../data/notices';
import './noticeCard.css';

export type NoticeCardProps = {
  notice: Notice;
  onDismiss: (id: string) => void;
};

/**
 * A notice.
 *
 * Built as plain semantic HTML rather than from a component library, because
 * a notice has to carry a specific kind of information: a limitation, a
 * provenance caveat or a legal constraint. The dismiss control is a real
 * button with a spoken label, so it is reachable and understandable without
 * sight of the icon.
 */
export function NoticeCard({ notice, onDismiss }: NoticeCardProps) {
  return (
    <article className={`mm-notice mm-notice--${notice.kind}`}>
      <div className="mm-notice__head">
        <h3 className="mm-notice__title">{notice.title}</h3>
        <span className="mm-notice__kind">{NOTICE_KIND_LABEL[notice.kind]}</span>
      </div>

      <p className="mm-notice__body">{notice.body}</p>

      <div className="mm-notice__foot">
        {notice.href ? (
          <a
            className="mm-notice__link"
            href={notice.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {notice.hrefLabel ?? notice.href}
          </a>
        ) : null}

        <Button
          kind="tertiary"
          size="mini"
          onClick={() => onDismiss(notice.id)}
          aria-label={`Dismiss notice: ${notice.title}`}
        >
          Dismiss
        </Button>
      </div>
    </article>
  );
}
