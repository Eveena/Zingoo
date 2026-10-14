import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { CONVERSATIONS, type Conversation } from '../data/chatMock'
import { ME } from '../data/mock'

export default function ChatListPage() {
  const [convos, setConvos] = useState(CONVERSATIONS.filter(c => !c.archived))
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [swipedId, setSwipedId] = useState<string | null>(null)
  const navigate = useNavigate()

  const pinned = convos.filter(c => c.pinned)
  const recent = convos.filter(c => !c.pinned)
  const filtered = query
    ? convos.filter(c => displayName(c).toLowerCase().includes(query.toLowerCase()))
    : null

  const togglePin = (id: string) => {
    setConvos(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c))
    setSwipedId(null)
  }
  const archiveConvo = (id: string) => {
    setConvos(prev => prev.filter(c => c.id !== id))
    setSwipedId(null)
  }
  const toggleMute = (id: string) => {
    setConvos(prev => prev.map(c => c.id === id ? { ...c, muted: !c.muted } : c))
    setSwipedId(null)
  }

  const totalUnread = convos.reduce((n, c) => n + c.unreadCount, 0)

  return (
    <div className="max-w-[430px] mx-auto flex flex-col min-h-screen" style={{ background: '#faf5ff' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-3" style={{ background: 'rgba(250,245,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(233,213,255,0.4)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.35rem', color: '#1a1a2e', letterSpacing: '-0.02em' }}>
              Messages
            </h1>
            {totalUnread > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full text-white" style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', fontSize: '10px', fontWeight: 800 }}>
                {totalUnread > 9 ? '9+' : totalUnread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-2xl flex items-center justify-center transition-colors duration-150"
              style={{ background: '#f3e8ff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e9d5ff')}
              onMouseLeave={e => (e.currentTarget.style.background = '#f3e8ff')}>
              <svg className="w-5 h-5" fill="none" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-150"
          style={{ background: focused ? 'white' : '#f3e8ff', border: `1.5px solid ${focused ? '#a855f7' : 'transparent'}`, boxShadow: focused ? '0 0 0 3px rgba(168,85,247,0.1)' : 'none' }}>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke={focused ? '#a855f7' : '#c084fc'} strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search conversations..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 outline-none bg-transparent text-sm"
            style={{ color: '#1a1a2e', fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="#9ca3af" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Filter chips */}
        <div className="flex gap-2 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {['All', 'Unread', 'Groups', 'Favorites'].map((f, i) => (
            <button key={f} className="shrink-0 px-4 py-1.5 rounded-full text-xs transition-all duration-150"
              style={{ fontWeight: 700, background: i === 0 ? 'linear-gradient(135deg,#a855f7,#ec4899)' : '#f3e8ff', color: i === 0 ? 'white' : '#a855f7' }}>
              {f}
            </button>
          ))}
        </div>

        {/* Search results */}
        {filtered && (
          filtered.length === 0
            ? <EmptySearch />
            : filtered.map(c => (
                <ConvoRow key={c.id} convo={c} swiped={swipedId === c.id}
                  onSwipe={() => setSwipedId(swipedId === c.id ? null : c.id)}
                  onPin={() => togglePin(c.id)} onArchive={() => archiveConvo(c.id)}
                  onMute={() => toggleMute(c.id)} onOpen={() => navigate(`/app/messages/${c.id}`)} />
              ))
        )}

        {/* Normal list */}
        {!filtered && (
          <>
            {/* Pinned */}
            {pinned.length > 0 && (
              <div className="mb-2">
                <p className="text-xs mb-2 flex items-center gap-1" style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6h2v-6h5v-2l-2-2z" /></svg>
                  Pinned
                </p>
                {pinned.map(c => (
                  <ConvoRow key={c.id} convo={c} swiped={swipedId === c.id}
                    onSwipe={() => setSwipedId(swipedId === c.id ? null : c.id)}
                    onPin={() => togglePin(c.id)} onArchive={() => archiveConvo(c.id)}
                    onMute={() => toggleMute(c.id)} onOpen={() => navigate(`/app/messages/${c.id}`)} />
                ))}
              </div>
            )}

            {/* Recent */}
            {recent.length > 0 && (
              <div>
                <p className="text-xs mb-2 mt-2" style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent</p>
                {recent.map(c => (
                  <ConvoRow key={c.id} convo={c} swiped={swipedId === c.id}
                    onSwipe={() => setSwipedId(swipedId === c.id ? null : c.id)}
                    onPin={() => togglePin(c.id)} onArchive={() => archiveConvo(c.id)}
                    onMute={() => toggleMute(c.id)} onOpen={() => navigate(`/app/messages/${c.id}`)} />
                ))}
              </div>
            )}

            {convos.length === 0 && <EmptyState />}
          </>
        )}
      </div>
    </div>
  )
}

function ConvoRow({ convo, swiped, onSwipe, onPin, onArchive, onMute, onOpen }: {
  convo: Conversation
  swiped: boolean
  onSwipe: () => void
  onPin: () => void
  onArchive: () => void
  onMute: () => void
  onOpen: () => void
}) {
  const last = convo.messages[convo.messages.length - 1]
  const other = convo.type === 'dm' ? convo.participants.find(p => p.id !== ME.id)! : null
  const dragStartX = useRef(0)

  const lastPreview = () => {
    if (convo.isTyping) return null
    if (!last) return 'Start a conversation'
    if (last.type === 'image') return '📷 Photo'
    if (last.type === 'voice') return `🎤 Voice note · ${last.duration}s`
    if (last.type === 'gif') return '🎭 GIF'
    if (last.type === 'sticker') return '🌸 Sticker'
    const prefix = last.senderId === ME.id ? 'You: ' : convo.type === 'group' ? (convo.participants.find(p => p.id === last.senderId)?.username.split('.')[0] + ': ') : ''
    return prefix + (last.text || '')
  }

  return (
    <div className="relative mb-1 overflow-hidden rounded-2xl">
      {/* Swipe actions backdrop */}
      {swiped && (
        <div className="absolute inset-y-0 right-0 flex items-center gap-0" style={{ zIndex: 0 }}>
          <button onClick={onMute} className="h-full px-4 flex flex-col items-center justify-center gap-1"
            style={{ background: '#f3e8ff', minWidth: 64 }}>
            <span style={{ fontSize: 18 }}>{convo.muted ? '🔔' : '🔕'}</span>
            <span className="text-xs" style={{ color: '#a855f7', fontWeight: 700 }}>{convo.muted ? 'Unmute' : 'Mute'}</span>
          </button>
          <button onClick={onPin} className="h-full px-4 flex flex-col items-center justify-center gap-1"
            style={{ background: '#ede9fe', minWidth: 64 }}>
            <span style={{ fontSize: 18 }}>{convo.pinned ? '📌' : '📌'}</span>
            <span className="text-xs" style={{ color: '#7c3aed', fontWeight: 700 }}>{convo.pinned ? 'Unpin' : 'Pin'}</span>
          </button>
          <button onClick={onArchive} className="h-full px-4 flex flex-col items-center justify-center gap-1"
            style={{ background: '#fce7f3', minWidth: 64 }}>
            <span style={{ fontSize: 18 }}>🗄️</span>
            <span className="text-xs" style={{ color: '#be185d', fontWeight: 700 }}>Archive</span>
          </button>
        </div>
      )}

      {/* Row */}
      <div
        className="relative flex items-center gap-3 px-3 py-3 cursor-pointer transition-all duration-200"
        style={{
          background: swiped ? 'white' : 'transparent',
          transform: swiped ? 'translateX(-196px)' : 'translateX(0)',
          zIndex: 1,
          borderRadius: 16,
        }}
        onClick={onOpen}
        onPointerDown={e => { dragStartX.current = e.clientX }}
        onPointerUp={e => { if (dragStartX.current - e.clientX > 50) onSwipe() }}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          {convo.type === 'group' ? (
            <GroupAvatar convo={convo} />
          ) : (
            <div className={convo.unreadCount > 0 ? 'story-ring' : 'story-ring-seen'} style={{ padding: '2px' }}>
              <img src={other!.avatar} alt={other!.username} className="w-12 h-12 rounded-full object-cover block" style={{ background: '#e9d5ff' }} />
            </div>
          )}
          {/* Online dot */}
          {(convo.type === 'dm' && convo.online) && (
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full" style={{ background: '#22c55e', border: '2px solid white' }} />
          )}
          {/* Muted icon */}
          {convo.muted && (
            <span className="absolute -top-1 -right-1 text-xs">🔕</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="truncate text-sm" style={{ fontWeight: convo.unreadCount > 0 ? 900 : 700, color: '#1a1a2e' }}>
                {displayName(convo)}
              </p>
              {convo.type === 'dm' && other?.verified && (
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="url(#vg2)" />
                  <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs><linearGradient id="vg2" x1="0" y1="0" x2="16" y2="16"><stop stopColor="#a855f7" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs>
                </svg>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-xs" style={{ color: convo.unreadCount > 0 ? '#a855f7' : '#9ca3af', fontWeight: convo.unreadCount > 0 ? 700 : 600 }}>
                {last?.timestamp || ''}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {convo.isTyping ? (
                <TypingDots />
              ) : (
                <p className="text-xs truncate" style={{ color: convo.unreadCount > 0 ? '#374151' : '#9ca3af', fontWeight: convo.unreadCount > 0 ? 700 : 600 }}>
                  {lastPreview()}
                </p>
              )}
            </div>
            {convo.unreadCount > 0 && (
              <span className="ml-2 shrink-0 min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', fontSize: '10px', fontWeight: 800 }}>
                {convo.unreadCount > 99 ? '99+' : convo.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function GroupAvatar({ convo }: { convo: Conversation }) {
  const others = convo.participants.filter(p => p.id !== ME.id).slice(0, 2)
  if (convo.groupAvatar) {
    return (
      <div className="story-ring" style={{ padding: '2px' }}>
        <img src={convo.groupAvatar} alt={convo.groupName} className="w-12 h-12 rounded-full object-cover block" style={{ background: '#e9d5ff' }} />
      </div>
    )
  }
  return (
    <div className="w-12 h-12 relative shrink-0">
      <img src={others[0]?.avatar} alt="" className="w-9 h-9 rounded-full object-cover absolute top-0 left-0" style={{ background: '#e9d5ff', border: '2px solid white' }} />
      <img src={others[1]?.avatar} alt="" className="w-8 h-8 rounded-full object-cover absolute bottom-0 right-0" style={{ background: '#fce7f3', border: '2px solid white' }} />
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 h-4">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#a855f7', animation: `typingBounce 1.2s ease infinite`, animationDelay: `${i * 0.2}s` }} />
      ))}
      <span className="text-xs ml-1" style={{ color: '#a855f7', fontWeight: 600 }}>typing…</span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4 animate-float">💬</div>
      <p className="text-base" style={{ fontWeight: 900, color: '#1a1a2e' }}>No messages yet</p>
      <p className="text-sm mt-1 max-w-xs" style={{ color: '#9ca3af', fontWeight: 600 }}>Start a conversation with a friend and share something beautiful!</p>
      <button className="mt-5 px-6 py-2.5 rounded-2xl text-white text-sm"
        style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', fontWeight: 800, boxShadow: '0 4px 14px rgba(168,85,247,0.3)' }}>
        New message
      </button>
    </div>
  )
}

function EmptySearch() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-5xl mb-3">🔍</div>
      <p className="text-sm" style={{ color: '#9ca3af', fontWeight: 600 }}>No conversations found</p>
    </div>
  )
}

function displayName(c: Conversation): string {
  if (c.type === 'group') return c.groupName || 'Group'
  const other = c.participants.find(p => p.id !== ME.id)
  return other?.username || 'Unknown'
}
