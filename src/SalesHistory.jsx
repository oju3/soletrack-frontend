import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import BackButton from './BackButton'
import { API_URL } from './api'

function SalesHistory() {
  const [sales, setSales] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${API_URL}/portfolio/sales`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load sales history: ${res.status}`)
        return res.json()
      })
      .then(data => setSales(data.items || []))
      .catch(err => setError(err.message))
  }, [])

  const totalRealized = sales
    ? sales.reduce((sum, s) => sum + (s.realized_pl || 0), 0)
    : 0

  return (
    <div className="min-h-screen bg-black p-8 text-white"><div className="mx-auto max-w-7xl">
      <NavBar />
      <BackButton />
      <h1 className="mb-6 text-2xl font-bold">Sales History</h1>

      {error && <div className="text-red-400">Error: {error}</div>}
      {!error && !sales && <div className="text-gray-400">Loading...</div>}

      {sales && sales.length > 0 && (
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-xs font-semibold uppercase text-gray-500">Total realized (net of fees)</p>
          <p className={`text-2xl font-bold ${totalRealized >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalRealized >= 0 ? '+' : ''}${totalRealized.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Across {sales.length} completed sale{sales.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {sales && sales.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-700 p-8 text-center text-gray-500">
          No sales recorded yet.
        </div>
      )}

      {sales && sales.length > 0 && (
        <div className="space-y-3">
          {sales.map(sale => (
            <div key={sale.id} className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{sale.name || sale.style_code}</p>
                  <p className="text-sm text-gray-400">
                    Size {sale.size} &middot; Bought ${sale.purchase_price} &middot; Sold ${sale.sale_price} on{' '}
                    <span className="uppercase">{sale.sale_platform}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Sold {sale.sale_date} &middot; Fee ${sale.fee_amount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Realized P/L</p>
                  <p className={`font-bold ${sale.realized_pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {sale.realized_pl >= 0 ? '+' : ''}${sale.realized_pl}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}

export default SalesHistory
