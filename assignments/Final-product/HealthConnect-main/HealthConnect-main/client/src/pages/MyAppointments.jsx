import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Failed to load appointments.')
        return
      }
      setAppointments(data)
    } catch {
      setError('Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      })
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a))
        )
      }
    } catch {
      alert('Failed to cancel appointment.')
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <p>Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="flex-between mb-6">
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1>My Appointments</h1>
            <p>View and manage your booked appointments.</p>
          </div>
          <Link to="/book" className="btn btn-primary">
            Book New
          </Link>
        </div>

        {error && <div className="alert alert-error" role="alert">{error}</div>}

        {appointments.length === 0 ? (
          <div className="card empty-state">
            <p>You have no appointments yet.</p>
            <Link to="/book" className="btn btn-primary">
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table aria-label="Appointments list">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a._id}>
                      <td>{a.service}</td>
                      <td>{a.doctor}</td>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td>
                        <span className={`badge badge-${a.status}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        {a.status === 'pending' && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(a._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
