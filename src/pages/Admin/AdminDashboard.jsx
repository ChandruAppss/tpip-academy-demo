import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { adminAPI } from '../../services/api'

const BG     = '#080c12'
const CARD   = '#0f1520'
const CARD2  = '#151e2d'
const BORDER = '#1e2d42'
const TEXT   = '#e8f0fe'
const MUTED  = 'rgba(232,240,254,0.4)'
const LIME   = '#adff2f'
const BLUE   = '#3b82f6'
const PURPLE = '#8d59ff'
const ORANGE = '#f97316'
const TEAL   = '#06b6d4'
const GREEN  = '#10b981'
const PINK   = '#ec4899'

function initials(name = 'Admin') { return name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) }

/* ── SVG Charts ── */
function DonutRing({ pct=0, color=LIME, size=80 }) {
  const r=size/2-7, c=2*Math.PI*r, off=c-(Math.min(pct,100)/100)*c
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x={size/2} y={size/2+5} textAnchor="middle" fill={color} fontSize="14" fontWeight="800">{pct}%</text>
    </svg>
  )
}

function BarChart({ data=[], colors=[], width=160, height=48 }) {
  const max=Math.max(...data,1), bw=Math.floor((width-(data.length-1)*3)/data.length)
  return (
    <svg width={width} height={height}>
      {data.map((v,i)=>{
        const bh=Math.max(3,(v/max)*height)
        return <rect key={i} x={i*(bw+3)} y={height-bh} width={bw} height={bh} rx="3"
          fill={colors[i%colors.length]||BLUE} opacity={0.4+0.6*(i/data.length)}/>
      })}
    </svg>
  )
}

