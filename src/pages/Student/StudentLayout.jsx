import { useState, useRef } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { studentAPI } from '../../services/api'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const BORDER = '#21262d'

function getInitials(name = 'Student User') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const SIDEBAR_SECTIONS = [
  {
    label: 'LEARNING',
    items: [
      { label: 'Dashboard',    to: '/student',              end: true,  icon: '🏠', color: LIME },
      { label: 'Sessions',     to: '/student/sessions',                 icon: '📅', color: '#f97316' },
      { label: "Session Calendar", to: "/student/sessions-calendar", icon: "📆", color: "#adff2f" },
      { label: 'Courses',      to: '/student/courses',                  icon: '📚', color: '#3b82f6' },
      { label: 'Discover',     to: '/student/discover',                 icon: '🔍', color: '#a855f7' },
    ],
  },
  {
    label: 'PERFORMANCE',
    items: [
      { label: 'Submissions',  to: '/student/submissions',  icon: '🎬', color: '#06b6d4' },
      { label: 'Progress',     to: '/student/progress',     icon: '📊', color: '#eab308' },
      { label: 'AI Analysis',  to: '/student/ai-analysis',  icon: '🤖', color: '#8d59ff', highlight: true },
      { label: 'AI Chat',      to: '/student/ai-chat',      icon: '💬', color: '#8d59ff', highlight: true },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { label: 'Certificates', to: '/student/certificates', icon: '🏅', color: '#10b981' },
      { label: 'Payments',     to: '/student/payments',     icon: '💳', color: '#ef4444' },
      { label: 'Profile',      to: '/student/profile',      icon: '👤', color: '#9ca3af' },
    ],
  },
]

const QUICK_CHIPS = [
  'Fix my pull shot',
  'Best drill for me',
  'My 3-month plan',
  'How to improve consistency',
]

