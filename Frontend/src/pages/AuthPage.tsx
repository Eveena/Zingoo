import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { FormEvent, ReactNode } from 'react'
import { ZingooMark } from '../components/Logo'
import { BirdMascot } from '../components/BirdMascot'
import { supabase } from '../lib/supabase'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-5 py-8 overflow-y-auto"
      style={{
        background: 'linear-gradient(160deg, #f3e8ff 0%, #fff5fa 100%)',
      }}
    >
      {/* LOGO */}
      <div className="flex items-center gap-2.5 mb-4">
        <ZingooMark size={30} />

        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900,
            fontSize: '1.5rem',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Zingoo
        </span>
      </div>

      {/* BIRD */}
      <div className="animate-float my-2">
        <BirdMascot size={90} />
      </div>

      {/* CARD */}
      <div
        className="w-full max-w-sm glass rounded-3xl p-6 shadow-xl animate-scalein"
        style={{
          boxShadow: '0 20px 60px rgba(168,85,247,0.15)',
        }}
      >
        {/* TABS */}
        <div
          className="flex rounded-2xl p-1 mb-6"
          style={{ background: '#f3e8ff' }}
        >
          {(['login', 'signup'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="flex-1 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                fontWeight: 800,
                background:
                  mode === m
                    ? 'linear-gradient(135deg, #a855f7, #ec4899)'
                    : 'transparent',
                color: mode === m ? 'white' : '#9ca3af',
                boxShadow:
                  mode === m
                    ? '0 4px 12px rgba(168,85,247,0.3)'
                    : 'none',
              }}
            >
              {m === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        {mode === 'login' ? <LoginForm /> : <SignupForm />}

        {/* SOCIAL AUTH */}
        <div className="mt-5">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex-1 h-px"
              style={{ background: '#e9d5ff' }}
            />

            <span
              className="text-xs"
              style={{ color: '#c084fc', fontWeight: 700 }}
            >
              or continue with
            </span>

            <div
              className="flex-1 h-px"
              style={{ background: '#e9d5ff' }}
            />
          </div>

          <div className="flex gap-3">
            <SocialBtn
              icon="G"
              label="Google"
              color="#ea4335"
              bg="#fff5f5"
              onClick={() => {}}
            />

            <SocialBtn
              icon="🍎"
              label="Apple"
              color="#1a1a2e"
              bg="#f8f8f8"
              onClick={() => {}}
            />
          </div>

          {mode === 'login' && (
            <button
              type="button"
              className="w-full mt-3 py-3 rounded-2xl text-sm transition-colors duration-150"
              style={{
                background: 'transparent',
                color: '#9ca3af',
                fontWeight: 700,
                border: '1.5px solid #e9d5ff',
              }}
              onClick={() => {}}
            >
              Continue as Guest
            </button>
          )}
        </div>
      </div>

      {/* FORGOT PASSWORD */}
      {mode === 'login' && (
        <p
          className="mt-4 text-xs"
          style={{ color: '#c084fc', fontWeight: 600 }}
        >
          Forgot your password?{' '}
          <button
            type="button"
            style={{
              color: '#a855f7',
              fontWeight: 800,
            }}
            onClick={() => {}}
          >
            Reset it
          </button>
        </p>
      )}
    </div>
  )
}

/* =========================================================
   LOGIN FORM
========================================================= */

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/app/home')
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleLogin}
    >
      <AuthField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon="✉️"
      />

      <AuthField
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        icon="🔒"
      />

      {error && (
        <p
          className="text-xs"
          style={{
            color: '#ef4444',
            fontWeight: 700,
          }}
        >
          {error}
        </p>
      )}

      <SubmitBtn>
        {loading ? 'Logging in...' : 'Log in'}
      </SubmitBtn>
    </form>
  )
}

/* =========================================================
   SIGNUP FORM
========================================================= */

