/**
 * Benchmark matrix published by MiniMax with the M3.1 Flash launch.
 *
 * Source: the vendor comparison table in the launch post
 * (https://www.minimax.io/blog/minimax-m31f) and the two cost/performance
 * charts released alongside it.
 *
 * Two honesty notes carried on the page itself:
 *  1. Every score in this file is VENDOR REPORTED. No independent
 *     reproduction of the full table exists.
 *  2. Each benchmark was run with a specific harness and context limit.
 *     Those settings are reproduced per row in `methodology` below, because
 *     they change the numbers more than the models do.
 */

export type BenchmarkGroup = 'cowork' | 'computer-use' | 'coding' | 'cyber' | 'general';

export type GroupSpec = {
  id: BenchmarkGroup;
  label: string;
  blurb: string;
};

export const GROUPS: readonly GroupSpec[] = [
  {
    id: 'cowork',
    label: 'CoWork',
    blurb: 'Knowledge work across real enterprise tools and documents.',
  },
  {
    id: 'computer-use',
    label: 'Computer use',
    blurb: 'Operating a real machine and completing cross-application tasks.',
  },
  {
    id: 'coding',
    label: 'Coding',
    blurb: 'Repository-scale software engineering under a fixed harness.',
  },
  { id: 'cyber', label: 'Cyber', blurb: 'Vulnerability discovery, patching and analysis.' },
  {
    id: 'general',
    label: 'General',
    blurb: 'Visual reasoning, hard knowledge and multimodal grounding.',
  },
] as const;

export type CompetitorId =
  'minimax' | 'deepseek-1017' | 'deepseek-41' | 'kimi-k3' | 'glm-53' | 'gpt-56-sol' | 'opus-5';

export type Competitor = {
  id: CompetitorId;
  name: string;
  short: string;
  /** True for the model this page is about. */
  isSubject: boolean;
  priceIn: number;
  priceOut: number;
  context: string;
};

export const COMPETITORS: readonly Competitor[] = [
  {
    id: 'minimax',
    name: 'MiniMax-M3.1-Flash',
    short: 'M3.1 Flash',
    isSubject: true,
    priceIn: 0.15,
    priceOut: 0.6,
    context: '1,000,000',
  },
  {
    id: 'deepseek-1017',
    name: 'DeepSeek-V4.1-Flash-1017',
    short: 'DS-V4.1-1017',
    isSubject: false,
    priceIn: 0.3,
    priceOut: 1.2,
    context: '1,000,000',
  },
  {
    id: 'deepseek-41',
    name: 'DeepSeek-V4.1-Flash',
    short: 'DS-V4.1',
    isSubject: false,
    priceIn: 0.3,
    priceOut: 1.2,
    context: '1,000,000',
  },
  {
    id: 'kimi-k3',
    name: 'Kimi-K3',
    short: 'Kimi K3',
    isSubject: false,
    priceIn: 3.0,
    priceOut: 15.0,
    context: '1,048,576',
  },
  {
    id: 'glm-53',
    name: 'GLM-5.3',
    short: 'GLM-5.3',
    isSubject: false,
    priceIn: 1.4,
    priceOut: 4.4,
    context: '1,048,576',
  },
  {
    id: 'gpt-56-sol',
    name: 'GPT-5.6 Sol',
    short: 'GPT-5.6 Sol',
    isSubject: false,
    priceIn: 0,
    priceOut: 0,
    context: '—',
  },
  {
    id: 'opus-5',
    name: 'Opus 5',
    short: 'Opus 5',
    isSubject: false,
    priceIn: 0,
    priceOut: 0,
    context: '—',
  },
] as const;

export type BenchmarkRow = {
  id: string;
  group: BenchmarkGroup;
  name: string;
  /** Harness and context limit the vendor used. Reproduced verbatim. */
  methodology: string;
  /** Score per competitor. `null` means the vendor published no number. */
  scores: Record<CompetitorId, number | null>;
  /** Higher is better. Used to decide the spectral position of the bar. */
  unit: 'score' | 'percent';
};

