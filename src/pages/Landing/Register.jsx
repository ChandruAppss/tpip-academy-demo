import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

const inputStyle = {
  width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10,
  padding: '12px 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', color: '#111827', background: '#fafafa', transition: 'border-color 0.2s'
}

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '',
    role: searchParams.get('role') || 'student'
  })
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters')
    setLoading(true)
    try {
      await authAPI.register(form)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Your full name', required: true },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', required: true },
    { key: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+1 555 000 0000', required: false },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Minimum 8 characters', required: true },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #065f46 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 30 }}>🏏</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>TPIP Academy</span>
          </Link>
        </div>

        <div style={{
          background: '#fff', borderRadius: 24, boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          padding: '40px 40px 32px', border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>Create Account</h1>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6 }}>Join TPIP Academy LMS today</p>
          </div>

          {/* Role toggle */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28,
            background: '#f3f4f6', borderRadius: 14, padding: 5
          }}>
            {[['student', '🎓 Student'], ['coach', '🏏 Coach']].map(([role, label]) => (
              <button key={role} type="button"
                onClick={() => setForm({ ...form, role })}
                style={{
                  padding: '11px 0', borderRadius: 10, fontWeight: 700, fontSize: 14,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: form.role === role ? '#16a34a' : 'transparent',
                  color: form.role === role ? '#fff' : '#6b7280',
                  boxShadow: form.role === role ? '0 2px 8px rgba(22,163,74,0.35)' : 'none'
                }}>{label}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type} required={f.required} value={form[f.key]}
                    placeholder={f.placeholder}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    onFocus={() => setFocused(f.key)}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle, borderColor: focused === f.key ? '#16a34a' : '#e5e7eb', boxShadow: focused === f.key ? '0 0 0 3px rgba(22,163,74,0.12)' : 'none' }}
                  />
                </div>
              ))}

              <button type="submit" disabled={loading} style={{
                width: '100%', background: loading ? '#86efac' : 'linear-gradient(135deg, #16a34a, #15803d)',
                color: '#fff', padding: '14px 0', borderRadius: 12, fontWeight: 700,
                fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(22,163,74,0.4)', marginTop: 4, transition: 'all 0.2s'
              }}>
                {loading ? 'Creating account...' : `Create ${form.role === 'coach' ? 'Coach' : 'Student'} Account`}
              </button>
            </div>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>Login here</Link>
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
