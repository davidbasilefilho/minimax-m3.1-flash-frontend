/**
 * Published pricing for MiniMax M3.1 Flash.
 *
 * Source: MiniMax launch post and the platform pricing page.
 * Flat per 1M tokens, no long-context surcharge.
 */

export const PRICING = {
  currency: 'USD',
  per: 1_000_000,
  input: 0.15,
  cachedInput: 0.015,
  output: 0.6,
  /** 7:2:1 cache-hit / input / output blend, per Artificial Analysis. */
  blended: 0.1,
  /** Discount on a reused prompt prefix versus fresh input. */
  cacheDiscountPercent: 90,
} as const;

export const PREDECESSOR_PRICING = {
  id: 'MiniMax-M3',
  input: 0.3,
  output: 1.2,
  note: 'M3 doubles above 512K input tokens. M3.1 Flash has no long-context surcharge.',
} as const;

export type CostBreakdown = {
  input: number;
  cached: number;
  output: number;
  total: number;
};

export type CostInput = {
  inputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
};

/**
 * Cost of a single request under the published flat rates.
 * Cached input is billed at the cache-read rate, not the fresh input rate.
 */
export function computeCost({ inputTokens, cachedInputTokens, outputTokens }: CostInput): CostBreakdown {
  const input = (Math.max(0, inputTokens) / PRICING.per) * PRICING.input;
  const cached = (Math.max(0, cachedInputTokens) / PRICING.per) * PRICING.cachedInput;
  const output = (Math.max(0, outputTokens) / PRICING.per) * PRICING.output;
  return { input, cached, output, total: input + cached + output };
}

/** What the same request would cost on the previous generation. */
export function computePredecessorCost({
  inputTokens,
  cachedInputTokens,
  outputTokens,
}: CostInput): number {
  const input = (Math.max(0, inputTokens) / PRICING.per) * PREDECESSOR_PRICING.input;
  const cached = (Math.max(0, cachedInputTokens) / PRICING.per) * PREDECESSOR_PRICING.input;
  const output = (Math.max(0, outputTokens) / PRICING.per) * PREDECESSOR_PRICING.output;
  return input + cached + output;
}

export function formatUsd(value: number, digits = 4): string {
  if (value === 0) return '$0';
  if (value < 0.01) return `$${value.toFixed(digits)}`;
  if (value < 1) return `$${value.toFixed(3)}`;
  return `$${value.toFixed(2)}`;
}

export function formatTokens(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  return String(value);
}

/** Token counts for one full Agents' Last Exam run, as published. */
export const ALE_RUN = {
  tasks: 152,
  totalCostUsd: 111,
  passRate: 29.6,
  note: 'A full 152-task ALE run at max effort cost about $111 and scored 29.6.',
} as const;
