import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const services = [
  'General Consultation',
  'Dental Checkup',
  'Mental Health Counselling',
  'Physiotherapy',
  'Eye Examination',
  'Blood Tests',
]

const doctors = [
  'Dr. John Smith',
  'Dr. Emily Brown',
  'Dr. Michael Davis',
  'Dr. Sarah Wilson',
]

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '1:00 PM',
  '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM',
  '3:30 PM', '4:00 PM', '4:30 PM',
]

const today = new Date().toISOString().split('T')[0]

export default function Book() {
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    service: '',
    doctor: '',
    date: '',
    time: '',
    notes: '',
    patientId: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [patients, setPatients] = useState([])

  useEffect(() => {
    if (user.role === 'admin') {
      fetch('/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setPatients(data)
        })
        .catch(() => {})
    }
  }, [user.role, token])

  const validate = () => {
    const errs = {}
    if (!form.service) errs.service = 'Please select a service.'
    if (!form.doctor) errs.doctor = 'Please select a doctor.'
    if (!form.date) errs.date = 'Please select a date.'
    if (!form.time) errs.time = 'Please select a time slot.'
    if (user.role === 'admin' && !form.patientId) errs.patientId = 'Please select a patient.'
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
      const body = {
        service: form.service,
        doctor: form.doctor,
        date: form.date,
        time: form.time,
        notes: form.notes,
      }

      if (user.role === 'admin') {
        body.patientId = form.patientId
      }

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.message || 'Booking failed. Please try again.')
        return
      }

      setSuccess(true)
      setTimeout(() => navigate(user.role === 'admin' ? '/admin' : '/my-appointments'), 2000)
    } catch {
      setServerError('Could not connect to the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page">
        <div className="container">
          <div className="alert alert-success" role="status">
            Appointment booked successfully. Redirecting...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Book an Appointment</h1>
          <p>Select the service, doctor, date and time below.</p>
        </div>

        <div style={{ maxWidth: 580 }}>
          <div className="card">
            {serverError && (
              <div className="alert alert-error" role="alert">{serverError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {user.role === 'admin' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="patientId">Patient</label>
                  <select
                    id="patientId"
                    name="patientId"
                    className="form-select"
                    value={form.patientId}
                    onChange={handleChange}
                    aria-required="true"
                  >
                    <option value="">Select a patient</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.email})
                      </option>
                    ))}
                  </select>
                  {errors.patientId && <span className="form-error">{errors.patientId}</span>}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="service">Service</label>
                <select
                  id="service"
                  name="service"
                  className="form-select"
                  value={form.service}
                  onChange={handleChange}
                  aria-required="true"
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.service && <span className="form-error">{errors.service}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="doctor">Doctor</label>
                <select
                  id="doctor"
                  name="doctor"
                  className="form-select"
                  value={form.doctor}
                  onChange={handleChange}
                  aria-required="true"
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.doctor && <span className="form-error">{errors.doctor}</span>}
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="date">Date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="form-input"
                    min={today}
                    value={form.date}
                    onChange={handleChange}
                    aria-required="true"
                  />
                  {errors.date && <span className="form-error">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="time">Time</label>
                  <select
                    id="time"
                    name="time"
                    className="form-select"
                    value={form.time}
                    onChange={handleChange}
                    aria-required="true"
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.time && <span className="form-error">{errors.time}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="notes">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-textarea"
                  placeholder="Any relevant medical information or special requests..."
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
