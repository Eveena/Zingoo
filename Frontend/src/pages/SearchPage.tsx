import { useState } from 'react'
import { USERS, type User } from '../data/mock'

const EXPLORE_PHOTOS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=400&h=400&fit=crop&auto=format',
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [following, setFollowing] = useState<Record<string, boolean>>(
    Object.fromEntries(USERS.map(u => [u.id, u.isFollowing ?? false]))
  )

  const filtered = query.trim()
    ? USERS.filter(
        u =>
          u.username.toLowerCase().includes(query.toLowerCase()) ||
          u.name.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const toggleFollow = (id: string) => setFollowing(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="max-w-[640px] mx-auto py-8 px-4 pb-24 md:pb-8">
      {/* Search bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-6 transition-all duration-150"
        style={{
          background: 'white',
          border: `1.5px solid ${focused ? '#a855f7' : '#f0f0f0'}`,
          boxShadow: focused ? '0 0 0 3px rgba(168,85,247,0.1)' : 'none',
        }}
      >
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="#9ca3af" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search people..."
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

      {/* User results */}
      {filtered.length > 0 && (
        <div className="mb-8 flex flex-col gap-1">
          {filtered.map(user => (
            <UserRow key={user.id} user={user} following={following[user.id]} onToggle={toggleFollow} />
          ))}
        </div>
      )}

      {/* Explore grid */}
      {!query && (
        <>
          <p className="text-xs mb-4" style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Explore
          </p>
          <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
            {EXPLORE_PHOTOS.map((src, i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden cursor-pointer group"
                style={{ background: '#f3e8ff' }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {query && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: '#9ca3af', fontWeight: 600 }}>No users found for &quot;{query}&quot;</p>
        </div>
      )}

      {/* Suggested people (no query) */}
      {!query && (
        <div className="mt-10">
          <p className="text-xs mb-4" style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Suggested for you
          </p>
          <div className="flex flex-col gap-1">
            {USERS.filter(u => !u.isFollowing).slice(0, 4).map(user => (
              <UserRow key={user.id} user={user} following={following[user.id]} onToggle={toggleFollow} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function UserRow({ user, following, onToggle }: { user: User; following: boolean; onToggle: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150" style={{ cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover shrink-0" style={{ background: '#e9d5ff' }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate" style={{ fontWeight: 800, color: '#1a1a2e' }}>{user.username}</p>
        <p className="text-xs truncate" style={{ color: '#9ca3af', fontWeight: 600 }}>{user.name} · {user.followers.toLocaleString()} followers</p>
      </div>
      <button
        onClick={() => onToggle(user.id)}
        className="shrink-0 px-4 py-1.5 rounded-lg text-xs transition-all duration-150"
        style={{
          background: following ? 'white' : 'linear-gradient(135deg, #a855f7, #ec4899)',
          color: following ? '#9ca3af' : 'white',
          fontWeight: 800,
          border: following ? '1.5px solid #e5e7eb' : 'none',
        }}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  )
}
