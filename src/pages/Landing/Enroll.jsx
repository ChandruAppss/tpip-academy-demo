import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const LIME = '#adff2f'
const BG = '#0d1117'
const BORDER = '#21262d'

const NAV_TABS = [
  { label: 'Admin Dashboard',  to: '/admin' },
  { label: 'Student Portal',   to: '/student' },
  { label: 'Coach Panel',      to: '/coach' },
  { label: 'Landing + Enroll', to: '/' },
]

const STEPS = [
  { n: 1, label: 'Your Details' },
  { n: 2, label: 'Select Slot' },
  { n: 3, label: 'Payment' },
]

const PROGRAMS = [
  'Elite Performance Program — ₹28,000 / 6 months',
  'Batting Fundamentals — ₹18,000 / 6 months',
  'Academy Group Plan — Custom',
]

const inputStyle = {
  width: '100%',
  background: '#111827',
  border: `1px solid ${BORDER}`,
  color: '#fff',
  borderRadius: 8,
  padding: '12px 16px',
  fontSize: 14,
  boxSizing: 'border-box',
  outline: 'none',
}

const ORDER_ROWS = [
  { label: 'Elite Performance Program', value: '₹28,000' },
  { label: 'Duration',              value: '6 Months' },
  { label: 'Live Sessions',         value: '36 included' },
  { label: 'Certificate',           value: 'NSDC + TPIP' },
]

export default function Enroll() {
  const [enrollType, setEnrollType] = useState('individual')
  const [step] = useState(1)

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'system-ui,-apple-system,sans-serif', color:'#fff' }}>

      {/* NAVBAR */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:52, padding:'0 32px', background:'#111827', borderBottom:`1px solid ${BORDER}` }}>
        <span style={{ fontWeight:700, fontSize:16, color:'#fff' }}>TPIP LMS</span>
        <div style={{ display:'flex', gap:4 }}>
          {NAV_TABS.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/admin' || tab.to === '/'}
              style={({ isActive }) => ({
                padding:'6px 14px', borderRadius:6, fontSize:13, fontWeight:600, textDecoration:'none', cursor:'pointer',
                background: isActive ? LIME : 'transparent',
                color: isActive ? '#000' : 'rgba(255,255,255,0.6)',
              })}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* STEP INDICATOR */}
      <div style={{ maxWidth:700, margin:'0 auto', paddingTop:40, paddingLeft:20, paddingRight:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display:'flex', alignItems:'center' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                <div style={{
                  width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:13, fontWeight:700,
                  background: s.n === step ? LIME : '#21262d',
                  color: s.n === step ? '#000' : 'rgba(255,255,255,0.4)',
                }}>
                  {s.n}
                </div>
                <span style={{ fontSize:11, color: s.n === step ? '#fff' : 'rgba(255,255,255,0.4)', whiteSpace:'nowrap' }}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width:80, height:1, background:BORDER, margin:'0 8px', marginBottom:20 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1 CONTENT */}
      <div style={{ maxWidth:700, margin:'32px auto', padding:'0 20px 60px' }}>
        <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:'1px', color:'#fff', textAlign:'center', textTransform:'uppercase', margin:'0 0 8px' }}>ENROLL NOW</h1>
        <p style={{ color:'rgba(255,255,255,0.5)', textAlign:'center', fontSize:14, marginBottom:28 }}>Complete your enrollment in 3 simple steps</p>

        {/* Toggle */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
          <button
            onClick={() => setEnrollType('individual')}
            style={{
              background:'#111827', borderRadius:10, padding:'14px 20px', cursor:'pointer', textAlign:'left',
              border: enrollType==='individual' ? `1px solid ${LIME}` : `1px solid ${BORDER}`,
            }}
          >
            <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:4 }}>Individual</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)' }}>Single student enrollment</div>
          </button>
          <button
            onClick={() => setEnrollType('academy')}
            style={{
              background:'#111827', borderRadius:10, padding:'14px 20px', cursor:'pointer', textAlign:'left',
              border: enrollType==='academy' ? `1px solid ${LIME}` : `1px solid ${BORDER}`,
            }}
          >
            <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:4 }}>Academy / Group</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)' }}>Bulk enrollment · 5+ students</div>
          </button>
        </div>

        {/* Form */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
          <div>
            <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Full Name</label>
            <input placeholder="Student's full name" style={inputStyle} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Age</label>
            <input placeholder="e.g. 16" style={inputStyle} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Email</label>
            <input placeholder="email@example.com" style={inputStyle} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Phone</label>
            <input placeholder="+91 00000 00000" style={inputStyle} />
          </div>
          <div style={{ gridColumn:'1 / -1' }}>
            <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Select Program</label>
            <select style={{ ...inputStyle, color:'rgba(255,255,255,0.8)' }}>
              {PROGRAMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ background:'#111827', border:`1px solid ${BORDER}`, borderRadius:12, padding:20, marginTop:20 }}>
          <div style={{ fontSize:11, letterSpacing:'1px', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', marginBottom:16, fontWeight:700 }}>ORDER SUMMARY</div>
          {ORDER_ROWS.map((row, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <span style={{ fontSize:14, color:'rgba(255,255,255,0.6)' }}>{row.label}</span>
              <span style={{ fontSize:14, color:'rgba(255,255,255,0.85)', fontWeight:500 }}>{row.value}</span>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:14, marginTop:4, display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:15, fontWeight:700, color:LIME }}>Total Payable</span>
            <span style={{ fontSize:15, fontWeight:800, color:LIME }}>₹28,000</span>
          </div>
        </div>

        {/* Proceed button */}
        <button style={{
          width:'100%', background:LIME, color:'#000', fontWeight:800, fontSize:16, padding:18,
          borderRadius:10, border:'none', cursor:'pointer', marginTop:20, letterSpacing:'1px',
        }}>
          PROCEED TO PAYMENT
        </button>

        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:12 }}>
          🔒 Secured by RazorPay · Account auto-created after payment
        </p>
      </div>
    </div>
  )
}
