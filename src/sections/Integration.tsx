import { useState } from 'react';
import { Tab, Tabs } from 'baseui/tabs';

import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';
import { ACCESS_PATHS, MIGRATION_STEPS, PROTOCOLS, REQUEST_EXAMPLES } from '../data/access';
import './integration.css';

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
    <div className="mm-code">
      <div className="mm-code__head">
        <span className="mm-code__label">{label}</span>
        <button type="button" className="mm-code__copy" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="mm-code__body" tabIndex={0}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Integration() {
  const [protocol, setProtocol] = useState<string>('anthropic');
  const active = PROTOCOLS.find((entry) => entry.id === protocol) ?? PROTOCOLS[0];

  return (
    <section id="integration" className="mm-section" aria-labelledby="integration-title">
      <div className="mm-shell">
        <Reveal>
          <SectionHeader
            id="integration-title"
            index="07"
            title="Integration"
            blurb="Two protocols, the same model, and one migration step that breaks integrations written for M3. MiniMax recommends the Anthropic-compatible path."
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
                  borderBottomColor: 'var(--mm-line)',
                  gap: 'var(--mm-space-2)',
                },
              },
              Tab: {
                style: ({ $active }: { $active?: boolean }) => ({
                  fontFamily: 'var(--mm-font-body)',
                  fontSize: 'var(--mm-text-sm)',
                  fontWeight: $active ? '500' : '400',
                  color: $active ? 'var(--mm-ink)' : 'var(--mm-ink-3)',
                  // `borderBottom`, not the longhand properties — Styletron
                  // renders atomically and mixing the two breaks the rule.
                  borderBottom: `2px solid ${$active ? 'var(--mm-rose)' : 'transparent'}`,
                  paddingTop: '0.6rem',
                  paddingBottom: '0.6rem',
                  marginLeft: 0,
                  marginRight: 'var(--mm-space-2)',
                  borderRadius: 'var(--mm-radius-sm)',
                }),
              },
              TabContent: { style: { paddingTop: 'var(--mm-space-5)' } },
            }}
          >
            {PROTOCOLS.map((entry) => (
              <Tab key={entry.id} title={entry.label} id={entry.id}>
                <div className="mm-integration__grid">
                  <dl className="mm-integration__spec">
                    <div>
                      <dt>Base URL</dt>
                      <dd className="mm-mono">{entry.baseUrl}</dd>
                    </div>
                    <div>
                      <dt>Endpoint</dt>
                      <dd className="mm-mono">{entry.endpoint}</dd>
                    </div>
                    <div>
                      <dt>Thinking depth field</dt>
                      <dd className="mm-mono">{entry.effortField}</dd>
                      <span className="mm-integration__spec-hint">{entry.effortLocation}</span>
                    </div>
                    <div>
                      <dt>Thinking comes back as</dt>
                      <dd>{entry.thinkingField}</dd>
                    </div>
                    <div>
                      <dt>Output limit field</dt>
                      <dd className="mm-mono">{entry.outputLimitField}</dd>
                    </div>
                    <div>
                      <dt>Note</dt>
                      <dd>{entry.note}</dd>
                    </div>
                  </dl>

                  <CodeBlock code={REQUEST_EXAMPLES[entry.id]} label="Request" />
                </div>
              </Tab>
            ))}
          </Tabs>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mm-integration__migration">
            <h3 className="mm-integration__subhead">Migrating from M3</h3>
            <ol className="mm-integration__steps">
              {MIGRATION_STEPS.map((step, index) => (
                <li key={step.title} className="mm-integration__step">
                  <span className="mm-integration__step-index mm-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="mm-integration__step-title">{step.title}</h4>
                    <p className="mm-integration__step-body">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mm-integration__access">
            <h3 className="mm-integration__subhead">Where it runs</h3>
            <ul className="mm-integration__access-list">
              {ACCESS_PATHS.map((path) => (
                <li key={path.id} className="mm-integration__access-item">
                  <span className="mm-integration__access-kind">{path.kind}</span>
                  <h4 className="mm-integration__access-name">{path.name}</h4>
                  <p className="mm-integration__access-detail">{path.detail}</p>
                  <a
                    className="mm-integration__access-link"
                    href={path.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {path.cta}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <p className="mm-visually-hidden" aria-live="polite">
          Selected protocol: {active.label}.
        </p>
      </div>
    </section>
  );
}
