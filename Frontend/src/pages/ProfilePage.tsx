import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { MY_POSTS } from '../data/mock'
import { supabase } from '../lib/supabase'

const POST_LIKES = [2841, 1204, 5320, 987, 3301, 712, 2108, 4450, 890]

export default function ProfilePage() {
  const [tab, setTab] = useState<'posts' | 'saved' | 'tagged'>('posts')
  const navigate = useNavigate()

  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const saved = MY_POSTS.slice(0, 6)
  const tagged = MY_POSTS.slice(3)

  const photos = tab === 'posts' ? MY_POSTS : tab === 'saved' ? saved : tagged

  useEffect(() => {
    let mounted = true

    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        navigate('/auth')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, bio, avatar_url, cover_url, birthday, gender, website, is_private, email')
        .eq('id', user.id)
        .single()

      if (error) console.error('Profile load error', error)
      if (mounted) setProfile(data || null)
      setLoading(false)
    }

    load()

    return () => {
      mounted = false
    }
  }, [navigate])

  // Load posts for this profile when available
  const [posts, setPosts] = useState<any[]>([])
  useEffect(() => {
    let mounted = true

    const loadPosts = async () => {
      if (!profile?.id) return

      const { data, error } = await supabase
        .from('posts')
        .select('id, caption, created_at, post_media(*)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to load profile posts', error)
        return
      }

      if (mounted) setPosts(data || [])
    }

    loadPosts()

    return () => {
      mounted = false
    }
  }, [profile])

  return (
    <div className="max-w-[430px] mx-auto">
      {/* Cover banner */}
      <div className="relative h-36" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899, #f97316)', overflow: 'visible' }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center"
          onClick={() => navigate('/app/settings')}
        >
          <svg className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Avatar + info */}
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-12 mb-3">
            <div className="story-ring" style={{ padding: '3px', zIndex: 20, position: 'relative' }}>
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&auto=format'}
              alt={profile?.display_name || ''}
              className="w-24 h-24 rounded-full object-cover"
              style={{ background: '#e9d5ff', border: '3px solid white' }}
            />
          </div>
          <div className="flex gap-2 mb-1">
            <button
              className="px-5 py-2 rounded-2xl text-sm transition-all duration-150"
              style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', fontWeight: 800, boxShadow: '0 4px 14px rgba(168,85,247,0.3)' }}
              onClick={() => navigate('/app/settings')}
            >
              Edit profile
            </button>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2">
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.2rem', color: '#1a1a2e', letterSpacing: '-0.01em' }}>{profile?.display_name}</h1>
          </div>
          <p className="text-sm" style={{ color: '#6b7280', fontWeight: 600 }}>@{profile?.username}</p>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: '#374151', fontWeight: 600 }}>{profile?.bio}</p>
          <p className="text-xs mt-1" style={{ color: '#a855f7', fontWeight: 700 }}>{profile?.website || ''}</p>
        </div>

        {/* Stats */}
        <div className="flex gap-0 rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid #f3e8ff', background: 'white' }}>
          {[
            { label: 'Posts', value: profile?.posts ?? 0 },
            { label: 'Followers', value: profile?.followers ?? 0 },
            { label: 'Following', value: profile?.following ?? 0 },
          ].map((s, i) => (
            <button
              key={s.label}
              className="flex-1 py-3.5 flex flex-col items-center transition-colors duration-150"
              style={{ borderRight: i < 2 ? '1px solid #f3e8ff' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fdf4ff')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1a1a2e' }}>
                {s.value >= 1000 ? `${(s.value / 1000).toFixed(1)}k` : s.value}
              </span>
              <span className="text-xs" style={{ color: '#9ca3af', fontWeight: 600 }}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Highlights placeholder */}
        <div className="flex gap-4 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
          {['Seoul', 'Nature', 'Food', 'Friends', 'Work'].map((h, i) => (
            <div key={h} className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${['#f3e8ff', '#fce7f3', '#fff1f5', '#e0f2fe', '#d1fae5'][i]}, ${['#e9d5ff', '#fbcfe8', '#fce7f3', '#bae6fd', '#a7f3d0'][i]})`, border: '2px solid white', boxShadow: '0 2px 8px rgba(168,85,247,0.15)' }}
              >
                <span style={{ fontSize: 20 }}>{['🏙️', '🌿', '🍜', '👯', '💼'][i]}</span>
              </div>
              <span className="text-xs" style={{ color: '#6b7280', fontWeight: 700, fontSize: '10px' }}>{h}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ border: '2px dashed #d8b4fe' }}>
              <svg className="w-5 h-5" fill="none" stroke="#c084fc" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs" style={{ color: '#9ca3af', fontWeight: 700, fontSize: '10px' }}>New</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: '#f3e8ff' }}>
        {[
          { key: 'posts', icon: GridIcon },
          { key: 'saved', icon: SaveIcon },
          { key: 'tagged', icon: TagIcon },
        ].map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className="flex-1 flex justify-center py-3 transition-colors duration-150"
            style={{ color: tab === key ? '#a855f7' : '#9ca3af', borderBottom: tab === key ? '2px solid #a855f7' : '2px solid transparent', marginBottom: '-1px' }}
          >
            <Icon active={tab === key} />
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {posts.length === 0 ? (
          <div className="col-span-3 text-center py-8" style={{ color: '#9ca3af' }}>
            No posts yet
          </div>
        ) : (
          posts.flatMap((p) => (p.post_media || []).map((m: any) => m.public_url)).map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden cursor-pointer group relative" style={{ background: '#f3e8ff' }}>
              <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3"
                style={{ background: 'rgba(26,26,46,0.38)' }}
              >
                <span className="text-white text-xs flex items-center gap-1" style={{ fontWeight: 800 }}>
                  <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  {POST_LIKES[i] || 0}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5" fill={active ? '#a855f7' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}
function SaveIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5" fill={active ? '#a855f7' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  )
}
function TagIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke={active ? '#a855f7' : 'currentColor'} strokeWidth={active ? 2.2 : 1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  )
}
