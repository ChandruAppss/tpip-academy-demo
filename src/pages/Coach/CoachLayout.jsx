import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const BORDER = '#21262d'

function getInitials(name = 'Coach User') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function CoachLayout() {
  const { profile, logout } = useAuthStore()
  const navigate = useNavigate()
  const initials = getInitials(profile?.full_name || 'Coach User')

  function handleLogout() { logout(); navigate('/login') }

  const LEFT_NAV = [
    { label: 'Dashboard',        to: '/coach',               end: true, color: LIME },
    { label: 'My Schedule',      to: '/coach/sessions',                 color: '#3b82f6' },
    { label: 'Availability',     to: '/coach/availability',             color: '#10b981' },
    { label: 'My Students',      to: '/coach/students',                 color: '#a855f7' },
    { label: 'Reviews',          to: '/coach/submissions',              color: '#f97316' },
  ]
  const RIGHT_NAV = [
    { label: 'Upload Content',   to: '/coach/courses',                  color: '#06b6d4' },
    { label: 'Assessments',      to: '/coach/assessments',              color: '#eab308' },
    { label: 'Earnings',         to: '/coach/earnings',                 color: '#10b981' },
    { label: 'Profile',          to: '/coach/profile',                  color: '#9ca3af' },
  ]

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '6px 10px', borderRadius: 7,
    fontSize: 12, fontWeight: isActive ? 700 : 500,
    textDecoration: 'none', whiteSpace: 'nowrap',
    color: isActive ? '#000' : 'rgba(255,255,255,0.75)',
    background: isActive ? LIME : 'transparent',
    border: '1px solid transparent',
    transition: 'all 0.15s ease',
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', fontFamily:'system-ui,-apple-system,sans-serif', background:BG, color:'#fff' }}>

      {/* TOP NAVBAR */}
      <div style={{ position:'relative', background:CARD, borderBottom:`1px solid ${BORDER}`, display:'flex', alignItems:'center', padding:'0 16px', height:80, flexShrink:0 }}>

        {/* LEFT NAV */}
        <div style={{ display:'flex', alignItems:'center', gap:2, flex:1 }}>
          {LEFT_NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end} style={navLinkStyle}>
              <div style={{ width:7, height:7, borderRadius:2, background:item.color, flexShrink:0 }} />
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* CENTER LOGO — absolutely centered */}
        <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <img
            src="/tpip-logo.png"
            alt="TPIP Academy"
            onClick={() => navigate('/coach')}
            onMouseEnter={e => { e.currentTarget.style.transform='scale(1.06)'; e.currentTarget.style.filter='drop-shadow(0 0 14px rgba(173,255,47,0.8))' }}
            onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.filter='drop-shadow(0 0 8px rgba(173,255,47,0.3))' }}
            style={{ width:150, height:56, objectFit:'contain', cursor:'pointer', transition:'transform 0.25s ease, filter 0.25s ease', display:'block', mixBlendMode:'screen', filter:'brightness(1.1)' }}
          />
          <div style={{ fontSize:9, color:'rgba(255,255,255,0.4)', letterSpacing:'1.5px', textTransform:'uppercase', marginTop:2 }}>COACH PANEL</div>
        </div>

        {/* RIGHT NAV */}
        <div style={{ display:'flex', alignItems:'center', gap:2, flex:1, justifyContent:'flex-end' }}>
          {RIGHT_NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end} style={navLinkStyle}>
              <div style={{ width:7, height:7, borderRadius:2, background:item.color, flexShrink:0 }} />
              {item.label}
            </NavLink>
          ))}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:8, paddingLeft:8, borderLeft:`1px solid ${BORDER}` }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:LIME, color:'#000', fontWeight:700, fontSize:11, display:'flex', alignItems:'center', justifyContent:'center' }}>{initials}</div>
            <button onClick={handleLogout} style={{ padding:'5px 10px', borderRadius:7, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'#ef4444', fontSize:11, fontWeight:600, cursor:'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex:1, background:BG, overflowY:'auto' }}>
        <Outlet />
      </div>
    </div>
  )
}
