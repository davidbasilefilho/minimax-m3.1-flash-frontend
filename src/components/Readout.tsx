import './readout.css';

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

const TONE_CLASS = {
  ink: '',
  signal: 'mm-readout--signal',
  reason: 'mm-readout--reason',
  throughput: 'mm-readout--throughput',
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
    <div className={`mm-readout mm-readout--${size} ${TONE_CLASS[tone]}`}>
      <div className="mm-readout__head">
        <span className="mm-readout__label">{label}</span>
        {source ? (
          <span
            className={`mm-readout__source mm-readout__source--${source}`}
            title={
              source === 'vendor'
                ? 'Reported by MiniMax'
                : 'Measured independently by Artificial Analysis'
            }
          >
            {source === 'vendor' ? 'vendor' : 'measured'}
          </span>
        ) : null}
      </div>

      <p className="mm-readout__value mm-num">
        {value}
        {unit ? <span className="mm-readout__unit">{unit}</span> : null}
      </p>

      {note ? <p className="mm-readout__note">{note}</p> : null}
    </div>
  );
}
