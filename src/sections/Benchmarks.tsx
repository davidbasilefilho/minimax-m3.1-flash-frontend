import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { ChipRadio } from '../components/ChipRadio';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { SpectralBar, SpectralLegend } from '../components/SpectralBar';
import { ALE_CURVE, BENCHMARKS, COMPETITORS, GROUPS } from '../data/benchmarks';
import type { BenchmarkGroup } from '../data/benchmarks';

type BenchmarkRowData = {
  id: string;
  name: string;
  group: BenchmarkGroup;
  unit: 'score' | 'percent';
  methodology: string;
  scores: Record<string, number | null>;
};

/**
 * Sorting on a score column, with unpublished scores pushed to the bottom
 * rather than treated as zero.
 */
function sortByScore(
  rowA: { original: BenchmarkRowData },
  rowB: { original: BenchmarkRowData },
  columnId: string,
): number {
  const a = rowA.original.scores[columnId];
  const b = rowB.original.scores[columnId];
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a - b;
}

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    score: sortByScore,
  },
});

const helper = createColumnHelper<typeof features, BenchmarkRowData>();

const DATA: BenchmarkRowData[] = BENCHMARKS.map((row) => ({
  id: row.id,
  name: row.name,
  group: row.group,
  unit: row.unit,
  methodology: row.methodology,
  scores: row.scores as Record<string, number | null>,
}));

/*
 * Every column resolves to the same value type so the whole array fits the
 * table's column contract. The cell renderer narrows the value back to the
 * concrete type it expects.
 */
function buildColumns() {
  return [
    helper.accessor((row: BenchmarkRowData): unknown => row.name, {
      id: 'name',
      header: 'Benchmark',
      enableSorting: true,
      sortFn: 'alphanumeric',
    }),
    ...COMPETITORS.map((competitor) =>
      helper.accessor((row: BenchmarkRowData): unknown => row.scores[competitor.id], {
        id: competitor.id,
        header: competitor.short,
        enableSorting: true,
        sortFn: 'score',
        cell: (info) => {
          const value = info.getValue();
          if (typeof value !== 'number') {
            return (
              <span className='text-ink-3 opacity-60' title='No score published'>
                —
              </span>
            );
          }
          return (
            <span
              className={`font-display tabular-nums ${
                competitor.isSubject ? 'text-ink font-semibold' : 'text-ink-2'
              }`}>
              {value.toFixed(1)}
            </span>
          );
        },
      }),
    ),
  ];
}

/**
 * The best score any model published on a benchmark, and the worst.
 *
 * Written as a loop rather than `Math.max(...values)`: the spread form
 * trips an internal React Compiler error, which silently drops the
 * component out of compilation.
 */
function fieldRange(row: BenchmarkRowData): { best: number; worst: number } {
  let best = Number.NEGATIVE_INFINITY;
  let worst = Number.POSITIVE_INFINITY;
  let seen = false;

  for (const value of Object.values(row.scores)) {
    if (value === null) continue;
    seen = true;
    if (value > best) best = value;
    if (value < worst) worst = value;
  }

  if (!seen) return { best: 1, worst: 0 };
  return { best, worst };
}

/**
 * Agents' Last Exam: pass rate against total cost.
 *
 * Logarithmic on the x axis, because the cost range is two orders of
 * magnitude. The shape of this chart is the commercial argument for the
 * model, and the gap between the top-right and the top-left is the point.
 */
