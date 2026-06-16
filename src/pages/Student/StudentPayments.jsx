import { useState } from 'react'
import toast from 'react-hot-toast'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const TRANSACTIONS = [
  { date: 'May 27', desc: 'Elite Batting - 4 sessions top-up', amount: '₹1,800', status: 'Paid' },
  { date: 'May 15', desc: 'Fast Bowling - 8 sessions', amount: '₹3,000', status: 'Paid' },
  { date: 'Apr 30', desc: 'Elite Batting - Initial 16 sessions', amount: '₹7,200', status: 'Paid' },
  { date: 'Apr 1',  desc: 'New Enrollment Fee', amount: '₹500', status: 'Paid' },
]

const SESSION_OPTIONS = [
  { label: '4 sessions', price: 1800 },
  { label: '8 sessions', price: 3600 },
  { label: '12 sessions', price: 5400 },
]

const PACKAGES = [
  { name: 'Elite Performance Masterclass', coach: 'Ravi Kumar', rate: 450, remaining: 6, total: 16, color: LIME },
  { name: 'Fast Bowling Intensive', coach: 'Vikram Singh', rate: 375, remaining: 3, total: 8, color: '#f97316' },
]

const BANKS = ['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Kotak', 'Yes Bank']

function statusStyle(s) {
  if (s === 'Paid') return { background: '#16a34a22', color: '#4ade80', border: '1px solid #16a34a44', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }
  if (s === 'Pending') return { background: '#f9731622', color: '#f97316', border: '1px solid #f9731644', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }
  return { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }
}

