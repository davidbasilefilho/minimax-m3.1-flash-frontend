import { Radio, RadioGroup } from 'baseui/radio';

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
 * The radio mark is hidden so the chip reads as a toggle, but the input
 * itself stays in the accessibility tree and keeps the radio semantics.
 */
export function ChipRadio<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: ChipRadioProps<T>) {
  return (
    <fieldset className='m-0 min-w-0 border-0 p-0'>
      <legend className='sr-only'>{legend}</legend>
      <RadioGroup
        name={name}
        value={value}
        onChange={(event) => {
          const next = options.find((option) => option.value === event.target.value);
          if (next) onChange(next.value);
        }}
        align='horizontal'
        overrides={{
          RadioGroupRoot: {
            style: { display: 'flex', gap: '0.35rem', flexWrap: 'wrap' },
          },
        }}>
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            checked={value === option.value}
            overrides={{
              Root: {
                style: ({ $checked }: { $checked?: boolean }) => ({
                  borderRadius: 'var(--radius-pill)',
                  border: `1px solid ${$checked ? 'var(--color-brand-rose)' : 'var(--color-line)'}`,
                  backgroundColor: $checked
                    ? 'color-mix(in srgb, var(--color-brand-rose) 14%, var(--color-surface))'
                    : 'var(--color-surface)',
                  color: $checked ? 'var(--color-ink)' : 'var(--color-ink-2)',
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
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: '500',
                  color: 'inherit',
                },
              },
              RadioMarkOuter: { style: { display: 'none' } },
              RadioMarkInner: { style: { backgroundColor: 'var(--color-brand-rose)' } },
            }}>
            {option.label}
          </Radio>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
