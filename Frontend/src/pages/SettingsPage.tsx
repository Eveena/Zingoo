import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'

const THEMES = [
  { name: 'Pastel Pink', from: '#f9a8d4', to: '#fce7f3' },
  { name: 'Lavender', from: '#c084fc', to: '#ede9fe' },
  { name: 'Mint', from: '#6ee7b7', to: '#d1fae5' },
  { name: 'Peach', from: '#fdba74', to: '#ffedd5' },
  { name: 'Sky Blue', from: '#7dd3fc', to: '#e0f2fe' },
  { name: 'Cream', from: '#fde68a', to: '#fefce8' },
]

const SECTIONS = [
  { id: 'account', label: 'Account', emoji: '👤' },
  { id: 'privacy', label: 'Privacy', emoji: '🔒' },
  { id: 'notifications', label: 'Notifications', emoji: '🔔' },
  { id: 'appearance', label: 'Appearance', emoji: '🎨' },
  { id: 'security', label: 'Security', emoji: '🛡️' },
  { id: 'help', label: 'Help & Support', emoji: '💬' },
  { id: 'about', label: 'About Zingoo', emoji: '🌸' },
]

export default function SettingsPage() {
  const [active, setActive] = useState('account')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const [birthday, setBirthday] = useState<string | null>(null)
  const [gender, setGender] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  const [darkMode, setDarkMode] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('Pastel Pink')
  const [privateAcc, setPrivateAcc] = useState(false)
  const [notifLikes, setNotifLikes] = useState(true)
  const [notifFollows, setNotifFollows] = useState(true)
  const [notifComments, setNotifComments] = useState(true)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true

    const loadProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, bio, avatar_url, cover_url, birthday, gender, website, is_private, email')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Failed to load profile for settings', error)
      }

      if (!mounted) return

      setName(data?.display_name || '')
      setUsername(data?.username || '')
      setBio(data?.bio || '')
      setEmail(data?.email || '')
      setBirthday(data?.birthday || null)
      setGender(data?.gender || '')
      setWebsite(data?.website || '')
      setAvatarUrl(data?.avatar_url || '')
      setIsPrivate(!!data?.is_private)
      setLoading(false)
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [])

  const handleUploadAvatar = async (file?: File) => {
    if (!file) return null

    const extension = file.name.split('.').pop() || 'jpg'
    const fileName = `${crypto.randomUUID()}.${extension}`
    const filePath = fileName

    const { error: uploadError } = await supabase.storage
      .from('posts')
      .upload(filePath, file, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('Avatar upload error', uploadError)
      return null
    }

    const { data } = supabase.storage.from('posts').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSave = async () => {
    setSaved(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const updates: any = {
        username: username.trim(),
        display_name: name.trim(),
        bio,
        birthday: birthday || null,
        gender: gender || null,
        website: website || null,
        is_private: isPrivate,
        email: email || null,
        updated_at: new Date().toISOString(),
      }

      if (avatarUrl) updates.avatar_url = avatarUrl

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        console.error('Profile update error', error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-[430px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4" style={{ background: 'rgba(250,245,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(233,213,255,0.4)' }}>
        <button onClick={() => navigate('/app/profile')} style={{ color: '#a855f7' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.2rem', color: '#1a1a2e', letterSpacing: '-0.01em' }}>Settings</h1>
      </div>

      <div className="px-4 py-4">
        {/* Profile card */}
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-5" style={{ background: 'white', border: '1px solid #f3e8ff', boxShadow: '0 2px 12px rgba(168,85,247,0.08)' }}>
          <img src={avatarUrl || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&auto=format'} alt={name || ''} className="w-14 h-14 rounded-full object-cover" style={{ background: '#e9d5ff' }} />
          <div className="flex-1 min-w-0">
            <p style={{ fontWeight: 900, color: '#1a1a2e', fontSize: '0.95rem' }}>{name || 'Your name'}</p>
            <p className="text-xs" style={{ color: '#9ca3af', fontWeight: 600 }}>@{username || 'username'}</p>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-xs"
            style={{ background: '#f3e8ff', color: '#a855f7', fontWeight: 800 }}
            onClick={() => navigate('/app/settings')}
          >
            Edit
          </button>
        </div>

        {/* Section list */}
        <div className="flex flex-col gap-1 mb-5">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(active === s.id ? '' : s.id)}
              className="flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-150 text-left"
              style={{ background: active === s.id ? '#f3e8ff' : 'white', border: `1px solid ${active === s.id ? '#e9d5ff' : '#f9f5ff'}` }}
            >
              <span className="flex items-center gap-3">
                <span style={{ fontSize: 18 }}>{s.emoji}</span>
                <span style={{ fontWeight: 700, color: '#374151', fontSize: '0.9rem' }}>{s.label}</span>
              </span>
              <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="#c084fc" strokeWidth="2" viewBox="0 0 24 24"
                style={{ transform: active === s.id ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Panel */}
        {active === 'account' && (
          <div className="p-4 rounded-2xl flex flex-col gap-4" style={{ background: 'white', border: '1px solid #f3e8ff' }}>
            <h3 style={{ fontWeight: 900, color: '#1a1a2e', fontSize: '0.95rem' }}>Account info</h3>
            <div className="flex items-center gap-3 mb-1">
              <img src={avatarUrl || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&auto=format'} alt="" className="w-14 h-14 rounded-full object-cover" style={{ background: '#e9d5ff' }} />
              <div>
                <label className="text-sm px-4 py-2 rounded-xl cursor-pointer" style={{ background: '#f3e8ff', color: '#a855f7', fontWeight: 800 }}>
                  Change photo
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    const publicUrl = await handleUploadAvatar(f)
                    if (publicUrl) setAvatarUrl(publicUrl)
                  }} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
            <SField label="Full name" value={name} onChange={setName} />
            <SField label="Username" value={username} onChange={setUsername} prefix="@" />
            <SField label="Email" value={email} onChange={setEmail} type="email" />
            <div>
              <label className="text-xs block mb-1.5" style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full px-3 py-3 rounded-2xl text-sm outline-none resize-none" style={{ border: '1.5px solid #e9d5ff', fontFamily: "'Nunito', sans-serif", fontWeight: 600, color: '#1a1a2e' }} />
            </div>
            <SaveBtn saved={saved} onClick={handleSave} />
          </div>
        )}

        {active === 'privacy' && (
          <div className="p-4 rounded-2xl flex flex-col gap-4" style={{ background: 'white', border: '1px solid #f3e8ff' }}>
            <h3 style={{ fontWeight: 900, color: '#1a1a2e', fontSize: '0.95rem' }}>Privacy</h3>
            <SToggle label="Private account" desc="Only approved followers can see your posts" value={privateAcc} onChange={setPrivateAcc} />
            <SToggle label="Activity status" desc="Show when you were last active" value={true} onChange={() => {}} />
            <SToggle label="Allow mentions" desc="Let others mention you in posts" value={true} onChange={() => {}} />
            <SToggle label="Close friends only" desc="Limit stories to close friends" value={false} onChange={() => {}} />
          </div>
        )}

        {active === 'notifications' && (
          <div className="p-4 rounded-2xl flex flex-col gap-4" style={{ background: 'white', border: '1px solid #f3e8ff' }}>
            <h3 style={{ fontWeight: 900, color: '#1a1a2e', fontSize: '0.95rem' }}>Notifications</h3>
            <SToggle label="Likes" desc="When someone likes your post" value={notifLikes} onChange={setNotifLikes} />
            <SToggle label="New followers" desc="When someone follows you" value={notifFollows} onChange={setNotifFollows} />
            <SToggle label="Comments" desc="When someone comments on your post" value={notifComments} onChange={setNotifComments} />
            <SToggle label="Mentions" desc="When someone mentions you" value={true} onChange={() => {}} />
            <SToggle label="Story reactions" desc="When someone reacts to your story" value={true} onChange={() => {}} />
          </div>
        )}

        {active === 'appearance' && (
          <div className="p-4 rounded-2xl flex flex-col gap-4" style={{ background: 'white', border: '1px solid #f3e8ff' }}>
            <h3 style={{ fontWeight: 900, color: '#1a1a2e', fontSize: '0.95rem' }}>Appearance</h3>
            <SToggle label="Dark mode" desc="Switch to a darker interface" value={darkMode} onChange={setDarkMode} />
            <div>
              <p className="text-sm mb-3" style={{ fontWeight: 800, color: '#1a1a2e' }}>Theme color</p>
              <div className="grid grid-cols-3 gap-3">
                {THEMES.map(t => (
                  <button
                    key={t.name}
                    onClick={() => setSelectedTheme(t.name)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${t.from}, ${t.to})`,
                        border: selectedTheme === t.name ? '3px solid #a855f7' : '3px solid transparent',
                        boxShadow: selectedTheme === t.name ? '0 4px 12px rgba(168,85,247,0.4)' : 'none',
                      }}
                    />
                    <span className="text-xs" style={{ fontWeight: selectedTheme === t.name ? 800 : 600, color: selectedTheme === t.name ? '#a855f7' : '#9ca3af' }}>
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-2xl mt-2 text-sm flex items-center justify-center gap-2 transition-colors duration-150"
          style={{ background: '#fff1f2', color: '#ef4444', fontWeight: 800, border: '1.5px solid #fecaca' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
          onMouseLeave={e => (e.currentTarget.style.background = '#fff1f2')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log out
        </button>
      </div>
    </div>
  )
}

function SField({ label, value, onChange, type = 'text', prefix }: { label: string; value: string; onChange: (v: string) => void; type?: string; prefix?: string }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label className="text-xs block mb-1.5" style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <div className="flex items-center rounded-2xl px-3 py-2.5 transition-all duration-150"
        style={{ border: `1.5px solid ${focused ? '#a855f7' : '#e9d5ff'}`, background: 'white', boxShadow: focused ? '0 0 0 3px rgba(168,85,247,0.1)' : 'none' }}>
        {prefix && <span className="text-sm mr-1" style={{ color: '#9ca3af', fontWeight: 700 }}>{prefix}</span>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="flex-1 outline-none bg-transparent text-sm" style={{ color: '#1a1a2e', fontFamily: "'Nunito', sans-serif", fontWeight: 600 }} />
      </div>
    </div>
  )
}

function SToggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm" style={{ fontWeight: 800, color: '#1a1a2e' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: '#9ca3af', fontWeight: 600 }}>{desc}</p>
      </div>
      <button onClick={() => onChange(!value)} className="shrink-0 relative w-11 h-6 rounded-full transition-colors duration-200" style={{ background: value ? 'linear-gradient(135deg, #a855f7, #ec4899)' : '#e5e7eb' }}>
        <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200" style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }} />
      </button>
    </div>
  )
}

function SaveBtn({ saved, onClick }: { saved: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="self-start px-6 py-2.5 rounded-xl text-sm text-white transition-all duration-200"
      style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #a855f7, #ec4899)', fontWeight: 800, boxShadow: '0 4px 14px rgba(168,85,247,0.25)' }}>
      {saved ? 'Saved!' : 'Save changes'}
    </button>
  )
}
