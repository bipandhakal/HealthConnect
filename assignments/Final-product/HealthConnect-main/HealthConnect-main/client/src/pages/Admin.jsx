import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Admin() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
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

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a))
        )
        if (selected && selected._id === id) {
          setSelected((prev) => ({ ...prev, status }))
        }
      }
    } catch {
      alert('Failed to update appointment status.')
    }
  }

  const deleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a._id !== id))
        if (selected && selected._id === id) setSelected(null)
      }
    } catch {
      alert('Failed to delete appointment.')
    }
  }

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  }

  const filtered =
    filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="flex-between mb-6">
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1>Admin Dashboard</h1>
            <p>Manage all patient appointments.</p>
          </div>
          <Link to="/book" className="btn btn-primary">
            Book for Patient
          </Link>
        </div>

        <div className="grid-4 mb-6">
          {Object.entries(counts).map(([key, count]) => (
            <div key={key} className="stat-card">
              <div className="stat-value">{count}</div>
              <div className="stat-label">{key}</div>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error" role="alert">{error}</div>}

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div className="card" style={{ padding: 0, flex: 1 }}>
            <div className="filter-bar" aria-label="Filter appointments">
              {['all', 'pending', 'confirmed', 'cancelled'].map((f) => (
                <button
                  key={f}
                  className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter(f)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="table-wrap">
              <table aria-label="All appointments">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Service</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{ textAlign: 'center', color: '#64748b', padding: 32 }}
                      >
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((a) => (
                      <tr
                        key={a._id}
                        style={{
                          cursor: 'pointer',
                          background: selected?._id === a._id ? '#eff6ff' : '',
                        }}
                        onClick={() => setSelected(selected?._id === a._id ? null : a)}
                      >
                        <td>
                          <div style={{ fontWeight: 600 }}>
                            {a.patient?.name || 'Unknown'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {a.patient?.email}
                          </div>
                        </td>
                        <td>{a.service}</td>
                        <td>{a.doctor}</td>
                        <td>{a.date}</td>
                        <td>{a.time}</td>
                        <td>
                          <span className={`badge badge-${a.status}`}>{a.status}</span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="flex-gap">
                            {a.status === 'pending' && (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => updateStatus(a._id, 'confirmed')}
                              >
                                Confirm
                              </button>
                            )}
                            {a.status !== 'cancelled' && (
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => updateStatus(a._id, 'cancelled')}
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => deleteAppointment(a._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selected && (
            <div
              className="card"
              style={{ width: 300, flexShrink: 0, position: 'sticky', top: 80 }}
              aria-label="Appointment details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Appointment Details</h3>
                <button
                  onClick={() => setSelected(null)}
                  style={{ color: '#64748b', fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer' }}
                  aria-label="Close details panel"
                >
                  Close
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="detail-row">
                  <span className="detail-label">Patient</span>
                  <span className="detail-value">{selected.patient?.name || 'Unknown'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{selected.patient?.email || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{selected.patient?.phone || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Service</span>
                  <span className="detail-value">{selected.service}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Doctor</span>
                  <span className="detail-value">{selected.doctor}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{selected.date}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{selected.time}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className={`badge badge-${selected.status}`}>{selected.status}</span>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                  <span className="detail-label" style={{ display: 'block', marginBottom: 6 }}>Additional Notes</span>
                  <p style={{ fontSize: '0.85rem', color: selected.notes ? '#1e293b' : '#94a3b8', lineHeight: 1.6 }}>
                    {selected.notes || 'No notes provided.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
