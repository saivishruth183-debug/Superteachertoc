import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginUser } from '../api/auth'
import { backendUrl } from '../api/backendUrl'

const brandDots = [
  { color: 'bg-[#ff6b57]', size: 'w-6 h-6', top: '18%', left: '22%' },
  { color: 'bg-[#8fc93a]', size: 'w-4 h-4', top: '58%', left: '14%' },
  { color: 'bg-[#2fa8e0]', size: 'w-8 h-8', top: '72%', left: '52%' },
  { color: 'bg-[#8b6ef2]', size: 'w-3 h-3', top: '30%', left: '68%' },
  { color: 'bg-[#ffc64b]', size: 'w-5 h-5', top: '12%', left: '58%' },
]

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const userData = await loginUser(email, password)

      if (userData.user?.role === "admin") {
        localStorage.setItem('authToken', userData.token)
        localStorage.setItem('currentUser', JSON.stringify(userData.user))
        setStatus('success')
        setError('')

        // brief pause so the "You're in" message is visible before navigating
        setTimeout(() => {
          navigate('/adminhome')
        }, 600)
      } else {
        setStatus('error')
        setError(
          userData.user?.role
            ? 'This account does not have administrator access.'
            : 'Invalid email or password.'
        )
      }
    } catch (err) {
      setStatus('error')
      setError(
        !backendUrl && import.meta.env.PROD
          ? 'The backend URL is not configured. Set VITE_BACKEND_URL in the frontend deployment settings.'
          : err?.response?.status === 405
            ? 'The login request reached a site that does not accept API requests. Set VITE_BACKEND_URL to the backend Vercel deployment URL, not the frontend URL.'
            : err?.response?.status === 401
              ? 'Invalid email or password.'
              : err.message || 'Something went wrong. Try again.'
      )
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[1fr_1.15fr] bg-white text-[#1c2430] font-sans">
      {/* Import Fredoka for the wordmark/headline only */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&display=swap');`}</style>

      <aside className="relative flex items-center justify-center overflow-hidden bg-[#f2f5f7] px-8 py-10 md:py-12 min-h-[220px]">
        <div className="absolute inset-0" aria-hidden="true">
          {brandDots.map((dot, index) => (
            <span
              key={index}
              className={`absolute rounded-full opacity-85 ${dot.color} ${dot.size}`}
              style={{ top: dot.top, left: dot.left }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-xs">
          <span className="text-3xl font-semibold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            superteacher<span className="text-[#ff6b57]">.</span>
          </span>
          <p className="mt-4 text-base leading-relaxed text-[#5a6572]">
            Learning paths for curious minds. Sign in to manage courses and track progress.
          </p>
        </div>
      </aside>

      <section className="flex items-center justify-center px-6 py-10 md:px-10 md:py-16">
        <div className="w-full max-w-sm">
          <p className="text-sm text-[#5a6572] mb-1">Welcome back</p>
          <h1
            className="text-2xl font-semibold mb-8"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Log in to your account
          </h1>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <label className="block">
              <span className="block text-sm font-medium text-[#5a6572] mb-1.5">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@school.edu"
                autoComplete="email"
                className="w-full border-0 border-b-2 border-[#1c2430]/10 bg-transparent py-2 text-base placeholder:text-[#a3adb8] focus:outline-none focus:border-[#ff6b57] transition-colors"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-[#5a6572] mb-1.5">Password</span>
              <div className="flex items-center border-b-2 border-[#1c2430]/10 focus-within:border-[#ff6b57] transition-colors">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="flex-1 border-0 bg-transparent py-2 text-base placeholder:text-[#a3adb8] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-sm font-medium text-[#2fa8e0] py-2 px-1 hover:underline"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 text-[#5a6572] cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="w-3.5 h-3.5 accent-[#ff6b57]"
                />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="font-medium text-[#2fa8e0] hover:underline">
                Forgot password?
              </a>
            </div>

            {error && (
              <p role="alert" className="rounded-md bg-[#ff6b57]/10 px-3 py-2 text-sm text-[#c0392b]">
                {error}
              </p>
            )}
            {status === 'success' && (
              <p role="status" className="rounded-md bg-[#8fc93a]/15 px-3 py-2 text-sm text-[#4c7017]">
                You're in. Redirecting…
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full rounded-lg bg-[#1c2430] py-3 text-base font-semibold text-white transition-colors hover:enabled:bg-[#ff6b57] active:enabled:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#5a6572]">
            New to superteacher?{' '}
            <a href="/signup" className="font-medium text-[#2fa8e0] hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}

export default Login