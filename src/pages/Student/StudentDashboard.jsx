import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { studentAPI } from '../../services/api'
import toast from 'react-hot-toast'

/* ─── Palette ─── */
const BG      = '#080c12'
const CARD    = '#0f1520'
const CARD2   = '#151e2d'
const BORDER  = '#1e2d42'
const TEXT    = '#e8f0fe'
const MUTED   = 'rgba(232,240,254,0.45)'
const LIME    = '#adff2f'
const BLUE    = '#3b82f6'
const PURPLE  = '#8d59ff'
const ORANGE  = '#f97316'
const TEAL    = '#06b6d4'
const PINK    = '#ec4899'
const GREEN   = '#10b981'

/* ══════════════════════════════════════
   SVG CHART COMPONENTS
══════════════════════════════════════ */
function DonutChart({ pct = 0, color = LIME, size = 72, label }) {
  const r  = size / 2 - 7
  const c  = 2 * Math.PI * r
  const off = c - (Math.min(pct, 100) / 100) * c
  return (
    <svg width={size} height={size} style={{ flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition:'stroke-dashoffset 1s ease' }}
      />
      <text x={size/2} y={size/2 - 3}  textAnchor="middle" fill={color}   fontSize="13" fontWeight="800">{pct}%</text>
      {label && <text x={size/2} y={size/2 + 11} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8" fontWeight="600">{label}</text>}
    </svg>
  )
}

function MiniBarChart({ data = [], color = BLUE, width = 100, height = 36 }) {
  if (!data.length) return null
  const max = Math.max(...data, 1)
  const bw  = Math.floor((width - (data.length - 1) * 2) / data.length)
  return (
    <svg width={width} height={height}>
      {data.map((v, i) => {
        const bh = Math.max(3, (v / max) * height)
        return (
          <rect key={i} x={i * (bw + 2)} y={height - bh} width={bw} height={bh} rx="2"
            fill={color} opacity={i === data.length - 1 ? 1 : 0.3 + (i / data.length) * 0.5}
          />
        )
      })}
    </svg>
  )
}

function Sparkline({ data = [], color = LIME, width = 80, height = 28 }) {
  if (data.length < 2) return null
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ')
  return (
    <svg width={width} height={height} style={{ overflow:'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={parseFloat(pts.split(' ').pop().split(',')[0])} cy={parseFloat(pts.split(' ').pop().split(',')[1])} r="3" fill={color}/>
    </svg>
  )
}

function RadialProgress({ pct = 0, color = LIME, size = 56, thick = 5 }) {
  const r = size / 2 - thick
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={thick}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={thick}
        strokeDasharray={c} strokeDashoffset={c - (pct/100)*c} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}/>
    </svg>
  )
}

function PieChart({ segments, size = 100 }) {
  const r = size / 2 - 4; let angle = -Math.PI / 2
  const total = segments.reduce((s, x) => s + x.value, 0)
  const arcs = segments.map(seg => {
    const frac = seg.value / total; const a = frac * 2 * Math.PI
    const x1 = size/2 + r * Math.cos(angle); const y1 = size/2 + r * Math.sin(angle)
    angle += a
    const x2 = size/2 + r * Math.cos(angle); const y2 = size/2 + r * Math.sin(angle)
    const large = frac > 0.5 ? 1 : 0
    return { d:`M${size/2},${size/2} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`, color:seg.color }
  })
  return (
    <svg width={size} height={size}>
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} opacity="0.9"/>)}
      <circle cx={size/2} cy={size/2} r={r * 0.55} fill={CARD}/>
    </svg>
  )
}

/* ══════════════════════════════════════
   SKELETON
══════════════════════════════════════ */
function Sk({ w = '100%', h = 14, r = 6 }) {
  return <div style={{ width:w, height:h, borderRadius:r, background:'rgba(255,255,255,0.06)', animation:'pulse 1.6s ease-in-out infinite' }}/>
}

/* ══════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════ */
const TODAY    = new Date()
const DAY_ABBR = ['Su','Mo','Tu','We','Th','Fr','Sa']

