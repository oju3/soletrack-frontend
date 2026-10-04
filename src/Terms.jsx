import NavBar from './NavBar'
import BackButton from './BackButton'

function Terms() {
  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-2xl">
        <NavBar />
        <BackButton />

        <h1 className="mb-2 text-2xl font-bold">Terms of Service</h1>
        <p className="mb-8 text-sm text-gray-500">Last updated August 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-gray-300">
          <section>
            <h2 className="mb-2 text-base font-semibold text-white">1. What this is</h2>
            <p>
              This is a personal sneaker resale valuation tool. It tracks sold prices from public
              marketplace sources and generates price projections. It is a portfolio project, not a
              commercial product, and is not affiliated with StockX, GOAT, eBay, Nike, or any brand
              named in the data.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">2. No financial advice</h2>
            <p>
              Nothing in this application constitutes financial, investment, or trading advice.
              Projections are statistical estimates built from historical sold-price data and carry
              real, documented uncertainty. Confidence tiers shown alongside each projection
              indicate how reliable the underlying data is, and some sneakers do not have enough
              data to project at all. Decisions to buy, hold, or sell are entirely your own.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">3. Data sources</h2>
            <p>
              Price data is drawn from third-party marketplaces via their public listings and
              aggregation services. Accuracy depends on the source data and is not guaranteed. Data
              may be delayed, incomplete, or occasionally incorrect.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">4. Account use</h2>
            <p>
              You are responsible for keeping your login credentials secure. This is a small,
              personally operated project without dedicated support infrastructure.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">5. Changes</h2>
            <p>
              These terms may change as the project develops. Continued use after a change means
              you accept the updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Terms
