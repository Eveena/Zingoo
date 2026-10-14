export function BirdMascot({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 120 132" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="60" cy="125" rx="22" ry="5" fill="#d8b4fe" opacity="0.35" />

      {/* Body */}
      <ellipse cx="60" cy="82" rx="30" ry="26" fill="#93c5fd" />

      {/* Belly */}
      <ellipse cx="60" cy="87" rx="17" ry="14" fill="#dbeafe" />

      {/* Left wing */}
      <ellipse cx="32" cy="80" rx="13" ry="8" fill="#60a5fa" transform="rotate(-15 32 80)" />
      <ellipse cx="31" cy="79" rx="10" ry="5.5" fill="#93c5fd" transform="rotate(-15 31 79)" />

      {/* Right wing */}
      <ellipse cx="88" cy="80" rx="13" ry="8" fill="#60a5fa" transform="rotate(15 88 80)" />
      <ellipse cx="89" cy="79" rx="10" ry="5.5" fill="#93c5fd" transform="rotate(15 89 79)" />

      {/* Head */}
      <circle cx="60" cy="50" r="26" fill="#93c5fd" />

      {/* Head tuft feathers */}
      <path d="M55 26 Q52 15 57 22" stroke="#60a5fa" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M60 24 Q60 12 62 20" stroke="#60a5fa" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M65 26 Q68 15 63 22" stroke="#60a5fa" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Left eye white */}
      <circle cx="50" cy="46" r="8" fill="white" />
      {/* Left pupil */}
      <circle cx="52" cy="46" r="5" fill="#1e293b" />
      {/* Left eye shine */}
      <circle cx="50" cy="43.5" r="2" fill="white" />

      {/* Right eye white */}
      <circle cx="70" cy="46" r="8" fill="white" />
      {/* Right pupil */}
      <circle cx="72" cy="46" r="5" fill="#1e293b" />
      {/* Right eye shine */}
      <circle cx="70" cy="43.5" r="2" fill="white" />

      {/* Beak */}
      <path d="M56 56 L64 56 L60 63 Z" fill="#fb923c" />
      <line x1="56" y1="56" x2="64" y2="56" stroke="#ea580c" strokeWidth="1" />

      {/* Blush left */}
      <ellipse cx="41" cy="53" rx="6" ry="3.5" fill="#fda4af" opacity="0.65" />
      {/* Blush right */}
      <ellipse cx="79" cy="53" rx="6" ry="3.5" fill="#fda4af" opacity="0.65" />

      {/* Feet */}
      <g stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round">
        <line x1="50" y1="106" x2="44" y2="116" />
        <line x1="50" y1="106" x2="50" y2="117" />
        <line x1="50" y1="106" x2="56" y2="116" />
        <line x1="70" y1="106" x2="64" y2="116" />
        <line x1="70" y1="106" x2="70" y2="117" />
        <line x1="70" y1="106" x2="76" y2="116" />
      </g>
    </svg>
  )
}

export function TinyBird({ size = 32 }: { size?: number }) {
  const s = size / 32
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="13" r="8" fill="#93c5fd" />
      <ellipse cx="16" cy="22" rx="7" ry="6" fill="#93c5fd" />
      <ellipse cx="16" cy="24" rx="4" ry="3.5" fill="#dbeafe" />
      <circle cx="13" cy="11" r="2.5" fill="white" />
      <circle cx="13.5" cy="11" r="1.5" fill="#1e293b" />
      <circle cx="19" cy="11" r="2.5" fill="white" />
      <circle cx="19.5" cy="11" r="1.5" fill="#1e293b" />
      <path d="M14.5 15.5 L17.5 15.5 L16 18 Z" fill="#fb923c" />
      <ellipse cx="10.5" cy="12" rx="1.5" ry="1" fill="#fda4af" opacity="0.7" />
      <ellipse cx="21.5" cy="12" rx="1.5" ry="1" fill="#fda4af" opacity="0.7" />
      <path d="M55 26 Q52 15 57 22" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" fill="none" transform="scale(0.26) translate(-200, -52)" />
    </svg>
  )
}
