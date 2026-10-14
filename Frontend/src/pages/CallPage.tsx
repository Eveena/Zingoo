import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { CONVERSATIONS } from '../data/chatMock'
import { ME } from '../data/mock'

export default function CallPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const mode = (searchParams.get('mode') as 'voice' | 'video') || 'voice'
  const navigate = useNavigate()

  const convo = CONVERSATIONS.find(c => c.id === id) || CONVERSATIONS[0]
  const other = convo.participants.find(p => p.id !== ME.id)!

  const [callState, setCallState] = useState<'ringing' | 'connected'>('ringing')
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [speaker, setSpeaker] = useState(false)
  const [videoOn, setVideoOn] = useState(mode === 'video')
  const [frontCam, setFrontCam] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setCallState('connected'), 2500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (callState !== 'connected') return
    const iv = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(iv)
  }, [callState])

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const endCall = () => navigate(`/app/messages/${id}`)

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden max-w-[430px] mx-auto"
      style={{ background: '#0f0a1a' }}>

      {/* Background — blurred avatar for video, gradient for voice */}
      {mode === 'video' ? (
        <>
          <img src={other.avatar} alt="" className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'blur(40px) brightness(0.4) saturate(1.2)', transform: 'scale(1.1)' }} />
          {/* Self preview (PiP) */}
          <div className="absolute top-20 right-4 w-28 h-40 rounded-2xl overflow-hidden z-20"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.2)' }}>
            <img src={ME.avatar} alt="me" className="w-full h-full object-cover" style={{ filter: frontCam ? 'none' : 'brightness(0.8)' }} />
            <div className="absolute inset-0 flex items-end p-2">
              <span className="text-white text-xs" style={{ fontWeight: 700, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>You</span>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #2d1a4e 0%, #1a0e2e 50%, #0f0a1a 100%)' }} />
      )}

      {/* Decorative circles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 rounded-full opacity-15"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle, #a855f7, transparent 70%)', transform: 'translate(-50%,-50%)' }} />
        <div className="absolute top-1/3 left-1/2 rounded-full opacity-10"
          style={{ width: 600, height: 600, background: 'radial-gradient(circle, #ec4899, transparent 70%)', transform: 'translate(-50%,-50%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 px-6 pt-16 pb-10 items-center">
        {/* Caller info */}
        <div className="flex flex-col items-center mb-auto">
          {/* Pulsing ring on ringing */}
          <div className="relative mb-6">
            {callState === 'ringing' && (
              <>
                <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(168,85,247,0.2)', animation: 'recordPulse 1.5s ease-in-out infinite', transform: 'scale(1.4)' }} />
                <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(168,85,247,0.12)', animation: 'recordPulse 1.5s ease-in-out infinite 0.3s', transform: 'scale(1.7)' }} />
              </>
            )}
            <img src={other.avatar} alt={other.name} className="w-28 h-28 rounded-full object-cover relative z-10"
              style={{ border: '3px solid rgba(255,255,255,0.3)', boxShadow: '0 0 0 4px rgba(168,85,247,0.3)' }} />
          </div>

          <h2 className="text-white text-2xl mb-1" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900 }}>{other.name}</h2>
          <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>@{other.username}</p>

          {callState === 'ringing' ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }}>
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-white" style={{ animation: `typingBounce 1.2s ease infinite`, animationDelay: `${i * 0.2}s` }} />
              ))}
              <span className="text-white text-sm ml-1" style={{ fontWeight: 600 }}>
                {mode === 'video' ? 'Video calling...' : 'Calling...'}
              </span>
            </div>
          ) : (
            <p className="text-white text-base" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmt(seconds)}</p>
          )}

          {/* E2E badge */}
          <div className="mt-3 flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: 12 }}>🔒</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>End-to-end encrypted</span>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full">
          {/* Secondary controls */}
          <div className="flex justify-center gap-6 mb-8">
            {mode === 'video' && (
              <CallBtn icon="🔄" label="Flip" active={false} onPress={() => setFrontCam(!frontCam)} small />
            )}
            <CallBtn icon={muted ? '🔇' : '🎤'} label={muted ? 'Unmute' : 'Mute'} active={muted} onPress={() => setMuted(!muted)} small />
            <CallBtn icon={speaker ? '🔊' : '🔈'} label="Speaker" active={speaker} onPress={() => setSpeaker(!speaker)} small />
            {mode === 'video' && (
              <CallBtn icon={videoOn ? '📹' : '📷'} label={videoOn ? 'Camera' : 'No cam'} active={!videoOn} onPress={() => setVideoOn(!videoOn)} small />
            )}
            <CallBtn icon="💬" label="Chat" active={false} onPress={() => navigate(`/app/messages/${id}`)} small />
          </div>

          {/* End call */}
          <div className="flex justify-center">
            <button
              onClick={endCall}
              className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-150 active:scale-90"
              style={{ background: '#ef4444', boxShadow: '0 8px 28px rgba(239,68,68,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
              <svg className="w-8 h-8" fill="white" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CallBtn({ icon, label, active, onPress, small }: { icon: string; label: string; active: boolean; onPress: () => void; small?: boolean }) {
  return (
    <button onClick={onPress} className="flex flex-col items-center gap-2">
      <div
        className={`${small ? 'w-14 h-14' : 'w-16 h-16'} rounded-2xl flex items-center justify-center transition-all duration-150`}
        style={{ background: active ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.12)', boxShadow: active ? '0 4px 16px rgba(168,85,247,0.4)' : 'none' }}>
        <span style={{ fontSize: small ? 22 : 26 }}>{icon}</span>
      </div>
      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{label}</span>
    </button>
  )
}
