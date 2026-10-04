import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Footprints } from 'lucide-react'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.msg || body.error_description || 'Could not create account.')
      }

      const data = await res.json()

      // Supabase returns a session directly if email confirmation is off;
      // otherwise access_token is absent and the user needs to confirm by email.
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        navigate('/hub')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-950 p-8">
        <div className="mb-6 flex items-center gap-2">
          <Footprints size={24} className="text-blue-400" />
          <h1 className="text-2xl font-bold text-white">SoleTrack</h1>
        </div>

        {success ? (
          <div>
            <p className="mb-4 text-sm text-green-400">
              Account created. Check your email to confirm before signing in.
            </p>
            <Link to="/login" className="text-sm text-blue-400 hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <label className="mb-1 block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-4 w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            />

            <label className="mb-1 block text-sm font-medium text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mb-4 w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            />

            <label className="mb-1 block text-sm font-medium text-gray-400">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mb-4 w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            />

            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mb-4 w-full rounded-lg bg-blue-400 py-2 text-sm font-semibold text-black hover:bg-blue-300 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </form>
    </div>
  )
}

export default Register