export const BENCHMARKS: readonly BenchmarkRow[] = [
  {
    id: 'automation-bench',
    group: 'cowork',
    name: 'Automation-Bench v1.0.6',
    methodology:
      'Evaluated on the 600 publicly released tasks (zapier/AutomationBench). Harness: Claude Code.',
    scores: {
      minimax: 62.8,
      'deepseek-1017': 60.5,
      'deepseek-41': 54.8,
      'kimi-k3': 46.7,
      'glm-53': 48.8,
      'gpt-56-sol': 45.8,
      'opus-5': 50.3,
    },
    unit: 'percent',
  },
  {
    id: 'banker-tool-bench',
    group: 'cowork',
    name: 'BankerToolBench',
    methodology:
      'Evaluated with the OpenCode 1.17.18 harness, with MiniMax-M2.7 as the judge model.',
    scores: {
      minimax: 76.2,
      'deepseek-1017': null,
      'deepseek-41': 73.7,
      'kimi-k3': 69.1,
      'glm-53': 74.5,
      'gpt-56-sol': 74.6,
      'opus-5': 76.2,
    },
    unit: 'score',
  },
  {
    id: 'gdp-pdf',
    group: 'cowork',
    name: 'GDP.pdf AA',
    methodology: 'Results taken directly from Artificial Analysis.',
    scores: {
      minimax: 20.8,
      'deepseek-1017': null,
      'deepseek-41': 12.8,
      'kimi-k3': 22.0,
      'glm-53': 11.2,
      'gpt-56-sol': 27.2,
      'opus-5': 21.6,
    },
    unit: 'score',
  },
  {
    id: 'terminal-bench',
    group: 'cowork',
    name: 'Terminal Bench 4.0',
    methodology: 'Harness: Codex 0.149.1.',
    scores: {
      minimax: 38.1,
      'deepseek-1017': 42.3,
      'deepseek-41': 31.2,
      'kimi-k3': 12.6,
      'glm-53': 37.9,
      'gpt-56-sol': 39.9,
      'opus-5': 51.8,
    },
    unit: 'score',
  },
  {
    id: 'loca-bench',
    group: 'cowork',
    name: 'LOCA-Bench 256K',
    methodology:
      'Evaluated with the official implementation (hkust-nlp/LOCA-bench) under controllable and extreme context.',
    scores: {
      minimax: 60.3,
      'deepseek-1017': null,
      'deepseek-41': null,
      'kimi-k3': 49.7,
      'glm-53': 50.3,
      'gpt-56-sol': 60.0,
      'opus-5': 53.7,
    },
    unit: 'score',
  },
  {
    id: 'agents-last-exam',
    group: 'computer-use',
    name: "Agents' Last Exam",
    methodology:
      'Official Overall setting. Only full-set results published on the official ALE leaderboard are included. Blank entries are not a score of zero.',
    scores: {
      minimax: 29.6,
      'deepseek-1017': null,
      'deepseek-41': null,
      'kimi-k3': 28.3,
      'glm-53': null,
      'gpt-56-sol': 30.6,
      'opus-5': 32.2,
    },
    unit: 'percent',
  },
  {
    id: 'osworld',
    group: 'computer-use',
    name: 'OSWorld 2.0',
    methodology:
      "Evaluated on the officially recommended 0808 Full release. Each model's score is the highest reported at its release, except for DS-V4.1, whose score comes from an in-house reproduction.",
    scores: {
      minimax: 61.7,
      'deepseek-1017': null,
      'deepseek-41': 54.3,
      'kimi-k3': 58.3,
      'glm-53': null,
      'gpt-56-sol': 65.7,
      'opus-5': 70.6,
    },
    unit: 'score',
  },
  {
    id: 'posttrain-bench',
    group: 'coding',
    name: 'PostTrain Bench v1.1',
    methodology:
      'Harness: Claude Code 2.1.251, maximum context window of 512K tokens. All other settings follow the official evaluation setup.',
    scores: {
      minimax: 39.3,
      'deepseek-1017': null,
      'deepseek-41': 30.5,
      'kimi-k3': 36.6,
      'glm-53': 37.5,
      'gpt-56-sol': 36.2,
      'opus-5': 40.4,
    },
    unit: 'score',
  },
  {
    id: 'deepswe',
    group: 'coding',
    name: 'DeepSWE v1.1',
    methodology: 'Harness: mini-SWE-agent 2.4.5, maximum context window of 512K tokens.',
    scores: {
      minimax: 73.7,
      'deepseek-1017': 77.0,
      'deepseek-41': 74.2,
      'kimi-k3': 67.5,
      'glm-53': 66.9,
      'gpt-56-sol': 73.0,
      'opus-5': 74.0,
    },
    unit: 'percent',
  },
  {
    id: 'nl2repo-bench',
    group: 'coding',
    name: 'NL2Repo-Bench',
    methodology:
      'Harness: Claude Code 2.1.233, maximum context window of 512K tokens. Evaluation cases involving reward hacking were assigned reward = 0.',
    scores: {
      minimax: 61.2,
      'deepseek-1017': 68.2,
      'deepseek-41': 65.4,
      'kimi-k3': 58.0,
      'glm-53': 58.0,
      'gpt-56-sol': 56.8,
      'opus-5': 75.3,
    },
    unit: 'score',
  },
  {
    id: 'swe-refactor',
    group: 'coding',
    name: 'SWE Refactor Bench',
    methodology:
      'Harness: Claude Code 2.1.220, maximum context window of 200K tokens. All other settings follow the official evaluation setup.',
    scores: {
      minimax: 23.0,
      'deepseek-1017': null,
      'deepseek-41': 11.8,
      'kimi-k3': 19.5,
      'glm-53': 10.4,
      'gpt-56-sol': 28.5,
      'opus-5': 31.0,
    },
    unit: 'score',
  },
  {
    id: 'cybergym',
    group: 'cyber',
    name: 'CyberGym',
    methodology: 'Harness: Claude Code 2.1.263, maximum context window of 1M tokens.',
    scores: {
      minimax: 82.2,
      'deepseek-1017': null,
      'deepseek-41': null,
      'kimi-k3': 80.0,
      'glm-53': 84.5,
      'gpt-56-sol': 83.6,
      'opus-5': null,
    },
    unit: 'score',
  },
  {
    id: 'babyvision',
    group: 'general',
    name: 'BabyVision (w/ tools)',
    methodology:
      'Harness: Claude Code 2.1.285, with the minimum image side length set to 1,500 pixels.',
    scores: {
      minimax: 91.0,
      'deepseek-1017': 92.5,
      'deepseek-41': 89.6,
      'kimi-k3': 85.7,
      'glm-53': null,
      'gpt-56-sol': 88.9,
      'opus-5': 94.1,
    },
    unit: 'score',
  },
  {
    id: 'hle',
    group: 'general',
    name: 'HLE (w/o tools)',
    methodology:
      'Restricted to the 2,158 questions with text-only prompts. Reported scores are calculated on this subset.',
    scores: {
      minimax: 43.4,
      'deepseek-1017': 44.0,
      'deepseek-41': 39.2,
      'kimi-k3': 43.5,
      'glm-53': 42.3,
      'gpt-56-sol': 49.5,
      'opus-5': 55.6,
    },
    unit: 'score',
  },
  {
    id: 'charxiv-rq',
    group: 'general',
    name: 'CharXiv RQ',
    methodology: 'Uses GPT-5.5 as the judge model.',
    scores: {
      minimax: 82.5,
      'deepseek-1017': null,
      'deepseek-41': 69.0,
      'kimi-k3': 84.8,
      'glm-53': null,
      'gpt-56-sol': 85.2,
      'opus-5': 83.7,
    },
    unit: 'score',
  },
] as const;

