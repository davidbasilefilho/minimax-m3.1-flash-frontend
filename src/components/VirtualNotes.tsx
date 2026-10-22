import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

import type { FieldNote } from '../data/fieldNotes';

export type VirtualNotesProps = {
  notes: readonly FieldNote[];
  expanded: boolean;
};

/**
 * The windowed field-notes log.
 *
 * The virtualizer lives in its own component on purpose. TanStack Virtual's
 * `useVirtualizer()` returns functions that cannot be memoised safely, so the
 * React Compiler deliberately skips the component that calls it. Keeping the
 * call inside one small component means the skip is scoped to exactly that
 * component and the rest of the page stays compiled.
 */
export function VirtualNotes({ notes, expanded }: VirtualNotesProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: notes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 132,
    overscan: 8,
  });

  return (
    <div
      className={`border-line bg-surface h-[460px] overflow-y-auto overscroll-contain rounded-md border px-5 py-4 max-[720px]:px-4 ${
        expanded ? 'h-[760px]' : ''
      }`}
      ref={parentRef}
      role='region'
      aria-label='Field notes log'
      // A scrollable region must be reachable by keyboard, or a keyboard user
      // cannot scroll it. This is the WAI-ARIA scrollable-region pattern.
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}>
      <div className='relative w-full' style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((item) => {
          const note = notes[item.index];
          return (
            <article
              key={item.key}
              className='border-line absolute top-0 left-0 w-full border-b py-4'
              style={{ transform: `translateY(${item.start}px)` }}
              aria-posinset={item.index + 1}
              aria-setsize={notes.length}>
              <div className='mb-[0.35rem] flex items-center gap-3'>
                <time
                  className='font-display text-ink-3 text-xs tracking-[0.02em] tabular-nums'
                  dateTime={note.date}>
                  {note.date}
                </time>
                <span
                  className={`rounded-pill border px-[0.4rem] py-[0.05rem] text-[9px] tracking-[0.07em] uppercase ${
                    note.kind === 'release'
                      ? 'border-brand-rose/44 text-brand-rose-text'
                      : note.kind === 'benchmark'
                        ? 'border-brand-orange/44 text-brand-orange-text'
                        : note.kind === 'research'
                          ? 'border-brand-violet/44 text-brand-violet-text'
                          : note.kind === 'cost'
                            ? 'border-brand-cyan/44 text-brand-cyan-text'
                            : 'border-line-strong text-ink-3'
                  }`}>
                  {note.kind}
                </span>
              </div>
              <h3 className='font-display text-md text-ink mb-[0.2rem] font-medium'>
                {note.title}
              </h3>
              <p className='text-ink-2 max-w-[78ch] text-sm leading-[1.6]'>{note.body}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