function FloatingAIWidget({ profile }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenOpened, setHasBeenOpened] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [questionsLeft, setQuestionsLeft] = useState(48)
  const [analysisContext, setAnalysisContext] = useState(null)
  const messagesEndRef = useRef(null)

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  async function handleOpen() {
    setIsOpen(true)
    if (!hasBeenOpened) {
      setHasBeenOpened(true)
      try {
        const data = await studentAPI.getAIAnalysis()
        setAnalysisContext(data)
      } catch (e) {
        // silently ignore
      }
    }
  }

  function handleClose() {
    setIsOpen(false)
  }

  async function handleSend(msg) {
    const text = (msg || chatInput).trim()
    if (!text || chatLoading) return
    setChatInput('')
    const newHistory = [...chatHistory, { role: 'user', content: text }]
    setChatHistory(newHistory)
    setChatLoading(true)
    setTimeout(scrollToBottom, 50)
    try {
      const d = await studentAPI.sendAIChat({
        message: text,
        history: newHistory,
        student_id: 's1',
        student_name: profile?.full_name,
        analysis_context: analysisContext,
      })
      const aiMsg = {
        role: 'assistant',
        content: d.reply || d.message || 'Here is my response.',
        resources: d.suggested_resources || [],
      }
      setChatHistory(prev => [...prev, aiMsg])
      if (d.questions_remaining !== undefined) setQuestionsLeft(d.questions_remaining)
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', resources: [] }])
    }
    setChatLoading(false)
    setTimeout(scrollToBottom, 50)
  }

  return (
    <>
      <style>{`
        @keyframes floatPulse {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes greenPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.6; transform:scale(1.3); }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(24px) scale(0.97); }
          to { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes dotBounce {
          0%,80%,100% { transform:translateY(0); opacity:0.4; }
          40% { transform:translateY(-6px); opacity:1; }
        }
        .ai-widget-btn:hover { transform: scale(1.08) !important; }
        .ai-input:focus { outline:none; border-color:rgba(141,89,255,0.6) !important; }
        .ai-chip:hover { background:rgba(141,89,255,0.25) !important; border-color:rgba(141,89,255,0.5) !important; }
        .ai-msg-scroll::-webkit-scrollbar { width:4px; }
        .ai-msg-scroll::-webkit-scrollbar-thumb { background:rgba(141,89,255,0.3); border-radius:4px; }
      `}</style>

      {/* Floating Button */}
      <div style={{ position:'fixed', bottom:28, right:28, zIndex:1000, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
        <div style={{ position:'relative' }}>
          <button
            className="ai-widget-btn"
            onClick={isOpen ? handleClose : handleOpen}
            style={{
              width:58, height:58, borderRadius:'50%',
              background:'linear-gradient(135deg,#8d59ff,#5b21b6)',
              border:'none', cursor:'pointer', color:'#fff', fontSize:26,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 8px 32px rgba(141,89,255,0.5)',
              transition:'transform 0.2s ease',
              animation: isOpen ? 'none' : 'floatPulse 3s ease-in-out infinite',
            }}
          >
            🤖
          </button>
          {/* Green online dot */}
          <div style={{
            position:'absolute', top:2, right:2,
            width:12, height:12, borderRadius:'50%',
            background:'#22c55e', border:'2px solid #0d1117',
            animation:'greenPulse 2s ease-in-out infinite',
          }} />
          {/* Unread badge */}
          {!hasBeenOpened && (
            <div style={{
              position:'absolute', top:-4, left:-4,
              background:'linear-gradient(135deg,#f97316,#ef4444)',
              color:'#fff', fontSize:9, fontWeight:800,
              padding:'2px 5px', borderRadius:8,
              border:'2px solid #0d1117', letterSpacing:'0.5px',
            }}>AI</div>
          )}
        </div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)', fontWeight:600, letterSpacing:'1px', textTransform:'uppercase' }}>
          TPIP AI
        </div>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div style={{
          position:'fixed', bottom:100, right:28, zIndex:999,
          width:380, height:560,
          background:'linear-gradient(180deg,#130a2a 0%,#0d1017 100%)',
          border:'1px solid rgba(141,89,255,0.35)',
          borderRadius:20,
          boxShadow:'0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(141,89,255,0.1)',
          display:'flex', flexDirection:'column', overflow:'hidden',
          animation:'slideUp 0.25s ease forwards',
          fontFamily:'system-ui,-apple-system,sans-serif',
        }}>
          {/* Header */}
          <div style={{
            padding:'14px 16px',
            background:'rgba(141,89,255,0.12)',
            borderBottom:'1px solid rgba(141,89,255,0.2)',
            display:'flex', alignItems:'center', gap:10, flexShrink:0,
          }}>
            <div style={{
              width:38, height:38, borderRadius:'50%',
              background:'linear-gradient(135deg,#8d59ff,#5b21b6)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, flexShrink:0,
            }}>🤖</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:14, fontWeight:700, color:'#fff' }}>TPIP AI Coach</span>
                <div style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', animation:'greenPulse 2s ease-in-out infinite' }} />
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>Analysing your performance</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
              <button
                onClick={handleClose}
                style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', width:26, height:26, borderRadius:'50%', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}
              >✕</button>
              <div style={{ fontSize:10, color:'#a78bfa', fontWeight:600, background:'rgba(141,89,255,0.15)', padding:'2px 7px', borderRadius:8, whiteSpace:'nowrap' }}>
                {questionsLeft} left today
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="ai-msg-scroll"
            style={{ flex:1, overflowY:'auto', padding:'14px 14px 8px', display:'flex', flexDirection:'column', gap:10 }}
          >
            {chatHistory.length === 0 && !chatLoading && (
              <div style={{ display:'flex', flexDirection:'column', gap:12, alignItems:'center', marginTop:16 }}>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', textAlign:'center', lineHeight:1.5 }}>
                  Ask me anything about your sports performance
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center' }}>
                  {QUICK_CHIPS.map(chip => (
                    <button
                      key={chip}
                      className="ai-chip"
                      onClick={() => handleSend(chip)}
                      style={{
                        background:'rgba(141,89,255,0.12)',
                        border:'1px solid rgba(141,89,255,0.3)',
                        color:'#c4b5fd', fontSize:11, fontWeight:500,
                        padding:'5px 11px', borderRadius:20, cursor:'pointer',
                        transition:'all 0.15s',
                      }}
                    >{chip}</button>
                  ))}
                </div>
              </div>
            )}

            {chatHistory.map((msg, i) => (
              <div key={i} style={{ display:'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems:'flex-end', gap:7 }}>
                {msg.role === 'assistant' && (
                  <div style={{ width:26, height:26, borderRadius:'50%', background:'linear-gradient(135deg,#8d59ff,#5b21b6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, flexShrink:0 }}>🤖</div>
                )}
                <div style={{ maxWidth:'78%' }}>
                  <div style={{
                    padding:'9px 13px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg,#8d59ff,#5b21b6)'
                      : 'rgba(255,255,255,0.07)',
                    border: msg.role === 'assistant' ? '1px solid rgba(141,89,255,0.2)' : 'none',
                    fontSize:13, color:'#fff', lineHeight:1.5,
                  }}>
                    {msg.content}
                  </div>
                  {msg.resources && msg.resources.length > 0 && (
                    <div style={{ marginTop:6, display:'flex', flexWrap:'wrap', gap:5 }}>
                      {msg.resources.map((r, ri) => (
                        <a
                          key={ri}
                          href={r.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display:'flex', alignItems:'center', gap:5,
                            background:'rgba(239,68,68,0.12)',
                            border:'1px solid rgba(239,68,68,0.3)',
                            color:'#fca5a5', fontSize:11,
                            padding:'4px 9px', borderRadius:8, textDecoration:'none',
                          }}
                        >
                          ▶ {r.title || 'Watch'}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div style={{ display:'flex', alignItems:'flex-end', gap:7 }}>
                <div style={{ width:26, height:26, borderRadius:'50%', background:'linear-gradient(135deg,#8d59ff,#5b21b6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, flexShrink:0 }}>🤖</div>
                <div style={{ padding:'10px 14px', borderRadius:'16px 16px 16px 4px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(141,89,255,0.2)', display:'flex', gap:5, alignItems:'center' }}>
                  {[0,1,2].map(d => (
                    <div key={d} style={{ width:6, height:6, borderRadius:'50%', background:'#a78bfa', animation:`dotBounce 1.2s ease ${d*0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding:'10px 12px 12px', borderTop:'1px solid rgba(141,89,255,0.15)', flexShrink:0 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
              <input
                className="ai-input"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask about your sports..."
                style={{
                  flex:1, background:'rgba(255,255,255,0.06)',
                  border:'1px solid rgba(141,89,255,0.3)',
                  borderRadius:12, padding:'9px 12px',
                  color:'#fff', fontSize:13,
                  transition:'border-color 0.2s',
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!chatInput.trim() || chatLoading}
                style={{
                  width:38, height:38, borderRadius:12, flexShrink:0,
                  background: chatInput.trim() && !chatLoading ? 'linear-gradient(135deg,#8d59ff,#5b21b6)' : 'rgba(141,89,255,0.2)',
                  border:'none', cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'default',
                  color:'#fff', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all 0.2s',
                }}
              >➤</button>
            </div>
            <div style={{ textAlign:'center' }}>
              <button
                onClick={() => { handleClose(); navigate('/student/ai-analysis') }}
                style={{
                  background:'none', border:'none', cursor:'pointer',
                  color:'rgba(167,139,250,0.7)', fontSize:11, fontWeight:500,
                }}
              >Full Analysis →</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function StudentLayout() {
  const { profile, logout } = useAuthStore()
  const navigate = useNavigate()

  const displayName = profile?.full_name || profile?.email?.split('@')[0] || 'Student User'
  const initials = getInitials(displayName)

  function handleLogout() { logout(); navigate('/login') }

  const LEFT_NAV = [
    { label: 'Dashboard',    to: '/student',                    end: true,  icon: '🏠' },
    { label: 'Sessions',     to: '/student/sessions',                       icon: '📅' },
    { label: 'Courses',      to: '/student/courses',                        icon: '📚' },
    { label: 'Discover',     to: '/student/discover',                       icon: '🔍' },
    { label: 'Submissions',  to: '/student/submissions',                    icon: '🎬' },
  ]
  const RIGHT_NAV = [
    { label: 'Progress',     to: '/student/progress',                       icon: '📊' },
    { label: 'AI Analysis',  to: '/student/ai-analysis',                    icon: '🤖', highlight: true },
    { label: 'Certificates', to: '/student/certificates',                   icon: '🏅' },
    { label: 'Payments',     to: '/student/payments',                       icon: '💳' },
    { label: 'Profile',      to: '/student/profile',                        icon: '👤' },
  ]

  const navLinkStyle = ({ isActive }, highlight) => ({
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '6px 10px', borderRadius: 7,
    fontSize: 12, fontWeight: isActive ? 700 : 500,
    textDecoration: 'none', whiteSpace: 'nowrap',
    color: isActive ? '#000' : highlight ? '#a78bfa' : 'rgba(255,255,255,0.75)',
    background: isActive ? LIME : highlight ? 'rgba(141,89,255,0.12)' : 'transparent',
    border: highlight ? '1px solid rgba(141,89,255,0.25)' : '1px solid transparent',
    transition: 'all 0.15s ease',
  })

  return (
    <>
      <div style={{ display:'flex', flexDirection:'column', height:'100vh', fontFamily:'system-ui,-apple-system,sans-serif', background:BG, color:'#fff' }}>

        {/* TOP NAVBAR */}
        <div style={{ position:'relative', background:CARD, borderBottom:`1px solid ${BORDER}`, display:'flex', alignItems:'center', padding:'0 16px', height:80, flexShrink:0 }}>

          {/* LEFT NAV */}
          <div style={{ display:'flex', alignItems:'center', gap:2, flex:1 }}>
            {LEFT_NAV.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end} style={s => navLinkStyle(s, item.highlight)}>
                <span>{item.icon}</span> {item.label}
              </NavLink>
            ))}
          </div>

          {/* CENTER LOGO — absolutely positioned so it's always perfectly centered */}
          <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', pointerEvents:'auto' }}>
            <img
              src="/tpip-logo.png"
              alt="TPIP Academy"
              onClick={() => navigate('/student')}
              onMouseEnter={e => { e.currentTarget.style.transform='scale(1.06)'; e.currentTarget.style.filter='drop-shadow(0 0 14px rgba(173,255,47,0.8))' }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.filter='drop-shadow(0 0 8px rgba(173,255,47,0.3))' }}
              style={{ width:150, height:56, objectFit:'contain', cursor:'pointer', transition:'transform 0.25s ease, filter 0.25s ease', display:'block', mixBlendMode:'screen', filter:'brightness(1.1)' }}
            />
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.4)', letterSpacing:'1.5px', textTransform:'uppercase', marginTop:2 }}>STUDENT PORTAL</div>
          </div>

          {/* RIGHT NAV */}
          <div style={{ display:'flex', alignItems:'center', gap:2, flex:1, justifyContent:'flex-end' }}>
            {RIGHT_NAV.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end} style={s => navLinkStyle(s, item.highlight)}>
                <span>{item.icon}</span> {item.label}
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
      <FloatingAIWidget profile={profile} />
    </>
  )
}
