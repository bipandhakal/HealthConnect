import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const services = [
  {
    name: 'General Consultation',
    description: 'Routine health checks and general medical advice from qualified GPs.',
  },
  {
    name: 'Dental Checkup',
    description: 'Comprehensive dental examination, cleaning, and oral health assessment.',
  },
  {
    name: 'Mental Health Counselling',
    description: 'Professional support and therapy sessions for mental wellbeing.',
  },
  {
    name: 'Physiotherapy',
    description: 'Rehabilitation and physical therapy for injury recovery and mobility.',
  },
  {
    name: 'Eye Examination',
    description: 'Full vision assessment and eye health evaluation.',
  },
  {
    name: 'Blood Tests',
    description: 'Diagnostic blood work and laboratory pathology services.',
  },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container">
          <h1 id="hero-heading">Community Health Services Booking System</h1>
          <p>
            Book appointments with qualified healthcare professionals quickly and
            easily. Manage your health in one place.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/book" className="btn btn-white">
                Book an Appointment
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-white">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-white">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="services-section" aria-labelledby="services-heading">
        <div className="container">
          <h2 id="services-heading">Our Services</h2>
          <div className="grid-3">
            {services.map((s, i) => (
              <div key={i} className="service-card">
                <h3>{s.name}</h3>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
