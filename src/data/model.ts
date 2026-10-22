/**
 * Model facts for MiniMax M3.1 Flash.
 *
 * Every value in this file is sourced from a primary document:
 *  - MiniMax launch post  — https://www.minimax.io/blog/minimax-m31f
 *  - MiniMax API docs      — https://platform.minimax.io/docs/guides/text-generation
 *  - MiniMax model page    — https://agent.minimax.io/tools/m3-1-flash-preview
 *  - MiniMax benchmark table (vendor published) — reproduced in `benchmarks.ts`
 *
 * Nothing here is invented. Where a figure is vendor-reported rather than
 * independently reproduced, the field says so.
 */

export const MODEL_ID = 'MiniMax-M3.1-Flash';

export type Effort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

export const EFFORT_ORDER: readonly Effort[] = ['low', 'medium', 'high', 'xhigh', 'max'] as const;

export type EffortSpec = {
  id: Effort;
  label: string;
  /** What MiniMax documents about the level. */
  note: string;
  /** Automation-Bench v1.0.6 score at this effort level (vendor reported). */
  automationBench: number;
  /** Average cost per Automation-Bench task at this effort level (vendor chart). */
  costPerTask: number;
};

export const EFFORTS: readonly EffortSpec[] = [
  {
    id: 'low',
    label: 'Low',
    note: 'Fastest and cheapest. Thinks briefly, then answers.',
    automationBench: 52.8,
    costPerTask: 0.028,
  },
  {
    id: 'medium',
    label: 'Medium',
    note: 'A reasonable default for everyday interactive work.',
    automationBench: 57.7,
    costPerTask: 0.036,
  },
  {
    id: 'high',
    label: 'High',
    note: 'More planning per turn, for multi-step agentic tasks.',
    automationBench: 59.2,
    costPerTask: 0.041,
  },
  {
    id: 'xhigh',
    label: 'Xhigh',
    note: 'Deep reasoning. Notable step from High to Xhigh on Automation-Bench.',
    automationBench: 61.2,
    costPerTask: 0.045,
  },
  {
    id: 'max',
    label: 'Max',
    note: "MiniMax's documented default. Thinks as long as the task needs.",
    automationBench: 62.8,
    costPerTask: 0.047,
  },
] as const;

export const MODEL = {
  id: MODEL_ID,
  vendor: 'MiniMax',
  family: 'M3.1',
  status: 'Generally available',
  released: '2026-10-19',
  weights: 'Released 2026-10-23 (announced); licence terms not yet published.',
  tagline:
    'Frontier multimodal coding model with 1M context window and tunable thinking depth.',
  slogan: 'Intelligence with Everyone',
  summary:
    'A 428B-parameter mixture-of-experts model with roughly 23B active parameters. Reasoning is always on and cannot be switched off — depth is tuned with five effort levels instead. It reads text, images and video, writes text, and holds a one-million-token context window.',
  parameters: {
    total: 428,
    active: 23,
    unit: 'B',
    architecture: 'Mixture of Experts',
  },
  context: {
    tokens: 1_000_000,
    maxOutputTokens: 524_288,
    pages: 'about 1,500 pages of A4 at 12pt Arial',
  },
  modalities: {
    input: ['text', 'image', 'video'],
    output: ['text'],
  },
  reasoning: {
    alwaysOn: true,
    defaultEffort: 'max' as Effort,
    disableAttempt:
      'model "MiniMax-M3.1-Flash" requires adaptive thinking',
    disableStatus: 400,
  },
  predecessor: {
    id: 'MiniMax-M3',
    relation: 'Previous generation, same 1M context window and MoE shape.',
    difference:
      'M3 lets you switch reasoning off. M3.1 Flash cannot, so the same simple call now carries a thinking-token and latency floor. MiniMax reports 70% lower overall agentic task cost and close to 3x faster online inference than M3.',
  },
  lineage: {
    stealth: 'Space Bunny',
    detail:
      'The stealth model Space Bunny processed more than 200 trillion tokens before launch. MiniMax describes it as an early version of M3.1 Flash.',
  },
} as const;

export type ModelSpec = typeof MODEL;

/** Readouts used in the hero and vitals sections. */
export const HERO_READOUTS = [
  { label: 'Total parameters', value: '428B', unit: 'mixture of experts' },
  { label: 'Active parameters', value: '23B', unit: 'per token' },
  { label: 'Context window', value: '1M', unit: 'tokens' },
] as const;

/** Throughput, latency and verbosity — vendor claims and independent measurement. */
export const THROUGHPUT = [
  {
    id: 'peak',
    label: 'Peak output speed',
    value: '200+',
    unit: 'tokens / second',
    source: 'vendor' as const,
    detail: 'MiniMax states everyday output speeds can reach 200+ TPS.',
  },
  {
    id: 'p50',
    label: 'Median output speed',
    value: '170+',
    unit: 'tokens / second',
    source: 'vendor' as const,
    detail: 'MiniMax states P50 output speed consistently reaches 170+ TPS.',
  },
  {
    id: 'aa-speed',
    label: 'Measured output speed',
    value: '92.8',
    unit: 'tokens / second',
    source: 'measured' as const,
    detail:
      'Artificial Analysis measures 92.8 TPS against a 108.4 median for the price class — slower than average, measured on the MiniMax API.',
  },
  {
    id: 'ttft',
    label: 'Time to first token',
    value: '1.43',
    unit: 'seconds',
    source: 'measured' as const,
    detail:
      'Artificial Analysis measures 1.43s TTFT against a 1.69s median for the price class — better than average.',
  },
  {
    id: 'intelligence',
    label: 'Intelligence Index',
    value: '43',
    unit: 'rank 5 of 173',
    source: 'measured' as const,
    detail:
      'Artificial Analysis Intelligence Index v4.3.2. The comparable-price-class median is 13.',
  },
  {
    id: 'cost-per-task',
    label: 'Cost per Intelligence task',
    value: '$0.22',
    unit: 'blended 3:1 input / output',
    source: 'measured' as const,
    detail: 'Blended rate at a 7:2:1 cache-hit / input / output ratio is $0.10 per 1M tokens.',
  },
  {
    id: 'verbosity',
    label: 'Output tokens on the Index',
    value: '180M',
    unit: 'vs 99M median',
    source: 'measured' as const,
    detail:
      'The model is verbose: it generated roughly 1.8x the median token volume for comparable models.',
  },
  {
    id: 'faster',
    label: 'Inference vs M3',
    value: '≈3x',
    unit: 'faster online',
    source: 'vendor' as const,
    detail: 'MiniMax attributes the speed-up to more aggressive sparsity in inference.',
  },
] as const;
