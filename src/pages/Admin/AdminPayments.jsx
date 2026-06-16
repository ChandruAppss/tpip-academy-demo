import { useState } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const MOCK_PAYMENTS = [
  { id: 1, student: 'Arjun Patel', program: 'Performance Masterclass', amount: 12000, date: '2025-05-01', method: 'UPI', txnId: 'TXN8821049', status: 'Paid' },
  { id: 2, student: 'Meera Krishnan', program: 'Spin Craft', amount: 8500, date: '2025-05-03', method: 'Card', txnId: 'TXN8834172', status: 'Paid' },
  { id: 3, student: 'Rohan Gupta', program: 'Pace Bowling Pro', amount: 9500, date: '2025-05-05', method: 'Bank', txnId: 'TXN8845831', status: 'Paid' },
  { id: 4, student: 'Sneha Verma', program: 'Fielding Excellence', amount: 7000, date: '2025-05-08', method: 'UPI', txnId: 'TXN8856294', status: 'Pending' },
  { id: 5, student: 'Vikram Nair', program: 'Junior Sports', amount: 5000, date: '2025-05-10', method: 'UPI', txnId: 'TXN8867453', status: 'Pending' },
  { id: 6, student: 'Ananya Das', program: 'Performance Masterclass', amount: 12000, date: '2025-04-20', method: 'Card', txnId: 'TXN8712048', status: 'Paid' },
  { id: 7, student: 'Karthik Reddy', program: 'Spin Craft', amount: 8500, date: '2025-04-15', method: 'Bank', txnId: 'TXN8703928', status: 'Refunded' },
  { id: 8, student: 'Pooja Iyer', program: 'Pace Bowling Pro', amount: 9500, date: '2025-05-12', method: 'UPI', txnId: 'TXN8878563', status: 'Paid' },
  { id: 9, student: 'Deepak Singh', program: 'Junior Sports', amount: 5000, date: '2025-05-15', method: 'Card', txnId: 'TXN8889102', status: 'Pending' },
  { id: 10, student: 'Kavya Menon', program: 'Fielding Excellence', amount: 7000, date: '2025-05-18', method: 'UPI', txnId: 'TXN8890274', status: 'Paid' },
]

const STATUS_STYLES = {
  Paid: { background: LIME + '22', color: LIME, border: `1px solid ${LIME}44` },
  Pending: { background: '#eab30822', color: '#eab308', border: '1px solid #eab30844' },
  Refunded: { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444' },
}

const METHOD_STYLES = {
  UPI: { background: '#3b82f622', color: '#3b82f6' },
  Card: { background: '#a855f722', color: '#a855f7' },
  Bank: { background: '#f9731622', color: '#f97316' },
}

const STATS = [
  { label: 'Total Revenue', value: '₹4,20,000', icon: '💰', color: LIME, bg: LIME + '15', border: LIME + '30' },
  { label: 'This Month', value: '₹38,500', icon: '📈', color: '#3b82f6', bg: '#3b82f615', border: '#3b82f630' },
  { label: 'Pending', value: '₹12,000', icon: '⏳', color: '#eab308', bg: '#eab30815', border: '#eab30830' },
  { label: 'Refunds', value: '₹3,200', icon: '↩️', color: '#ef4444', bg: '#ef444415', border: '#ef444430' },
]

export default function AdminPayments() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS)
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmRefund, setConfirmRefund] = useState(null)

  const filtered = payments.filter(p => {
    if (filterStatus !== 'All' && p.status !== filterStatus) return false
    if (searchQuery && !p.student.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterFrom && p.date < filterFrom) return false
    if (filterTo && p.date > filterTo) return false
    return true
  })

  const handleExportCSV = () => {
    const header = 'Student,Program,Amount,Date,Method,Transaction ID,Status'
    const rows = filtered.map(p => `${p.student},${p.program},${p.amount},${p.date},${p.method},${p.txnId},${p.status}`)
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'payments.csv'
    a.click()
    toast.success('CSV exported!')
  }

  const handleViewReceipt = (txnId) => {
    toast.success(`Receipt for ${txnId} opened`)
  }

  const handleRefundConfirm = async () => {
    const id = confirmRefund
    setConfirmRefund(null)
    try {
      await adminAPI.refundPayment(id)
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Refunded' } : p))
      toast.success('Refund processed successfully!')
    } catch {
      toast.error('Failed to process refund')
    }
  }

  const inputStyle = { padding: '9px 12px', border: `1px solid ${BORDER}`, borderRadius: '8px', fontSize: '13px', color: '#fff', outline: 'none', background: BG }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '1px' }}>PAYMENTS</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', margin: '4px 0 0' }}>Track revenue, pending payments, and refunds</p>
        </div>
        <button
          onClick={handleExportCSV}
          style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '12px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '170px' }}>
            <span style={{ fontSize: '26px' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ background: CARD, borderRadius: '12px', padding: '16px 20px', border: `1px solid ${BORDER}`, marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>From</span>
          <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>To</span>
          <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} style={inputStyle} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={inputStyle}>
          {['All', 'Paid', 'Pending', 'Refunded'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search student..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ ...inputStyle, minWidth: '200px' }}
        />
        {(filterFrom || filterTo || filterStatus !== 'All' || searchQuery) && (
          <button
            onClick={() => { setFilterFrom(''); setFilterTo(''); setFilterStatus('All'); setSearchQuery('') }}
            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
          >
            Clear filters
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>{filtered.length} records</span>
      </div>

      {/* Table Card */}
      <div style={{ background: CARD, borderRadius: '12px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: CARD2 }}>
                {['Student', 'Program', 'Amount', 'Payment Date', 'Method', 'Transaction ID', 'Status', 'Actions'].map(col => (
                  <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>No payments match your filters</td>
                </tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = CARD2; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: LIME, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                        {p.student.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>{p.student}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{p.program}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: LIME }}>
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{p.date}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ ...METHOD_STYLES[p.method], borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: '700' }}>{p.method}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{p.txnId}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ ...STATUS_STYLES[p.status], borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        onClick={() => handleViewReceipt(p.txnId)}
                        title="View Receipt"
                        style={{ background: '#3b82f622', border: '1px solid #3b82f644', color: '#3b82f6', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}
                      >
                        🧾
                      </button>
                      {p.status === 'Paid' && (
                        <button
                          onClick={() => setConfirmRefund(p.id)}
                          style={{ background: '#ef444422', border: '1px solid #ef444444', color: '#ef4444', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
                        >
                          Refund
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

      {/* Refund Confirm Dialog */}
      {confirmRefund !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: CARD, borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', border: `1px solid ${BORDER}`, textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>Confirm Refund</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '0 0 24px', lineHeight: 1.6 }}>
              Are you sure you want to process a refund for{' '}
              <strong style={{ color: '#fff' }}>{payments.find(p => p.id === confirmRefund)?.student}</strong>?
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmRefund(null)}
                style={{ padding: '10px 24px', border: `1px solid ${BORDER}`, borderRadius: '8px', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleRefundConfirm}
                style={{ padding: '10px 24px', border: 'none', borderRadius: '8px', background: '#ef4444', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
