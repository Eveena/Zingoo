import { useState } from 'react'
import { NOTIFICATIONS } from '../data/mock'

const TYPE_ICONS: Record<string, string> = {
  like: '❤️',
  comment: '💬',
  follow: '👤',
  mention: '📢',
  tag: '🏷️',
}

export default function ActivityPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const [tab, setTab] = useState<'all' | 'likes' | 'comments' | 'follows'>('all')

  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))

  const filtered = notifs.filter(n => {
    if (tab === 'all') return true
    if (tab === 'likes') return n.type === 'like'
    if (tab === 'comments') return n.type === 'comment'
    if (tab === 'follows') return n.type === 'follow'
    return true
  })

  const today = filtered.filter(n => ['2m', '15m', '1h'].includes(n.time))
  const thisWeek = filtered.filter(n => !['2m', '15m', '1h'].includes(n.time))
  const unread = notifs.filter(n => !n.read).length

  return (
    <div className="max-w-[430px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-3" style={{ background: 'rgba(250,245,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(233,213,255,0.4)' }}>
        <div className="flex items-center justify-between mb-3">
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.3rem', color: '#1a1a2e', letterSpacing: '-0.01em' }}>
            Activity
            {unread > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', fontWeight: 800 }}>
                {unread}
              </span>
            )}
          </h1>
          {unread > 0 && (
            <button onClick={markAll} className="text-xs px-3 py-1.5 rounded-xl" style={{ background: '#f3e8ff', color: '#a855f7', fontWeight: 800 }}>
              Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {([['all', 'All'], ['likes', '❤️ Likes'], ['comments', '💬 Comments'], ['follows', '👤 Follows']] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs transition-all duration-150"
              style={{
                fontWeight: 700,
                background: tab === value ? 'linear-gradient(135deg, #a855f7, #ec4899)' : '#f3e8ff',
                color: tab === value ? 'white' : '#a855f7',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        {today.length > 0 && (
          <>
            <p className="text-xs my-4" style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Today</p>
            <div className="flex flex-col gap-1">
              {today.map(n => <NotifCard key={n.id} notif={n} />)}
            </div>
          </>
        )}

        {thisWeek.length > 0 && (
          <>
            <p className="text-xs my-4" style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>This week</p>
            <div className="flex flex-col gap-1">
              {thisWeek.map(n => <NotifCard key={n.id} notif={n} />)}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔔</div>
            <p className="text-base" style={{ fontWeight: 800, color: '#1a1a2e' }}>No activity yet</p>
            <p className="text-sm mt-1" style={{ color: '#9ca3af', fontWeight: 600 }}>When someone interacts with you, it'll show here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function NotifCard({ notif }: { notif: typeof NOTIFICATIONS[0] }) {
  const [following, setFollowing] = useState(false)

  return (
    <div
      className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors duration-150"
      style={{ background: notif.read ? 'transparent' : 'rgba(168,85,247,0.06)', cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#fdf4ff')}
      onMouseLeave={e => (e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(168,85,247,0.06)')}
    >
      {/* Avatar + type badge */}
      <div className="relative shrink-0">
        <img src={notif.user.avatar} alt={notif.user.username} className="w-11 h-11 rounded-full object-cover" style={{ background: '#e9d5ff' }} />
        <span
          className="absolute -bottom-1 -right-1 text-sm w-5 h-5 flex items-center justify-center rounded-full"
          style={{ background: 'white', fontSize: '11px', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
        >
          {TYPE_ICONS[notif.type]}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm leading-tight">
          <span style={{ fontWeight: 800, color: '#1a1a2e' }}>{notif.user.username}</span>{' '}
          <span style={{ fontWeight: 600, color: '#6b7280' }}>{notif.text}</span>
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#9ca3af', fontWeight: 600 }}>{notif.time} ago</p>
      </div>

      {notif.postThumb && (
        <img src={notif.postThumb} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" style={{ background: '#e9d5ff' }} />
      )}

      {notif.type === 'follow' && (
        <button
          onClick={() => setFollowing(!following)}
          className="shrink-0 px-3 py-1.5 rounded-xl text-xs transition-all duration-150"
          style={{
            background: following ? 'white' : 'linear-gradient(135deg, #a855f7, #ec4899)',
            color: following ? '#9ca3af' : 'white',
            fontWeight: 800,
            border: following ? '1.5px solid #e9d5ff' : 'none',
          }}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  )
}
