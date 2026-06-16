import { useState } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const MOCK_CERTS = [
  { id: 1, student: 'Arjun Patel', program: 'Performance Masterclass', coach: 'Rahul Sharma', completionDate: '2025-05-10', certId: 'A3F9B2', status: 'Issued' },
  { id: 2, student: 'Meera Krishnan', program: 'Spin Craft', coach: 'Kapil Dev Jr', completionDate: '2025-05-12', certId: 'C7D1E4', status: 'Issued' },
  { id: 3, student: 'Rohan Gupta', program: 'Pace Bowling Pro', coach: 'Anil Mehta', completionDate: '2025-05-15', certId: 'F2A8C5', status: 'Issued' },
  { id: 4, student: 'Sneha Verma', program: 'Fielding Excellence', coach: 'Sunita Rao', completionDate: '2025-05-18', certId: 'B9E3D7', status: 'Pending' },
  { id: 5, student: 'Vikram Nair', program: 'Junior Sports', coach: 'Priya Singh', completionDate: '2025-05-20', certId: 'D4F6A1', status: 'Pending' },
  { id: 6, student: 'Ananya Das', program: 'Performance Masterclass', coach: 'Rahul Sharma', completionDate: '2025-04-28', certId: 'E8B2C9', status: 'Issued' },
  { id: 7, student: 'Karthik Reddy', program: 'Spin Craft', coach: 'Kapil Dev Jr', completionDate: '2025-04-20', certId: 'A1D5F8', status: 'Revoked' },
  { id: 8, student: 'Pooja Iyer', program: 'Pace Bowling Pro', coach: 'Anil Mehta', completionDate: '2025-05-22', certId: 'C3E7B4', status: 'Issued' },
]

const STATUS_STYLES = {
  Issued: { background: LIME + '22', color: LIME, border: `1px solid ${LIME}44` },
  Pending: { background: '#eab30822', color: '#eab308', border: '1px solid #eab30844' },
  Revoked: { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444' },
}

const STAT_CHIPS = [
  { label: 'Total Issued', value: 142, icon: '🎓', color: LIME, bg: LIME + '15', border: LIME + '30' },
  { label: 'Pending Review', value: 8, icon: '⏳', color: '#eab308', bg: '#eab30815', border: '#eab30830' },
  { label: 'This Month', value: 23, icon: '📅', color: '#3b82f6', bg: '#3b82f615', border: '#3b82f630' },
]

export default function AdminCertificates() {
  const [certs, setCerts] = useState(MOCK_CERTS)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ student: '', program: '', completionDate: '', grade: 'A' })

  const handleViewPDF = () => toast.success('Certificate PDF opened')

  const handleRevoke = (id) => {
    setCerts(prev => prev.map(c => c.id === id ? { ...c, status: 'Revoked' } : c))
    toast.success('Certificate revoked')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.student || !form.program || !form.completionDate) {
      toast.error('Please fill all required fields')
      return
    }
    setSubmitting(true)
    try {
      await adminAPI.issueCertificate(form)
      toast.success('Certificate issued successfully!')
      setShowModal(false)
      setForm({ student: '', program: '', completionDate: '', grade: 'A' })
    } catch {
      toast.error('Failed to issue certificate')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = { width: '100%', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: '8px', fontSize: '14px', color: '#fff', background: BG, outline: 'none', boxSizing: 'border-box' }
  const labelStyle = { display: 'block', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '1px' }}>CERTIFICATES</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', margin: '4px 0 0' }}>Issue and manage student certificates</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: LIME, color: '#000', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Issue Certificate
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {STAT_CHIPS.map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '12px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '26px' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ background: CARD, borderRadius: '12px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${BORDER}` }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: 0 }}>All Certificates</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: CARD2 }}>
                {['Student', 'Program', 'Coach', 'Completion Date', 'Certificate ID', 'Status', 'Actions'].map(col => (
                  <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certs.map((c, i) => (
                <tr key={c.id} style={{ borderTop: `1px solid ${BORDER}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = CARD2; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: LIME, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                        {c.student.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>{c.student}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{c.program}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{c.coach}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{c.completionDate}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', background: CARD2, padding: '3px 8px', borderRadius: '4px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>{c.certId}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ ...STATUS_STYLES[c.status], borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={handleViewPDF}
                        title="View PDF"
                        style={{ background: '#3b82f622', border: '1px solid #3b82f644', color: '#3b82f6', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '15px', lineHeight: 1 }}
                      >
                        📄
                      </button>
                      {c.status !== 'Revoked' && (
                        <button
                          onClick={() => handleRevoke(c.id)}
                          style={{ background: '#ef444422', border: '1px solid #ef444444', color: '#ef4444', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Certificate Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: CARD, borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '460px', border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>Issue Certificate</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '22px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Student *</label>
                <select value={form.student} onChange={e => setForm(p => ({ ...p, student: e.target.value }))} style={inputStyle}>
                  <option value="">Select student</option>
                  {['Arjun Patel', 'Meera Krishnan', 'Rohan Gupta', 'Sneha Verma', 'Vikram Nair', 'Ananya Das', 'Karthik Reddy', 'Pooja Iyer'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Program *</label>
                <select value={form.program} onChange={e => setForm(p => ({ ...p, program: e.target.value }))} style={inputStyle}>
                  <option value="">Select program</option>
                  {['Performance Masterclass', 'Pace Bowling Pro', 'Fielding Excellence', 'Spin Craft', 'Junior Sports'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Completion Date *</label>
                <input type="date" value={form.completionDate} onChange={e => setForm(p => ({ ...p, completionDate: e.target.value }))} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Grade</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Distinction', 'A', 'B', 'C'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, grade: g }))}
                      style={{
                        padding: '8px 16px', borderRadius: '8px',
                        border: form.grade === g ? `2px solid ${LIME}` : `2px solid ${BORDER}`,
                        background: form.grade === g ? LIME + '22' : 'transparent',
                        color: form.grade === g ? LIME : 'rgba(255,255,255,0.5)',
                        fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '10px 20px', border: `1px solid ${BORDER}`, borderRadius: '8px', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  style={{ padding: '10px 24px', border: 'none', borderRadius: '8px', background: submitting ? LIME + '88' : LIME, color: '#000', fontSize: '14px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                  {submitting ? 'Issuing...' : 'Issue Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
