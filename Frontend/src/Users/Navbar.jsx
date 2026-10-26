import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../assets/Logo.png'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isAdminPage = location.pathname.startsWith('/admin')

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    setMenuOpen(false)
    navigate('/userhome')
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <img src={Logo} alt="superteacher" className="h-15 w-auto" />
        </Link>

        <div className="hidden md:block">
          {isAdminPage ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-[#ff6b57] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ff8a7a]"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-[#ff6b57] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ff8a7a]"
            >
              Log in
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-md text-white md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-white transition-transform ${
                menuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 bg-white transition-opacity ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 bg-white transition-transform ${
                menuOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out md:hidden ${
          menuOpen ? 'max-h-64' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-1 border-t border-white/10 px-4 pb-4 pt-2">
          {isAdminPage ? (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 rounded-lg bg-[#ff6b57] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#ff8a7a]"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-lg bg-[#ff6b57] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#ff8a7a]"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar