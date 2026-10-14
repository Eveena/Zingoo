import { NavLink, Outlet, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const NAV_TABS = [
  {
    to: '/app/home',
    label: 'Home',
    type: 'home',
  },
  {
    to: '/app/explore',
    label: 'Explore',
    type: 'explore',
  },
  {
    to: '/app/create',
    label: 'Create',
    type: 'create',
  },
  {
    to: '/app/activity',
    label: 'Activity',
    type: 'activity',
  },
  {
    to: '/app/messages',
    label: 'Messages',
    type: 'messages',
  },
  {
    to: '/app/profile',
    label: 'Profile',
    type: 'profile',
  },
]

function NavIcon({
  type,
  active,
}: {
  type: string
  active: boolean
}) {
  const color = active ? '#a855f7' : '#6b7280'

  if (type === 'home') {
    return (
      <svg
        className="w-6 h-6"
        fill={active ? 'currentColor' : 'none'}
        stroke={color}
        strokeWidth={active ? 0 : 1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    )
  }

  if (type === 'explore') {
    return (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    )
  }

  if (type === 'create') {
    return (
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
        style={{
          background:
            'linear-gradient(135deg, #a855f7, #ec4899)',
          boxShadow: '0 5px 15px rgba(168,85,247,0.25)',
        }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16M4 12h16"
          />
        </svg>
      </div>
    )
  }

  if (type === 'activity') {
    return (
      <svg
        className="w-6 h-6"
        fill={active ? 'currentColor' : 'none'}
        stroke={color}
        strokeWidth={active ? 0 : 1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    )
  }

  if (type === 'messages') {
    return (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 11.5a8.5 8.5 0 01-9 8.5 9.7 9.7 0 01-4-.85L3 21l1.9-4.2A8.2 8.2 0 013 11.5C3 7 7 3.5 12 3.5s9 3.5 9 8z"
        />
      </svg>
    )
  }

  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path
        strokeLinecap="round"
        d="M5 21a7 7 0 0114 0"
      />
    </svg>
  )
}

export default function AppLayout() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true

    const init = async () => {
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

    init()

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate('/auth')
    })

    return () => {
      mounted = false
      // unsubscribe listener
      // @ts-ignore
      data?.subscription?.unsubscribe?.()
    }
  }, [navigate])

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#faf5ff',
      }}
    >
      {loading && (
        <div className="w-full text-center py-8">Loading...</div>
      )}
      {/* =========================
          DESKTOP LAYOUT
      ========================== */}

      <div className="hidden lg:flex min-h-screen">

        {/* =========================
            LEFT SIDEBAR
        ========================== */}

        <aside
          className="fixed left-0 top-0 bottom-0 z-40 flex flex-col"
          style={{
            width: '245px',
            background: 'rgba(255,255,255,0.92)',
            borderRight: '1px solid rgba(229,231,235,0.8)',
          }}
        >
          {/* Logo */}

          <div
            className="flex items-center gap-3 px-6 pt-7 pb-10 cursor-pointer"
            onClick={() => navigate('/app/home')}
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-xl font-black"
              style={{
                background:
                  'linear-gradient(135deg,#a855f7,#ec4899)',
                boxShadow:
                  '0 7px 20px rgba(168,85,247,0.25)',
              }}
            >
              Z
            </div>

            <span
              className="text-2xl font-black"
              style={{
                background:
                  'linear-gradient(135deg,#a855f7,#ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Zingoo
            </span>
          </div>

          {/* Navigation */}

          <nav className="px-4 flex flex-col gap-2">
            {NAV_TABS.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="w-full"
              >
                {({ isActive }) => (
                  <div
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg,#f4e8ff,#fce7f3)'
                        : 'transparent',
                      color: isActive
                        ? '#a855f7'
                        : '#6b7280',
                      fontWeight: isActive ? 800 : 600,
                    }}
                  >
                    <NavIcon
                      type={tab.type}
                      active={isActive}
                    />

                    <span className="text-sm">
                      {tab.label}
                    </span>

                    {tab.type === 'activity' && (
                      <span
                        className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-white"
                        style={{
                          background:
                            'linear-gradient(135deg,#a855f7,#ec4899)',
                          fontSize: '10px',
                          fontWeight: 800,
                        }}
                      >
                        3
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Profile at bottom */}

          <div className="mt-auto px-5 pb-6">
            <button
              onClick={() => navigate('/app/profile')}
              className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all"
              style={{
                background:
                  'linear-gradient(135deg,#faf5ff,#fdf2f8)',
              }}
            >
              <img
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&auto=format'}
                alt="profile"
                className="w-11 h-11 rounded-full object-cover"
                style={{
                  border: '2px solid #e9d5ff',
                }}
              />

              <div className="text-left">
                <p
                  className="text-sm"
                  style={{
                    fontWeight: 800,
                    color: '#1f2937',
                  }}
                >
                  {profile?.username || 'zingoo_user'}
                </p>

                <p
                  className="text-xs"
                  style={{
                    color: '#9ca3af',
                    fontWeight: 600,
                  }}
                >
                  Your profile ✨
                </p>
              </div>
            </button>
          </div>
        </aside>

        {/* =========================
            MAIN CONTENT
        ========================== */}

        <main
          className="min-h-screen"
          style={{
            marginLeft: '245px',
            marginRight: '310px',
            width: 'calc(100% - 555px)',
          }}
        >
          <div
            className="mx-auto min-h-screen"
            style={{
              width: '100%',
              maxWidth: '760px',
            }}
          >
            <Outlet />
          </div>
        </main>

        {/* =========================
            RIGHT SIDEBAR
        ========================== */}

        <aside
          className="fixed right-0 top-0 bottom-0 z-30"
          style={{
            width: '310px',
            background: 'rgba(255,255,255,0.90)',
            borderLeft: '1px solid rgba(229,231,235,0.8)',
          }}
        >
          <div className="px-7 pt-10">

            {/* Current user */}

            <div className="flex items-center gap-3 mb-9">
              <img
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&auto=format'}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover"
                style={{
                  border: '2px solid #e9d5ff',
                }}
              />

              <div className="flex-1">
                <p
                  className="text-sm"
                  style={{
                    fontWeight: 800,
                    color: '#1f2937',
                  }}
                >
                  {profile?.username || 'zingoo_user'}
                </p>

                <p
                  className="text-xs"
                  style={{
                    color: '#9ca3af',
                    fontWeight: 600,
                  }}
                >
                  Welcome back ✨
                </p>
              </div>

              <button
                className="text-xs"
                style={{
                  color: '#a855f7',
                  fontWeight: 800,
                }}
                onClick={async () => {
                  await supabase.auth.signOut()
                  navigate('/auth')
                }}
              >
                Log out
              </button>
            </div>

            {/* Suggested title */}

            <div className="flex items-center justify-between mb-5">
              <p
                className="text-sm"
                style={{
                  color: '#6b7280',
                  fontWeight: 800,
                }}
              >
                Suggested for you
              </p>

              <button
                className="text-xs"
                style={{
                  color: '#6b7280',
                  fontWeight: 700,
                }}
              >
                See all
              </button>
            </div>

            {/* Suggestions */}

            {[
              {
                username: 'luna.vibes',
                image:
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&auto=format',
              },
              {
                username: 'haru.jpg',
                image:
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format',
              },
              {
                username: 'sora.days',
                image:
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
              },
              {
                username: 'milo.jpeg',
                image:
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format',
              },
            ].map((user) => (
              <div
                key={user.username}
                className="flex items-center gap-3 mb-5"
              >
                <img
                  src={user.image}
                  alt={user.username}
                  className="w-11 h-11 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm truncate"
                    style={{
                      fontWeight: 800,
                      color: '#1f2937',
                    }}
                  >
                    {user.username}
                  </p>

                  <p
                    className="text-xs"
                    style={{
                      color: '#9ca3af',
                      fontWeight: 600,
                    }}
                  >
                    Suggested for you
                  </p>
                </div>

                <button
                  className="text-xs"
                  style={{
                    color: '#a855f7',
                    fontWeight: 800,
                  }}
                >
                  Follow
                </button>
              </div>
            ))}

            {/* Cute Zingoo card */}

            <div
              className="mt-8 p-5 rounded-3xl"
              style={{
                background:
                  'linear-gradient(135deg,#f8eaff,#ffeaf6)',
                border:
                  '1px solid rgba(168,85,247,0.12)',
              }}
            >
              <div className="text-xl mb-3">
                ✨ 💜 🌸
              </div>

              <h3
                className="text-base"
                style={{
                  color: '#9333ea',
                  fontWeight: 900,
                }}
              >
                Stay vibey ✨
              </h3>

              <p
                className="text-xs mt-2 leading-relaxed"
                style={{
                  color: '#9ca3af',
                  fontWeight: 600,
                }}
              >
                Share little moments, discover new
                vibes and make your Zingoo world cute.
              </p>
            </div>

            {/* Footer */}

            <div
              className="absolute left-7 right-7 bottom-7 text-xs"
              style={{
                color: '#c4b5fd',
                fontWeight: 600,
                lineHeight: 1.8,
              }}
            >
              About · Help · Privacy · Terms
              <br />
              © 2026 ZINGOO ✨
            </div>
          </div>
        </aside>
      </div>

      {/* =========================
          MOBILE LAYOUT
      ========================== */}

      <div className="lg:hidden min-h-screen">
        <div className="pb-24">
          <Outlet />
        </div>

        {/* Mobile bottom navigation */}

        <div
          className="fixed bottom-5 left-1/2 z-50"
          style={{
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '420px',
          }}
        >
          <nav
            className="flex items-center justify-around px-3 py-2.5"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '28px',
              boxShadow:
                '0 8px 40px rgba(168,85,247,0.18), 0 2px 12px rgba(0,0,0,0.08)',
              border:
                '1px solid rgba(255,255,255,0.8)',
            }}
          >
            {NAV_TABS
              .filter((tab) =>
                ['home', 'explore', 'create', 'activity', 'profile'].includes(
                  tab.type
                )
              )
              .map((tab) => {
                if (tab.type === 'create') {
                  return (
                    <button
                      key={tab.to}
                      onClick={() => navigate(tab.to)}
                      className="flex items-center justify-center w-12 h-12 rounded-2xl"
                      style={{
                        background:
                          'linear-gradient(135deg,#a855f7,#ec4899)',
                        boxShadow:
                          '0 4px 16px rgba(168,85,247,0.4)',
                      }}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16M4 12h16"
                        />
                      </svg>
                    </button>
                  )
                }

                return (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    className="flex flex-col items-center gap-0.5 px-2 py-1"
                  >
                    {({ isActive }) => (
                      <>
                        <NavIcon
                          type={tab.type}
                          active={isActive}
                        />

                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            color: isActive
                              ? '#a855f7'
                              : '#9ca3af',
                          }}
                        >
                          {tab.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                )
              })}
          </nav>
        </div>
      </div>
    </div>
  )
}