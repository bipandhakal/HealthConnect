import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required.'
    if (!form.email.trim()) {
      errs.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address.'
    }
    if (!form.password) {
      errs.password = 'Password is required.'
    } else {
      const pwd = form.password
      if (pwd.length < 8) {
        errs.password = 'Password must be at least 8 characters.'
      } else if (!/[A-Z]/.test(pwd)) {
        errs.password = 'Password must contain at least one uppercase letter.'
      } else if (!/[a-z]/.test(pwd)) {
        errs.password = 'Password must contain at least one lowercase letter.'
      } else if (!/[0-9]/.test(pwd)) {
        errs.password = 'Password must contain at least one number.'
      } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
        errs.password = 'Password must contain at least one special character.'
      }
    }
    return errs
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.message || 'Registration failed.')
        return
      }

      navigate('/login')
    } catch {
      setServerError('Could not connect to the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>
            HealthConnect
          </div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Community Health Services Booking System
          </div>
        </div>

        <h2>Create Account</h2>
        <p>Register to book health service appointments.</p>

        {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              aria-required="true"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="abc@gmail.com"
              value={form.email}
              onChange={handleChange}
              aria-required="true"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="form-input"
              placeholder="+61 400 000 000"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Min 8 chars, uppercase, number, symbol"
              value={form.password}
              onChange={handleChange}
              aria-required="true"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
            {!errors.password && (
              <span className="form-hint">
                Must have uppercase, lowercase, number and special character.
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  )
}
