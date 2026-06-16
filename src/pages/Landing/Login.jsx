import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)
  const emailRef = useRef(null)
  const passRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = emailRef.current?.value?.trim()
    const password = passRef.current?.value
    if (!email || !password) return toast.error('Please enter email and password')
    setLoading(true)
    try {
      const { data } = await authAPI.login({ email, password })
      login(data.token, data.profile)
      toast.success(`Welcome back, ${data.profile.full_name}!`)
      const map = { admin: '/admin', coach: '/coach', student: '/student' }
      navigate(map[data.profile.role] || '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = async (email, pass) => {
    if (emailRef.current) emailRef.current.value = email
    if (passRef.current) passRef.current.value = pass
    setLoading(true)
    try {
      const { data } = await authAPI.login({ email, password: pass })
      login(data.token, data.profile)
      toast.success(`Welcome, ${data.profile.full_name}!`)
      const map = { admin: '/admin', coach: '/coach', student: '/student' }
      navigate(map[data.profile.role] || '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed — check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.05)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,30px) scale(0.95)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(15px,15px)} 66%{transform:translate(-15px,10px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:none} }
        .quick-btn:hover { background: rgba(173,255,47,0.15) !important; border-color: #adff2f !important; color: #adff2f !important; }
        .input-field { transition: border-color 0.2s, box-shadow 0.2s; }
        .input-field:focus { border-color: #adff2f !important; box-shadow: 0 0 0 3px rgba(173,255,47,0.15) !important; outline: none; }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(173,255,47,0.5) !important; }
        .login-btn { transition: all 0.2s; }
      `}</style>

      {/* LEFT PANEL — Branding */}
      <div style={{
        flex: '0 0 48%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #052e16 0%, #064e3b 40%, #0a3622 70%, #052e16 100%)',
        display: 'flex', flexDirection: 'column', padding: '40px 48px',
      }}>
        {/* Animated gradient orbs */}
        <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'-10%', left:'-5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(173,255,47,0.18) 0%, transparent 70%)', animation:'float1 8s ease-in-out infinite' }} />
          <div style={{ position:'absolute', bottom:'5%', right:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', animation:'float2 10s ease-in-out infinite' }} />
          <div style={{ position:'absolute', top:'40%', right:'10%', width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle, rgba(250,204,21,0.1) 0%, transparent 70%)', animation:'float3 7s ease-in-out infinite' }} />
          {/* Grid lines */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
        </div>

        {/* Logo */}
        <div style={{ position:'relative', zIndex:2 }}>
          <Link to="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10 }}>
            <div style={{ width:40, height:40, background:'linear-gradient(135deg,#adff2f,#16a34a)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, boxShadow:'0 4px 16px rgba(173,255,47,0.4)' }}>🏏</div>
            <span style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'-0.5px' }}>TPIP <span style={{ color:'#adff2f' }}>Academy</span></span>
          </Link>
        </div>

        {/* Main content */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', zIndex:2 }}>
          <div style={{ marginBottom:12 }}>
            <span style={{ background:'rgba(173,255,47,0.15)', border:'1px solid rgba(173,255,47,0.3)', color:'#adff2f', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, letterSpacing:'1px', textTransform:'uppercase' }}>
              🏆 India's #1 Sports LMS
            </span>
          </div>
          <h1 style={{ fontSize:46, fontWeight:900, color:'#fff', lineHeight:1.1, margin:'16px 0 20px', letterSpacing:'-1px' }}>
            Train Like<br/>
            <span style={{ background:'linear-gradient(90deg,#adff2f,#facc15,#adff2f)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 3s linear infinite' }}>a Champion</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:16, lineHeight:1.7, maxWidth:380, margin:'0 0 40px' }}>
            Live 1-on-1 coaching, AI video analysis, and structured programs built for serious athletes.
          </p>

          {/* Stats row */}
          <div style={{ display:'flex', gap:32, marginBottom:48 }}>
            {[['248+','Students'],['12','Expert Coaches'],['95%','Success Rate']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontSize:26, fontWeight:900, color:'#adff2f', lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Testimonial card */}
          <div style={{ background:'rgba(255,255,255,0.06)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'20px 24px', maxWidth:380 }}>
            <div style={{ display:'flex', gap:3, marginBottom:10 }}>
              {[...Array(5)].map((_,i) => <span key={i} style={{ color:'#facc15', fontSize:14 }}>★</span>)}
            </div>
            <p style={{ color:'rgba(255,255,255,0.8)', fontSize:14, lineHeight:1.6, margin:'0 0 14px', fontStyle:'italic' }}>
              "My performance rating went from 24 to 61 in just 3 months. The coach feedback is incredible."
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#adff2f,#16a34a)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, color:'#052e16' }}>AK</div>
              <div>
                <div style={{ color:'#fff', fontWeight:600, fontSize:13 }}>Arjun Kapoor</div>
                <div style={{ color:'rgba(255,255,255,0.45)', fontSize:11 }}>Elite Performance Program</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ position:'relative', zIndex:2, color:'rgba(255,255,255,0.3)', fontSize:12 }}>
          © 2025 TPIP Academy · All rights reserved
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div style={{
        flex:1, background:'#080e0a', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'40px 48px',
        position:'relative', overflow:'hidden'
      }}>
        {/* Subtle bg texture */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 80% 20%, rgba(173,255,47,0.04) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(16,185,129,0.04) 0%, transparent 50%)', pointerEvents:'none' }} />

        <div style={{ width:'100%', maxWidth:400, position:'relative', zIndex:1, animation:'slideIn 0.5s ease both' }}>

          {/* Header */}
          <div style={{ marginBottom:36 }}>
            <h2 style={{ fontSize:30, fontWeight:900, color:'#fff', margin:'0 0 8px', letterSpacing:'-0.5px' }}>Welcome back 👋</h2>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:15, margin:0 }}>Sign in to continue your sports journey</p>
          </div>

          {/* Quick one-click login buttons */}
          <div style={{ marginBottom:28 }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:600, letterSpacing:'1px', textTransform:'uppercase', marginBottom:10 }}>Quick Login — One Click</p>
            <div style={{ display:'flex', gap:8 }}>
              {[
                { label:'🎓 Student',  email:'onlinephone234@gmail.com',  pass:'student1234',     color:'#3b82f6' },
                { label:'🏏 Coach',    email:'rahul.coach@tpip.com',      pass:'coach1234',       color:'#8d59ff' },
                { label:'⚙️ Admin',   email:'vampirerocks123@gmail.com',  pass:'LiCreative9791',  color:'#adff2f' },
              ].map(({ label, email, pass, color }) => (
                <button key={label} disabled={loading} className="quick-btn"
                  onClick={() => quickLogin(email, pass)}
                  style={{ flex:1, padding:'11px 4px', background:`${color}18`, border:`1px solid ${color}55`, borderRadius:10, color, fontSize:12, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'inherit', transition:'all 0.2s', opacity: loading ? 0.5 : 1 }}>
                  {label}
                </button>
              ))}
            </div>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.2)', marginTop:8, textAlign:'center' }}>Taps instantly log you in and redirect</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="on">
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.45)', marginBottom:8, letterSpacing:'0.5px' }}>EMAIL ADDRESS</label>
                <input ref={emailRef} type="email" name="email" autoComplete="email" required
                  placeholder="you@example.com"
                  className="input-field"
                  style={{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'14px 16px', fontSize:15, color:'#fff', fontFamily:'inherit' }}
                />
              </div>

              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.45)', letterSpacing:'0.5px' }}>PASSWORD</label>
                  <span style={{ fontSize:12, color:'#adff2f', cursor:'pointer', fontWeight:600 }}>Forgot password?</span>
                </div>
                <input ref={passRef} type="password" name="password" autoComplete="current-password" required
                  placeholder="••••••••"
                  className="input-field"
                  style={{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'14px 16px', fontSize:15, color:'#fff', fontFamily:'inherit' }}
                />
              </div>

              <button type="submit" disabled={loading} className="login-btn"
                style={{ width:'100%', background: loading ? 'rgba(173,255,47,0.5)' : 'linear-gradient(135deg,#adff2f,#84cc16)', color:'#052e16', padding:'15px 0', borderRadius:12, fontWeight:900, fontSize:16, border:'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow:'0 4px 20px rgba(173,255,47,0.35)', marginTop:4, letterSpacing:'0.3px' }}>
                {loading ? 'Signing in…' : '⚡ Login to Your Account'}
              </button>
            </div>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0' }}>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.25)', fontWeight:500 }}>OR</span>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
          </div>

          <Link to="/register" style={{ display:'block', textAlign:'center', padding:'13px 0', borderRadius:12, border:'1.5px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', fontWeight:600, fontSize:14, textDecoration:'none', background:'rgba(255,255,255,0.03)', transition:'all 0.2s' }}>
            Create a New Account →
          </Link>

          <p style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.2)', marginTop:10 }}>
            Click Student / Coach / Admin above to auto-fill
          </p>

          <div style={{ textAlign:'center', marginTop:32 }}>
            <Link to="/" style={{ fontSize:13, color:'rgba(255,255,255,0.25)', textDecoration:'none' }}>← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
