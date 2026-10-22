import { Button } from 'baseui/button';

import { NOTICE_KIND_LABEL } from '../data/notices';
import type { Notice } from '../data/notices';

export type NoticeCardProps = {
  notice: Notice;
  onDismiss: (id: string) => void;
};

const KIND_BORDER = {
  legal: 'border-l-brand-coral',
  provenance: 'border-l-brand-cyan',
  status: 'border-l-brand-violet',
  accuracy: 'border-l-brand-orange',
} as const;

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
    <article
      className={`border-line bg-surface flex h-full flex-col gap-3 rounded-md border border-l-2 p-5 ${KIND_BORDER[notice.kind]}`}>
      <div className='flex flex-wrap items-baseline justify-between gap-3'>
        <h3 className='font-display text-md text-ink font-medium'>{notice.title}</h3>
        <span className='rounded-pill border-line-strong text-ink-3 border px-[0.45rem] py-[0.1rem] text-[9px] tracking-[0.07em] whitespace-nowrap uppercase'>
          {NOTICE_KIND_LABEL[notice.kind]}
        </span>
      </div>

      <p className='text-ink-2 flex-1 text-sm leading-[1.6]'>{notice.body}</p>

      <div className='flex flex-wrap items-center justify-between gap-3 pt-2'>
        {notice.href ? (
          <a
            className='text-brand-rose-text hover:text-ink text-xs font-medium underline decoration-1 underline-offset-[3px]'
            href={notice.href}
            target='_blank'
            rel='noreferrer noopener'>
            {notice.hrefLabel ?? notice.href}
          </a>
        ) : null}

        <Button
          kind='tertiary'
          size='mini'
          onClick={() => onDismiss(notice.id)}
          aria-label={`Dismiss notice: ${notice.title}`}>
          Dismiss
        </Button>
      </div>
    </article>
  );
}
