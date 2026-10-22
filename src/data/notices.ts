/**
 * Notices shown on the page.
 *
 * These are not decoration. Each one states a limitation, a provenance
 * caveat, or a legal constraint that a reader needs before trusting anything
 * else on the page.
 */

export type NoticeKind = 'legal' | 'provenance' | 'status' | 'accuracy';

export type Notice = {
  id: string;
  kind: NoticeKind;
  title: string;
  body: string;
  /** Optional outbound reference. */
  href?: string;
  hrefLabel?: string;
};

export const NOTICES: readonly Notice[] = [
  {
    id: 'unofficial',
    kind: 'legal',
    title: 'Unofficial test project',
    body: 'This is a front-end demonstration built for design and engineering testing. It is not affiliated with, endorsed by, or operated by MiniMax. No content here is official product documentation.',
  },
  {
    id: 'trademark',
    kind: 'legal',
    title: 'Trademark and asset usage',
    body: 'The MiniMax name, wordmark, symbol, slogan lockup and brand imagery are the property of their respective rights holders and are used here for identification only, per the MiniMax Brand Book. Brand assets may not be altered, distorted, separated or redesigned. For permission to use these assets, contact partnercomms@minimaxai.com.',
    href: 'https://www.minimax.io/brand-vi',
    hrefLabel: 'MiniMax Brand Book',
  },
  {
    id: 'benchmarks',
    kind: 'provenance',
    title: 'Benchmark scores are vendor reported',
    body: 'Every score in the benchmark matrix comes from MiniMax’s own comparison table. No independent reproduction of the full table exists. Harness choice and context limit change results more than the models do — each row states the harness that produced it. Blank cells mean no number was published, not a score of zero.',
  },
  {
    id: 'automation-discrepancy',
    kind: 'accuracy',
    title: 'One figure has been reported two ways',
    body: 'MiniMax’s launch post and its published table have both appeared with the Automation-Bench score at 62.2 and at 62.8. This page uses 62.8, matching the vendor’s comparison table and its cost chart. Treat the figure as approximate.',
  },
  {
    id: 'hallucination',
    kind: 'accuracy',
    title: 'Knowledge reliability cuts both ways',
    body: 'Independent evaluation puts M3.1 Flash at 56% on AA-Omniscience, ahead of DeepSeek V4.1 at 43% and GLM at 28% — and also records a high hallucination rate for the same model. A strong aggregate score is not the same as a trustworthy answer. Verify before you rely on a result.',
  },
  {
    id: 'thinking-cannot-be-off',
    kind: 'status',
    title: 'Thinking cannot be turned off',
    body: 'M3.1 Flash requires adaptive thinking. Sending thinking.type = "disabled" or effort = "none" returns HTTP 400: "model \\"MiniMax-M3.1-Flash\\" requires adaptive thinking". Lower the effort level instead of trying to disable it.',
  },
  {
    id: 'weights',
    kind: 'status',
    title: 'Weights and licence',
    body: 'Model weights were scheduled for release on 2026-10-23. Self-hosting hardware requirements were not disclosed at launch, and the licence terms had not been published. The 428B / 23B figure is a Mixture-of-Experts shape, not a self-hosting recommendation.',
  },
  {
    id: 'migrating',
    kind: 'status',
    title: 'Migrating from M3',
    body: 'M3 parses inline <think> tags. M3.1 Flash returns thinking separately — a thinking content block on the Anthropic-compatible path, a reasoning_content field on the OpenAI-compatible path. Integrations that scrape <think> out of content need updating.',
  },
  {
    id: 'no-live-api',
    kind: 'accuracy',
    title: 'No live API calls in this page',
    body: 'Every number shown is static, sourced data. The cost calculator runs the published flat rates locally in your browser. Nothing is sent anywhere, and no MiniMax account or API key is involved.',
  },
] as const;

export const NOTICE_KIND_LABEL: Record<NoticeKind, string> = {
  legal: 'Legal',
  provenance: 'Provenance',
  status: 'Status',
  accuracy: 'Accuracy',
};
