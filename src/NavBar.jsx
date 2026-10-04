import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Footprints, LogOut, Search, Wallet, Clock } from 'lucide-react'

function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const links = [
    { to: '/hub', label: 'Home', icon: Footprints },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/portfolio', label: 'Portfolio', icon: Wallet },
    { to: '/sales', label: 'Sales', icon: Clock },
  ]

  return (
    <div className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4">
      <div className="flex items-center gap-6">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 text-sm font-medium ${
                active ? 'text-blue-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg border border-gray-800 px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-900"
      >
        <LogOut size={16} />
        Log out
      </button>
    </div>
  )
}

export default NavBar
