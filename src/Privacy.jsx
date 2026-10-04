import NavBar from './NavBar'
import BackButton from './BackButton'

function Privacy() {
  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-2xl">
        <NavBar />
        <BackButton />

        <h1 className="mb-2 text-2xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-sm text-gray-500">Last updated August 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-gray-300">
          <section>
            <h2 className="mb-2 text-base font-semibold text-white">1. What we collect</h2>
            <p>
              We store your email address (for login) and the portfolio data you enter yourself:
              sneakers you add, purchase prices, purchase dates, and sale records. We do not collect
              payment information, browsing history outside this app, or data from any source you
              haven't directly provided.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">2. How it's used</h2>
            <p>
              Your data is used only to run the features of this application: authenticating you,
              displaying your portfolio, and computing profit/loss and valuations for sneakers you've
              added. It is not sold, shared with advertisers, or used for any purpose beyond
              operating the app.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">3. Storage</h2>
            <p>
              Data is stored in a managed Postgres database (Supabase). Passwords are never stored
              in plain text; authentication is handled through Supabase's standard hashed-password
              and token system.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">4. Your control</h2>
            <p>
              You can delete individual portfolio entries at any time within the app. To request
              full account deletion, contact the project owner directly.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">5. Third parties</h2>
            <p>
              Sneaker price data displayed in the app is sourced from third-party marketplaces and
              aggregation services. Viewing this data does not share any of your personal
              information with those services.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Privacy
