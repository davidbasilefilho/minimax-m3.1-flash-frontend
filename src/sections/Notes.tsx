import { useSelector } from '@tanstack/react-store';
import { useState } from 'react';

import { ChipRadio } from '../components/ChipRadio';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { VirtualNotes } from '../components/VirtualNotes';
import { FIELD_NOTES } from '../data/fieldNotes';
import type { FieldNote } from '../data/fieldNotes';
import { actions, appStore } from '../store/appStore';

type NoteKind = FieldNote['kind'] | 'all';

const NOTE_KINDS: readonly NoteKind[] = [
  'all',
  'release',
  'benchmark',
  'platform',
  'research',
  'cost',
] as const;

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

  const notes = kind === 'all' ? FIELD_NOTES : FIELD_NOTES.filter((note) => note.kind === kind);

  return (
    <section id='notes' className='py-section scroll-mt-20' aria-labelledby='notes-title'>
      <div className='max-w-shell px-gutter mx-auto'>
        <Reveal>
          <SectionHeader
            id='notes-title'
            index='08'
            title='Field notes'
            blurb='The public history of the model, oldest first — thirty-eight dated events across releases, benchmarks, platform changes and published research. Windowed, so the list stays quick whatever grows.'
            aside={
              <button
                type='button'
                className='rounded-pill border-line bg-surface-2 text-ink-2 ease-out-expo hover:border-line-strong hover:text-ink cursor-pointer border px-[0.9rem] py-[0.4rem] text-xs transition-colors duration-150'
                onClick={() => actions.setNotesExpanded(!expanded)}
                aria-expanded={expanded}>
                {expanded ? 'Collapse the list' : 'Expand the list'}
              </button>
            }
          />
        </Reveal>

        <Reveal>
          <div className='mb-4 flex flex-wrap items-center justify-between gap-4'>
            <ChipRadio
              name='mm-note-kind'
              legend='Filter field notes by kind'
              value={kind}
              onChange={setKind}
              options={NOTE_KINDS.map((entry) => ({
                value: entry,
                label: KIND_LABEL[entry],
              }))}
            />
            <span className='text-ink-3 text-xs tabular-nums'>{notes.length} entries</span>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <VirtualNotes notes={notes} expanded={expanded} />
        </Reveal>
      </div>
    </section>
  );
}
