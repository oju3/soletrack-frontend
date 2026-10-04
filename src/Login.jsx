import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Footprints } from 'lucide-react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        throw new Error('Invalid email or password')
      }

      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      navigate('/hub')
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

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-400 py-2 text-sm font-semibold text-black hover:bg-blue-300 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
