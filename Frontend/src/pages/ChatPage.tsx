import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { CONVERSATIONS, STICKER_PACKS, CHAT_THEMES, type Message } from '../data/chatMock'
import { ME } from '../data/mock'

const REACTION_EMOJIS = ['❤️', '😂', '😍', '🔥', '😢', '👏', '🥹', '✨']
const GIF_PREVIEWS = [
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&h=150&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=150&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200&h=150&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&h=150&fit=crop&auto=format',
]

export default function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const convo = CONVERSATIONS.find(c => c.id === id) || CONVERSATIONS[0]
  const theme = CHAT_THEMES[convo.chatTheme] || CHAT_THEMES.purple
  const other = convo.type === 'dm' ? convo.participants.find(p => p.id !== ME.id)! : null

  const [messages, setMessages] = useState<Message[]>(convo.messages)
  const [text, setText] = useState('')
  const [tray, setTray] = useState(false)
  const [trayTab, setTrayTab] = useState<'media' | 'gifs' | 'stickers'>('media')
  const [reactionTarget, setReactionTarget] = useState<string | null>(null)
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [recording, setRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [showMediaOptions, setShowMediaOptions] = useState(false)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (recording) {
      setRecordSeconds(0)
      recordTimerRef.current = setInterval(() => setRecordSeconds(s => s + 1), 1000)
    } else {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current)
    }
    return () => { if (recordTimerRef.current) clearInterval(recordTimerRef.current) }
  }, [recording])

  const sendMessage = (msg: Partial<Message>) => {
    const newMsg: Message = {
      id: `new-${Date.now()}`,
      senderId: ME.id,
      type: 'text',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      ...msg,
      replyTo: replyTo?.id,
      replyPreview: replyTo?.text,
    }
    setMessages(prev => [...prev, newMsg])
    setText('')
    setReplyTo(null)
    setTray(false)
  }

  const sendText = () => {
    if (!text.trim()) return
    sendMessage({ type: 'text', text: text.trim() })
  }

  const sendVoice = () => {
    if (recordSeconds < 1) { setRecording(false); return }
    sendMessage({ type: 'voice', duration: recordSeconds, waveform: Array.from({ length: 40 }, () => 0.2 + Math.random() * 0.8) })
    setRecording(false)
    setRecordSeconds(0)
  }

  const addReaction = (msgId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m
      const existing = m.reactions || []
      const withoutMe = existing.map(r => ({ ...r, userIds: r.userIds.filter(uid => uid !== ME.id) })).filter(r => r.userIds.length > 0)
      const already = existing.find(r => r.emoji === emoji)
      if (already?.userIds.includes(ME.id)) return { ...m, reactions: withoutMe }
      const next = withoutMe.find(r => r.emoji === emoji)
      if (next) return { ...m, reactions: withoutMe.map(r => r.emoji === emoji ? { ...r, userIds: [...r.userIds, ME.id] } : r) }
      return { ...m, reactions: [...withoutMe, { emoji, userIds: [ME.id] }] }
    }))
    setReactionTarget(null)
  }

  const deleteMsg = (msgId: string) => setMessages(prev => prev.filter(m => m.id !== msgId))

  const isMine = (m: Message) => m.senderId === ME.id
  const bgFrom = theme.from
  const bgTo = theme.to

  const ATTACH_OPTIONS = [
    { icon: '📷', label: 'Camera', action: () => {} },
    { icon: '🖼️', label: 'Gallery', action: () => sendMessage({ type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop&auto=format' }) },
    { icon: '🎭', label: 'GIF', action: () => { setTray(true); setTrayTab('gifs') } },
    { icon: '🌸', label: 'Sticker', action: () => { setTray(true); setTrayTab('stickers') } },
    { icon: '📍', label: 'Location', action: () => sendMessage({ type: 'text', text: '📍 Hongdae, Seoul — shared a location' }) },
    { icon: '📊', label: 'Poll', action: () => sendMessage({ type: 'text', text: '📊 Created a poll: "Saturday night market?" 👍👎' }) },
    { icon: '📁', label: 'File', action: () => {} },
    { icon: '👤', label: 'Contact', action: () => {} },
  ]

  return (
    <div className="max-w-[430px] mx-auto flex flex-col min-h-screen relative"
      style={{ background: `linear-gradient(160deg, ${bgFrom}08 0%, ${bgTo}06 100%)` }}>

      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 glass"
        style={{ background: 'rgba(250,245,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(233,213,255,0.4)' }}>
        <button onClick={() => navigate('/app/messages')} style={{ color: '#a855f7' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button onClick={() => setShowInfo(true)} className="flex items-center gap-3 flex-1 min-w-0">
          {convo.type === 'dm' ? (
            <div className="relative">
              <div className="story-ring" style={{ padding: '2px' }}>
                <img src={other!.avatar} alt={other!.username} className="w-10 h-10 rounded-full object-cover block" style={{ background: '#e9d5ff' }} />
              </div>
              {convo.online && <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full" style={{ background: '#22c55e', border: '2px solid white' }} />}
            </div>
          ) : (
            <img src={convo.groupAvatar || ''} alt="" className="w-10 h-10 rounded-full object-cover" style={{ background: '#e9d5ff' }} />
          )}
          <div className="text-left min-w-0">
            <p className="text-sm truncate" style={{ fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.01em' }}>
              {convo.type === 'dm' ? other!.username : convo.groupName}
            </p>
            <p className="text-xs" style={{ color: convo.online ? '#22c55e' : '#9ca3af', fontWeight: 600 }}>
              {convo.type === 'group'
                ? `${convo.participants.length} members`
                : convo.online ? 'Online now' : `Last seen ${convo.lastSeen}`}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/app/call/${id}?mode=voice`)} style={{ color: '#a855f7' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button onClick={() => navigate(`/app/call/${id}?mode=video`)} style={{ color: '#a855f7' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button style={{ color: '#a855f7' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </button>
        </div>
      </div>

      {/* Encryption badge */}
      <div className="flex justify-center py-2">
        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs" style={{ background: '#f3e8ff', color: '#7c3aed', fontWeight: 700 }}>
          🔒 End-to-end encrypted
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4" onClick={() => { setReactionTarget(null); setShowMediaOptions(false) }}>
        {messages.map((m, i) => {
          const mine = isMine(m)
          const showAvatar = !mine && (i === 0 || messages[i - 1].senderId !== m.senderId)
          const senderUser = convo.participants.find(p => p.id === m.senderId)

          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'} mb-1 group`}>
              {/* Avatar for group chats */}
              {!mine && convo.type === 'group' && (
                <div className="w-8 shrink-0 mr-2 mt-auto">
                  {showAvatar && <img src={senderUser?.avatar} alt="" className="w-7 h-7 rounded-full object-cover" style={{ background: '#e9d5ff' }} />}
                </div>
              )}

              <div className={`max-w-[78%] ${mine ? 'msg-in-right' : 'msg-in-left'}`}>
                {/* Group sender name */}
                {!mine && convo.type === 'group' && showAvatar && (
                  <p className="text-xs mb-1 ml-3" style={{ color: '#a855f7', fontWeight: 700 }}>{senderUser?.username}</p>
                )}

                {/* Reply preview */}
                {m.replyPreview && (
                  <div className={`px-3 py-1.5 rounded-xl mb-1 text-xs ${mine ? 'ml-auto' : ''}`} style={{ background: 'rgba(168,85,247,0.1)', borderLeft: '3px solid #a855f7', maxWidth: '100%' }}>
                    <p className="truncate" style={{ color: '#7c3aed', fontWeight: 600 }}>{m.replyPreview}</p>
                  </div>
                )}

                {/* Bubble */}
                <div
                  className="relative"
                  onContextMenu={e => { e.preventDefault(); setReactionTarget(m.id) }}
                >
                  {m.type === 'text' && (
                    <div className={`px-4 py-2.5 rounded-[20px] ${mine ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                      style={{
                        background: mine ? `linear-gradient(135deg,${bgFrom},${bgTo})` : 'white',
                        color: mine ? 'white' : '#1a1a2e',
                        boxShadow: mine ? `0 4px 16px ${bgFrom}35` : '0 2px 12px rgba(168,85,247,0.08)',
                        fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.45,
                      }}>
                      {m.text}
                    </div>
                  )}

                  {m.type === 'image' && (
                    <button onClick={() => setExpandedImage(m.mediaUrl!)} className="block rounded-[20px] overflow-hidden"
                      style={{ maxWidth: 220, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                      <img src={m.mediaUrl} alt="" className="w-full h-48 object-cover block" style={{ background: '#e9d5ff' }} />
                    </button>
                  )}

                  {m.type === 'voice' && (
                    <VoiceBubble mine={mine} duration={m.duration!} waveform={m.waveform!} bgFrom={bgFrom} bgTo={bgTo} />
                  )}

                  {/* Reactions */}
                  {m.reactions && m.reactions.filter(r => r.userIds.length > 0).length > 0 && (
                    <div className={`flex gap-1 mt-1 flex-wrap ${mine ? 'justify-end' : 'justify-start'}`}>
                      {m.reactions.filter(r => r.userIds.length > 0).map(r => (
                        <button key={r.emoji} onClick={() => addReaction(m.id, r.emoji)}
                          className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs reaction-pop"
                          style={{ background: r.userIds.includes(ME.id) ? `${bgFrom}22` : 'white', border: `1px solid ${r.userIds.includes(ME.id) ? bgFrom : '#e9d5ff'}`, fontWeight: 700, color: '#374151' }}>
                          {r.emoji} {r.userIds.length}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Reaction picker */}
                  {reactionTarget === m.id && (
                    <div className={`absolute ${mine ? 'right-0' : 'left-0'} bottom-full mb-2 flex gap-1.5 px-3 py-2 rounded-2xl glass z-30 reaction-pop`}
                      style={{ boxShadow: '0 8px 32px rgba(168,85,247,0.2)', border: '1px solid rgba(255,255,255,0.8)', whiteSpace: 'nowrap' }}
                      onClick={e => e.stopPropagation()}>
                      {REACTION_EMOJIS.map(r => (
                        <button key={r} className="text-xl transition-transform hover:scale-125 duration-100" onClick={() => addReaction(m.id, r)}>{r}</button>
                      ))}
                      <div className="w-px mx-1" style={{ background: '#e9d5ff' }} />
                      <button className="text-sm px-1" style={{ color: '#ef4444' }} onClick={() => deleteMsg(m.id)}>🗑️</button>
                      <button className="text-sm px-1" style={{ color: '#a855f7' }} onClick={() => { setReplyTo(m); setReactionTarget(null) }}>↩️</button>
                    </div>
                  )}
                </div>

                {/* Timestamp + status */}
                <div className={`flex items-center gap-1 mt-0.5 ${mine ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs" style={{ color: '#9ca3af', fontWeight: 600 }}>{m.timestamp}</span>
                  {mine && <StatusTick status={m.status} color={bgFrom} />}
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {convo.isTyping && (
          <div className="flex justify-start mb-2">
            <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: 'white', boxShadow: '0 2px 12px rgba(168,85,247,0.08)' }}>
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full" style={{ background: '#c084fc', animation: `typingBounce 1.2s ease infinite`, animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Reply bar */}
      {replyTo && (
        <div className="mx-4 mb-1 px-3 py-2 rounded-2xl flex items-center gap-3" style={{ background: '#f3e8ff', border: '1px solid #e9d5ff' }}>
          <div className="w-1 h-8 rounded-full shrink-0" style={{ background: `linear-gradient(${bgFrom},${bgTo})` }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs truncate" style={{ color: bgFrom, fontWeight: 700 }}>Replying to {replyTo.senderId === ME.id ? 'yourself' : convo.participants.find(p => p.id === replyTo.senderId)?.username}</p>
            <p className="text-xs truncate" style={{ color: '#6b7280', fontWeight: 600 }}>{replyTo.text || (replyTo.type === 'image' ? '📷 Photo' : '🎤 Voice note')}</p>
          </div>
          <button onClick={() => setReplyTo(null)} style={{ color: '#9ca3af' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Attachment tray */}
      {tray && (
        <div className="sheet-up mx-4 mb-2 rounded-3xl overflow-hidden" style={{ background: 'white', border: '1px solid #f3e8ff', boxShadow: '0 -8px 32px rgba(168,85,247,0.12)' }}>
          <div className="flex gap-0 border-b" style={{ borderColor: '#f3e8ff' }}>
            {(['media', 'gifs', 'stickers'] as const).map(t => (
              <button key={t} onClick={() => setTrayTab(t)}
                className="flex-1 py-3 text-xs transition-colors duration-150"
                style={{ fontWeight: trayTab === t ? 800 : 600, color: trayTab === t ? '#a855f7' : '#9ca3af', borderBottom: trayTab === t ? `2px solid #a855f7` : '2px solid transparent', marginBottom: '-1px' }}>
                {t === 'media' ? '📷 Media' : t === 'gifs' ? '🎭 GIFs' : '🌸 Stickers'}
              </button>
            ))}
          </div>

          {trayTab === 'media' && (
            <div className="grid grid-cols-3 gap-1 p-3">
              {GIF_PREVIEWS.map((src, i) => (
                <button key={i} className="aspect-square rounded-xl overflow-hidden" style={{ background: '#f3e8ff' }}
                  onClick={() => sendMessage({ type: 'image', mediaUrl: src })}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {trayTab === 'gifs' && (
            <div className="grid grid-cols-2 gap-2 p-3">
              {GIF_PREVIEWS.map((src, i) => (
                <button key={i} className="rounded-xl overflow-hidden h-24" style={{ background: '#f3e8ff' }}
                  onClick={() => sendMessage({ type: 'gif', mediaUrl: src, text: '[GIF]' })}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {trayTab === 'stickers' && (
            <div className="grid grid-cols-4 gap-2 p-4">
              {STICKER_PACKS.map(s => (
                <button key={s.id} className="text-4xl flex items-center justify-center h-14 rounded-2xl transition-transform hover:scale-110 duration-100"
                  style={{ background: '#fdf4ff' }}
                  onClick={() => sendMessage({ type: 'sticker', text: s.emoji })}>
                  {s.emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Attachment quick actions */}
      {showMediaOptions && (
        <div className="sheet-up mx-4 mb-2 rounded-3xl p-4" style={{ background: 'white', border: '1px solid #f3e8ff', boxShadow: '0 -8px 32px rgba(168,85,247,0.12)' }}>
          <div className="grid grid-cols-4 gap-3">
            {ATTACH_OPTIONS.map(opt => (
              <button key={opt.label} onClick={() => { opt.action(); setShowMediaOptions(false) }}
                className="flex flex-col items-center gap-2 py-3 rounded-2xl transition-colors"
                style={{ background: '#fdf4ff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f3e8ff')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fdf4ff')}>
                <span style={{ fontSize: 26 }}>{opt.icon}</span>
                <span className="text-xs" style={{ color: '#6b7280', fontWeight: 700 }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="sticky bottom-0 px-4 pb-6 pt-2" style={{ background: 'rgba(250,245,255,0.92)', backdropFilter: 'blur(20px)' }}>
        {recording ? (
          <VoiceRecorder
            seconds={recordSeconds}
            onCancel={() => { setRecording(false); setRecordSeconds(0) }}
            onSend={sendVoice}
            bgFrom={bgFrom}
            bgTo={bgTo}
          />
        ) : (
          <div className="flex items-end gap-2">
            <button onClick={() => { setShowMediaOptions(!showMediaOptions); setTray(false) }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-150"
              style={{ background: showMediaOptions ? 'linear-gradient(135deg,#a855f7,#ec4899)' : '#f3e8ff', color: showMediaOptions ? 'white' : '#a855f7' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                style={{ transform: showMediaOptions ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>

            <div className="flex-1 flex items-end gap-2 px-4 py-2.5 rounded-3xl glass"
              style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(233,213,255,0.8)', boxShadow: '0 4px 20px rgba(168,85,247,0.1)' }}>
              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setTray(false); setShowMediaOptions(false) }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText() } }}
                placeholder="Message..."
                rows={1}
                className="flex-1 outline-none bg-transparent resize-none text-sm leading-relaxed"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, color: '#1a1a2e', maxHeight: '120px', overflowY: 'auto' }}
              />
              <button onClick={() => { setTray(!tray); setTrayTab('stickers'); setShowMediaOptions(false) }}
                className="text-xl transition-transform hover:scale-110 duration-100 shrink-0">
                🌸
              </button>
            </div>

            {text.trim() ? (
              <button onClick={sendText}
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-150"
                style={{ background: `linear-gradient(135deg,${bgFrom},${bgTo})`, boxShadow: `0 4px 14px ${bgFrom}40` }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            ) : (
              <button
                onPointerDown={() => setRecording(true)}
                onPointerUp={sendVoice}
                onPointerLeave={() => { if (recording) { setRecording(false); setRecordSeconds(0) } }}
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-150"
                style={{ background: '#f3e8ff', color: '#a855f7', animation: recording ? 'recordPulse 1s infinite' : 'none' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expanded image viewer */}
      {expandedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.9)' }} onClick={() => setExpandedImage(null)}>
          <img src={expandedImage} alt="" className="max-w-full max-h-full object-contain rounded-2xl" style={{ padding: 16 }} />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center" style={{ color: 'white' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Profile sheet */}
      {showInfo && other && (
        <div className="fixed inset-0 z-50" onClick={() => setShowInfo(false)}>
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl sheet-up overflow-hidden max-w-[430px] mx-auto"
            style={{ background: 'white', maxHeight: '80vh', boxShadow: '0 -8px 40px rgba(168,85,247,0.2)' }}
            onClick={e => e.stopPropagation()}>
            <div className="p-6 flex flex-col items-center text-center border-b" style={{ borderColor: '#f3e8ff' }}>
              <div className="story-ring mb-3" style={{ padding: '3px' }}>
                <img src={other.avatar} alt={other.name} className="w-20 h-20 rounded-full object-cover" style={{ background: '#e9d5ff' }} />
              </div>
              <p style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1a1a2e' }}>{other.name}</p>
              <p className="text-sm mt-0.5" style={{ color: '#9ca3af', fontWeight: 600 }}>@{other.username}</p>
              <p className="text-sm mt-2" style={{ color: '#374151', fontWeight: 600 }}>{other.bio}</p>
            </div>
            <div className="p-4 grid grid-cols-3 gap-2">
              {[['👁️', 'Profile'], ['📸', 'Posts'], ['🚫', 'Block'], ['🔇', 'Mute'], ['🚩', 'Report'], ['↩️', 'Close']].map(([icon, label]) => (
                <button key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-colors"
                  style={{ background: '#fdf4ff' }}
                  onClick={label === 'Close' ? () => setShowInfo(false) : undefined}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f3e8ff')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fdf4ff')}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <span className="text-xs" style={{ color: '#374151', fontWeight: 700 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function VoiceBubble({ mine, duration, waveform, bgFrom, bgTo }: { mine: boolean; duration: number; waveform: number[]; bgFrom: string; bgTo: string }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const togglePlay = () => {
    if (playing) {
      if (timerRef.current) clearInterval(timerRef.current)
      setPlaying(false)
    } else {
      setPlaying(true)
      const step = 100 / (duration * 10)
      timerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timerRef.current!)
            setPlaying(false)
            return 0
          }
          return p + step
        })
      }, 100)
    }
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const elapsed = Math.round((progress / 100) * duration)

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-[20px]"
      style={{
        background: mine ? `linear-gradient(135deg,${bgFrom},${bgTo})` : 'white',
        color: mine ? 'white' : '#1a1a2e',
        boxShadow: mine ? `0 4px 16px ${bgFrom}35` : '0 2px 12px rgba(168,85,247,0.08)',
        minWidth: 200,
      }}>
      <button onClick={togglePlay} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: mine ? 'rgba(255,255,255,0.25)' : bgFrom, color: mine ? 'white' : 'white' }}>
        {playing
          ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>
          : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
      </button>

      <div className="flex-1 relative">
        <div className="flex items-center gap-0.5 h-8">
          {waveform.slice(0, 28).map((v, i) => {
            const pct = (i / 28) * 100
            const done = pct <= progress
            return (
              <div key={i} className="flex-1 rounded-full"
                style={{
                  height: `${Math.max(20, v * 100)}%`,
                  background: done ? (mine ? 'rgba(255,255,255,0.9)' : bgFrom) : (mine ? 'rgba(255,255,255,0.35)' : '#e9d5ff'),
                  transition: 'background 0.1s',
                  animation: playing && Math.abs(pct - progress) < 10 ? `waveBar 0.8s ease infinite` : 'none',
                  animationDelay: `${i * 0.04}s`,
                }} />
            )
          })}
        </div>
      </div>

      <span className="text-xs shrink-0" style={{ fontWeight: 700, opacity: 0.8 }}>
        {playing ? fmt(elapsed) : fmt(duration)}
      </span>
    </div>
  )
}

function VoiceRecorder({ seconds, onCancel, onSend, bgFrom, bgTo }: { seconds: number; onCancel: () => void; onSend: () => void; bgFrom: string; bgTo: string }) {
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const bars = Array.from({ length: 40 }, (_, i) => 0.3 + Math.random() * 0.7)

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-3xl glass"
      style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(233,213,255,0.8)' }}>
      <button onClick={onCancel} style={{ color: '#ef4444' }}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center gap-0.5 flex-1 h-8">
        {bars.map((v, i) => (
          <div key={i} className="flex-1 rounded-full" style={{ height: `${v * 100}%`, background: `linear-gradient(${bgFrom},${bgTo})`, animation: `waveBar 0.6s ease infinite`, animationDelay: `${i * 0.03}s` }} />
        ))}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm font-bold" style={{ color: '#ef4444', fontWeight: 800 }}>{fmt(seconds)}</span>
        <span className="w-2 h-2 rounded-full" style={{ background: '#ef4444', animation: 'recordPulse 1s infinite' }} />
      </div>

      <button onClick={onSend} className="w-9 h-9 rounded-2xl flex items-center justify-center"
        style={{ background: `linear-gradient(135deg,${bgFrom},${bgTo})`, boxShadow: `0 4px 14px ${bgFrom}40` }}>
        <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
      </button>
    </div>
  )
}

function StatusTick({ status, color }: { status: Message['status']; color: string }) {
  if (status === 'sending') return <span className="text-xs" style={{ color: '#9ca3af' }}>⏳</span>
  if (status === 'sent') return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="#9ca3af" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
  if (status === 'delivered') return (
    <svg className="w-4 h-3.5" viewBox="0 0 28 16" fill="none">
      <path d="M2 8l4 4L14 4" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8l4 4 8-8" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  // read
  return (
    <svg className="w-4 h-3.5" viewBox="0 0 28 16" fill="none">
      <path d="M2 8l4 4L14 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8l4 4 8-8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
