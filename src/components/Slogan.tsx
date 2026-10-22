export type SloganProps = {
  className?: string;
};

/**
 * The official slogan: 【 Intelligence with Everyone 】.
 *
 * The brand book fixes the construction — three lines set in Libre Baskerville
 * Bold, with a stylised "w" motif and a filled disc standing in for the "o" in
 * "Everyone". Four layouts are permitted; this is the most official one.
 */
export function Slogan({ className }: SloganProps) {
  return (
    <p
      className={`font-editorial text-ink flex flex-col items-start text-[clamp(1.5rem,3.4vw,2.35rem)] leading-[1.08] font-bold tracking-[-0.015em] ${className ?? ''}`}>
      <span className='flex items-center gap-[0.28em]'>Intelligence</span>
      <span className='flex items-center gap-[0.28em]'>
        with
        <svg
          className='text-ink-2 h-[0.78em] w-[1.06em] shrink-0'
          viewBox='0 0 44 32'
          aria-hidden='true'
          focusable='false'>
          <path
            d='M5 8 V20 Q5 26 11 26 Q17 26 17 20 V8 M17 8 V20 Q17 26 23 26 Q29 26 29 20 V8 M29 8 V20 Q29 26 35 26 Q41 26 41 20 V8'
            fill='none'
            stroke='currentColor'
            strokeWidth='5.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </span>
      <span className='flex items-center gap-[0.28em]'>
        Every
        <span className='mb-[0.02em] ml-[0.04em] inline-block size-[0.56em] rounded-full bg-current' />
        ne
      </span>
    </p>
  );
}