function AleScatter() {
  const width = 900;
  const height = 420;
  const padLeft = 52;
  const padRight = 24;
  const padTop = 24;
  const padBottom = 52;

  // Explicit loops rather than `Math.min(...costs)`: the spread form trips
  // an internal React Compiler error that silently drops the component out
  // of compilation.
  let lowestCost = Number.POSITIVE_INFINITY;
  let highestCost = Number.NEGATIVE_INFINITY;
  let highestPass = Number.NEGATIVE_INFINITY;

  for (const point of ALE_CURVE) {
    if (point.costUsd < lowestCost) lowestCost = point.costUsd;
    if (point.costUsd > highestCost) highestCost = point.costUsd;
    if (point.passRate > highestPass) highestPass = point.passRate;
  }

  const minCost = Math.log10(lowestCost * 0.8);
  const maxCost = Math.log10(highestCost * 1.25);
  const maxPass = Math.ceil(highestPass / 5) * 5;

  const x = (cost: number) =>
    padLeft + ((Math.log10(cost) - minCost) / (maxCost - minCost)) * (width - padLeft - padRight);
  const y = (pass: number) => height - padBottom - (pass / maxPass) * (height - padBottom - padTop);

  const ticks = [100, 200, 500, 1000, 2000];

  return (
    <figure className='border-line bg-surface m-0 mt-6 rounded-md border p-5'>
      <figcaption className='mb-4 flex flex-col gap-[0.25rem]'>
        <span className='font-display text-ink text-lg'>
          Agents’ Last Exam — pass rate against total cost
        </span>
        <span className='text-ink-3 text-xs'>
          ALE-V1 Overall · 152 tasks · public model data as of 2026-10-18 · best harness and effort
          per model
        </span>
      </figcaption>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className='h-auto w-full overflow-visible'
        role='img'
        aria-label='Scatter plot of pass rate against total cost. MiniMax-M3.1-Flash reaches a 29.6 percent pass rate for 111 dollars, while the higher pass rates cost from 250 to 1800 dollars.'>
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={x(tick)}
              x2={x(tick)}
              y1={padTop}
              y2={height - padBottom}
              stroke='var(--color-line)'
              strokeWidth='1'
              vectorEffect='non-scaling-stroke'
            />
            <text
              x={x(tick)}
              y={height - padBottom + 18}
              textAnchor='middle'
              className='fill-ink-3 font-body text-[10px] tabular-nums'>
              ${tick.toLocaleString()}
            </text>
          </g>
        ))}

        {[0, 10, 20, 30, 40].map((tick) => (
          <g key={tick}>
            <line
              x1={padLeft}
              x2={width - padRight}
              y1={y(tick)}
              y2={y(tick)}
              stroke='var(--color-line)'
              strokeWidth='1'
              vectorEffect='non-scaling-stroke'
            />
            <text
              x={padLeft - 10}
              y={y(tick) + 3}
              textAnchor='end'
              className='fill-ink-3 font-body text-[10px] tabular-nums'>
              {tick}%
            </text>
          </g>
        ))}

        <line
          x1={x(111)}
          y1={padTop}
          x2={x(111)}
          y2={height - padBottom}
          stroke='var(--color-brand-rose)'
          strokeWidth='1.5'
          strokeDasharray='4 6'
          vectorEffect='non-scaling-stroke'
        />

        {ALE_CURVE.map((point) => {
          const isSubject = point.model === 'MiniMax-M3.1-Flash';
          return (
            <g key={point.model}>
              <circle
                cx={x(point.costUsd)}
                cy={y(point.passRate)}
                r={isSubject ? 8 : 5}
                fill={isSubject ? 'var(--color-brand-rose)' : 'var(--color-ink-3)'}
                stroke='var(--color-canvas)'
                strokeWidth='2'
                vectorEffect='non-scaling-stroke'
              />
              {isSubject ? (
                <text
                  x={x(point.costUsd) + 14}
                  y={y(point.passRate) - 8}
                  className='fill-brand-rose-text font-body text-[11px] font-semibold'>
                  MiniMax-M3.1-Flash · 29.6% at $111
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export function Benchmarks() {
  const [group, setGroup] = useState<BenchmarkGroup | 'all'>('all');
  const [selected, setSelected] = useState<string>('automation-bench');

  const data = group === 'all' ? DATA : DATA.filter((row) => row.group === group);

  const table = useTable(
    {
      features,
      columns: buildColumns(),
      data,
      initialState: { sorting: [{ id: 'minimax', desc: false }] },
    },
    (state) => ({ sorting: state.sorting }),
  );

  const selectedRow = DATA.find((row) => row.id === selected) ?? DATA[0];
  const { best, worst } = fieldRange(selectedRow);
  const field = COMPETITORS.map((competitor) => ({
    competitor,
    score: selectedRow.scores[competitor.id],
  }))
    .filter(
      (entry): entry is { competitor: (typeof COMPETITORS)[number]; score: number } =>
        entry.score !== null,
    )
    .toSorted((a, b) => b.score - a.score);

  return (
    <section
      id='benchmarks'
      className='mm-section--tinted py-section scroll-mt-20'
      aria-labelledby='benchmarks-title'>
      <div className='max-w-shell px-gutter mx-auto'>
        <Reveal>
          <SectionHeader
            id='benchmarks-title'
            index='04'
            title='Benchmarks'
            blurb='Fifteen benchmarks across five groups, every score published by MiniMax, every harness named. Sort any column. A blank cell means no score was published — not a zero.'
          />
        </Reveal>

        <Reveal>
          <div className='mb-5'>
            <ChipRadio
              name='mm-bench-group'
              legend='Filter benchmarks by group'
              value={group}
              onChange={setGroup}
              options={[
                { value: 'all' as const, label: 'All groups' },
                ...GROUPS.map((entry) => ({ value: entry.id, label: entry.label })),
              ]}
            />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className='border-line bg-surface overflow-x-auto rounded-md border'>
            <table className='w-full min-w-[860px] border-collapse text-sm'>
              <caption className='sr-only'>
                Benchmark scores for MiniMax M3.1 Flash and six comparison models. All scores are
                reported by MiniMax. Activate a column heading to sort by that model.
              </caption>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const sorted = header.column.getIsSorted();
                      const toggle = header.column.getToggleSortingHandler();
                      const isSubject = header.column.id === 'minimax';
                      return (
                        <th
                          key={header.id}
                          scope='col'
                          className={`border-line-strong bg-surface-2 text-ink-3 sticky top-0 z-2 border-b px-[0.85rem] py-[0.7rem] text-xs font-medium tracking-[0.01em] ${
                            header.column.id === 'name' ? 'text-left' : 'text-right'
                          } ${isSubject ? 'text-brand-rose-text' : ''}`}
                          aria-sort={
                            sorted === 'asc'
                              ? 'ascending'
                              : sorted === 'desc'
                                ? 'descending'
                                : 'none'
                          }>
                          {header.column.id === 'name' ? (
                            <table.FlexRender header={header} />
                          ) : (
                            <button
                              type='button'
                              className={`font-inherit ease-out-expo hover:text-ink -m-[0.2rem] -mr-[0.3rem] inline-flex items-center gap-[0.3rem] rounded-xs p-[0.2rem] pr-[0.3rem] text-inherit transition-colors duration-150 ${
                                sorted ? 'text-brand-rose-text' : ''
                              }`}
                              onClick={toggle}
                              aria-label={`Sort by ${String(header.column.columnDef.header)}`}>
                              {String(header.column.columnDef.header)}
                              <span className='text-[10px] opacity-70' aria-hidden='true'>
                                {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
                              </span>
                            </button>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`ease-out-expo hover:bg-surface-2 cursor-pointer transition-colors duration-150 ${
                      row.original.id === selected
                        ? 'shadow-[inset_2px_0_0_var(--color-brand-rose)]'
                        : ''
                    }`}>
                    {row.getAllCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`border-line border-b px-[0.85rem] py-[0.7rem] whitespace-nowrap ${
                          cell.column.id === 'name'
                            ? 'min-w-[260px] text-left whitespace-normal'
                            : 'text-right'
                        } ${cell.column.id === 'minimax' ? 'bg-brand-rose/7' : ''}`}>
                        {cell.column.id === 'name' ? (
                          <button
                            type='button'
                            className='text-left'
                            aria-label={`Show ${row.original.name} in the field comparison`}
                            onClick={() => setSelected(row.original.id)}>
                            <span className='flex flex-col gap-[0.15rem]'>
                              <span className='text-ink font-medium'>{row.original.name}</span>
                              <span className='text-ink-3 max-w-[44ch] text-[11px] leading-[1.4] whitespace-normal'>
                                {row.original.methodology}
                              </span>
                            </span>
                          </button>
                        ) : (
                          <table.FlexRender cell={cell} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className='border-line bg-surface mt-6 rounded-md border p-5'>
            <div className='mb-5 flex flex-wrap justify-between gap-6'>
              <div>
                <h3 className='font-display text-ink mb-1 text-lg font-normal'>
                  {selectedRow.name}
                </h3>
                <p className='text-ink-3 max-w-[62ch] text-xs'>{selectedRow.methodology}</p>
              </div>
              <p className='text-ink-3 max-w-[40ch] self-end text-xs'>
                Bar length is the score, normalised across this benchmark’s published field. Bar
                colour is that position on the brand scale.
              </p>
            </div>

            <ul className='flex flex-col gap-4'>
              {field.map((entry) => (
                <li
                  key={entry.competitor.id}
                  className='grid grid-cols-[150px_minmax(0,1fr)_52px] items-center gap-4 max-[720px]:grid-cols-[110px_minmax(0,1fr)_44px] max-[720px]:gap-2'>
                  <span className='text-ink-2 inline-flex items-center gap-[0.4rem] overflow-hidden text-sm text-ellipsis whitespace-nowrap'>
                    {entry.competitor.short}
                    {entry.competitor.isSubject ? (
                      <span className='rounded-pill border-brand-rose/44 text-brand-rose-text border px-[0.35rem] py-[0.05rem] text-[9px] tracking-[0.06em] uppercase'>
                        subject
                      </span>
                    ) : null}
                  </span>
                  <SpectralBar
                    score={entry.score}
                    best={best}
                    worst={worst}
                    isSubject={entry.competitor.isSubject}
                    label={`${entry.competitor.name}: ${entry.score} on ${selectedRow.name}`}
                  />
                  <span className='font-display text-md text-ink text-right tabular-nums'>
                    {entry.score.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>

            <SpectralLegend
              low={`lowest published · ${worst.toFixed(1)}`}
              high={`highest published · ${best.toFixed(1)}`}
            />
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <AleScatter />
        </Reveal>

        <Reveal delay={0.16}>
          <p className='font-editorial text-ink-2 mt-6 max-w-[76ch] text-sm'>
            Two cautions worth repeating. Every score above is vendor reported, and harness choice
            changes results more than the models do — the same benchmark run under a different
            harness is a different benchmark. And the strongest result on this page,
            Automation-Bench, is the one where the gap to Opus 5 is largest; on Terminal Bench 4.0
            and NL2Repo-Bench, Opus 5 is ahead by thirteen and fourteen points.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