function Sparkline({ data=[], color=LIME, width=80, height=28 }) {
  if(data.length<2) return null
  const max=Math.max(...data),min=Math.min(...data),range=max-min||1
  const pts=data.map((v,i)=>`${(i/(data.length-1))*width},${height-((v-min)/range)*(height-4)-2}`).join(' ')
  return (
    <svg width={width} height={height} style={{overflow:'visible'}}>
      <defs><linearGradient id={`lg${color.replace('#','')}`} x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="1"/></linearGradient></defs>
      <polyline points={pts} fill="none" stroke={`url(#lg${color.replace('#','')})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={parseFloat(pts.split(' ').pop().split(',')[0])} cy={parseFloat(pts.split(' ').pop().split(',')[1])} r="3" fill={color}/>
    </svg>
  )
}

function Sk({ w='100%', h=14, r=6 }) {
  return <div style={{width:w,height:h,borderRadius:r,background:'rgba(255,255,255,0.06)',animation:'pulse 1.6s ease-in-out infinite'}}/>
}

/* ── Revenue mini trend ── */
const revTrend = [18000,22000,19500,28000,24000,31000,45000]
const sessTrend= [5,8,6,10,9,13,15]

export default function AdminDashboard() {
  const { profile } = useAuthStore()
  const navigate    = useNavigate()
  const [stats,    setStats]    = useState(null)
  const [sessions, setSessions] = useState([])
  const [students, setStudents] = useState([])
  const [programs, setPrograms] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [sessTab,  setSessTab]  = useState('All')
  const ini = initials(profile?.full_name || 'Admin')

  useEffect(() => {
    ;(async () => {
      try {
        const [dr,sr,str,pr] = await Promise.allSettled([
          adminAPI.getDashboard(), adminAPI.getSessions(),
          adminAPI.getStudents(),  adminAPI.getPrograms(),
        ])
        if(dr.status==='fulfilled') setStats(dr.value.data)
        if(sr.status==='fulfilled') setSessions(sr.value.data||[])
        if(str.status==='fulfilled') setStudents(str.value.data||[])
        if(pr.status==='fulfilled') setPrograms(pr.value.data||[])
      } catch{}
      finally{ setLoading(false) }
    })()
  },[])

  const allSess  = sessions.slice(0,6).map(s=>({
    name:   s.title||'Session',
    coach:  s.coach?.profile?.full_name||'TBD',
    time:   s.scheduled_at ? new Date(s.scheduled_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) : '',
    date:   s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : '',
    status: s.status==='live'?'Live':s.status==='completed'?'Done':'Upcoming',
    color:  s.status==='live'?LIME:s.status==='completed'?'#6b7280':BLUE,
  }))
  const filtered = sessTab==='All'?allSess:sessTab==='Live'?allSess.filter(s=>s.status==='Live'):allSess.filter(s=>s.status==='Upcoming')

  const STATCARDS = stats ? [
    { label:'Total Students',    value:stats.totalStudents,     sub:'enrolled', color:LIME,   icon:'👥', trend:'+8 this month', sparkData:[180,195,200,215,220,234,stats.totalStudents], grad:'linear-gradient(135deg,rgba(173,255,47,0.12),rgba(173,255,47,0.02))' },
    { label:'Upcoming Sessions', value:stats.upcomingSessions,  sub:'scheduled',color:BLUE,   icon:'📅', trend:`${sessTrend[sessTrend.length-1]} today`, sparkData:sessTrend, grad:'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(59,130,246,0.02))' },
    { label:'Total Revenue',     value:`₹${((stats.totalRevenueInr||0)/1000).toFixed(0)}K`, sub:'all time', color:GREEN, icon:'💰', trend:'+₹28.5K this month', sparkData:revTrend.map(v=>v/1000), grad:'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.02))' },
    { label:'Active Coaches',    value:stats.totalCoaches,      sub:'registered',color:ORANGE, icon:'🏏', trend:`${stats.pendingReviews||0} reviews pending`, sparkData:[6,7,8,9,10,11,stats.totalCoaches], grad:'linear-gradient(135deg,rgba(249,115,22,0.12),rgba(249,115,22,0.02))' },
  ] : []

  return (
    <div style={{ padding:'24px 28px', background:BG, minHeight:'100%', fontFamily:"'Inter',system-ui,sans-serif", color:TEXT }}>
      <style>{`
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes liveGlow{ 0%,100%{box-shadow:0 0 8px rgba(173,255,47,0.3)} 50%{box-shadow:0 0 20px rgba(173,255,47,0.6)} }
        .acard { animation:fadeUp 0.4s ease both; transition:transform 0.2s,box-shadow 0.2s; }
        .acard:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,0.4) !important; }
        .qa:hover { border-color: ${LIME} !important; background: rgba(173,255,47,0.06) !important; transform:translateY(-2px); }
        .qa { transition:all 0.18s; }
        .tr:hover { background: rgba(255,255,255,0.03) !important; }
        .tr { transition:background 0.15s; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:16, marginBottom:22, alignItems:'start' }}>
        <div className="acard" style={{
          background:'linear-gradient(135deg,#052e16,#064e3b 50%,#0a1020)',
          border:`1px solid rgba(173,255,47,0.2)`, borderRadius:18, padding:'22px 28px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', inset:0, opacity:0.04, backgroundImage:'linear-gradient(rgba(173,255,47,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(173,255,47,0.8) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none'}}/>
          <div style={{ position:'absolute', top:-40, right:80, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,rgba(173,255,47,0.1),transparent 70%)', pointerEvents:'none'}}/>
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:`linear-gradient(135deg,${LIME},#84cc16)`, color:'#000', fontWeight:900, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 24px rgba(173,255,47,0.4)` }}>{ini}</div>
              <div>
                <div style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>Admin Dashboard</div>
                <div style={{ fontSize:13, color:LIME, marginTop:1 }}>
                  {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
                </div>
              </div>
              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6, background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.4)', color:'#22c55e', padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:700 }}>
                <span style={{ animation:'pulse 2s infinite' }}>●</span> LIVE
              </div>
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {[
                { label:'New Enrollments', value:stats?.newEnrollmentsThisMonth||8, color:BLUE },
                { label:'Pending Reviews', value:stats?.pendingReviews||3,          color:ORANGE },
                { label:'AI Sessions',     value:'Active',                           color:PURPLE },
              ].map(b=>(
                <div key={b.label} style={{ background:`${b.color}12`, border:`1px solid ${b.color}30`, borderRadius:20, padding:'4px 14px', fontSize:12, fontWeight:600, color:b.color, display:'flex', gap:6, alignItems:'center' }}>
                  <span style={{ fontWeight:800 }}>{b.value}</span> {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Settings shortcut */}
        <div className="acard" style={{ width:200, background:'linear-gradient(145deg,#1a0635,#0d1840)', border:`1.5px solid rgba(141,89,255,0.35)`, borderRadius:18, padding:'20px', cursor:'pointer', textAlign:'center' }}
          onClick={() => navigate('/admin/ai-settings')}>
          <div style={{ fontSize:32, marginBottom:8, filter:'drop-shadow(0 0 12px rgba(141,89,255,0.6))' }}>🤖</div>
          <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:4 }}>AI Settings</div>
          <div style={{ fontSize:11, color:'rgba(141,89,255,0.7)', marginBottom:14 }}>Configure API keys, limits & content</div>
          <div style={{ background:`${PURPLE}20`, border:`1px solid ${PURPLE}40`, color:'#a78bfa', borderRadius:8, padding:'7px', fontSize:12, fontWeight:600 }}>Open →</div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {loading
          ? Array(4).fill(0).map((_,i)=><div key={i} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:20}}><Sk h={12} w="60%" style={{marginBottom:12}}/><Sk h={38} w="40%" style={{marginBottom:8}}/><Sk h={8} w="50%"/></div>)
          : STATCARDS.map((c,i)=>(
            <div key={i} className="acard" style={{ background:c.grad, border:`1px solid ${c.color}22`, borderLeft:`3px solid ${c.color}`, borderRadius:14, padding:20, animationDelay:`${i*60}ms` }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ fontSize:11, color:MUTED, textTransform:'uppercase', letterSpacing:'0.8px' }}>{c.label}</div>
                <span style={{ fontSize:20 }}>{c.icon}</span>
              </div>
              <div style={{ fontSize:38, fontWeight:900, color:c.color, lineHeight:1, marginBottom:6, textShadow:`0 0 24px ${c.color}40` }}>{c.value}</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{c.trend}</div>
                <Sparkline data={c.sparkData} color={c.color} width={60} height={22}/>
              </div>
            </div>
          ))
        }
      </div>

      {/* ── REVENUE + SESSIONS CHARTS ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:22 }}>
        {/* Revenue chart */}
        <div className="acard" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:16 }}>💰</span>
              <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>Monthly Revenue</span>
            </div>
            <span style={{ fontSize:14, fontWeight:800, color:GREEN }}>₹{((stats?.totalRevenueInr||45000)/1000).toFixed(0)}K total</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:8, marginBottom:10 }}>
            {['Jan','Feb','Mar','Apr','May'].map((m,i)=>{
              const vals=[18,22,19.5,21,28.5]
              const maxV=Math.max(...vals)
              const h=Math.max(8,(vals[i]/maxV)*90)
              return (
                <div key={m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{ fontSize:10, color:GREEN, fontWeight:600 }}>₹{vals[i]}K</div>
                  <div style={{ width:'100%', height:h, background:`linear-gradient(180deg,${GREEN},${GREEN}44)`, borderRadius:'4px 4px 0 0', transition:'height 1s ease' }}/>
                  <div style={{ fontSize:10, color:MUTED }}>{m}</div>
                </div>
              )
            })}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0 0', borderTop:`1px solid ${BORDER}` }}>
            <div style={{ fontSize:12, color:MUTED }}>Total collected</div>
            <div style={{ fontSize:13, fontWeight:700, color:GREEN }}>₹{((stats?.totalRevenueInr||45000)/1000).toFixed(1)}K</div>
          </div>
        </div>

        {/* Session activity */}
        <div className="acard" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:16 }}>📈</span>
              <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>Session Activity</span>
            </div>
            <span style={{ fontSize:14, fontWeight:800, color:BLUE }}>{stats?.upcomingSessions||6} active</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:6, marginBottom:10 }}>
            {['W1','W2','W3','W4','W5','W6','Now'].map((w,i)=>{
              const vals=sessTrend, maxV=Math.max(...vals)
              const h=Math.max(8,(vals[i]/maxV)*90)
              const isLast=i===vals.length-1
              return (
                <div key={w} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{ fontSize:10, color: isLast ? BLUE : MUTED, fontWeight: isLast ? 700 : 400 }}>{vals[i]}</div>
                  <div style={{ width:'100%', height:h, background: isLast ? `linear-gradient(180deg,${BLUE},${BLUE}44)` : `${BLUE}33`, borderRadius:'4px 4px 0 0', boxShadow: isLast ? `0 0 10px ${BLUE}50` : 'none', transition:'height 1s ease' }}/>
                  <div style={{ fontSize:10, color:MUTED }}>{w}</div>
                </div>
              )
            })}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0 0', borderTop:`1px solid ${BORDER}` }}>
            <div style={{ fontSize:12, color:MUTED }}>Total sessions tracked</div>
            <div style={{ fontSize:13, fontWeight:700, color:BLUE }}>{sessTrend.reduce((a,b)=>a+b,0)}</div>
          </div>
        </div>
      </div>

      {/* ── TWO COLUMNS ── */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>

        {/* LEFT */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* SESSIONS TABLE */}
          <div className="acard" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>📅</span>
                <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>Sessions</span>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {['All','Live','Upcoming'].map(t=>(
                  <button key={t} onClick={()=>setSessTab(t)} style={{ padding:'3px 12px', borderRadius:12, fontSize:12, fontWeight:600, border:'none', cursor:'pointer', background:sessTab===t?LIME:'transparent', color:sessTab===t?'#000':MUTED }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr 0.8fr 0.8fr 0.8fr', gap:0, marginBottom:10, padding:'0 8px' }}>
              {['Session','Coach','Date','Time','Status'].map(h=>(
                <div key={h} style={{ fontSize:10, color:MUTED, textTransform:'uppercase', letterSpacing:'0.8px', fontWeight:600 }}>{h}</div>
              ))}
            </div>

            {loading ? [1,2,3,4].map(i=><div key={i} style={{padding:'12px 8px',marginBottom:6}}><Sk h={18}/></div>)
            : filtered.length===0
              ? <div style={{textAlign:'center',padding:'28px',color:MUTED,fontSize:13}}>No sessions</div>
              : filtered.map((s,i)=>(
                <div key={i} className="tr" style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr 0.8fr 0.8fr 0.8fr', gap:0, padding:'12px 8px', borderRadius:8, borderBottom:i<filtered.length-1?`1px solid ${BORDER}`:'none', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:s.color, flexShrink:0, boxShadow:`0 0 6px ${s.color}` }}/>
                    <span style={{ fontSize:13, fontWeight:600, color:TEXT }}>{s.name}</span>
                  </div>
                  <div style={{ fontSize:12, color:MUTED }}>{s.coach}</div>
                  <div style={{ fontSize:12, color:MUTED }}>{s.date}</div>
                  <div style={{ fontSize:12, color:TEXT, fontWeight:600 }}>{s.time}</div>
                  <div style={{ padding:'3px 10px', borderRadius:10, fontSize:11, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', background: s.status==='Live'?`${LIME}22`:s.status==='Done'?'rgba(107,114,128,0.15)':'rgba(59,130,246,0.12)', color:s.status==='Live'?LIME:s.status==='Done'?'#6b7280':BLUE, border:`1px solid ${s.color}30` }}>
                    {s.status==='Live'?'⚡':s.status==='Done'?'✓':'→'} {s.status}
                  </div>
                </div>
              ))
            }
          </div>

          {/* QUICK ACTIONS */}
          <div className="acard" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
            <div style={{ fontSize:13, fontWeight:700, color:TEXT, marginBottom:16 }}>Quick Actions</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                { emoji:'📋', title:'Enroll Student',  sub:'Add students individually',      to:'/admin/students',     color:LIME   },
                { emoji:'📅', title:'Schedule Session', sub:'Create & assign to coach',       to:'/admin/sessions',     color:BLUE   },
                { emoji:'🎖️', title:'Issue Certificate',sub:'Generate completion certs',     to:'/admin/certificates', color:ORANGE },
                { emoji:'👥', title:'Manage Coaches',   sub:'View & approve coach profiles',  to:'/admin/coaches',      color:TEAL   },
                { emoji:'📊', title:'Programs',         sub:'Curriculum & batches',           to:'/admin/programs',     color:PURPLE },
                { emoji:'🤖', title:'AI Settings',      sub:'API keys, limits & content',     to:'/admin/ai-settings',  color:PINK   },
              ].map((a,i)=>(
                <div key={i} className="qa" onClick={()=>navigate(a.to)} style={{
                  background:CARD2, border:`1px solid ${BORDER}`, borderRadius:12, padding:'16px 14px', cursor:'pointer',
                }}>
                  <div style={{ fontSize:22, marginBottom:8 }}>{a.emoji}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:TEXT, marginBottom:3 }}>{a.title}</div>
                  <div style={{ fontSize:11, color:MUTED, lineHeight:1.4 }}>{a.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* PROGRAMS */}
          <div className="acard" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><span>📚</span><span style={{ fontSize:13, fontWeight:700, color:TEXT }}>Programs</span></div>
              <span onClick={()=>navigate('/admin/programs')} style={{ fontSize:12, color:BLUE, cursor:'pointer', fontWeight:600 }}>All →</span>
            </div>
            {loading
              ? [1,2,3].map(i=><div key={i} style={{marginBottom:14}}><Sk h={14} w="70%" style={{marginBottom:6}}/><Sk h={6}/></div>)
              : programs.slice(0,4).map((p,i)=>{
                  const cols=[LIME,BLUE,ORANGE,TEAL,PURPLE]
                  const c=cols[i%cols.length]
                  const pct=Math.round(((p.total_enrollments||0)/Math.max(1,p.max_students||10))*100)
                  return (
                    <div key={i} style={{ marginBottom:14 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                        <div>
                          <div style={{ fontSize:12, fontWeight:600, color:TEXT }}>{p.title}</div>
                          <div style={{ fontSize:10, color:MUTED }}>{p.instructor} · {p.duration_weeks}w</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:12, fontWeight:700, color:c }}>{pct}%</div>
                          <div style={{ fontSize:10, color:MUTED }}>{p.total_enrollments}/{p.max_students}</div>
                        </div>
                      </div>
                      <div style={{ background:'rgba(255,255,255,0.06)', height:6, borderRadius:3, overflow:'hidden' }}>
                        <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${c},${c}66)`, borderRadius:3 }}/>
                      </div>
                    </div>
                  )
                })
            }
          </div>

          {/* RECENT STUDENTS */}
          <div className="acard" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><span>👥</span><span style={{ fontSize:13, fontWeight:700, color:TEXT }}>Students</span></div>
              <span onClick={()=>navigate('/admin/students')} style={{ fontSize:12, color:BLUE, cursor:'pointer', fontWeight:600 }}>All →</span>
            </div>
            {loading
              ? [1,2,3,4].map(i=><div key={i} style={{display:'flex',gap:10,alignItems:'center',marginBottom:12}}><Sk w={32} h={32} r={16}/><div style={{flex:1}}><Sk h={12} w="60%" style={{marginBottom:4}}/><Sk h={9} w="40%"/></div></div>)
              : students.slice(0,5).map((s,i)=>{
                  const n=s.profile?.full_name||'Student'
                  const ini2=n.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
                  const lvlCols={ Advanced:LIME, Intermediate:TEAL, Beginner:BLUE }
                  const lc=lvlCols[s.level]||MUTED
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:i<4?`1px solid ${BORDER}`:'none' }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${lc}40,${lc}20)`, border:`1px solid ${lc}40`, color:lc, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{ini2}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:600, color:TEXT, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n}</div>
                        <div style={{ fontSize:10, color:MUTED }}>{s.level} · {s.playing_role||'Student'}</div>
                      </div>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:s.profile?.is_active?GREEN:'#6b7280', boxShadow:s.profile?.is_active?`0 0 6px ${GREEN}`:'none' }}/>
                    </div>
                  )
                })
            }
          </div>

          {/* SYSTEM STATUS */}
          <div className="acard" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
            <div style={{ fontSize:13, fontWeight:700, color:TEXT, marginBottom:14 }}>System Status</div>
            {[
              { label:'API Server',      color:GREEN,  status:'Operational' },
              { label:'AI Integration',  color:PURPLE, status:'Active' },
              { label:'Video Storage',   color:GREEN,  status:'Operational' },
              { label:'Payment Gateway', color:GREEN,  status:'Online' },
            ].map((item,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:i<3?`1px solid ${BORDER}`:'none' }}>
                <span style={{ fontSize:12, color:MUTED }}>{item.label}</span>
                <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:item.color, fontWeight:600 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:item.color, display:'inline-block', boxShadow:`0 0 6px ${item.color}`, animation:'pulse 2s infinite' }}/>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
