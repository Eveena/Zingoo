interface LogoProps {
  size?: number
  textSize?: string
  color?: string
}

export function ZingooMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="14" fill="url(#zm-g)" />
      {/* Z body */}
      <path d="M12 14h16L12 30h16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sparkle top-right */}
      <path d="M33 9 L34 12 L37 13 L34 14 L33 17 L32 14 L29 13 L32 12 Z" fill="white" opacity="0.9" />
      <defs>
        <linearGradient id="zm-g" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function ZingooLogo({ size = 32, textSize = '1.35rem', color = '#7c3aed' }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', userSelect: 'none' }}>
      <ZingooMark size={size} />
      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: textSize, letterSpacing: '-0.02em', color, lineHeight: 1 }}>
        Zingoo
      </span>
    </div>
  )
}
