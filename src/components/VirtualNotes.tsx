import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import type { FieldNote } from '../data/fieldNotes';
import './virtualNotes.css';

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
      className={`mm-notes__scroll${expanded ? ' is-expanded' : ''}`}
      ref={parentRef}
      role="region"
      aria-label="Field notes log"
      tabIndex={0}
    >
      <div className="mm-notes__spacer" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((item) => {
          const note = notes[item.index];
          return (
            <article
              key={item.key}
              className="mm-notes__entry"
              style={{ transform: `translateY(${item.start}px)` }}
              aria-posinset={item.index + 1}
              aria-setsize={notes.length}
            >
              <div className="mm-notes__entry-head">
                <time className="mm-notes__date mm-num" dateTime={note.date}>
                  {note.date}
                </time>
                <span className={`mm-notes__kind mm-notes__kind--${note.kind}`}>{note.kind}</span>
              </div>
              <h3 className="mm-notes__entry-title">{note.title}</h3>
              <p className="mm-notes__entry-body">{note.body}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
