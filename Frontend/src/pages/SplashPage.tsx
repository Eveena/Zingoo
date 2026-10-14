import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { BirdMascot } from '../components/BirdMascot'
import { ZingooMark } from '../components/Logo'

interface FloatingHeart {
  id: number
  x: number
  delay: number
  size: number
}

export default function SplashPage() {
  const navigate = useNavigate()
  const [hearts] = useState<FloatingHeart[]>(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: 8 + Math.random() * 84,
      delay: Math.random() * 2.5,
      size: 12 + Math.random() * 18,
    }))
  )
  const [dotPhase, setDotPhase] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setDotPhase(p => (p + 1) % 3), 500)
    const t = setTimeout(() => navigate('/onboarding'), 2800)
    return () => { clearInterval(iv); clearTimeout(t) }
  }, [navigate])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f3e8ff 0%, #fce7f3 45%, #fff1f5 100%)' }}
    >
      {/* Floating hearts */}
      {hearts.map(h => (
        <span
          key={h.id}
          style={{
            position: 'absolute',
            left: `${h.x}%`,
            bottom: '-20px',
            fontSize: h.size,
            animation: `floatUp ${2.5 + h.delay}s ease-out infinite`,
            animationDelay: `${h.delay}s`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {['💜', '🩷', '💖', '✨', '🌸'][h.id % 5]}
        </span>
      ))}

      {/* Soft blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #c084fc, transparent 70%)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-52 h-52 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #f9a8d4, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #93c5fd, transparent 70%)', transform: 'translate(-50%,-50%)' }} />
      </div>

      {/* Sparkles */}
      {[
        { top: '15%', left: '12%', delay: 0 },
        { top: '20%', left: '82%', delay: 0.8 },
        { top: '70%', left: '8%', delay: 1.2 },
        { top: '75%', left: '88%', delay: 0.4 },
      ].map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute text-xl"
          style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s`, pointerEvents: 'none' }}
        >
          ✨
        </span>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Mascot */}
        <div className="animate-float">
          <BirdMascot size={140} />
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 animate-fadeinup" style={{ animationDelay: '0.2s' }}>
          <ZingooMark size={52} />
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '2.8rem', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
            Zingoo
          </span>
          <p className="text-sm" style={{ color: '#c084fc', fontWeight: 700, letterSpacing: '0.05em' }}>
            share what you love
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2 mt-2" style={{ animationDelay: '0.5s' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: dotPhase === i ? 24 : 8,
                height: 8,
                background: dotPhase === i
                  ? 'linear-gradient(90deg, #a855f7, #ec4899)'
                  : '#e9d5ff',
                borderRadius: 99,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
