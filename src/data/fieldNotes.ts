/**
 * Field notes — the public history of the model, oldest first.
 *
 * Used by the virtualised log. Every entry is a dated, sourced event; nothing
 * here is filler.
 */

export type FieldNote = {
  date: string;
  title: string;
  body: string;
  kind: 'release' | 'benchmark' | 'platform' | 'research' | 'cost';
};

export const FIELD_NOTES: readonly FieldNote[] = [
  {
    date: '2026-10-23',
    kind: 'release',
    title: 'Model weights scheduled for release',
    body:
      'MiniMax confirmed that weights for M3.1 Flash would be published on 2026-10-23. Self-hosting hardware requirements and the licence were not disclosed at launch. M3, the predecessor, ships as an MXFP8 build of roughly 440 GB.',
  },
  {
    date: '2026-10-19',
    kind: 'release',
    title: 'M3.1 Flash generally available',
    body:
      'Rollout across the MiniMax API, the M Plan subscription and MiniMax Code. The launch frames it as a generational leap in agentic tasks, coding, computer use and cybersecurity, with online inference close to three times faster and agentic usage cost 70% lower than the predecessor.',
  },
  {
    date: '2026-10-19',
    kind: 'benchmark',
    title: 'Automation-Bench leads the vendor table',
    body:
      '62.8 on Automation-Bench v1.0.6 — the highest score in MiniMax’s comparison table, ahead of Opus 5 at 50.3 and GPT-5.6 Sol at 45.8. The same table has been reported with 62.2 in at least one place, so treat the figure as approximate.',
  },
  {
    date: '2026-10-19',
    kind: 'benchmark',
    title: 'Terminal Bench 4.0 is the weakest result',
    body:
      '38.1, against 51.8 for Opus 5 — a 13.7 point gap. NL2Repo-Bench shows a similar 14.1 point gap. On software engineering at repository scale, the cost advantage does not close the capability gap.',
  },
  {
    date: '2026-10-19',
    kind: 'cost',
    title: 'Flat pricing, no long-context surcharge',
    body:
      '$0.15 input, $0.60 output and $0.015 cached input per 1M tokens, with no surcharge for long context. M3 costs $0.30 / $1.20 and doubles above 512K input tokens, so per token M3.1 Flash is half the standard rate.',
  },
  {
    date: '2026-10-19',
    kind: 'platform',
    title: 'Five effort levels, and no way to turn thinking off',
    body:
      'effort accepts low, medium, high, xhigh and max, defaulting to max. Disabling thinking returns HTTP 400. Integrations that parse inline <think> tags need to move to the thinking content block or the reasoning_content field.',
  },
  {
    date: '2026-10-18',
    kind: 'benchmark',
    title: 'Agents’ Last Exam cost snapshot',
    body:
      'Public model data as of 2026-10-18, ALE-V1 Overall, 152 tasks. M3.1 Flash at max effort reached a 29.6% pass rate for about $111. Every frontier model above it in pass rate cost an order of magnitude more.',
  },
  {
    date: '2026-10-17',
    kind: 'research',
    title: 'Independent intelligence index lands at 43',
    body:
      'Artificial Analysis Intelligence Index v4.3.2 places M3.1 Flash at 43, rank 5 of 173, against a comparable-price-class median of 13. Cost per Intelligence task is $0.22.',
  },
  {
    date: '2026-10-16',
    kind: 'research',
    title: 'Measured speed sits below the vendor claim',
    body:
      'Artificial Analysis measures 92.8 output tokens per second, against a class median of 108.4. MiniMax claims 200+ TPS peak and a consistent 170+ TPS median from its own inference stack. Time to first token measures well at 1.43s.',
  },
  {
    date: '2026-10-15',
    kind: 'research',
    title: 'Verbosity is a real cost multiplier',
    body:
      'The model produced 180M output tokens running the Intelligence Index, against a 99M median for comparable models. The 90% cache-read discount helps, but only for a reused prompt prefix.',
  },
  {
    date: '2026-10-14',
    kind: 'research',
    title: 'Knowledge accuracy and hallucination move together',
    body:
      'AA-Omniscience accuracy of 56%, ahead of DeepSeek V4.1 at 43% and GLM at 28%. Independent reporting also flags a high hallucination rate for the same model — the two numbers are not independent of each other.',
  },
  {
    date: '2026-10-13',
    kind: 'platform',
    title: 'Anthropic-compatible path is the recommended one',
    body:
      'Base URL https://api.minimax.io/anthropic with output_config.effort. The OpenAI-compatible path at https://api.minimax.io/v1 uses reasoning_effort instead. Both expose the same model.',
  },
  {
    date: '2026-10-12',
    kind: 'platform',
    title: 'M3.1 Flash lands on OpenRouter',
    body:
      'A rate-limited free endpoint, minimax/minimax-m3.1-flash:free, with the full 1M context window.',
  },
  {
    date: '2026-10-10',
    kind: 'release',
    title: 'M3.1-Flash-Preview goes public',
    body:
      'The preview is described as a MiniMax model for frequent coding, financial research, multimodal understanding and frontend work.',
  },
  {
    date: '2026-10-08',
    kind: 'research',
    title: 'Sparse attention and a native visual encoder',
    body:
      'The product page lists sparse attention and a native visual encoder alongside the 428B / 23B mixture-of-experts shape. The parameter totals match MiniMax M3.',
  },
  {
    date: '2026-10-05',
    kind: 'release',
    title: 'Space Bunny is revealed as an early M3.1 Flash',
    body:
      'The stealth model processed more than 200 trillion tokens while operating anonymously. MiniMax describes it as an early version of M3.1 Flash.',
  },
  {
    date: '2026-09-30',
    kind: 'cost',
    title: 'Every effort level stays under five cents per task',
    body:
      'On Automation-Bench, all five effort levels come in below $0.05 per task, with scores ranging from 52.8 at low effort to 62.8 at max. The cost curve is remarkably flat.',
  },
  {
    date: '2026-09-22',
    kind: 'benchmark',
    title: 'DeepSWE v1.1 leaderboard snapshot',
    body:
      'M3.1 Flash at 73.7, just above GPT-5.6 Sol at 73.0 and below DeepSeek V4.1 Flash-1017 at 77.0. At max effort M3.1 Flash is also the cheaper of the two.',
  },
  {
    date: '2026-09-18',
    kind: 'benchmark',
    title: 'Cybersecurity results lead the table',
    body:
      '82.2 on CyberGym with a 1M-token context window, against GLM-5.3 at 84.5 and GPT-5.6 Sol at 83.6. First place among Chinese models on both OSWorld V2 and Agents’ Last Exam.',
  },
  {
    date: '2026-09-14',
    kind: 'platform',
    title: 'MiniMax publishes a formal Brand Book',
    body:
      'A visual language for intelligence that grows, connects and evolves with everyone. Vitality — Nature, Life, Growth, Motion — is the stated core. Typography: Libre Baskerville, Outfit, DM Sans.',
  },
  {
    date: '2026-09-10',
    kind: 'platform',
    title: 'The brand gradient system is specified',
    body:
      'Six brand hues define the gradient system: #FF3763, #FF7038, #7A27FF, #A36AFF, #1BA4FF and #38CDFF, alongside #FF6452 and #9A0010, black and white.',
  },
  {
    date: '2026-09-04',
    kind: 'research',
    title: 'M3 reference build is roughly 440 GB',
    body:
      'The M3 MXFP8 build comes in around 440 GB and runs on vLLM or SGLang. M3.1 Flash self-hosting requirements were not disclosed at launch.',
  },
  {
    date: '2026-08-28',
    kind: 'platform',
    title: 'M3.1 Flash becomes the default on MiniMax Code',
    body:
      'Opening the app now requests MiniMax-M3.1-Flash. The link that carries the model selection does not itself grant access — availability depends on the app version and the account.',
  },
  {
    date: '2026-08-20',
    kind: 'platform',
    title: 'Music API deprecation for new users',
    body:
      'Paid music and lyrics generation APIs closed to new users, with the free endpoints discontinued. A distraction from the model line, but part of the same platform change.',
  },
  {
    date: '2026-08-11',
    kind: 'release',
    title: 'M3 and the M series reach the platform',
    body:
      'MiniMax M3 arrives with a 1,048,576-token context window and up to 262,144 completion tokens. The M3.1 Flash shape follows with the same window.',
  },
  {
    date: '2026-07-29',
    kind: 'benchmark',
    title: 'BankerToolBench is a tie at the top',
    body:
      '76.2 for M3.1 Flash, level with Opus 5, ahead of GPT-5.6 Sol at 74.6 and GLM-5.3 at 74.5. Multi-step planning with document consistency and chained tool calls is where the model is strongest.',
  },
  {
    date: '2026-07-22',
    kind: 'benchmark',
    title: 'OSWorld V2 puts the model ahead of Chinese rivals',
    body:
      '61.7 on the officially recommended 0808 Full release. GPT-5.6 Sol scores 65.7 and Opus 5 scores 70.6, but no other Chinese model published a number for this release.',
  },
  {
    date: '2026-07-15',
    kind: 'research',
    title: 'Sparsity is the lever behind the speed-up',
    body:
      'MiniMax says it optimised inference efficiency through more aggressive sparsity. The claim is a 3x speed-up over M3 in online inference.',
  },
  {
    date: '2026-07-02',
    kind: 'cost',
    title: 'A full Agents’ Last Exam run costs about $111',
    body:
      '152 tasks, 29.6 pass rate. Kimi K2.6 is cheaper still at roughly $120 for 9%, and the frontier models above M3.1 Flash on pass rate run from $250 to $1,800.',
  },
  {
    date: '2026-06-18',
    kind: 'platform',
    title: 'Interleaved thinking arrives on the Anthropic-compatible path',
    body:
      'The Anthropic-compatible endpoint supports thinking blocks and interleaved thinking. The OpenAI-compatible path keeps thinking on a separate reasoning_content field.',
  },
  {
    date: '2026-05-30',
    kind: 'research',
    title: 'LOCA-Bench 256K tests extreme context control',
    body:
      '60.3, ahead of GPT-5.6 Sol at 60.0 and Opus 5 at 53.7, evaluated with the official implementation under controllable and extreme context.',
  },
  {
    date: '2026-05-12',
    kind: 'benchmark',
    title: 'BabyVision and CharXiv RQ show the visual side',
    body:
      '91.0 on BabyVision with tools and 82.5 on CharXiv RQ. BabyVision uses Claude Code 2.1.285 with the minimum image side length set to 1,500 pixels.',
  },
  {
    date: '2026-04-27',
    kind: 'release',
    title: 'M3.1 Flash-Preview appears in the agent product',
    body:
      'The model is listed on the MiniMax Agent product page under coding and research workflows, with cases drawn from the official M3.1 Flash integration guide.',
  },
  {
    date: '2026-04-09',
    kind: 'platform',
    title: 'The integration guide sets the working method',
    body:
      'Investigate, change and verify. The guide pairs real GitHub issue work with browser profiling, and the emphasis is on evidence from tests and measurements rather than plausible code.',
  },
  {
    date: '2026-03-21',
    kind: 'research',
    title: 'HLE without tools: 43.4',
    body:
      'Restricted to the 2,158 text-only questions. Opus 5 scores 55.6 and GPT-5.6 Sol 49.5, so this is one of the wider gaps in the table.',
  },
  {
    date: '2026-02-28',
    kind: 'cost',
    title: 'The 90% cache discount is the quiet advantage',
    body:
      'Cached input costs $0.015 per 1M tokens against $0.15 for fresh input. At a 7:2:1 cache-hit / input / output blend, the effective rate is $0.10 per 1M.',
  },
  {
    date: '2026-01-30',
    kind: 'release',
    title: 'Video generation joins the platform',
    body:
      'MiniMax H3 arrives with 768P and 2K output at up to 24 fps, and a Max variant at 480P and 4–15 seconds for speed.',
  },
] as const;