function SignupForm() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [birthday, setBirthday] = useState('')
  const [gender, setGender] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError('')

    /* VALIDATION */

    if (!name.trim()) {
      setError('Please enter your full name')
      return
    }

    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    if (!password) {
      setError('Please enter a password')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    if (!gender) {
      setError('Please select your gender')
      return
    }

    setLoading(true)

    /* =====================================================
       PROFILE DATA
       
       These values match your profiles table:
       
       id
       username
       display_name
       bio
       avatar_url
       cover_url
       birthday
       gender
       website
       is_private
       created_at
       updated_at
    ===================================================== */

    const displayName = name.trim()

    const bio = ''
    const avatarUrl = ''
    const coverUrl = ''
    const website = ''
    const isPrivate = false

    /* =====================================================
       CREATE SUPABASE AUTH ACCOUNT
    ===================================================== */

    const {
      data: { user },
      error: signupError,
    } = await supabase.auth.signUp({
      email: email.trim(),
      password,

      options: {
        data: {
          username: username.trim(),
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
          cover_url: coverUrl,
          birthday: birthday || null,
          gender,
          website,
          is_private: isPrivate,
        },
      },
    })

    if (signupError) {
      setLoading(false)
      setError(signupError.message)
      return
    }

    if (!user) {
      setLoading(false)
      setError('Unable to create account')
      return
    }

    /* =====================================================
       SAVE PROFILE INTO profiles TABLE
    ===================================================== */

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          username: username.trim(),
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
          cover_url: coverUrl,
          birthday: birthday || null,
          gender,
          website,
          is_private: isPrivate,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      )

    setLoading(false)

    if (profileError) {
      console.error('Profile creation error:', profileError)

      setError(
        `Account created, but profile could not be saved: ${profileError.message}`
      )

      return
    }

    /* SUCCESS */

    navigate('/app/home')
  }

  return (
    <form
      className="flex flex-col gap-3.5"
      onSubmit={handleSignup}
    >
      {/* FULL NAME */}

      <AuthField
        label="Full name"
        type="text"
        value={name}
        onChange={setName}
        placeholder="Nova Kim"
        icon="👤"
      />

      {/* USERNAME */}

      <AuthField
        label="Username"
        type="text"
        value={username}
        onChange={setUsername}
        placeholder="nova.jpeg"
        icon="@"
      />

      {/* EMAIL */}

      <AuthField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon="✉️"
      />

      {/* PASSWORD */}

      <AuthField
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        icon="🔒"
      />

      {/* CONFIRM PASSWORD */}

      <AuthField
        label="Confirm password"
        type="password"
        value={confirm}
        onChange={setConfirm}
        placeholder="••••••••"
        icon="🔑"
      />

      {/* BIRTHDAY */}

      <AuthField
        label="Birthday"
        type="date"
        value={birthday}
        onChange={setBirthday}
        placeholder=""
        icon="🎂"
      />

      {/* GENDER */}

      <div>
        <label
          className="block text-xs mb-1.5"
          style={{
            color: '#9ca3af',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Gender
        </label>

        <div className="flex gap-2">
          {['She/Her', 'He/Him', 'They/Them'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className="flex-1 py-2 rounded-xl text-xs transition-all duration-150"
              style={{
                fontWeight: 700,
                background:
                  gender === g
                    ? 'linear-gradient(135deg, #a855f7, #ec4899)'
                    : '#f3e8ff',
                color: gender === g ? 'white' : '#a855f7',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <p
          className="text-xs"
          style={{
            color: '#ef4444',
            fontWeight: 700,
          }}
        >
          {error}
        </p>
      )}

      {/* SUBMIT */}

      <SubmitBtn>
        {loading ? 'Creating account...' : 'Create account'}
      </SubmitBtn>
    </form>
  )
}

/* =========================================================
   AUTH FIELD
========================================================= */

function AuthField({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  icon: string
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div>
      <label
        className="block text-xs mb-1.5"
        style={{
          color: '#9ca3af',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </label>

      <div
        className="flex items-center rounded-2xl px-3 py-3 gap-2.5 transition-all duration-150"
        style={{
          background: focused ? 'white' : '#fdf4ff',
          border: `1.5px solid ${
            focused ? '#a855f7' : '#e9d5ff'
          }`,
          boxShadow: focused
            ? '0 0 0 3px rgba(168,85,247,0.12)'
            : 'none',
        }}
      >
        <span
          className="text-base shrink-0"
          style={{ fontSize: 15 }}
        >
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 outline-none bg-transparent text-sm"
          style={{
            color: '#1a1a2e',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
          }}
        />
      </div>
    </div>
  )
}

/* =========================================================
   SUBMIT BUTTON
========================================================= */

function SubmitBtn({
  children,
}: {
  children: ReactNode
}) {
  return (
    <button
      type="submit"
      className="mt-1 w-full py-3.5 rounded-2xl text-white text-sm transition-all duration-200"
      style={{
        background:
          'linear-gradient(135deg, #a855f7, #ec4899)',
        fontWeight: 800,
        boxShadow:
          '0 6px 20px rgba(168,85,247,0.35)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.9'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1'
      }}
    >
      {children}
    </button>
  )
}

/* =========================================================
   SOCIAL BUTTON
========================================================= */

function SocialBtn({
  icon,
  label,
  color,
  bg,
  onClick,
}: {
  icon: string
  label: string
  color: string
  bg: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm transition-all duration-150"
      style={{
        background: bg,
        color,
        fontWeight: 800,
        border: '1.5px solid #e9d5ff',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.85'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1'
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  )
}