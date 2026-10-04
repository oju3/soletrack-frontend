import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import NavBar from './NavBar'
import BackButton from './BackButton'
import { API_URL } from './api'

function AddPair() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedSneaker, setSelectedSneaker] = useState(null)
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [purchaseSource, setPurchaseSource] = useState('stockx')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Debounced search: waits 300ms after typing stops before hitting the API,
  // so it doesn't fire a request on every keystroke.
  useEffect(() => {
    if (!query || selectedSneaker) {
      setResults([])
      return
    }

    const timeout = setTimeout(() => {
      const token = localStorage.getItem('token')
      fetch(`${API_URL}/sneakers/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setResults(data.results || []))
        .catch(() => setResults([]))
    }, 300)

    return () => clearTimeout(timeout)
  }, [query, selectedSneaker])

  const handleSelect = (sneaker) => {
    setSelectedSneaker(sneaker)
    setQuery(sneaker.name)
    setResults([])
  }

  const handleClear = () => {
    setSelectedSneaker(null)
    setQuery('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!selectedSneaker) {
      setError('Please select a sneaker from the search results.')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sneaker_id: selectedSneaker.id,
          size: size,
          purchase_price: parseFloat(price),
          purchase_date: purchaseDate,
          purchase_source: purchaseSource,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail ? JSON.stringify(body.detail) : `Failed to add pair: ${res.status}`)
      }

      navigate('/portfolio')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black p-8 text-white"><div className="mx-auto max-w-7xl">
      <NavBar />
      <BackButton />
      <button
        onClick={() => navigate('/portfolio')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to portfolio
      </button>

      <h1 className="mb-6 text-2xl font-bold">Add a pair</h1>

      <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4">
        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-gray-400">Sneaker</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                if (selectedSneaker) setSelectedSneaker(null)
              }}
              placeholder="Start typing a sneaker name..."
              required
              className="w-full rounded-lg border border-gray-800 bg-black py-2 pl-9 pr-3 text-sm text-white focus:border-blue-400 focus:outline-none"
            />
          </div>

          {selectedSneaker && (
            <p className="mt-1 text-xs text-blue-400">
              Selected: {selectedSneaker.name} ({selectedSneaker.style_code}){' '}
              <button type="button" onClick={handleClear} className="text-gray-500 hover:text-white">
                (change)
              </button>
            </p>
          )}

          {results.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-800 bg-gray-950 shadow-lg">
              {results.slice(0, 8).map(sneaker => (
                <button
                  key={sneaker.id}
                  type="button"
                  onClick={() => handleSelect(sneaker)}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-900"
                >
                  <span className="font-medium">{sneaker.name}</span>
                  <span className="ml-2 text-xs text-gray-500">{sneaker.style_code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Size</label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="10"
            required
            className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Purchase price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="220.00"
            required
            className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Purchase date</label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Purchase source</label>
          <select
            value={purchaseSource}
            onChange={(e) => setPurchaseSource(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
          >
            <option value="snkrs">SNKRS</option>
            <option value="stockx">StockX</option>
            <option value="goat">GOAT</option>
            <option value="ebay">eBay</option>
            <option value="in_store">In store</option>
            <option value="other">Other</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-400 py-2 text-sm font-semibold text-black hover:bg-blue-300 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add pair'}
        </button>
      </form>
    </div>
    </div>
  )
}

export default AddPair
