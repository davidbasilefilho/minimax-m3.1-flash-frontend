/**
 * How to call MiniMax M3.1 Flash.
 *
 * Sources: https://platform.minimax.io/docs/guides/text-generation
 *          https://platform.minimax.io/docs/api-reference/text-anthropic-api
 */

export type Protocol = {
  id: 'anthropic' | 'openai';
  label: string;
  recommended: boolean;
  baseUrl: string;
  endpoint: string;
  effortField: string;
  effortLocation: string;
  thinkingField: string;
  outputLimitField: string;
  note: string;
};

export const PROTOCOLS: readonly Protocol[] = [
  {
    id: 'anthropic',
    label: 'Anthropic-compatible',
    recommended: true,
    baseUrl: 'https://api.minimax.io/anthropic',
    endpoint: '/v1/messages',
    effortField: 'output_config.effort',
    effortLocation: 'Top-level output_config object',
    thinkingField: 'thinking content block',
    outputLimitField: 'max_tokens',
    note:
      'Supports thinking blocks, interleaved thinking and streaming. This is the default path.',
  },
  {
    id: 'openai',
    label: 'OpenAI-compatible',
    recommended: false,
    baseUrl: 'https://api.minimax.io/v1',
    endpoint: '/chat/completions',
    effortField: 'reasoning_effort',
    effortLocation: 'Top-level request body',
    thinkingField: 'reasoning_content field',
    outputLimitField: 'max_tokens / max_completion_tokens',
    note:
      'Already wired up to the OpenAI SDK. Thinking is always returned on reasoning_content while content holds only the final answer.',
  },
] as const;

export const REQUEST_EXAMPLES: Record<Protocol['id'], string> = {
  anthropic: `curl https://api.minimax.io/anthropic/v1/messages \\
  -H "Authorization: Bearer <MINIMAX_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "MiniMax-M3.1-Flash",
    "output_config": {"effort": "max"},
    "max_tokens": 4096,
    "messages": [
      {"role": "user", "content": "Hi, how are you?"}
    ]
  }'`,
  openai: `curl https://api.minimax.io/v1/chat/completions \\
  -H "Authorization: Bearer <MINIMAX_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "MiniMax-M3.1-Flash",
    "reasoning_effort": "max",
    "messages": [
      {"role": "user", "content": "Hi, how are you?"}
    ]
  }'`,
};

export type AccessPath = {
  id: string;
  name: string;
  kind: 'api' | 'subscription' | 'app' | 'aggregator';
  detail: string;
  href: string;
  cta: string;
};

export const ACCESS_PATHS: readonly AccessPath[] = [
  {
    id: 'api',
    name: 'MiniMax developer platform',
    kind: 'api',
    detail:
      'The model runs as MiniMax-M3.1-Flash on platform.minimax.io. Anthropic-compatible and OpenAI-compatible endpoints, both streaming and non-streaming.',
    href: 'https://platform.minimax.io/docs/guides/text-generation',
    cta: 'Read the API guide',
  },
  {
    id: 'm-plan',
    name: 'M Plan',
    kind: 'subscription',
    detail:
      'A MiniMax subscription that bundles access to the model alongside the rest of the M series.',
    href: 'https://www.minimax.io/m-plan',
    cta: 'See M Plan',
  },
  {
    id: 'code',
    name: 'MiniMax Code',
    kind: 'app',
    detail:
      'A desktop coding agent where M3.1 Flash is the working model. Bring a repository, a reproduction and acceptance criteria; the emphasis is on evidence from tests and measurements.',
    href: 'https://agent.minimax.io/download',
    cta: 'Download MiniMax Code',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    kind: 'aggregator',
    detail:
      'A rate-limited free endpoint under minimax/minimax-m3.1-flash:free, with the same 1M context window.',
    href: 'https://openrouter.ai/minimax/minimax-m3.1-flash:free',
    cta: 'Open on OpenRouter',
  },
] as const;

export const MIGRATION_STEPS = [
  {
    title: 'Stop sending thinking.type',
    body:
      'thinking: {"type": "disabled"} and effort: "none" both return HTTP 400 on M3.1 Flash. Remove the field rather than toggling it.',
  },
  {
    title: 'Pick a level instead',
    body:
      'effort accepts low, medium, high, xhigh and max. Omitting it defaults to max. Set it explicitly if you want predictable latency and cost.',
  },
  {
    title: 'Read thinking from its own field',
    body:
      'On the Anthropic-compatible path a thinking content block arrives before the text block. On the OpenAI-compatible path it arrives on reasoning_content. Stop parsing <think> out of content.',
  },
  {
    title: 'Stop relying on disabled-reasoning latency',
    body:
      'Always-on reasoning sets a token and latency floor even for a trivial call. If a request used to feel instant, lower the effort level to get some of that back.',
  },
] as const;
