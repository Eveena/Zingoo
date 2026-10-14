import { useState } from 'react'
import { USERS, EXPLORE_PHOTOS } from '../data/mock'

const CATEGORIES = ['Trending', 'Fashion', 'Photography', 'Food', 'Travel', 'Art', 'Gaming', 'Music', 'Lifestyle']

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [category, setCategory] = useState('Trending')
  const [following, setFollowing] = useState<Record<string, boolean>>(
    Object.fromEntries(USERS.map(u => [u.id, u.isFollowing ?? false]))
  )

  const filtered = query.trim()
    ? USERS.filter(u => u.username.toLowerCase().includes(query.toLowerCase()) || u.name.toLowerCase().includes(query.toLowerCase()))
    : []

  const toggleFollow = (id: string) => setFollowing(prev => ({ ...prev, [id]: !prev[id] }))

  const left = EXPLORE_PHOTOS.filter((_, i) => i % 2 === 0)
  const right = EXPLORE_PHOTOS.filter((_, i) => i % 2 !== 0)

  return (
    <div className="max-w-[430px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-3" style={{ background: 'rgba(250,245,255,0.92)', backdropFilter: 'blur(16px)' }}>
        {/* Search */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150"
          style={{ background: focused ? 'white' : '#f3e8ff', border: `1.5px solid ${focused ? '#a855f7' : 'transparent'}`, boxShadow: focused ? '0 0 0 3px rgba(168,85,247,0.12)' : 'none' }}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke={focused ? '#a855f7' : '#c084fc'} strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search people, tags, places..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 outline-none bg-transparent text-sm"
            style={{ color: '#1a1a2e', fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <svg className="w-4 h-4" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category chips */}
        {!query && (
          <div className="flex gap-2 mt-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="shrink-0 px-4 py-1.5 rounded-full text-xs transition-all duration-150"
                style={{
                  fontWeight: 700,
                  background: category === c ? 'linear-gradient(135deg, #a855f7, #ec4899)' : '#f3e8ff',
                  color: category === c ? 'white' : '#a855f7',
                  boxShadow: category === c ? '0 4px 12px rgba(168,85,247,0.3)' : 'none',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        {/* User results */}
        {filtered.length > 0 && (
          <div className="flex flex-col gap-1 mb-4">
            {filtered.map(user => (
              <UserRow key={user.id} user={user} following={following[user.id]} onToggle={toggleFollow} />
            ))}
          </div>
        )}

        {query && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm" style={{ color: '#9ca3af', fontWeight: 600 }}>No results for "{query}"</p>
          </div>
        )}

        {/* Pinterest masonry grid */}
        {!query && (
          <div className="flex gap-3 mt-1">
            {/* Left column */}
            <div className="flex-1 flex flex-col gap-3">
              {left.map((p, i) => (
                <PhotoCard key={i} src={p.src} likes={p.likes} />
              ))}
            </div>
            {/* Right column */}
            <div className="flex-1 flex flex-col gap-3 mt-6">
              {right.map((p, i) => (
                <PhotoCard key={i} src={p.src} likes={p.likes} />
              ))}
            </div>
          </div>
        )}

        {/* Suggested users (no query) */}
        {!query && (
          <div className="mt-6">
            <p className="text-xs mb-3" style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              People to follow
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {USERS.filter(u => !u.isFollowing).map(user => (
                <div key={user.id} className="shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl" style={{ background: 'white', border: '1px solid #f3e8ff', width: '140px', boxShadow: '0 2px 12px rgba(168,85,247,0.08)' }}>
                  <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover" style={{ background: '#e9d5ff' }} />
                  <div className="text-center">
                    <p className="text-xs" style={{ fontWeight: 800, color: '#1a1a2e' }}>{user.username}</p>
                    <p className="text-xs" style={{ color: '#9ca3af', fontWeight: 600 }}>{(user.followers / 1000).toFixed(1)}k followers</p>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className="w-full py-1.5 rounded-xl text-xs"
                    style={{
                      background: following[user.id] ? 'white' : 'linear-gradient(135deg, #a855f7, #ec4899)',
                      color: following[user.id] ? '#9ca3af' : 'white',
                      fontWeight: 800,
                      border: following[user.id] ? '1.5px solid #e9d5ff' : 'none',
                    }}
                  >
                    {following[user.id] ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PhotoCard({ src, likes }: { src: string; likes: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: '#f3e8ff' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={src} alt="" className="w-full object-cover block transition-transform duration-300" style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
      {hovered && (
        <div className="absolute inset-0 flex items-end p-3 transition-all duration-200" style={{ background: 'linear-gradient(to top, rgba(45,26,61,0.55) 0%, transparent 60%)' }}>
          <span className="text-white text-xs flex items-center gap-1" style={{ fontWeight: 800 }}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likes.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  )
}

function UserRow({ user, following, onToggle }: { user: typeof USERS[0]; following: boolean; onToggle: (id: string) => void }) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-colors duration-150"
      style={{ cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#faf5ff')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover shrink-0" style={{ background: '#e9d5ff' }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-sm truncate" style={{ fontWeight: 800, color: '#1a1a2e' }}>{user.username}</p>
          {user.verified && <span className="text-xs">✨</span>}
        </div>
        <p className="text-xs truncate" style={{ color: '#9ca3af', fontWeight: 600 }}>{user.name}</p>
      </div>
      <button
        onClick={() => onToggle(user.id)}
        className="shrink-0 px-4 py-1.5 rounded-xl text-xs transition-all duration-150"
        style={{
          background: following ? 'white' : 'linear-gradient(135deg, #a855f7, #ec4899)',
          color: following ? '#9ca3af' : 'white',
          fontWeight: 800,
          border: following ? '1.5px solid #e9d5ff' : 'none',
        }}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  )
}
