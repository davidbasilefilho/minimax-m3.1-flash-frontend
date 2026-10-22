import { Radio, RadioGroup } from 'baseui/radio';

import './chipRadio.css';

export type ChipRadioOption<T extends string> = {
  value: T;
  label: string;
};

export type ChipRadioProps<T extends string> = {
  name: string;
  legend: string;
  options: readonly ChipRadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * A single-select filter, rendered as chips.
 *
 * Built on Base Web's radio group so the semantics are right: one tab stop,
 * arrow keys move between options, and the selected option is announced.
 */
export function ChipRadio<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: ChipRadioProps<T>) {
  return (
    <fieldset className="mm-chips">
      <legend className="mm-visually-hidden">{legend}</legend>
      <RadioGroup
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        align="horizontal"
        overrides={{
          RadioGroupRoot: {
            style: { display: 'flex', gap: '0.35rem', flexWrap: 'wrap' },
          },
        }}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            checked={value === option.value}
            overrides={{
              Root: {
                style: ({ $checked }: { $checked?: boolean }) => ({
                  borderRadius: 'var(--mm-radius-pill)',
                  border: `1px solid ${$checked ? 'var(--mm-rose)' : 'var(--mm-line)'}`,
                  backgroundColor: $checked
                    ? 'color-mix(in srgb, var(--mm-rose) 14%, var(--mm-surface))'
                    : 'var(--mm-surface)',
                  color: $checked ? 'var(--mm-ink)' : 'var(--mm-ink-2)',
                  paddingLeft: '0.95rem',
                  paddingRight: '0.95rem',
                  paddingTop: '0.4rem',
                  paddingBottom: '0.4rem',
                  marginTop: 0,
                  marginBottom: 0,
                }),
              },
              Label: {
                style: {
                  fontFamily: 'var(--mm-font-body)',
                  fontSize: 'var(--mm-text-xs)',
                  fontWeight: '500',
                  color: 'inherit',
                },
              },
              RadioMarkOuter: {
                style: {
                  display: 'none',
                },
              },
              RadioMarkInner: { style: { backgroundColor: 'var(--mm-rose)' } },
            }}
          >
            {option.label}
          </Radio>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
