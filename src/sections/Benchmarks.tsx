import { useState } from 'react';
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';

import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';
import { SpectralBar, SpectralLegend } from '../components/SpectralBar';
import { ChipRadio } from '../components/ChipRadio';
import { ALE_CURVE, BENCHMARKS, COMPETITORS, GROUPS } from '../data/benchmarks';
import type { BenchmarkGroup } from '../data/benchmarks';
import './benchmarks.css';

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
 * table's column contract. The cell renderer casts back to the concrete type
 * it expects.
 */
const COLUMNS = [
  helper.accessor((row: BenchmarkRowData): unknown => row.name, {
    id: 'name',
    header: 'Benchmark',
    enableSorting: true,
    sortFn: 'alphanumeric',
    cell: (info) => (
      <div className="mm-bench__name-cell">
        <span className="mm-bench__name">{info.row.original.name}</span>
        <span className="mm-bench__harness">{info.row.original.methodology}</span>
      </div>
    ),
  }),
  ...COMPETITORS.map((competitor) =>
    helper.accessor((row: BenchmarkRowData): unknown => row.scores[competitor.id], {
      id: competitor.id,
      header: competitor.short,
      enableSorting: true,
      sortFn: 'score',
      cell: (info) => {
        const value = info.getValue() as number | null;
        if (value === null || value === undefined) {
          return <span className="mm-bench__empty" title="No score published">—</span>;
        }
        return (
          <span className={`mm-bench__score${competitor.isSubject ? ' is-subject' : ''}`}>
            {value.toFixed(1)}
          </span>
        );
      },
    }),
  ),
];

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
  const y = (pass: number) =>
    height - padBottom - (pass / maxPass) * (height - padBottom - padTop);

  const ticks = [100, 200, 500, 1000, 2000];

  return (
    <figure className="mm-bench__scatter">
      <figcaption className="mm-bench__scatter-head">
        <span className="mm-bench__scatter-title">Agents’ Last Exam — pass rate against total cost</span>
        <span className="mm-bench__scatter-source">
          ALE-V1 Overall · 152 tasks · public model data as of 2026-10-18 · best harness and
          effort per model
        </span>
      </figcaption>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mm-bench__scatter-svg"
        role="img"
        aria-label="Scatter plot of pass rate against total cost. MiniMax-M3.1-Flash reaches a 29.6 percent pass rate for 111 dollars, while the higher pass rates cost from 250 to 1800 dollars."
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={x(tick)}
              x2={x(tick)}
              y1={padTop}
              y2={height - padBottom}
              stroke="var(--mm-line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <text x={x(tick)} y={height - padBottom + 18} textAnchor="middle" className="mm-bench__tick">
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
              stroke="var(--mm-line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <text x={padLeft - 10} y={y(tick) + 3} textAnchor="end" className="mm-bench__tick">
              {tick}%
            </text>
          </g>
        ))}

        <line
          x1={x(111)}
          y1={padTop}
          x2={x(111)}
          y2={height - padBottom}
          stroke="var(--mm-rose)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
        />

        {ALE_CURVE.map((point) => {
          const isSubject = point.model === 'MiniMax-M3.1-Flash';
          return (
            <g key={point.model}>
              <circle
                cx={x(point.costUsd)}
                cy={y(point.passRate)}
                r={isSubject ? 8 : 5}
                fill={isSubject ? 'var(--mm-rose)' : 'var(--mm-ink-3)'}
                stroke="var(--mm-canvas)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              {isSubject ? (
                <text
                  x={x(point.costUsd) + 14}
                  y={y(point.passRate) - 8}
                  className="mm-bench__scatter-label is-subject"
                >
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
      columns: COLUMNS,
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
    .filter((entry): entry is { competitor: (typeof COMPETITORS)[number]; score: number } =>
      entry.score !== null,
    )
    .sort((a, b) => b.score - a.score);

  return (
    <section id="benchmarks" className="mm-section mm-section--tinted" aria-labelledby="benchmarks-title">
      <div className="mm-shell">
        <Reveal>
          <SectionHeader
            id="benchmarks-title"
            index="04"
            title="Benchmarks"
            blurb="Fifteen benchmarks across five groups, every score published by MiniMax, every harness named. Sort any column. A blank cell means no score was published — not a zero."
          />
        </Reveal>

        <Reveal>
          <div className="mm-bench__filters">
            <ChipRadio
              name="mm-bench-group"
              legend="Filter benchmarks by group"
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
          <div className="mm-bench__table-wrap">
            <table className="mm-bench__table">
              <caption className="mm-visually-hidden">
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
                          scope="col"
                          className={isSubject ? 'is-subject' : undefined}
                          aria-sort={
                            sorted === 'asc'
                              ? 'ascending'
                              : sorted === 'desc'
                                ? 'descending'
                                : 'none'
                          }
                        >
                          {header.column.id === 'name' ? (
                            <table.FlexRender header={header} />
                          ) : (
                            <button
                              type="button"
                              className={`mm-bench__sort${sorted ? ' is-sorted' : ''}`}
                              onClick={toggle}
                            >
                              {String(header.column.columnDef.header)}
                              <span className="mm-bench__sort-icon" aria-hidden="true">
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
                    className={row.original.id === selected ? 'is-selected' : undefined}
                    onClick={() => setSelected(row.original.id)}
                  >
                    {row.getAllCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={
                          cell.column.id === 'minimax' ? 'is-subject' : undefined
                        }
                      >
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mm-bench__field">
            <div className="mm-bench__field-head">
              <div>
                <h3 className="mm-bench__field-title">{selectedRow.name}</h3>
                <p className="mm-bench__field-harness">{selectedRow.methodology}</p>
              </div>
              <p className="mm-bench__field-note">
                Bar length is the score, normalised across this benchmark’s published field. Bar
                colour is that position on the brand scale.
              </p>
            </div>

            <ul className="mm-bench__field-list">
              {field.map((entry) => (
                <li key={entry.competitor.id} className="mm-bench__field-item">
                  <span className="mm-bench__field-name">
                    {entry.competitor.short}
                    {entry.competitor.isSubject ? (
                      <span className="mm-bench__field-badge">subject</span>
                    ) : null}
                  </span>
                  <SpectralBar
                    score={entry.score}
                    best={best}
                    worst={worst}
                    isSubject={entry.competitor.isSubject}
                    label={`${entry.competitor.name}: ${entry.score} on ${selectedRow.name}`}
                  />
                  <span className="mm-bench__field-value mm-num">{entry.score.toFixed(1)}</span>
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
          <p className="mm-bench__caveat mm-editorial">
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
