import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Footprints } from 'lucide-react'
import sneakerPlaceholder from './assets/sneaker-placeholder.svg'
import NavBar from './NavBar'
import { API_URL } from './api'

function HubCard({ title, subtitle, description, onClick, stat }) {
  return (
    <motion.div
      onClick={onClick}
      className="group relative h-[28rem] w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-800 bg-gray-950"
      whileHover="hover"
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        variants={{ hover: { scale: 1.08 } }}
        transition={{ duration: 0.3 }}
      >
        <img src={sneakerPlaceholder} alt="" className="h-52 opacity-20" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

      <div className="absolute bottom-0 left-0 w-full translate-y-3 p-7 transition-transform duration-300 group-hover:translate-y-0">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-400">
          {subtitle}
        </p>
        <h3 className="mb-2 text-4xl font-bold text-white">{title}</h3>
        {stat && (
          <p className={`mb-2 text-lg font-semibold ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
            {stat.label}
          </p>
        )}
        <p className="max-h-0 overflow-hidden text-sm text-gray-400 opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

function Hub() {
  const navigate = useNavigate()
  const [totalPL, setTotalPL] = useState(null)
  const [portfolioCount, setPortfolioCount] = useState(null)
  const [salesCount, setSalesCount] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch(`${API_URL}/portfolio`, { headers }).then(res => res.ok ? res.json() : { items: [] }),
      fetch(`${API_URL}/portfolio/sales`, { headers }).then(res => res.ok ? res.json() : { items: [] }),
    ])
      .then(([portfolioData, salesData]) => {
        const items = portfolioData.items || []
        const sales = salesData.items || []
        const unrealized = items.reduce((sum, i) => sum + (i.unrealized_pl_gross || 0), 0)
        const realized = sales.reduce((sum, s) => sum + (s.realized_pl || 0), 0)
        setTotalPL(unrealized + realized)
        setPortfolioCount(items.length)
        setSalesCount(sales.length)
      })
      .catch(() => {
        setTotalPL(null)
        setPortfolioCount(null)
        setSalesCount(null)
      })
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black p-8 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <NavBar />

        <div className="mb-12 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-400">
            <Footprints size={36} className="text-black" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">SoleTrack</h1>
            <p className="text-base text-gray-500">Sneaker resale valuation, tracked properly</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
            <p className="text-xs font-semibold uppercase text-gray-500">Owned pairs</p>
            <p className="text-2xl font-bold">{portfolioCount ?? '—'}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
            <p className="text-xs font-semibold uppercase text-gray-500">Completed sales</p>
            <p className="text-2xl ft-bold">{salesCount ?? '—'}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
            <p className="text-xs font-semibold uppercase text-gray-500">Overall P/L</p>
            <p className={`text-2xl font-bold ${totalPL != null && totalPL >= 0 ? 'text-green-400' : totalPL != null ? 'text-red-400' : ''}`}>
              {totalPL != null ? `${totalPL >= 0 ? '+' : ''}$${totalPL.toFixed(2)}` : '—'}
            </p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-3">
          <HubCard
            title="Sneaker Search"
            subtitle="Browse the catalogue"
            description="Search the full catalogue with real-time valuations and backtested price projections for every sneaker."
            onClick={() => navigate('/search')}
          />
          <HubCard
            title="Portfolio"
            subtitle="Track what you own"
            description="Track every pair you own, see live gross  and mark sales as they happen."
            onClick={() => navigate('/portfolio')}
          />
          <HubCard
            title="Overall Profit"
            subtitle="Realized + unrealized P/L"
            description="Combined realized and unrealized profit across every pair, bought or sold."
            onClick={() => navigate('/sales')}
            stat={
              totalPL != null
                ? { label: `${totalPL >= 0 ? '+' : ''}$${totalPL.toFixed(2)}`, positive: totalPL >= 0 }
                : null
            }
          />
        </div>

        <div className="mt-10 flex justify-center gap-6 border-t border-gray-800 pt-6 text-xs text-gray-500">
          <Link to="/terms" className="hover:text-gray-300">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}

export default Hub
