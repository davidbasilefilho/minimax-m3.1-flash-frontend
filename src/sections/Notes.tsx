import { useMemo, useState } from 'react';
import { useSelector } from '@tanstack/react-store';

import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';
import { ChipRadio } from '../components/ChipRadio';
import { VirtualNotes } from '../components/VirtualNotes';
import { FIELD_NOTES } from '../data/fieldNotes';
import type { FieldNote } from '../data/fieldNotes';
import { appStore, actions } from '../store/appStore';
import './notes.css';

type NoteKind = FieldNote['kind'] | 'all';

const KIND_LABEL: Record<NoteKind, string> = {
  all: 'Everything',
  release: 'Releases',
  benchmark: 'Benchmarks',
  platform: 'Platform',
  research: 'Research',
  cost: 'Cost',
};

export function Notes() {
  const expanded = useSelector(appStore, (state) => state.notesExpanded);
  const [kind, setKind] = useState<NoteKind>('all');

  const notes = useMemo(
    () => (kind === 'all' ? FIELD_NOTES : FIELD_NOTES.filter((note) => note.kind === kind)),
    [kind],
  );

  return (
    <section id="notes" className="mm-section" aria-labelledby="notes-title">
      <div className="mm-shell">
        <Reveal>
          <SectionHeader
            id="notes-title"
            index="08"
            title="Field notes"
            blurb="The public history of the model, oldest first — thirty-eight dated events across releases, benchmarks, platform changes and published research. Windowed, so the list stays quick whatever grows."
            aside={
              <button
                type="button"
                className="mm-notes__expand"
                onClick={() => actions.setNotesExpanded(!expanded)}
                aria-expanded={expanded}
              >
                {expanded ? 'Collapse the list' : 'Expand the list'}
              </button>
            }
          />
        </Reveal>

        <Reveal>
          <div className="mm-notes__filters">
            <ChipRadio
              name="mm-note-kind"
              legend="Filter field notes by kind"
              value={kind}
              onChange={setKind}
              options={(Object.keys(KIND_LABEL) as NoteKind[]).map((entry) => ({
                value: entry,
                label: KIND_LABEL[entry],
              }))}
            />
            <span className="mm-notes__count mm-num">{notes.length} entries</span>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <VirtualNotes notes={notes} expanded={expanded} />
        </Reveal>
      </div>
    </section>
  );
}
