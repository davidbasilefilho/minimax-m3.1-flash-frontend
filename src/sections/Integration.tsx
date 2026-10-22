import { Tab, Tabs } from 'baseui/tabs';
import { useState } from 'react';

import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { ACCESS_PATHS, MIGRATION_STEPS, PROTOCOLS, REQUEST_EXAMPLES } from '../data/access';

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className='border-line bg-canvas-deep overflow-hidden rounded-md border'>
      <div className='border-line bg-surface flex items-center justify-between gap-3 border-b px-4 py-2'>
        <span className='text-ink-3 text-xs'>{label}</span>
        <button
          type='button'
          className='rounded-pill border-line bg-surface-2 text-ink-2 ease-out-expo hover:text-ink cursor-pointer border px-[0.7rem] py-[0.2rem] text-xs transition-colors duration-150'
          onClick={() => {
            void copy();
          }}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className='text-ink-2 overflow-x-auto px-4 py-4 font-mono text-sm leading-[1.65]'>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Integration() {
  const [protocol, setProtocol] = useState<string>('anthropic');
  const active = PROTOCOLS.find((entry) => entry.id === protocol) ?? PROTOCOLS[0];

  return (
    <section
      id='integration'
      className='py-section scroll-mt-20'
      aria-labelledby='integration-title'>
      <div className='max-w-shell px-gutter mx-auto'>
        <Reveal>
          <SectionHeader
            id='integration-title'
            index='07'
            title='Integration'
            blurb='Two protocols, the same model, and one migration step that breaks integrations written for M3. MiniMax recommends the Anthropic-compatible path.'
          />
        </Reveal>

        <Reveal>
          <Tabs
            activeKey={protocol}
            onChange={({ activeKey }) => setProtocol(String(activeKey))}
            overrides={{
              Root: { style: { backgroundColor: 'transparent' } },
              TabBar: {
                style: {
                  backgroundColor: 'transparent',
                  borderBottomColor: 'var(--color-line)',
                  gap: '0.5rem',
                },
              },
              Tab: {
                style: ({ $active }: { $active?: boolean }) => ({
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: $active ? '500' : '400',
                  color: $active ? 'var(--color-ink)' : 'var(--color-ink-3)',
                  // `borderBottom`, not the longhand properties — Styletron
                  // renders atomically and mixing the two breaks the rule.
                  borderBottom: `2px solid ${$active ? 'var(--color-brand-rose)' : 'transparent'}`,
                  paddingTop: '0.6rem',
                  paddingBottom: '0.6rem',
                  marginLeft: 0,
                  marginRight: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                }),
              },
              TabContent: { style: { paddingTop: '0.5rem' } },
            }}>
            {PROTOCOLS.map((entry) => (
              <Tab key={entry.id} title={entry.label} id={entry.id}>
                <div className='grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-start gap-6 max-[900px]:grid-cols-1'>
                  <dl className='m-0 flex flex-col gap-4'>
                    {[
                      { term: 'Base URL', value: entry.baseUrl, mono: true },
                      { term: 'Endpoint', value: entry.endpoint, mono: true },
                      {
                        term: 'Thinking depth field',
                        value: entry.effortField,
                        mono: true,
                        hint: entry.effortLocation,
                      },
                      { term: 'Thinking comes back as', value: entry.thinkingField },
                      { term: 'Output limit field', value: entry.outputLimitField, mono: true },
                      { term: 'Note', value: entry.note },
                    ].map((row) => (
                      <div
                        key={row.term}
                        className='border-line flex flex-col gap-[0.15rem] border-b pb-3'>
                        <dt className='text-ink-3 text-xs'>{row.term}</dt>
                        <dd
                          className={`text-ink m-0 text-sm ${row.mono ? 'font-mono text-[0.92em] break-all' : ''}`}>
                          {row.value}
                        </dd>
                        {row.hint ? <span className='text-ink-3 text-xs'>{row.hint}</span> : null}
                      </div>
                    ))}
                  </dl>

                  <CodeBlock code={REQUEST_EXAMPLES[entry.id]} label='Request' />
                </div>
              </Tab>
            ))}
          </Tabs>
        </Reveal>

        <Reveal delay={0.08}>
          <div className='border-line mt-7 border-t pt-6'>
            <h3 className='font-display text-ink mb-5 text-lg font-normal'>Migrating from M3</h3>
            <ol className='flex flex-col gap-4'>
              {MIGRATION_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className='grid grid-cols-[44px_minmax(0,1fr)] items-start gap-4'>
                  <span className='font-display text-ink-3 after:bg-line relative pt-[0.1rem] text-sm after:absolute after:top-[0.6rem] after:right-[-0.6rem] after:left-0 after:h-px'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className='font-display text-md text-ink mb-[0.2rem] font-medium'>
                      {step.title}
                    </h4>
                    <p className='text-ink-2 max-w-[68ch] text-sm'>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className='border-line mt-7 border-t pt-6'>
            <h3 className='font-display text-ink mb-5 text-lg font-normal'>Where it runs</h3>
            <ul className='grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4'>
              {ACCESS_PATHS.map((path) => (
                <li
                  key={path.id}
                  className='border-line bg-surface flex flex-col gap-2 rounded-md border p-5'>
                  <span className='text-ink-3 text-[10px] tracking-[0.07em] uppercase'>
                    {path.kind}
                  </span>
                  <h4 className='font-display text-md text-ink font-medium'>{path.name}</h4>
                  <p className='text-ink-2 flex-1 text-sm leading-[1.55]'>{path.detail}</p>
                  <a
                    className='text-brand-rose-text hover:text-ink mt-2 self-start text-sm font-medium underline decoration-1 underline-offset-[3px]'
                    href={path.href}
                    target='_blank'
                    rel='noreferrer noopener'>
                    {path.cta}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <p className='sr-only' aria-live='polite'>
          Selected protocol: {active.label}.
        </p>
      </div>
    </section>
  );
}
