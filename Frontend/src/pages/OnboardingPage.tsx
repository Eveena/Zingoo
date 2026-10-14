import { useState } from 'react'
import { useNavigate } from 'react-router'

const SLIDES = [
  {
    title: 'Welcome to Zingoo',
    subtitle: 'Share your happiest moments with the world. Every photo tells a story.',
    gradient: 'linear-gradient(160deg, #f3e8ff 0%, #fce7f3 100%)',
    accent: '#a855f7',
    illustration: <ShareIllustration />,
  },
  {
    title: 'Connect with friends',
    subtitle: 'Follow people you love, react to their posts, and build your little corner.',
    gradient: 'linear-gradient(160deg, #eff6ff 0%, #fce7f3 100%)',
    accent: '#3b82f6',
    illustration: <FriendsIllustration />,
  },
  {
    title: 'Create memories',
    subtitle: 'Every moment captured becomes a memory worth keeping forever.',
    gradient: 'linear-gradient(160deg, #fef9c3 0%, #fce7f3 100%)',
    accent: '#ec4899',
    illustration: <MemoriesIllustration />,
  },
]

export default function OnboardingPage() {
  const [slide, setSlide] = useState(0)
  const navigate = useNavigate()

  const next = () => {
    if (slide < SLIDES.length - 1) setSlide(slide + 1)
    else navigate('/auth')
  }

  const s = SLIDES[slide]

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-12 transition-all duration-500"
      style={{ background: s.gradient }}
    >
      {/* Skip */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => navigate('/auth')}
          className="text-sm px-4 py-2 rounded-full"
          style={{ color: '#9ca3af', fontWeight: 700 }}
        >
          Skip
        </button>
      </div>

      {/* Illustration */}
      <div className="animate-fadein flex flex-col items-center gap-8 flex-1 justify-center" key={slide}>
        <div className="animate-float">
          {s.illustration}
        </div>

        <div className="text-center max-w-xs">
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.9rem', letterSpacing: '-0.02em', color: '#1a1a2e', lineHeight: 1.2 }}>
            {s.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed" style={{ color: '#6b7280', fontWeight: 600 }}>
            {s.subtitle}
          </p>
        </div>
      </div>

      {/* Dots + Button */}
      <div className="w-full flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: slide === i ? 28 : 8,
                height: 8,
                background: slide === i ? s.accent : '#e9d5ff',
                borderRadius: 99,
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full max-w-sm py-4 rounded-2xl text-white text-base transition-all duration-200"
          style={{ background: `linear-gradient(135deg, ${s.accent}, #ec4899)`, fontWeight: 800, boxShadow: `0 8px 24px ${s.accent}40` }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.92')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {slide === SLIDES.length - 1 ? "Let's start!" : 'Continue'}
        </button>
      </div>
    </div>
  )
}

function ShareIllustration() {
  return (
    <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Phone */}
      <rect x="60" y="20" width="100" height="160" rx="20" fill="white" opacity="0.9" filter="url(#s1)" />
      <rect x="68" y="36" width="84" height="84" rx="12" fill="#f3e8ff" />
      <rect x="68" y="36" width="84" height="84" rx="12" fill="url(#img1)" opacity="0.8" />
      {/* Mountains in image placeholder */}
      <path d="M68 100 L92 68 L110 85 L126 62 L152 100 Z" fill="#c084fc" opacity="0.6" />
      <path d="M68 100 L95 75 L115 90 L152 100 Z" fill="#a855f7" opacity="0.5" />
      {/* Like bar */}
      <rect x="68" y="128" width="84" height="32" rx="8" fill="#fafafa" />
      <path d="M78 142 C78 138 84 136 84 142 C84 136 90 138 90 142 C90 147 84 151 84 151 C84 151 78 147 78 142Z" fill="#ec4899" />
      <rect x="96" y="140" width="30" height="4" rx="2" fill="#e5e7eb" />
      <rect x="96" y="147" width="20" height="4" rx="2" fill="#e5e7eb" />
      {/* Camera icon on top */}
      <circle cx="110" cy="22" r="14" fill="url(#cam-g)" />
      <rect x="103" y="17" width="14" height="10" rx="3" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="110" cy="22" r="3" stroke="white" strokeWidth="1.5" fill="none" />
      {/* Hearts floating */}
      <text x="160" y="60" style={{ fontSize: 18 }}>💜</text>
      <text x="40" y="80" style={{ fontSize: 14 }}>🩷</text>
      <text x="168" y="110" style={{ fontSize: 12 }}>✨</text>
      <defs>
        <filter id="s1" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#a855f7" floodOpacity="0.15" />
        </filter>
        <linearGradient id="cam-g" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function FriendsIllustration() {
  return (
    <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Three avatar circles */}
      <circle cx="70" cy="90" r="40" fill="#dbeafe" />
      <circle cx="70" cy="72" r="16" fill="#93c5fd" />
      <path d="M42 118 C42 104 56 96 70 96 C84 96 98 104 98 118 Z" fill="#60a5fa" />

      <circle cx="150" cy="90" r="40" fill="#fce7f3" />
      <circle cx="150" cy="72" r="16" fill="#f9a8d4" />
      <path d="M122 118 C122 104 136 96 150 96 C164 96 178 104 178 118 Z" fill="#f472b6" />

      <circle cx="110" cy="65" r="32" fill="#f3e8ff" />
      <circle cx="110" cy="50" r="14" fill="#c084fc" />
      <path d="M86 90 C86 78 97 72 110 72 C123 72 134 78 134 90 Z" fill="#a855f7" />

      {/* Connecting line / heart between them */}
      <path d="M90 85 C95 75 115 75 130 85" stroke="#f9a8d4" strokeWidth="2" strokeDasharray="4 3" fill="none" />
      <text x="104" y="76" style={{ fontSize: 14 }}>💗</text>

      {/* Floating elements */}
      <text x="24" y="50" style={{ fontSize: 16 }}>✨</text>
      <text x="170" y="45" style={{ fontSize: 14 }}>🌸</text>
      <text x="10" y="130" style={{ fontSize: 12 }}>💜</text>
      <text x="192" y="125" style={{ fontSize: 16 }}>✨</text>
    </svg>
  )
}

function MemoriesIllustration() {
  return (
    <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Polaroid stack */}
      <rect x="30" y="40" width="90" height="100" rx="8" fill="white" transform="rotate(-12 30 40)" filter="url(#s2)" />
      <rect x="36" y="46" width="78" height="66" rx="4" fill="#fef9c3" transform="rotate(-12 36 46)" />
      <path d="M38 90 L58 70 L70 82 L82 65 L102 90 Z" fill="#fbbf24" opacity="0.6" transform="rotate(-12 38 90)" />

      <rect x="95" y="50" width="90" height="100" rx="8" fill="white" transform="rotate(8 95 50)" filter="url(#s2)" />
      <rect x="101" y="56" width="78" height="66" rx="4" fill="#fce7f3" transform="rotate(8 101 56)" />
      <path d="M103 100 L118 78 L132 90 L150 70 L176 100 Z" fill="#ec4899" opacity="0.5" transform="rotate(8 103 100)" />

      <rect x="60" y="55" width="90" height="100" rx="8" fill="white" transform="rotate(1 60 55)" filter="url(#s2)" />
      <rect x="66" y="61" width="78" height="66" rx="4" fill="#f3e8ff" transform="rotate(1 66 61)" />
      <path d="M68 110 L88 88 L102 100 L118 80 L144 110 Z" fill="#a855f7" opacity="0.5" transform="rotate(1 68 110)" />
      <text x="80" y="140" style={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'Nunito', fontWeight: 700 }}>July 2025 ♥</text>

      {/* Stars */}
      <text x="8" y="42" style={{ fontSize: 20 }}>⭐</text>
      <text x="178" y="55" style={{ fontSize: 16 }}>🌟</text>
      <text x="190" y="150" style={{ fontSize: 14 }}>✨</text>
      <text x="10" y="165" style={{ fontSize: 18 }}>💛</text>
      <defs>
        <filter id="s2" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#a855f7" floodOpacity="0.12" />
        </filter>
      </defs>
    </svg>
  )
}
