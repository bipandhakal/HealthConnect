import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/login')
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const brandTarget = user
    ? user.role === 'admin' ? '/admin' : '/home'
    : '/login'

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="container navbar-inner">
        <Link to={brandTarget} className="navbar-brand">
          HealthConnect
        </Link>

        <div className="navbar-links">
          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `navbar-link hide-mobile ${isActive ? 'active' : ''}`}
              >
                Login
              </NavLink>
              <NavLink to="/register" className="navbar-link primary">
                Register
              </NavLink>
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <NavLink
                to="/home"
                className={({ isActive }) => `navbar-link hide-mobile ${isActive ? 'active' : ''}`}
              >
                Home
              </NavLink>
              <NavLink
                to="/admin"
                className={({ isActive }) => `navbar-link hide-mobile ${isActive ? 'active' : ''}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/book"
                className={({ isActive }) => `navbar-link hide-mobile ${isActive ? 'active' : ''}`}
              >
                Book for Patient
              </NavLink>
            </>
          )}

          {user && user.role !== 'admin' && (
            <>
              <NavLink
                to="/home"
                className={({ isActive }) => `navbar-link hide-mobile ${isActive ? 'active' : ''}`}
              >
                Home
              </NavLink>
              <NavLink
                to="/book"
                className={({ isActive }) => `navbar-link hide-mobile ${isActive ? 'active' : ''}`}
              >
                Book Appointment
              </NavLink>
              <NavLink
                to="/my-appointments"
                className={({ isActive }) => `navbar-link hide-mobile ${isActive ? 'active' : ''}`}
              >
                My Appointments
              </NavLink>
            </>
          )}

          {user && (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setDropdownOpen((p) => !p)}
                aria-expanded={dropdownOpen}
                aria-label={`Logged in as ${user.name}`}
              >
                <span className="user-avatar-circle">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="user-avatar-name hide-mobile">{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="user-dropdown" role="menu">
                  <div className="user-dropdown-info">
                    <div className="user-dropdown-name">{user.name}</div>
                    <div className="user-dropdown-email">{user.email}</div>
                    <div className="user-dropdown-role">{user.role}</div>
                  </div>
                  <div className="user-dropdown-divider" />
                  <button
                    className="user-dropdown-item"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