export default function StudentDashboard() {
  const { profile } = useAuthStore()
  const navigate    = useNavigate()
  const name        = profile?.full_name || 'Athlete'
  const firstName   = name.split(' ')[0]
  const avatar      = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const hour        = TODAY.getHours()
  const greeting    = hour < 12 ? '🌅 Good morning' : hour < 18 ? '☀️ Good afternoon' : '🌙 Good evening'

  const [loading,      setLoading]      = useState(true)
  const [dashboard,    setDashboard]    = useState(null)
  const [sessions,     setSessions]     = useState([])
  const [submissions,  setSubmissions]  = useState([])
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const [d, s, sub, c] = await Promise.all([
          studentAPI.getDashboard(),
          studentAPI.getSessions(),
          studentAPI.getSubmissions(),
          studentAPI.getCertificates(),
        ])
        setDashboard(d.data)
        setSessions(s.data || [])
        setSubmissions(sub.data || [])
        setCertificates(c.data || [])
      } catch { toast.error('Failed to load dashboard data') }
      finally  { setLoading(false) }
    })()
  }, [])

  const upcoming = sessions.filter(s => new Date(s.scheduled_at) >= TODAY)
  const past     = sessions.filter(s => new Date(s.scheduled_at) <  TODAY)
  const todaySess = upcoming.find(s => new Date(s.scheduled_at).toDateString() === TODAY.toDateString())
  const enrollments = dashboard?.activeEnrollments || []
  const pending     = submissions.filter(s => !s.coach_feedback && s.status !== 'reviewed')
  const reviewed    = submissions.filter(s =>  s.coach_feedback || s.status === 'reviewed')

  // Mock weekly activity data (last 7 days)
  const weekActivity  = [2, 0, 3, 1, 4, 2, upcoming.length > 0 ? 3 : 1]
  const perfTrend     = [5.8, 6.1, 6.0, 6.5, 6.8, 7.0, 7.2]

  // Calendar next 7 days
  const calDays = Array.from({ length:7 }, (_, i) => {
    const d = new Date(TODAY); d.setDate(TODAY.getDate() + i)
    const daySess = upcoming.filter(s => new Date(s.scheduled_at).toDateString() === d.toDateString())
    return { date:d, abbr:DAY_ABBR[d.getDay()], num:d.getDate(), isToday:i===0, sessions:daySess }
  })

  // Pie chart for submission status
  const subPie = [
    { value: Math.max(reviewed.length, 1), color: LIME    },
    { value: Math.max(pending.length,  1), color: ORANGE  },
  ]

  return (
    <div style={{ padding:'24px 28px', minHeight:'100%', background:BG, fontFamily:"'Inter',-apple-system,system-ui,sans-serif", color:TEXT }}>
      <style>{`
        * { box-sizing:border-box; }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(173,255,47,0.2)} 50%{box-shadow:0 0 40px rgba(173,255,47,0.45)} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .dash-card  { animation:fadeUp 0.4s ease both; transition:transform 0.2s,box-shadow 0.2s; }
        .dash-card:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,0.4) !important; }
        .sess-row { transition:all 0.2s; cursor:pointer; }
        .sess-row:hover { background:rgba(59,130,246,0.08) !important; transform:translateX(4px); }
        .cal-day  { transition:all 0.2s; cursor:pointer; }
        .cal-day:hover  { transform:scale(1.05); }
        .ai-glow  { animation:glow 3s ease-in-out infinite; }
        .quick-chip { transition:all 0.15s; cursor:pointer; }
        .quick-chip:hover { background:rgba(141,89,255,0.2) !important; transform:translateY(-1px); }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:4px; }
      `}</style>

      {/* ════════════════════════════════════════
          HERO HEADER
      ════════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:16, marginBottom:22, alignItems:'stretch' }}>

        {/* Greeting + today */}
        <div className="dash-card" style={{
          background:'linear-gradient(135deg, #0a2a0a 0%, #0d2040 50%, #1a0a3d 100%)',
          border:`1px solid rgba(173,255,47,0.2)`, borderRadius:18, padding:'22px 28px',
          position:'relative', overflow:'hidden',
        }}>
          {/* Grid overlay */}
          <div style={{ position:'absolute', inset:0, opacity:0.04, backgroundImage:'linear-gradient(rgba(173,255,47,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(173,255,47,0.8) 1px,transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none' }}/>
          {/* Glow orbs */}
          <div style={{ position:'absolute', top:-40, right:60,  width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(173,255,47,0.12),transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-30, left:100, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.1),transparent 70%)', pointerEvents:'none' }}/>

          <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:13, color:'rgba(173,255,47,0.7)', marginBottom:4, fontWeight:500 }}>
                {greeting}
              </div>
              <div style={{ fontSize:26, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:6 }}>
                {firstName} 👋
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)' }}>
                {TODAY.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
              </div>
              <div style={{ display:'flex', gap:8, marginTop:14, flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(173,255,47,0.1)', border:'1px solid rgba(173,255,47,0.25)', borderRadius:20, padding:'4px 12px', fontSize:12, fontWeight:600, color:LIME }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:LIME, display:'inline-block', boxShadow:`0 0 6px ${LIME}` }}/>
                  {loading ? '…' : `${enrollments.length} active programs`}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.25)', borderRadius:20, padding:'4px 12px', fontSize:12, fontWeight:600, color:BLUE }}>
                  📅 {loading ? '…' : `${upcoming.length} upcoming`}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(141,89,255,0.1)', border:'1px solid rgba(141,89,255,0.25)', borderRadius:20, padding:'4px 12px', fontSize:12, fontWeight:600, color:'#a78bfa' }}>
                  🤖 AI Score: {loading ? '…' : '7.2/10'}
                </div>
              </div>
            </div>
            <div style={{ textAlign:'center', flexShrink:0 }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:`linear-gradient(135deg,${LIME},#84cc16)`, color:'#000', fontWeight:800, fontSize:22, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 24px rgba(173,255,47,0.4)`, marginBottom:8 }}>{avatar}</div>
              <div style={{ fontSize:11, color:MUTED }}>Level</div>
              <div style={{ fontSize:13, fontWeight:700, color:LIME }}>Advanced</div>
            </div>
          </div>
        </div>

        {/* Today's Session card */}
        <div className="dash-card" style={{
          width:260, background: todaySess
            ? 'linear-gradient(145deg,#1a0a3d,#0d1840)'
            : 'linear-gradient(145deg,#0f1520,#0a1020)',
          border:`1.5px solid ${todaySess ? 'rgba(141,89,255,0.45)' : BORDER}`,
          borderRadius:18, padding:'20px 22px', display:'flex', flexDirection:'column', justifyContent:'space-between',
          position:'relative', overflow:'hidden',
        }}>
          {todaySess && <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:'radial-gradient(circle,rgba(141,89,255,0.2),transparent 70%)', pointerEvents:'none' }}/>}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:14 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background: todaySess ? PURPLE : '#374151', boxShadow: todaySess ? `0 0 8px ${PURPLE}` : 'none', animation: todaySess ? 'pulse 2s infinite' : 'none' }}/>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'1px', color: todaySess ? '#a78bfa' : MUTED, textTransform:'uppercase' }}>Today's Session</span>
            </div>
            {loading ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}><Sk h={18} w="70%"/><Sk h={12} w="50%"/></div>
            ) : todaySess ? (
              <>
                <div style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:5, lineHeight:1.3 }}>{todaySess.title}</div>
                <div style={{ fontSize:28, fontWeight:900, color:PURPLE, lineHeight:1, marginBottom:4, textShadow:`0 0 20px ${PURPLE}60` }}>
                  {new Date(todaySess.scheduled_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                </div>
                <div style={{ fontSize:12, color:MUTED }}>with {todaySess.coach?.profile?.full_name || 'Coach'}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:16, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>No session today</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)' }}>Next: {upcoming[0] ? new Date(upcoming[0].scheduled_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : 'None scheduled'}</div>
              </>
            )}
          </div>
          {!loading && todaySess && (
            <a href={todaySess.zoom_link || '#'} target="_blank" rel="noreferrer"
              style={{ display:'block', textAlign:'center', background:`linear-gradient(135deg,${PURPLE},#5b21b6)`, color:'#fff', borderRadius:10, padding:'10px', fontSize:13, fontWeight:700, textDecoration:'none', boxShadow:`0 4px 16px rgba(141,89,255,0.4)`, marginTop:14 }}>
              {todaySess.zoom_link ? '▶ Join Session' : '⏳ Link Pending'}
            </a>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          STATS ROW (4 colorful cards)
      ════════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'Sessions Done',    value: loading ? null : past.length,           sub:`${upcoming.length} upcoming`,      color:BLUE,   icon:'📅', sparkData:[1,2,1,3,2,past.length>0?past.length:2,past.length], gradient:'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(59,130,246,0.03))' },
          { label:'Active Programs',  value: loading ? null : enrollments.length,     sub:`${certificates.length} completed`, color:LIME,   icon:'📚', sparkData:[0,1,1,1,2,2,enrollments.length], gradient:'linear-gradient(135deg,rgba(173,255,47,0.12),rgba(173,255,47,0.03))' },
          { label:'Practice Clips',   value: loading ? null : submissions.length,    sub:`${pending.length} pending review`,  color:ORANGE, icon:'🎬', sparkData:[0,1,0,2,1,2,submissions.length], gradient:'linear-gradient(135deg,rgba(249,115,22,0.12),rgba(249,115,22,0.03))' },
          { label:'Certificates',     value: loading ? null : certificates.length,   sub:'earned so far',                    color:TEAL,   icon:'🏅', sparkData:[0,0,0,1,1,1,certificates.length], gradient:'linear-gradient(135deg,rgba(6,182,212,0.12),rgba(6,182,212,0.03))' },
        ].map((c, i) => (
          <div key={i} className="dash-card" style={{ background:c.gradient, border:`1px solid ${c.color}22`, borderLeft:`3px solid ${c.color}`, borderRadius:14, padding:'18px 20px', animationDelay:`${i*60}ms` }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
              <div>
                <div style={{ fontSize:11, color:MUTED, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:8 }}>{c.label}</div>
                {loading
                  ? <Sk h={36} w="50%" r={8}/>
                  : <div style={{ fontSize:38, fontWeight:900, color:c.color, lineHeight:1, textShadow:`0 0 20px ${c.color}40` }}>{c.value}</div>
                }
              </div>
              <div style={{ fontSize:22 }}>{c.icon}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{c.sub}</div>
              {!loading && <Sparkline data={c.sparkData} color={c.color} width={64} height={24}/>}
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════
          AI ANALYSIS BANNER  (PROMINENT)
      ════════════════════════════════════════ */}
      <div className="dash-card ai-glow" style={{
        background:'linear-gradient(135deg, #1a0635 0%, #0d1840 40%, #0a0d1a 100%)',
        border:'1.5px solid rgba(141,89,255,0.35)', borderRadius:18, padding:'22px 28px',
        marginBottom:22, position:'relative', overflow:'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{ position:'absolute', top:-60,  right:-40, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(141,89,255,0.18),transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-60, left:200,  width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.1),transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', inset:0, opacity:0.03, backgroundImage:'radial-gradient(circle at 1px 1px, rgba(141,89,255,0.8) 1px, transparent 0)', backgroundSize:'24px 24px', pointerEvents:'none' }}/>

        <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center' }}>

          {/* Score ring */}
          <div style={{ textAlign:'center' }}>
            <div style={{ position:'relative', display:'inline-block' }}>
              <RadialProgress pct={72} color={PURPLE} size={90} thick={7}/>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>7.2</div>
                <div style={{ fontSize:8, color:'#a78bfa', fontWeight:600 }}>/ 10</div>
              </div>
            </div>
            <div style={{ fontSize:10, color:'#a78bfa', fontWeight:700, letterSpacing:'0.5px', marginTop:4 }}>AI SCORE</div>
          </div>

          {/* Insights */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#8d59ff,#5b21b6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🤖</div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>TPIP AI Performance Analyst</div>
                <div style={{ fontSize:12, color:'rgba(141,89,255,0.7)' }}>Analysed your coach feedback, sessions & assessments</div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
              {[
                { icon:'💪', label:'Top Strength',  text:'Cover Drive — coach noted strong improvement in elbow position', color:GREEN  },
                { icon:'⚠️', label:'Priority Fix',  text:'Pull Shot — back-foot placement flagged by coach as critical',   color:ORANGE },
                { icon:'🎯', label:"This Month's Focus", text:'Back-Foot Play & Short-Pitch Defence',                        color:BLUE   },
                { icon:'📈', label:'3-Month Outlook',text:'District-level selection realistic at current improvement rate', color:TEAL   },
              ].map((item, i) => (
                <div key={i} style={{ background:`${item.color}0d`, border:`1px solid ${item.color}25`, borderRadius:10, padding:'10px 12px', display:'flex', gap:8, alignItems:'flex-start' }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize:10, color:item.color, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:2 }}>{item.label}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)', lineHeight:1.4 }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Performance trend sparkline */}
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ fontSize:11, color:MUTED }}>7-week trend:</div>
              <Sparkline data={perfTrend} color={PURPLE} width={100} height={22}/>
              <div style={{ fontSize:11, color:'#a78bfa', fontWeight:600 }}>↑ +1.4 pts</div>
            </div>
          </div>

          {/* CTA + Quick chat */}
          <div style={{ display:'flex', flexDirection:'column', gap:10, flexShrink:0, width:200 }}>
            <button onClick={() => navigate('/student/ai-analysis')} style={{
              background:'linear-gradient(135deg,#8d59ff,#5b21b6)', color:'#fff', border:'none', borderRadius:12,
              padding:'12px 20px', fontWeight:700, fontSize:13, cursor:'pointer', textAlign:'center',
              boxShadow:'0 4px 20px rgba(141,89,255,0.5)',
            }}>⚡ Full AI Analysis →</button>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', textAlign:'center' }}>Ask AI about your game</div>
            {[
              'Fix my pull shot',
              'My 3-month plan',
              'Drill recommendations',
            ].map(q => (
              <button key={q} className="quick-chip" onClick={() => navigate('/student/ai-analysis')} style={{
                background:'rgba(141,89,255,0.08)', border:'1px solid rgba(141,89,255,0.2)',
                borderRadius:8, padding:'7px 10px', fontSize:11, color:'rgba(255,255,255,0.6)',
                textAlign:'left',
              }}>💬 {q}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MAIN GRID: Left + Right
      ════════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16, marginBottom:16 }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* WEEK CALENDAR */}
          <div className="dash-card" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>📆</span>
                <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>This Week</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <MiniBarChart data={weekActivity} color={BLUE} width={84} height={28}/>
                <span style={{ fontSize:11, color:MUTED }}>{weekActivity.reduce((a,b)=>a+b,0)} sessions</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8 }}>
              {calDays.map((day, i) => (
                <div key={i} className="cal-day" style={{
                  borderRadius:12, padding:'10px 6px', textAlign:'center',
                  background: day.isToday
                    ? 'linear-gradient(145deg,rgba(173,255,47,0.15),rgba(173,255,47,0.05))'
                    : day.sessions.length > 0 ? 'rgba(59,130,246,0.08)' : CARD2,
                  border: `1.5px solid ${day.isToday ? 'rgba(173,255,47,0.4)' : day.sessions.length > 0 ? 'rgba(59,130,246,0.3)' : BORDER}`,
                  animationDelay:`${i*40}ms`,
                }}>
                  <div style={{ fontSize:10, color: day.isToday ? LIME : MUTED, fontWeight:700, marginBottom:4 }}>{day.abbr}</div>
                  <div style={{ fontSize:18, fontWeight:800, color: day.isToday ? LIME : TEXT, marginBottom:6 }}>{day.num}</div>
                  {day.sessions.length > 0 ? (
                    day.sessions.slice(0,2).map((s, j) => (
                      <div key={j} style={{ background: day.isToday ? 'rgba(173,255,47,0.2)' : 'rgba(59,130,246,0.2)', borderRadius:5, padding:'2px 4px', fontSize:9, color: day.isToday ? LIME : '#93c5fd', fontWeight:600, marginBottom:2, lineHeight:1.3 }}>
                        {new Date(s.scheduled_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                      </div>
                    ))
                  ) : (
                    <div style={{ width:18, height:3, borderRadius:2, background:'rgba(255,255,255,0.06)', margin:'0 auto' }}/>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* UPCOMING SESSIONS */}
          <div className="dash-card" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px', flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>🏏</span>
                <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>Upcoming Sessions</span>
              </div>
              <span onClick={() => navigate('/student/sessions')} style={{ fontSize:12, color:BLUE, cursor:'pointer', fontWeight:600 }}>View all →</span>
            </div>

            {loading
              ? [1,2,3].map(i => <div key={i} style={{ marginBottom:10 }}><Sk h={56} r={10}/></div>)
              : upcoming.length === 0
                ? <div style={{ textAlign:'center', padding:'32px 0', color:MUTED, fontSize:13 }}>No upcoming sessions scheduled</div>
                : upcoming.slice(0,4).map((s, i) => {
                    const dt     = new Date(s.scheduled_at)
                    const isToday = dt.toDateString() === TODAY.toDateString()
                    const colors  = [BLUE, PURPLE, ORANGE, TEAL]
                    const c       = colors[i % colors.length]
                    return (
                      <div key={i} className="sess-row" style={{
                        display:'flex', alignItems:'center', gap:14, padding:'12px 14px', marginBottom:8,
                        background: isToday ? `${c}10` : CARD2,
                        border:`1px solid ${isToday ? c+'50' : BORDER}`,
                        borderRadius:12, position:'relative', overflow:'hidden',
                      }}>
                        <div style={{ width:3, height:'100%', position:'absolute', left:0, top:0, background:c, borderRadius:'3px 0 0 3px' }}/>
                        {/* Date block */}
                        <div style={{ width:46, textAlign:'center', flexShrink:0 }}>
                          <div style={{ fontSize:10, color:c, fontWeight:700, textTransform:'uppercase' }}>{dt.toLocaleDateString('en-IN',{month:'short'})}</div>
                          <div style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1 }}>{dt.getDate()}</div>
                          <div style={{ fontSize:10, color:MUTED }}>{dt.toLocaleDateString('en-IN',{weekday:'short'})}</div>
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                            <span style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{s.title}</span>
                            {isToday && <span style={{ fontSize:9, fontWeight:700, background:c, color:'#000', borderRadius:4, padding:'2px 7px' }}>TODAY</span>}
                          </div>
                          <div style={{ fontSize:12, color:MUTED }}>
                            {dt.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})} · {s.coach?.profile?.full_name || 'Coach'} · {s.duration_minutes}min
                          </div>
                        </div>
                        {s.zoom_link
                          ? <a href={s.zoom_link} target="_blank" rel="noreferrer" style={{ background:`linear-gradient(135deg,${c},${c}99)`, color:'#000', borderRadius:8, padding:'6px 14px', fontSize:11, fontWeight:700, textDecoration:'none', flexShrink:0 }}>Join →</a>
                          : <span style={{ fontSize:11, color:MUTED, background:CARD, borderRadius:8, padding:'6px 12px', border:`1px solid ${BORDER}`, flexShrink:0 }}>Pending</span>
                        }
                      </div>
                    )
                  })
            }
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* PROGRAMS PROGRESS */}
          <div className="dash-card" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
              <span style={{ fontSize:16 }}>📚</span>
              <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>My Programs</span>
            </div>

            {loading
              ? [1,2].map(i => <Sk key={i} h={80} r={12} style={{marginBottom:10}}/>)
              : enrollments.length === 0
                ? <div style={{ textAlign:'center', padding:'24px 0', color:MUTED, fontSize:13 }}>No programs enrolled</div>
                : enrollments.map((enr, i) => {
                    const progColors = [LIME, TEAL, PURPLE, ORANGE]
                    const c = progColors[i % progColors.length]
                    return (
                      <div key={i} style={{ background:CARD2, border:`1px solid ${BORDER}`, borderRadius:12, padding:'14px 16px', marginBottom:10 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <DonutChart pct={enr.progress_pct || 0} color={c} size={64}/>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:3, lineHeight:1.3 }}>{enr.course?.title || 'Program'}</div>
                            <div style={{ fontSize:11, color:MUTED, marginBottom:8 }}>Coach: {enr.coach?.profile?.full_name || '—'}</div>
                            <div style={{ background:'rgba(255,255,255,0.06)', height:5, borderRadius:3, overflow:'hidden' }}>
                              <div style={{ width:`${enr.progress_pct||0}%`, height:'100%', background:`linear-gradient(90deg,${c},${c}88)`, borderRadius:3, transition:'width 1s ease' }}/>
                            </div>
                            <div style={{ fontSize:10, color:MUTED, marginTop:3 }}>{enr.progress_pct||0}% complete</div>
                          </div>
                        </div>
                      </div>
                    )
                  })
            }
            <button onClick={() => navigate('/student/courses')} style={{ width:'100%', background:'transparent', border:`1px dashed ${BORDER}`, borderRadius:10, padding:'10px', color:MUTED, fontSize:12, cursor:'pointer', marginTop:4 }}>
              + View all courses
            </button>
          </div>

          {/* SUBMISSION STATUS CHART */}
          <div className="dash-card" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <span style={{ fontSize:16 }}>🎬</span>
              <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>Practice Clips</span>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:20 }}>
              {loading ? <Sk h={100} w={100} r={50}/> : <PieChart segments={subPie} size={90}/>}
              <div style={{ flex:1 }}>
                {loading ? (
                  <div style={{display:'flex',flexDirection:'column',gap:8}}><Sk h={12}/><Sk h={12} w="80%"/></div>
                ) : (
                  <>
                    {[
                      { label:'Reviewed',       value:reviewed.length, color:LIME   },
                      { label:'Awaiting review', value:pending.length,  color:ORANGE },
                    ].map((item, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:10, height:10, borderRadius:'50%', background:item.color, flexShrink:0 }}/>
                          <span style={{ fontSize:12, color:MUTED }}>{item.label}</span>
                        </div>
                        <span style={{ fontSize:16, fontWeight:700, color:item.color }}>{item.value}</span>
                      </div>
                    ))}
                    <button onClick={() => navigate('/student/submissions')} style={{ width:'100%', background:`${ORANGE}12`, border:`1px solid ${ORANGE}30`, borderRadius:8, padding:'7px', color:ORANGE, fontSize:12, fontWeight:600, cursor:'pointer', marginTop:4 }}>
                      + Submit new clip
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Latest feedback */}
            {!loading && reviewed.length > 0 && (
              <div style={{ marginTop:14, background:CARD2, border:`1px solid ${BORDER}`, borderRadius:10, padding:'12px 14px' }}>
                <div style={{ fontSize:10, color:LIME, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>Latest Coach Feedback</div>
                <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.6)', lineHeight:1.55, fontStyle:'italic' }}>
                  "{reviewed[0].coach_feedback?.slice(0,100)}{reviewed[0].coach_feedback?.length > 100 ? '…' : ''}"
                </p>
              </div>
            )}
          </div>

          {/* CERTIFICATES */}
          {!loading && certificates.length > 0 && (
            <div className="dash-card" style={{ background:'linear-gradient(135deg,rgba(6,182,212,0.08),rgba(6,182,212,0.02))', border:`1px solid rgba(6,182,212,0.25)`, borderRadius:16, padding:'18px 20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <span style={{ fontSize:16 }}>🏅</span>
                <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>Certificates Earned</span>
              </div>
              {certificates.map((cert, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ fontSize:24 }}>🥇</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{cert.program?.name}</div>
                    <div style={{ fontSize:11, color:TEAL }}>Issued {new Date(cert.issued_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          RECENT COACH FEEDBACK TIMELINE
      ════════════════════════════════════════ */}
      {!loading && submissions.length > 0 && (
        <div className="dash-card" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:16 }}>💬</span>
              <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>Coach Feedback Timeline</span>
            </div>
            <span onClick={() => navigate('/student/submissions')} style={{ fontSize:12, color:BLUE, cursor:'pointer', fontWeight:600 }}>All submissions →</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {submissions.slice(0,3).map((sub, i) => {
              const done   = sub.coach_feedback || sub.status === 'reviewed'
              const colors = [LIME, TEAL, BLUE]
              const c      = done ? colors[i % colors.length] : ORANGE
              return (
                <div key={i} style={{ background:CARD2, border:`1px solid ${done ? c+'30' : BORDER}`, borderRadius:12, padding:'14px 16px', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background: done ? `linear-gradient(90deg,${c},${c}44)` : `${ORANGE}44` }}/>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:TEXT }}>{sub.title || 'Practice clip'}</span>
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, background:`${c}18`, color:c, border:`1px solid ${c}30` }}>
                      {done ? '✓ Reviewed' : '⏳ Pending'}
                    </span>
                  </div>
                  <div style={{ fontSize:11, color:MUTED, marginBottom: done && sub.coach_feedback ? 10 : 0 }}>
                    {new Date(sub.submitted_at||sub.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                    {sub.description ? ` · ${sub.description.slice(0,45)}…` : ''}
                  </div>
                  {done && sub.coach_feedback && (
                    <p style={{ margin:0, fontSize:11, color:'rgba(255,255,255,0.55)', lineHeight:1.5, fontStyle:'italic', borderTop:`1px solid ${BORDER}`, paddingTop:8 }}>
                      "{sub.coach_feedback.slice(0,90)}{sub.coach_feedback.length>90?'…':''}"
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          UPLOAD + QUICK ACTIONS ROW
      ════════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Upload */}
        <div className="dash-card" onClick={() => navigate('/student/submissions')} style={{ background:'linear-gradient(135deg,rgba(249,115,22,0.08),rgba(249,115,22,0.02))', border:`1px dashed ${ORANGE}44`, borderRadius:16, padding:'22px', textAlign:'center', cursor:'pointer', transition:'all 0.2s' }}>
          <div style={{ fontSize:32, marginBottom:10, animation:'float 3s ease-in-out infinite' }}>🎬</div>
          <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:4 }}>Submit Practice Clip</div>
          <div style={{ fontSize:12, color:MUTED, marginBottom:14 }}>Upload a video or audio clip for coach review</div>
          <div style={{ display:'inline-block', background:`${ORANGE}20`, border:`1px solid ${ORANGE}50`, color:ORANGE, borderRadius:10, padding:'8px 20px', fontSize:13, fontWeight:700 }}>
            Upload Now →
          </div>
        </div>

        {/* Quick nav */}
        <div className="dash-card" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'22px' }}>
          <div style={{ fontSize:13, fontWeight:700, color:TEXT, marginBottom:14 }}>Quick Access</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[
              { icon:'🤖', label:'AI Analysis',  to:'/student/ai-analysis',  color:PURPLE, bg:'rgba(141,89,255,0.1)' },
              { icon:'🔍', label:'Find Coaches',  to:'/student/discover',     color:TEAL,   bg:'rgba(6,182,212,0.1)'  },
              { icon:'📊', label:'My Progress',   to:'/student/progress',     color:LIME,   bg:'rgba(173,255,47,0.1)' },
              { icon:'🏅', label:'Certificates',  to:'/student/certificates', color:ORANGE, bg:'rgba(249,115,22,0.1)' },
            ].map(item => (
              <button key={item.label} onClick={() => navigate(item.to)} style={{
                background:item.bg, border:`1px solid ${item.color}30`, borderRadius:10, padding:'12px',
                display:'flex', alignItems:'center', gap:8, cursor:'pointer', transition:'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor=item.color+'80' }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor=item.color+'30' }}>
                <span style={{ fontSize:18 }}>{item.icon}</span>
                <span style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.8)' }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
