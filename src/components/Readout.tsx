export type ReadoutProps = {
  label: string;
  value: string;
  unit?: string;
  note?: string;
  /** Where the number came from. */
  source?: 'vendor' | 'measured';
  /** Larger type for hero readouts. */
  size?: 'sm' | 'md' | 'lg';
  tone?: 'ink' | 'signal' | 'reason' | 'throughput';
};

const SIZE_CLASS = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-[clamp(2.4rem,5.5vw,3.4rem)]',
} as const;

const TONE_CLASS = {
  ink: 'text-ink',
  signal: 'text-brand-rose-text',
  reason: 'text-brand-violet-text',
  throughput: 'text-brand-cyan-text',
} as const;

/**
 * An instrument readout: a label, a value, a unit, and where the number
 * came from. The source marker is not optional — a vendor claim and an
 * independent measurement do not carry the same weight, and the interface
 * says which is which.
 */
export function Readout({
  label,
  value,
  unit,
  note,
  source,
  size = 'md',
  tone = 'ink',
}: ReadoutProps) {
  return (
    <div className='flex min-w-0 flex-col gap-[0.35rem]'>
      <div className='flex flex-wrap items-center gap-2'>
        <span className='text-ink-3 text-xs tracking-[0.01em]'>{label}</span>
        {source ? (
          <span
            className={`rounded-pill cursor-help border px-[0.4rem] py-[0.1rem] text-[10px] tracking-[0.06em] whitespace-nowrap ${
              source === 'measured'
                ? 'border-brand-cyan/46 text-brand-cyan-text'
                : 'border-brand-violet/46 text-brand-violet-text'
            }`}
            title={
              source === 'vendor'
                ? 'Reported by MiniMax'
                : 'Measured independently by Artificial Analysis'
            }>
            {source === 'vendor' ? 'vendor' : 'measured'}
          </span>
        ) : null}
      </div>

      <p
        className={`font-display flex flex-wrap items-baseline gap-[0.35rem] leading-none font-light tracking-[-0.02em] tabular-nums ${SIZE_CLASS[size]} ${TONE_CLASS[tone]}`}>
        {value}
        {unit ? (
          <span className='font-body text-ink-3 text-xs font-normal tracking-[0.02em]'>{unit}</span>
        ) : null}
      </p>

      {note ? <p className='text-ink-2 max-w-[34ch] text-sm leading-[1.5]'>{note}</p> : null}
    </div>
  );
}
