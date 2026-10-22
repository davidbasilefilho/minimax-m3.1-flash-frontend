# SIGNAL — MiniMax M3.1 Flash

An **unofficial** front-end showcase and model dossier for
[MiniMax M3.1 Flash](https://www.minimax.io/blog/minimax-m31f), built as a working
demonstration of a design system derived from the official
[MiniMax Brand Book](https://www.minimax.io/brand-vi).

Front-end only. Every number on the page is static, sourced data — the application
makes no API calls, needs no MiniMax account and holds no API key.

> **Not affiliated with MiniMax.** This project is a design and engineering test
> built for a portfolio. The MiniMax name, wordmark, symbol, slogan lockup and brand
> imagery remain the property of their respective rights holders and are used here for
> identification only, per the MiniMax Brand Book. See [Notices on the page](#notices)
> and [`NOTICE`](./NOTICE).

---

## The design system

**SIGNAL** is an instrument bench for a model that never stops thinking. The MiniMax
mark is a monoline oscilloscope trace, so the trace became the grammar of the whole
interface: the hero signal, the section divider, the scroll spine, the loader and the
chart are all the same mark at a different scale.

Four rules come straight from the mark:

| Rule | Consequence |
| --- | --- |
| One stroke weight | A 1px hairline for structure, a 2px signal weight for anything live. Nothing between. |
| Rounded, always | Round caps, round elbows, pill controls, 14px panels. |
| Continuous, not separated | Sections are joined by a drawn trace, not by empty space. |
| The gradient carries data | A score's colour is its position on the brand scale. The gradient is a reading, never a wash. |

**Colour** is the eight brand hues verbatim — rose `#FF3763`, coral `#FF6452`,
orange `#FF7038`, violet `#7A27FF`, lilac `#A36AFF`, azure `#1BA4FF`, cyan `#38CDFF`,
deep red `#9A0010` — arranged into four named gradients, plus two themes: `chamber`
(dark, default) and `daylight` (light).

**Type** is the brand's own three families, self-hosted: Outfit for display, DM Sans
for body and interface, Libre Baskerville for the editorial voice.

---

## Stack

| | |
| --- | --- |
| Build | Vite 8 · TypeScript 5.9 |
| UI | React 19.3 with the **React Compiler** enabled |
| Components | **Base Web 18** (Uber) with a custom Styletron theme built on the brand tokens |
| State | **@tanstack/react-store** — theme, motion, effort, calculator, notices |
| Data | **@tanstack/react-table** v9 for the benchmark matrix · **@tanstack/react-virtual** for the field-notes log |
| Motion | **motion** 14 · **lenis** for smooth scrolling |
| Deploy | **Nitro 3** — one build, any platform. Cloudflare Workers by default. |

### React Compiler

The compiler is on via `@vitejs/plugin-react`'s `compiler` option, and the
`eslint-plugin-react-hooks` v7 compiler diagnostics are promoted to **error** so a
silent compiler bail fails the build rather than shipping a re-render bug.

There is no hand-written `useMemo`, `useCallback` or `React.memo` in the codebase.
The one exception is documented in `src/components/VirtualNotes.tsx`: TanStack
Virtual's `useVirtualizer()` returns functions that cannot be memoised safely, so
the compiler skips that component. Keeping the call inside one small component
scopes the skip to exactly that component.

---

## Running it

```bash
bun install
bun run dev          # Vite dev server on http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `bun run dev` | Vite dev server with HMR |
| `bun run build:web` | Static SPA build into `dist/` |
| `bun run build` | SPA build + Nitro build into `.output/` |
| `bun run preview` | Preview the Vite build |
| `bun run preview:worker` | Preview the Cloudflare Worker with `wrangler dev` |
| `bun run deploy` | Build and deploy to Cloudflare Workers |
| `bun run typecheck` | `tsc -b` across app, server and config |
| `bun run lint` | ESLint with the compiler diagnostics at error level |

### URL preferences

A link can carry a preference: `?theme=daylight`, `?theme=chamber`, `?motion=calm`,
`?motion=live`. The masthead switch overrides it and the choice is remembered in
`localStorage`.

---

## Deployment

Nitro sits underneath as the deployment layer so the same build can land anywhere.
The preset is selected with `NITRO_PRESET`:

```bash
NITRO_PRESET=cloudflare_module bun run build   # Cloudflare Workers (default)
NITRO_PRESET=cloudflare-pages bun run build    # Cloudflare Pages
NITRO_PRESET=netlify         bun run build    # Netlify
NITRO_PRESET=vercel          bun run build    # Vercel
NITRO_PRESET=node-server     bun run build    # Node
NITRO_PRESET=static          bun run build    # Static hosting
```

For Cloudflare Workers:

```bash
bun run build
bunx wrangler deploy
```

Nitro generates `.output/server/wrangler.json` with the assets binding wired up.
The only server route is `GET /api/health`, which exists so the platform has
something to ping.

---

## Accessibility

- Skip link, landmarks, and `aria-labelledby` on every section.
- The focus ring is **never** removed — a 2px ring on a higher-specificity selector
  so it wins against the component library's own focus styling.
- **Keyboard and mouse are independent.** Every hover affordance has a
  `:focus-visible` twin, every drag has a keyboard equivalent, and all content is
  reachable by Tab as well as by the section index.
- `aria-live="polite"` on the cost calculator output and the selected effort level.
  Decorative motion is `aria-hidden`.
- Text contrast is checked in both themes; text-safe variants of each brand hue
  exist per theme.
- `prefers-reduced-motion` collapses every duration to 1ms, disables Lenis and
  removes parallax. The masthead switch does the same thing on demand.

---

## What is on the page

| Section | Contents |
| --- | --- |
| 00 Overview | The live trace, driven by the selected thinking depth |
| 01 Notices | Nine limitations, provenance caveats and legal constraints |
| 02 Vitals | 428B / 23B mixture of experts, 1M context, and a field of 428 marks with 23 lit |
| 03 Thinking depth | The five `effort` levels, and the score curves they produce |
| 04 Benchmarks | Fifteen benchmarks × seven models, sortable, with the published harness for each |
| 05 Cost | A live calculator over the published flat rates |
| 06 Throughput | Vendor claims and independent measurements, side by side |
| 07 Integration | Both API protocols, the request bodies, and the M3 migration steps |
| 08 Field notes | Thirty-eight dated events, windowed |
| 09 Design system | The tokens, type, motion and component rules, shown on themselves |

---

## Sources

- MiniMax launch post — <https://www.minimax.io/blog/minimax-m31f>
- MiniMax model documentation — <https://platform.minimax.io/docs/guides/text-generation>
- MiniMax agent product page — <https://agent.minimax.io/tools/m3-1-flash-preview>
- MiniMax Brand Book — <https://www.minimax.io/brand-vi>
- Artificial Analysis — <https://artificialanalysis.ai/models/minimax-m3-1-flash>
- LLM Stats — <https://llm-stats.com/models/minimax-m3.1-flash>

Every benchmark score in this project is **vendor reported** by MiniMax. No
independent reproduction of the full table exists. Harness choice and context limit
change results more than the models do, so each row names the harness that produced
it.

---

## Licence

Apache 2.0 — see [`LICENSE`](./LICENSE). Copyright 2026 David Basile Filho.

Third-party components keep their own licences; see [`NOTICE`](./NOTICE).

---

## Agent skills

The workspace skills this project was built with are committed alongside the source
rather than ignored, so the repository is self-contained:

- `.agents/skills/frontend-design` — the design direction skill
- `.agents/skills/react-compiler` — the React Compiler rules and lint setup
- `.claude/skills/…` — the same two skills, mirrored for Claude Code
- `skills-lock.json` — the manifest recording where each skill came from and its
  content hash

`.claude/skills/*` are links into `.agents/skills/*` on the author's machine. Git
records the resolved content rather than the link, so a clone gets real files on
every platform and no absolute paths to break.

