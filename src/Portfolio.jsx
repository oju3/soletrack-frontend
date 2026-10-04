import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import NavBar from './NavBar'
import BackButton from './BackButton'
import { API_URL } from './api'

function SellModal({ item, onClose, onConfirm }) {
  const [salePrice, setSalePrice] = useState('')
  const [salePlatform, setSalePlatform] = useState('ebay')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await onConfirm(item.id, parseFloat(salePrice), salePlatform)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-950 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Mark as sold</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-400">{item.name || item.style_code}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">Sale price</label>
            <input
              type="number"
              step="0.01"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="260.00"
              required
              autoFocus
              className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">Sold on</label>
            <select
              value={salePlatform}
              onChange={(e) => setSalePlatform(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            >
              <option value="ebay">eBay</option>
              <option value="stockx">StockX</option>
              <option value="goat">GOAT</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-700 py-2 text-sm font-medium text-gray-300 hover:bg-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-400 py-2 text-sm font-semibold text-black hover:bg-blue-300 disabled:opacity-50"
            >
              {loading ? 'Selling...' : 'Confirm sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Portfolio() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)
  const [sellingItem, setSellingItem] = useState(null)
  const navigate = useNavigate()

  const loadPortfolio = () => {
    const token = localStorage.getItem('token')
    fetch(`${API_URL}/portfolio`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load portfolio: ${res.status}`)
        return res.json()
      })
      .then(data => setItems(data.items || []))
      .catch(err => setError(err.message))
  }

  useEffect(() => {
    loadPortfolio()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleConfirmSale = async (ownedId, salePrice, salePlatform) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/portfolio/${ownedId}/sell`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sale_price: salePrice,
        sale_platform: salePlatform,
        sale_date: new Date().toISOString().split('T')[0],
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.detail ? JSON.stringify(body.detail) : `Failed to sell: ${res.status}`)
    }

    setSellingItem(null)
    loadPortfolio()
  }

  return (
    <div className="min-h-screen bg-black p-8 text-white"><div className="mx-auto max-w-7xl">
      <NavBar />
      <BackButton />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <Link
          to="/add"
          className="flex items-center gap-2 rounded-lg bg-blue-400 px-3 py-1.5 text-sm font-medium text-black hover:bg-blue-300"
        >
          <Plus size={16} />
          Add pair
        </Link>
      </div>

      {items && items.length > 0 && (
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-xs font-semibold uppercase text-gray-500">Total unrealized (gross)</p>
          <p className={`text-2xl font-bold ${
            items.reduce((sum, i) => sum + (i.unrealized_pl_gross || 0), 0) >= 0
              ? 'text-green-400'
              : 'text-red-400'
          }`}>
            {items.reduce((sum, i) => sum + (i.unrealized_pl_gross || 0), 0) >= 0 ? '+' : ''}
            ${items.reduce((sum, i) => sum + (i.unrealized_pl_gross || 0), 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            Across {items.filter(i => i.unrealized_pl_gross != null).length} of {items.length} pairs with a known valuation
          </p>
        </div>
      )}

      {error && <div className="text-red-400">Error: {error}</div>}
      {!error && !items && <div className="text-gray-400">Loading...</div>}
      {items && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-700 p-8 text-center text-gray-500">
          No sneakers in your portfolio yet.
        </div>
      )}
      {items && items.length > 0 && (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{item.name || item.style_code}</p>
                  <p className="text-sm text-gray-400">Size {item.size} &middot; Bought ${item.purchase_price}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Current value</p>
                    <p className="font-bold">
                      {item.current_value != null ? `$${item.current_value}` : 'N/A'}
                    </p>
                    {item.unrealized_pl_gross != null && (
                      <p className={`text-xs ${item.unrealized_pl_gross >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.unrealized_pl_gross >= 0 ? '+' : ''}${item.unrealized_pl_gross} unrealized (gross)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSellingItem(item)}
                    className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-900"
                  >
                    Mark as sold
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sellingItem && (
        <SellModal
          item={sellingItem}
          onClose={() => setSellingItem(null)}
          onConfirm={handleConfirmSale}
        />
      )}
    </div>
    </div>
  )
}

export default Portfolio
