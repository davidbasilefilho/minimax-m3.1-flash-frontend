export type MmLogoProps = {
  /** Rendered height of the lockup. Width follows the official aspect ratio. */
  height?: number;
  /**
   * The brand book requires adequate contrast and forbids altering, distorting
   * or separating the asset. The wordmark is black, so on the dark surface it
   * sits on a solid white plate rather than being recoloured.
   */
  className?: string;
};

/**
 * The official MiniMax lockup, used unmodified.
 *
 * The asset is the transparent 349×128 horizontal brand file from
 * minimax.io. It is never filtered, recoloured, cropped or given a shadow —
 * the brand book explicitly forbids all four. On the dark surface it rests on
 * a white plate, which is the only way to keep the black wordmark legible
 * without touching the artwork.
 */
export function MmLogo({ height = 30, className }: MmLogoProps) {
  return (
    <span
      className={`data-[theme=daylight]:border-line inline-flex shrink-0 items-center rounded-[10px] bg-white px-3 py-2 leading-none data-[theme=daylight]:border ${className ?? ''}`}
      style={{ height }}>
      <img
        src='/brand/minimax-horizontal-brand-black.webp'
        alt='MiniMax'
        width={349}
        height={128}
        className='block h-full w-auto object-contain'
        decoding='async'
      />
    </span>
  );
}
