import { useId } from 'react'

type Props = {
  /** Liquid colour — defaults to mustard amber. */
  liquid?: string
  liquidDeep?: string
  className?: string
  title?: string
  /** Set true when purely decorative (e.g. inside a labelled card). */
  decorative?: boolean
}

/**
 * High-quality SVG bottle used as the low-end-device fallback for the 3D hero,
 * as the placeholder while three.js loads, and as the product-card art.
 */
export function BottleStatic({
  liquid = '#C1841A',
  liquidDeep = '#8F5E12',
  className = '',
  title = 'A glass bottle of Kedar’s cold-pressed oil',
  decorative = false,
}: Props) {
  const id = useId()
  const silhouette =
    'M60 150 C60 118 78 105 92 98 L92 60 L148 60 L148 98 C162 105 180 118 180 150 L180 370 C180 384 170 392 156 392 L84 392 C70 392 60 384 60 370 Z'

  return (
    <svg
      viewBox="0 0 240 420"
      className={className}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
    >
      {!decorative && <title>{title}</title>}
      <defs>
        <linearGradient id={`${id}-liquid`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={liquidDeep} />
          <stop offset="0.35" stopColor={liquid} />
          <stop offset="0.6" stopColor={liquid} />
          <stop offset="1" stopColor={liquidDeep} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.18" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.82" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={`${id}-cap`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#3a2c1f" />
          <stop offset="0.5" stopColor="#171310" />
          <stop offset="1" stopColor="#3a2c1f" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2C2016" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2C2016" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <path d={silhouette} />
        </clipPath>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="120" cy="398" rx="88" ry="12" fill={`url(#${id}-shadow)`} />

      {/* Liquid (clipped to bottle silhouette) */}
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="60" y="150" width="120" height="250" fill={`url(#${id}-liquid)`} />
        <ellipse cx="120" cy="150" rx="60" ry="9" fill={liquid} />
        <ellipse cx="120" cy="150" rx="60" ry="9" fill="#ffffff" opacity="0.18" />
        {/* Air inside the shoulder */}
        <path
          d="M60 150 C60 118 78 105 92 98 L92 60 L148 60 L148 98 C162 105 180 118 180 150 Z"
          fill="#ffffff"
          opacity="0.06"
        />
      </g>

      {/* Glass body outline + reflections */}
      <path d={silhouette} fill={`url(#${id}-glass)`} stroke="#2C2016" strokeOpacity="0.28" strokeWidth="1.5" />
      <path
        d="M74 165 C72 220 72 300 76 372"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M166 175 C167 230 167 300 164 366"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Label band */}
      <rect x="61" y="205" width="118" height="96" fill="#F6EFE2" />
      <rect x="61" y="205" width="118" height="96" fill={`url(#${id}-glass)`} opacity="0.5" />
      <rect x="61" y="214" width="118" height="3" fill="#C1841A" />
      <rect x="61" y="284" width="118" height="3" fill="#C1841A" />
      <text
        x="120"
        y="258"
        textAnchor="middle"
        fontFamily="Fraunces Variable, Fraunces, Georgia, serif"
        fontWeight="600"
        fontSize="22"
        fill="#2C2016"
        letterSpacing="-0.5"
      >
        Kedar’s
      </text>
      <text
        x="120"
        y="274"
        textAnchor="middle"
        fontFamily="Karla, system-ui, sans-serif"
        fontWeight="600"
        fontSize="8"
        fill="#9C6812"
        letterSpacing="2"
      >
        COLD-PRESSED
      </text>

      {/* Cap */}
      <rect x="86" y="30" width="68" height="36" rx="6" fill={`url(#${id}-cap)`} />
      <rect x="84" y="60" width="72" height="6" rx="2" fill="#2C2016" />
      <rect x="94" y="34" width="6" height="28" rx="2" fill="#ffffff" opacity="0.12" />
    </svg>
  )
}
