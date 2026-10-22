import './slogan.css';

/**
 * The official slogan: 【 Intelligence with Everyone 】.
 *
 * The brand book fixes the construction — three lines set in Libre Baskerville
 * Bold, with a stylised "w" motif and a filled disc standing in for the "o" in
 * "Everyone". Four layouts are permitted; this is the most official one.
 */
export function Slogan({ className }: { className?: string }) {
  return (
    <p className={`mm-slogan${className ? ` ${className}` : ''}`}>
      <span className="mm-slogan__line">Intelligence</span>
      <span className="mm-slogan__line">
        with
        <svg
          className="mm-slogan__motif"
          viewBox="0 0 44 32"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M5 8 V20 Q5 26 11 26 Q17 26 17 20 V8 M17 8 V20 Q17 26 23 26 Q29 26 29 20 V8 M29 8 V20 Q29 26 35 26 Q41 26 41 20 V8"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="mm-slogan__line">
        Every
        <span className="mm-slogan__disc" aria-hidden="true" />
        ne
      </span>
    </p>
  );
}