export default function StudentPayments() {
  const [tab, setTab] = useState('Overview')
  const [payTab, setPayTab] = useState('UPI')
  const [selectedPkg, setSelectedPkg] = useState('Elite Batting')
  const [selectedSessions, setSelectedSessions] = useState(null)
  const [upiId, setUpiId] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardNum, setCardNum] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [bank, setBank] = useState(BANKS[0])
  const [showSuccess, setShowSuccess] = useState(false)

  const selectedAmount = selectedSessions !== null ? SESSION_OPTIONS[selectedSessions]?.price : 0

  const inputStyle = {
    width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 8,
    padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  }

  function handlePay() {
    if (selectedSessions === null) { toast.error('Please select a session package'); return }
    setShowSuccess(true)
  }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff', maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        @keyframes fadeInModal { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
      `}</style>

      {/* HEADER BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #052e16 0%, #064e3b 50%, #0a3d1f 100%)',
        border: '1px solid rgba(173,255,47,0.18)',
        borderRadius: 20,
        padding: '28px 36px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(rgba(173,255,47,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(173,255,47,0.5) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>MY PAYMENTS & BILLING</h1>
          <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Payments go to TPIP Academy · Coaches are credited after each session</p>
        </div>
      </div>

      {/* TAB BAR */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: CARD2, borderRadius: 10, padding: 4, border: `1px solid ${BORDER}`, width: 'fit-content' }}>
        {['Overview', 'Pay Now', 'Transaction History'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: tab === t ? LIME : 'transparent', color: tab === t ? '#000' : 'rgba(255,255,255,0.45)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === 'Overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 28 }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: `3px solid ${LIME}`, borderRadius: 14, padding: 24, backgroundImage: 'linear-gradient(135deg, rgba(173,255,47,0.06), transparent)' }}>
              <div style={{ fontSize: 11, letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>Amount Paid</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: LIME, lineHeight: 1, marginBottom: 4 }}>₹46,000</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>this year</div>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: '3px solid #3b82f6', borderRadius: 14, padding: 24, backgroundImage: 'linear-gradient(135deg, rgba(59,130,246,0.06), transparent)' }}>
              <div style={{ fontSize: 11, letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>Sessions Purchased</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#3b82f6', lineHeight: 1, marginBottom: 4 }}>24</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>total sessions</div>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: '3px solid #f97316', borderRadius: 14, padding: 24, backgroundImage: 'linear-gradient(135deg, rgba(249,115,22,0.06), transparent)' }}>
              <div style={{ fontSize: 11, letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>⚠️ Next Payment Due</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#f97316', lineHeight: 1, marginBottom: 4 }}>₹18,000</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>due Jun 15, 2026</div>
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 16 }}>ACTIVE PACKAGES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {PACKAGES.map((pkg, i) => {
              const usedPct = ((pkg.total - pkg.remaining) / pkg.total) * 100
              const isLow = pkg.remaining <= 3
              return (
                <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{pkg.name}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Coach: {pkg.coach} · ₹{pkg.rate}/session</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: isLow ? '#f97316' : LIME }}>{pkg.remaining} remaining of {pkg.total}</span>
                  </div>
                  <div style={{ background: BORDER, borderRadius: 6, height: 8, overflow: 'hidden', marginBottom: 14 }}>
                    <div style={{ width: `${usedPct}%`, height: '100%', background: isLow ? '#f97316' : pkg.color, borderRadius: 6 }} />
                  </div>
                  <button
                    onClick={() => setTab('Pay Now')}
                    style={{ padding: '8px 20px', background: isLow ? '#f97316' : LIME, color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    Top Up
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* PAY NOW TAB */}
      {tab === 'Pay Now' && (
        <div style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>Select Package</label>
            <select value={selectedPkg} onChange={e => setSelectedPkg(e.target.value)} style={inputStyle}>
              <option value="Elite Batting">Elite Performance Masterclass</option>
              <option value="Fast Bowling">Fast Bowling Intensive</option>
              <option value="New">New Enrollment</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>Select Top-Up Amount</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {SESSION_OPTIONS.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedSessions(i)}
                  style={{
                    flex: 1, padding: 16, borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                    border: selectedSessions === i ? `2px solid ${LIME}` : `1px solid ${BORDER}`,
                    background: selectedSessions === i ? LIME + '15' : CARD,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15, color: selectedSessions === i ? LIME : '#fff' }}>{opt.label}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>₹{opt.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>Payment Method</label>
            <div style={{ display: 'flex', gap: 4, background: CARD2, padding: 4, borderRadius: 10, border: `1px solid ${BORDER}`, width: 'fit-content', marginBottom: 16 }}>
              {['UPI', 'Card', 'Net Banking'].map(m => (
                <button key={m} onClick={() => setPayTab(m)} style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: payTab === m ? LIME : 'transparent', color: payTab === m ? '#000' : 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  {m}
                </button>
              ))}
            </div>

            {payTab === 'UPI' && (
              <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="Enter UPI ID (e.g. name@upi)" style={inputStyle} />
            )}
            {payTab === 'Card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Cardholder Name" style={inputStyle} />
                <input value={cardNum} onChange={e => setCardNum(e.target.value)} placeholder="Card Number (•••• •••• •••• ••••)" style={inputStyle} maxLength={19} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input value={cardExp} onChange={e => setCardExp(e.target.value)} placeholder="MM / YY" style={inputStyle} />
                  <input value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="CVV" style={inputStyle} maxLength={4} type="password" />
                </div>
              </div>
            )}
            {payTab === 'Net Banking' && (
              <select value={bank} onChange={e => setBank(e.target.value)} style={inputStyle}>
                {BANKS.map(b => <option key={b}>{b}</option>)}
              </select>
            )}
          </div>

          <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 13, color: '#60a5fa', marginBottom: 20 }}>
            🔒 Secured by Razorpay · Money held by TPIP · Released to coach after each session
          </div>

          <button
            onClick={handlePay}
            style={{ width: '100%', padding: 14, background: `linear-gradient(135deg, ${LIME}, #84cc16)`, color: '#000', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: 'pointer', letterSpacing: '0.5px' }}
          >
            PROCEED TO PAY {selectedAmount ? `₹${selectedAmount.toLocaleString()}` : ''}
          </button>
        </div>
      )}

      {/* TRANSACTION HISTORY TAB */}
      {tab === 'Transaction History' && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Date', 'Description', 'Amount', 'Status', 'Receipt'].map(h => (
                  <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', background: CARD2, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((tx, i) => (
                <tr key={i} onMouseEnter={e => e.currentTarget.style.background = CARD2} onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '14px 18px', fontSize: 14, color: 'rgba(255,255,255,0.5)', borderBottom: `1px solid ${BORDER}` }}>{tx.date}</td>
                  <td style={{ padding: '14px 18px', fontSize: 14, color: '#fff', fontWeight: 500, borderBottom: `1px solid ${BORDER}` }}>{tx.desc}</td>
                  <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 700, color: LIME, borderBottom: `1px solid ${BORDER}` }}>{tx.amount}</td>
                  <td style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
                    <span style={statusStyle(tx.status)}>{tx.status} {tx.status === 'Paid' ? '✅' : tx.status === 'Pending' ? '⏳' : '❌'}</span>
                  </td>
                  <td style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
                    <button onClick={() => toast.success('Receipt downloaded!')} style={{ background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 6, padding: '5px 12px', fontSize: 12, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>⬇ Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 40, maxWidth: 440, width: '100%', textAlign: 'center', animation: 'fadeInModal 0.25s ease' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#fff' }}>Payment Successful!</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px' }}>
              ₹{selectedAmount.toLocaleString()} added to your account.<br />
              Coach will be credited after each session.
            </p>
            <button
              onClick={() => { setShowSuccess(false); setTab('Overview') }}
              style={{ padding: '12px 32px', background: LIME, color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
            >
              Back to Overview
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
