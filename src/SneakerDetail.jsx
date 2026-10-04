import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import NavBar from './NavBar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import sneakerPlaceholder from './assets/sneaker-placeholder.svg'
import BackButton from './BackButton'
import { API_URL } from './api'

function SneakerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [valuation, setValuation] = useState(null)
  const [projection, setProjection] = useState(null)
  const [error, setError] = useState(null)
  const [recommendation, setRecommendation] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch(`${API_URL}/sneakers/${id}/valuation`, { headers }).then(res => {
        if (!res.ok) throw new Error(`Valuation failed: ${res.status}`)
        return res.json()
      }),
      fetch(`${API_URL}/sneakers/${id}/projection`, { headers }).then(res => {
        if (!res.ok) throw new Error(`Projection failed: ${res.status}`)
        return res.json()
      }),
      fetch(`${API_URL}/sneakers/${id}/recommendation`, { headers }).then(res => {
        if (!res.ok) throw new Error(`Recommendation failed: ${res.status}`)
        return res.json()
      }),
    ])
      .then(([valuationData, projectionData, recommendationData]) => {
        setValuation(valuationData)
        setProjection(projectionData)
        setRecommendation(recommendationData)
      })
      .catch(err => setError(err.message))
  }, [id])

  if (error) return <div className="p-8 text-red-600">Error: {error}</div>
  if (!valuation || !projection) return <div className="p-8">Loading...</div>

  const ebay = valuation.ebay_median
  const goat = valuation.goat_median
  const bothAvailable = ebay != null && goat != null

  let diffPercent = null
  let diffDirection = null
  if (bothAvailable) {
    diffPercent = (((goat - ebay) / ebay) * 100).toFixed(1)
    diffDirection = goat > ebay ? 'higher' : goat < ebay ? 'lower' : 'equal'
  }

  // Real chart data from the actual projection horizons -- day 0 anchors the
  // chart at today's known price so the lines have a real starting point,
  // not just three floating future points.
  const currentPrice = ebay ?? goat ?? null
  const chartData = currentPrice != null
    ? [
        { day: 0, bear: currentPrice, base: currentPrice, bull: currentPrice },
        ...(projection.horizons || []).map(h => ({
          day: h.days_ahead,
          bear: h.bear,
          base: h.base,
          bull: h.bull,
        })),
      ]
    : (projection.horizons || []).map(h => ({
        day: h.days_ahead,
        bear: h.bear,
        base: h.base,
        bull: h.bull,
      }))

  return (
    <div className="min-h-screen bg-black p-8 text-white"><div className="mx-auto max-w-7xl">
      <NavBar />
      <BackButton />
      <button
        onClick={() => navigate('/search')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to search
      </button>

      <img src={sneakerPlaceholder} alt="" className="mb-4 h-20 opacity-80" />
      <h1 className="mb-1 text-2xl font-bold">{valuation.name}</h1>
      <p className="mb-6 text-sm text-gray-500">{valuation.style_code}</p>

      <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Price comparison</p>
      <div className="mb-2 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-xs font-semibold uppercase text-gray-500">eBay Median</p>
          <p className="text-2xl font-bold">{ebay != null ? `$${ebay}` : 'N/A'}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-xs font-semibold uppercase text-gray-500">GOAT Median</p>
          <p className="text-2xl font-bold">{goat != null ? `$${goat}` : 'N/A'}</p>
        </div>
      </div>

      {bothAvailable && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl bg-gray-900 p-3 text-sm">
          {diffDirection === 'higher' && <TrendingUp size={16} className="text-green-400" />}
          {diffDirection === 'lower' && <TrendingDown size={16} className="text-red-400" />}
          {diffDirection === 'equal' && <Minus size={16} className="text-gray-500" />}
          <span>
            GOAT is <strong>{Math.abs(diffPercent)}% {diffDirection}</strong> than eBay for this
            sneaker.
          </span>
        </div>
      )}
      {!bothAvailable && (
        <p className="mb-6 text-sm text-gray-500">
          A direct comparison isn't available: this sneaker only has pricing from one platform.
        </p>
      )}

      {recommendation && recommendation.recommendation && (
        <div
          className={`mb-6 rounded-2xl border p-4 ${
            recommendation.recommendation === 'HOLD'
              ? 'border-green-800 bg-green-950'
              : 'border-red-800 bg-red-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-2xl font-bold ${
                recommendation.recommendation === 'HOLD' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {recommendation.recommendation}
            </span>
            <span className="text-sm text-gray-400">
              {recommendation.horizon_days}-day outlook
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <p className="text-gray-500">Net now</p>
              <p>${recommendation.net_now}</p>
            </div>
            <div>
              <p className="text-gray-500">Net projected</p>
              <p>${recommendation.net_projected}</p>
            </div>
            <div>
              <p className="text-gray-500">Gain</p>
              <p>{recommendation.percent_gain}%</p>
            </div>
          </div>
          {recommendation.confidence_tier === 'low_confidence' && (
            <p className="mt-3 text-xs text-yellow-500">
              This recommendation is based on a low-confidence projection.
            </p>
          )}
        </div>
      )}
      {recommendation && !recommendation.recommendation && (
        <p className="mb-6 text-sm text-gray-500">
          No HOLD/SELL recommendation available: {recommendation.reason?.replace(/_/g, ' ') ?? 'insufficient data'}.
        </p>
      )}

      <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
        <p className="mb-4 text-xs font-semibold uppercase text-gray-500">
          Projection ({projection.confidence_tier ?? 'unavailable'})
        </p>

        {projection.horizons && projection.horizons.length > 0 ? (
          <>
            <div className="mb-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="day"
                    stroke="#6b7280"
                    tickFormatter={(d) => `${d}d`}
                  />
                  <YAxis stroke="#6b7280" tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a' }}
                    labelFormatter={(d) => `Day ${d}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="bull" stroke="#4ade80" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="base" stroke="#60a5fa" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="bear" stroke="#f87171" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {projection.horizons.map(h => (
                <div key={h.days_ahead} className="flex justify-between text-sm">
                  <span className="text-gray-500">{h.days_ahead} days</span>
                  <span>
                    Bear ${h.bear} &middot; Base ${h.base} &middot; Bull ${h.bull}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">No projection available for this sneaker.</p>
        )}
      </div>
    </div>
    </div>
  )
}

export default SneakerDetail