/**
 * Agents' Last Exam — pass rate against total cost, from the vendor chart.
 * 152 tasks, ALE-V1 Overall, public model data as of 2026-10-18.
 * Best harness and effort per model.
 */
export type AlePoint = {
  model: string;
  passRate: number;
  costUsd: number;
  vendor:
    | 'MiniMax'
    | 'OpenAI'
    | 'Anthropic'
    | 'Meta'
    | 'Alibaba'
    | 'xAI'
    | 'Moonshot'
    | 'Zhipu'
    | 'DeepSeek'
    | 'Google';
};

export const ALE_CURVE: readonly AlePoint[] = [
  { model: 'MiniMax-M3.1-Flash', passRate: 29.6, costUsd: 111, vendor: 'MiniMax' },
  { model: 'Claude Opus 5.5', passRate: 38.0, costUsd: 1500, vendor: 'Anthropic' },
  { model: 'GPT-6 Astra', passRate: 35.0, costUsd: 1100, vendor: 'OpenAI' },
  { model: 'Claude Opus 5', passRate: 33.0, costUsd: 1200, vendor: 'Anthropic' },
  { model: 'GPT-5.6 Sol', passRate: 30.5, costUsd: 700, vendor: 'OpenAI' },
  { model: 'GPT-6 Sol', passRate: 32.5, costUsd: 300, vendor: 'OpenAI' },
  { model: 'Muse Spark 1.3', passRate: 32.5, costUsd: 400, vendor: 'Meta' },
  { model: 'GPT-5.6 Luna', passRate: 30.2, costUsd: 250, vendor: 'OpenAI' },
  { model: 'GPT-5.6 Terra', passRate: 28.0, costUsd: 500, vendor: 'OpenAI' },
  { model: 'Kimi K3', passRate: 28.0, costUsd: 650, vendor: 'Moonshot' },
  { model: 'Qwen-3-8-max', passRate: 26.5, costUsd: 480, vendor: 'Alibaba' },
  { model: 'Grok 4.5', passRate: 26.5, costUsd: 320, vendor: 'xAI' },
  { model: 'GPT-5.5', passRate: 26.0, costUsd: 600, vendor: 'OpenAI' },
  { model: 'GPT-5.4', passRate: 20.5, costUsd: 250, vendor: 'OpenAI' },
  { model: 'GLM-5.2', passRate: 20.5, costUsd: 1000, vendor: 'Zhipu' },
  { model: 'Claude Opus 4.7', passRate: 20.5, costUsd: 1700, vendor: 'Anthropic' },
  { model: 'Gemini 3.1 Pro', passRate: 16.0, costUsd: 1800, vendor: 'Google' },
  { model: 'Qwen3.7-Max', passRate: 12.5, costUsd: 700, vendor: 'Alibaba' },
  { model: 'DeepSeek V4 Pro', passRate: 12.5, costUsd: 250, vendor: 'DeepSeek' },
  { model: 'GLM-5.1', passRate: 12.0, costUsd: 420, vendor: 'Zhipu' },
  { model: 'Kimi K2.6', passRate: 9.0, costUsd: 120, vendor: 'Moonshot' },
] as const;

/**
 * DeepSWE v1.1 — score against cost per task, from the vendor chart.
 * DeepSWE v1.1 leaderboard as of 2026-09-22, harness: mini-swe-agent.
 */
export type EffortPoint = {
  effort: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  score: number;
  costUsd: number;
};

export const DEEPSWE_CURVE: readonly EffortPoint[] = [
  { effort: 'low', score: 67.3, costUsd: 0.245 },
  { effort: 'high', score: 68.1, costUsd: 0.255 },
  { effort: 'xhigh', score: 72.1, costUsd: 0.265 },
  { effort: 'max', score: 73.7, costUsd: 0.278 },
] as const;
