import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import NavBar from './NavBar'
import BackButton from './BackButton'
import { API_URL } from './api'

function App() {
  const [query, setQuery] = useState('jordan')
  const [inputValue, setInputValue] = useState('jordan')
  const [sneakers, setSneakers] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    fetch(`${API_URL}/sneakers/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}: ${res.statusText}`)
        }
        return res.json()
      })
      .then(data => {
        if (!data.results) {
          throw new Error('Response had no results field: ' + JSON.stringify(data))
        }
        setSneakers(data.results)
      })
      .catch(err => setError(err.message))
  }, [query])

  const handleSubmit = (e) => {
    e.preventDefault()
    setQuery(inputValue)
  }

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <NavBar />
        <BackButton />

        <h1 className="mb-6 text-2xl font-bold">Sneaker Search</h1>

        <form onSubmit={handleSubmit} className="relative mb-8 max-w-lg">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name or style code..."
            className="w-full rounded-lg border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-3 text-sm text-white focus:border-blue-400 focus:outline-none"
          />
        </form>

        {error && <div className="text-red-400">Error: {error}</div>}
        {!error && !sneakers && <div className="text-gray-400">Loading...</div>}
        {sneakers && sneakers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-700 p-8 text-center text-gray-500">
            No sneakers matched "{query}".
          </div>
        )}

        {sneakers && sneakers.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sneakers.map((sneaker, index) => (
              <Link
                key={sneaker.id}
                to={`/sneaker/${sneaker.id}`}
                className={`group flex flex-col justify-between rounded-2xl border border-gray-800 bg-gray-950 p-5 transition-colors hover:border-blue-400 ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div>
                  <span className="mb-3 inline-block rounded-full bg-blue-400 px-2.5 py-0.5 text-xs font-semibold text-black">
                    {sneaker.style_code}
                  </span>
                  <h2 className="text-lg font-bold leading-tight text-white group-hover:text-blue-400">
                    {sneaker.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">{sneaker.colorway}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>{sneaker.release_date}</span>
                  <span className="flex items-center gap-1">
                    View <span className="text-blue-400">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
