/**
 * The reading order of the page.
 *
 * The indices are part of the information architecture, not decoration:
 * the sections are an ordered reading of the model, from identity through
 * capability, cost, performance and integration.
 */

export type SectionSpec = {
  id: string;
  index: string;
  label: string;
  short: string;
};

export const SECTIONS: readonly SectionSpec[] = [
  { id: 'hero', index: '00', label: 'Overview', short: 'Overview' },
  { id: 'notices', index: '01', label: 'Notices', short: 'Notices' },
  { id: 'vitals', index: '02', label: 'Vitals', short: 'Vitals' },
  { id: 'thinking', index: '03', label: 'Thinking depth', short: 'Thinking' },
  { id: 'benchmarks', index: '04', label: 'Benchmarks', short: 'Bench' },
  { id: 'cost', index: '05', label: 'Cost', short: 'Cost' },
  { id: 'throughput', index: '06', label: 'Throughput', short: 'Speed' },
  { id: 'integration', index: '07', label: 'Integration', short: 'Integrate' },
  { id: 'notes', index: '08', label: 'Field notes', short: 'Notes' },
  { id: 'system', index: '09', label: 'Design system', short: 'System' },
] as const;

export const SECTION_IDS = SECTIONS.map((section) => section.id);
