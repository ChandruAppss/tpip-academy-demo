import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { coachAPI } from '../../services/api'
import toast from 'react-hot-toast'

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

function initials(name='Coach') { return name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) }

/* ── SVG Charts ── */
function RadialProgress({ pct=0, color=LIME, size=80, thick=7 }) {
  const r=size/2-thick, c=2*Math.PI*r
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={thick}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={thick}
        strokeDasharray={c} strokeDashoffset={c-(pct/100)*c} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}/>
    </svg>
  )
}

function MiniBar({ data=[], color=BLUE, width=100, height=36 }) {
  const max=Math.max(...data,1), bw=Math.floor((width-(data.length-1)*2)/data.length)
  return (
    <svg width={width} height={height}>
      {data.map((v,i)=>{
        const bh=Math.max(3,(v/max)*height)
        return <rect key={i} x={i*(bw+2)} y={height-bh} width={bw} height={bh} rx="2"
          fill={color} opacity={i===data.length-1?1:0.25+0.6*(i/data.length)}/>
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
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={parseFloat(pts.split(' ').pop().split(',')[0])} cy={parseFloat(pts.split(' ').pop().split(',')[1])} r="3" fill={color}/>
    </svg>
  )
}

function Sk({ w='100%', h=14, r=6 }) {
  return <div style={{width:w,height:h,borderRadius:r,background:'rgba(255,255,255,0.06)',animation:'pulse 1.6s ease-in-out infinite'}}/>
}

export default function CoachDashboard() {
  const { profile } = useAuthStore()
  const navigate    = useNavigate()
  const ini         = initials(profile?.full_name || 'Coach')

  const [loading,     setLoading]     = useState(true)
  const [dashboard,   setDashboard]   = useState(null)
  const [students,    setStudents]    = useState([])
  const [sessions,    setSessions]    = useState([])
  const [submissions, setSubmissions] = useState([])
  const [reviewTab,   setReviewTab]   = useState('pending')
  const [feedbackId,  setFeedbackId]  = useState(null)
  const [feedbackTxt, setFeedbackTxt] = useState('')
  const [saving,      setSaving]      = useState(false)

  useEffect(()=>{
    ;(async()=>{
      try {
        const [dr,sr,sesr,subr] = await Promise.allSettled([
          coachAPI.getDashboard(), coachAPI.getStudents(),
          coachAPI.getSessions(),  coachAPI.getSubmissions(),
        ])
        if(dr.status==='fulfilled')   setDashboard(dr.value.data)
        if(sr.status==='fulfilled')   setStudents(sr.value.data||[])
        if(sesr.status==='fulfilled') setSessions(sesr.value.data||[])
        if(subr.status==='fulfilled') setSubmissions(subr.value.data||[])
      } catch{ toast.error('Failed to load dashboard') }
      finally{ setLoading(false) }
    })()
  },[])

  async function saveFeedback(id) {
    if(!feedbackTxt.trim()) return toast.error('Enter feedback first')
    setSaving(true)
    try {
      await coachAPI.submitFeedback(id,{feedback_text:feedbackTxt,rating:4})
      toast.success('Feedback submitted!')
      setFeedbackId(null); setFeedbackTxt('')
    } catch { toast.error('Failed to submit feedback') }
    finally { setSaving(false) }
  }

  const upcoming    = sessions.filter(s=>new Date(s.scheduled_at)>=new Date())
  const todaySess   = upcoming.filter(s=>new Date(s.scheduled_at).toDateString()===new Date().toDateString())
  const pendingSubs = submissions.filter(s=>!s.coach_feedback&&s.status!=='reviewed')
  const reviewedSubs= submissions.filter(s=>s.coach_feedback||s.status==='reviewed')
  const shownSubs   = reviewTab==='pending'?pendingSubs:reviewedSubs

  // Earnings trend (mock)
  const earningsTrend=[18,22,19.5,21,28.5]
  const sessActivity =[5,8,6,10,9,13,upcoming.length]

  const STATS = [
    { label:'My Students',      value:loading?'…':String(students.length),    sub:'enrolled',             color:LIME,   icon:'👥', spark:[30,35,38,40,42,44,students.length], grad:'linear-gradient(135deg,rgba(173,255,47,0.12),rgba(173,255,47,0.02))' },
    { label:'Upcoming Sessions',value:loading?'…':String(upcoming.length),    sub:`${todaySess.length} today`, color:BLUE,icon:'📅', spark:sessActivity, grad:'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(59,130,246,0.02))' },
    { label:'Pending Reviews',  value:loading?'…':String(pendingSubs.length), sub:'need attention',        color:ORANGE, icon:'⚠️', spark:[0,1,2,1,3,2,pendingSubs.length], grad:'linear-gradient(135deg,rgba(249,115,22,0.12),rgba(249,115,22,0.02))' },
    { label:'Total Earnings',   value:loading?'…':`₹${((dashboard?.totalEarnings||124500)/1000).toFixed(0)}K`, sub:'all time', color:GREEN, icon:'💰', spark:earningsTrend, grad:'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.02))' },
  ]

  const lvlColors={ Advanced:LIME, Intermediate:TEAL, Beginner:BLUE }
  const roleColors={ Batsman:LIME, 'Fast Bowler':ORANGE, 'Spin Bowler':PURPLE, 'All-rounder':TEAL, 'Wicket-keeper':BLUE }

  return (
    <div style={{ padding:'24px 28px', background:BG, minHeight:'100%', fontFamily:"'Inter',system-ui,sans-serif", color:TEXT }}>
      <style>{`
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .ccard { animation:fadeUp 0.4s ease both; transition:transform 0.2s,box-shadow 0.2s; }
        .ccard:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,0.4) !important; }
        .rev-card { transition:all 0.2s; }
        .rev-card:hover { transform:translateY(-2px); box-shadow:0 6px 24px rgba(0,0,0,0.3) !important; }
        .stu-row:hover { background:rgba(59,130,246,0.06) !important; border-radius:10px; }
        .stu-row { transition:all 0.15s; }
      `}</style>

      {/* ── HERO HEADER ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:14, marginBottom:22, alignItems:'start' }}>

        {/* Main greeting */}
        <div className="ccard" style={{
          background:'linear-gradient(135deg,#052e16,#1e1b4b 60%,#0a0d1a)',
          border:'1px solid rgba(141,89,255,0.25)', borderRadius:18, padding:'22px 28px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:-40, right:60, width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle,rgba(173,255,47,0.1),transparent 70%)', pointerEvents:'none'}}/>
          <div style={{ position:'absolute', bottom:-30, right:160, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(141,89,255,0.12),transparent 70%)', pointerEvents:'none'}}/>
          <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                <div style={{ width:50, height:50, borderRadius:'50%', background:`linear-gradient(135deg,${LIME},#84cc16)`, color:'#000', fontWeight:900, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 20px rgba(173,255,47,0.4)` }}>{ini}</div>
                <div>
                  <div style={{ fontSize:20, fontWeight:800, color:'#fff' }}>Coach Dashboard</div>
                  <div style={{ fontSize:12, color:'rgba(141,89,255,0.8)' }}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {loading
                  ? null
                  : [
                    { label:`${students.length} Students`, color:LIME   },
                    { label:`${upcoming.length} Sessions`,  color:BLUE   },
                    { label:`${pendingSubs.length} Reviews Pending`, color:ORANGE },
                  ].map(b=>(
                    <div key={b.label} style={{ background:`${b.color}12`, border:`1px solid ${b.color}30`, borderRadius:20, padding:'4px 12px', fontSize:12, fontWeight:600, color:b.color }}>{b.label}</div>
                  ))
                }
              </div>
            </div>
            {/* Earnings ring */}
            <div style={{ textAlign:'center', flexShrink:0 }}>
              <div style={{ position:'relative', display:'inline-block' }}>
                <RadialProgress pct={72} color={GREEN} size={76} thick={6}/>
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ fontSize:12, fontWeight:800, color:'#fff' }}>₹{((dashboard?.totalEarnings||124500)/1000).toFixed(0)}K</div>
                  <div style={{ fontSize:8, color:GREEN }}>earned</div>
                </div>
              </div>
              <div style={{ fontSize:10, color:MUTED, marginTop:2 }}>Total Earnings</div>
            </div>
          </div>
        </div>

        {/* Today's load */}
        <div className="ccard" style={{ width:150, background:'linear-gradient(145deg,rgba(59,130,246,0.12),rgba(59,130,246,0.04))', border:`1.5px solid rgba(59,130,246,0.35)`, borderRadius:18, padding:'18px', textAlign:'center' }}>
          <div style={{ fontSize:10, color:BLUE, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Today</div>
          <div style={{ fontSize:44, fontWeight:900, color:'#fff', lineHeight:1, marginBottom:4 }}>{loading?'…':todaySess.length}</div>
          <div style={{ fontSize:12, color:MUTED, marginBottom:14 }}>session{todaySess.length!==1?'s':''}</div>
          <div style={{ background:CARD2, borderRadius:8, padding:'6px' }}>
            <MiniBar data={sessActivity} color={BLUE} width={110} height={32}/>
          </div>
        </div>

        {/* Pending reviews */}
        <div className="ccard" style={{ width:150, background:'linear-gradient(145deg,rgba(249,115,22,0.12),rgba(249,115,22,0.04))', border:`1.5px solid ${pendingSubs.length>0?'rgba(249,115,22,0.5)':'rgba(249,115,22,0.2)'}`, borderRadius:18, padding:'18px', textAlign:'center', animation:'float 3s ease-in-out infinite' }}>
          <div style={{ fontSize:10, color:ORANGE, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Reviews</div>
          <div style={{ fontSize:44, fontWeight:900, color:loading?MUTED:pendingSubs.length>0?ORANGE:'#fff', lineHeight:1, marginBottom:4, textShadow:pendingSubs.length>0?`0 0 20px ${ORANGE}60`:'none' }}>
            {loading?'…':pendingSubs.length}
          </div>
          <div style={{ fontSize:12, color:MUTED, marginBottom:14 }}>pending</div>
          <div style={{ background:`${ORANGE}18`, border:`1px solid ${ORANGE}30`, borderRadius:8, padding:'6px 8px', fontSize:11, color:ORANGE, fontWeight:600, cursor:'pointer' }} onClick={()=>setReviewTab('pending')}>
            Review Now →
          </div>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {STATS.map((c,i)=>(
          <div key={i} className="ccard" style={{ background:c.grad, border:`1px solid ${c.color}22`, borderLeft:`3px solid ${c.color}`, borderRadius:14, padding:20, animationDelay:`${i*60}ms` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div style={{ fontSize:11, color:MUTED, textTransform:'uppercase', letterSpacing:'0.8px' }}>{c.label}</div>
              <span style={{ fontSize:20 }}>{c.icon}</span>
            </div>
            <div style={{ fontSize:36, fontWeight:900, color:c.color, lineHeight:1, marginBottom:6, textShadow:`0 0 20px ${c.color}40` }}>{c.value}</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{c.sub}</div>
              <Sparkline data={c.spark} color={c.color} width={56} height={20}/>
            </div>
          </div>
        ))}
      </div>

      {/* ── EARNINGS CHART ── */}
      <div className="ccard" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 24px', marginBottom:22 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:16 }}>💰</span>
            <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>Monthly Earnings</span>
          </div>
          <div style={{ display:'flex', gap:16 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:11, color:MUTED }}>This Month</div>
              <div style={{ fontSize:16, fontWeight:800, color:GREEN }}>₹28.5K</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:11, color:MUTED }}>All Time</div>
              <div style={{ fontSize:16, fontWeight:800, color:LIME }}>₹{((dashboard?.totalEarnings||124500)/1000).toFixed(0)}K</div>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:10 }}>
          {['Jan','Feb','Mar','Apr','May'].map((m,i)=>{
            const vals=earningsTrend, maxV=Math.max(...vals)
            const h=Math.max(8,(vals[i]/maxV)*110)
            const isLast=i===vals.length-1
            return (
              <div key={m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ fontSize:11, color:isLast?GREEN:MUTED, fontWeight:isLast?700:400 }}>₹{vals[i]}K</div>
                <div style={{ width:'100%', height:h, background:isLast?`linear-gradient(180deg,${GREEN},${GREEN}44)`:`${GREEN}28`, borderRadius:'6px 6px 0 0', boxShadow:isLast?`0 0 16px ${GREEN}40`:'none', transition:'height 1s ease', position:'relative' }}>
                  {isLast && <div style={{ position:'absolute', inset:0, borderRadius:'6px 6px 0 0', background:'linear-gradient(180deg,rgba(255,255,255,0.08),transparent)' }}/>}
                </div>
                <div style={{ fontSize:11, color:isLast?TEXT:MUTED, fontWeight:isLast?600:400 }}>{m}</div>
              </div>
            )
          })}
          {/* Trend line overlay - simple */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 8px', gap:4 }}>
            <Sparkline data={earningsTrend} color={GREEN} width={60} height={50}/>
            <div style={{ fontSize:10, color:GREEN, fontWeight:600 }}>+54% trend</div>
          </div>
        </div>
      </div>

      {/* ── TWO COLUMNS ── */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:16 }}>

        {/* LEFT - Review queue */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="ccard" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>📋</span>
                <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>Practice Review Queue</span>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {[['pending',`Pending (${pendingSubs.length})`],['reviewed',`Reviewed (${reviewedSubs.length})`]].map(([v,l])=>(
                  <button key={v} onClick={()=>setReviewTab(v)} style={{ padding:'4px 12px', borderRadius:12, fontSize:12, fontWeight:600, border:'none', cursor:'pointer', background:reviewTab===v?LIME:'transparent', color:reviewTab===v?'#000':MUTED }}>{l}</button>
                ))}
              </div>
            </div>

            {loading
              ? [1,2].map(i=><div key={i} style={{marginBottom:14}}><Sk h={80} r={12}/></div>)
              : shownSubs.length===0
                ? (
                  <div style={{ textAlign:'center', padding:'40px 20px', background:CARD2, borderRadius:12, border:`1px dashed ${BORDER}` }}>
                    <div style={{ fontSize:32, marginBottom:10 }}>{reviewTab==='pending'?'✅':'📭'}</div>
                    <div style={{ fontSize:14, fontWeight:600, color:TEXT, marginBottom:4 }}>{reviewTab==='pending'?'All caught up!':'No reviewed submissions yet'}</div>
                    <div style={{ fontSize:12, color:MUTED }}>{reviewTab==='pending'?'No pending reviews':'Reviewed clips will appear here.'}</div>
                  </div>
                )
                : shownSubs.map((sub,i)=>{
                    const done=sub.coach_feedback||sub.status==='reviewed'
                    return (
                      <div key={sub.id} className="rev-card" style={{
                        background:CARD2, border:`1px solid ${done?`${GREEN}30`:ORANGE+'30'}`,
                        borderRadius:14, padding:'16px 18px', marginBottom:12, position:'relative', overflow:'hidden',
                      }}>
                        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:done?`linear-gradient(90deg,${GREEN},${GREEN}44)`:`linear-gradient(90deg,${ORANGE},${ORANGE}44)` }}/>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:36, height:36, borderRadius:'50%', background:done?`${GREEN}20`:`${ORANGE}20`, border:`1px solid ${done?GREEN:ORANGE}40`, color:done?GREEN:ORANGE, fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                              {initials(sub.student?.profile?.full_name||'ST')}
                            </div>
                            <div>
                              <div style={{ fontSize:14, fontWeight:700, color:TEXT }}>{sub.student?.profile?.full_name||'Student'}</div>
                              <div style={{ fontSize:11, color:MUTED }}>{new Date(sub.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
                            </div>
                          </div>
                          <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:10, background:done?`${GREEN}18`:`${ORANGE}18`, color:done?GREEN:ORANGE, border:`1px solid ${done?GREEN:ORANGE}30` }}>
                            {done?'✓ Reviewed':'⏳ New'}
                          </span>
                        </div>

                        <div style={{ display:'flex', alignItems:'center', gap:12, background:BG, borderRadius:10, padding:'12px', marginBottom:12, border:`1px solid ${BORDER}` }}>
                          <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg,${LIME},#84cc16)`, color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>▶</div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{sub.title||'Practice clip'}</div>
                            {sub.description&&<div style={{ fontSize:11, color:MUTED, marginTop:2, fontStyle:'italic' }}>"{sub.description.slice(0,80)}…"</div>}
                          </div>
                        </div>

                        {done ? (
                          <div style={{ background:`${GREEN}0a`, border:`1px solid ${GREEN}20`, borderRadius:10, padding:'10px 14px' }}>
                            <div style={{ fontSize:11, color:GREEN, fontWeight:700, marginBottom:4 }}>Your feedback:</div>
                            <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.65)', lineHeight:1.55 }}>{sub.coach_feedback}</p>
                          </div>
                        ) : feedbackId===sub.id ? (
                          <div>
                            <textarea value={feedbackTxt} onChange={e=>setFeedbackTxt(e.target.value)}
                              placeholder="Write detailed feedback for this student..."
                              style={{ width:'100%', boxSizing:'border-box', background:BG, border:`1.5px solid ${LIME}44`, borderRadius:10, color:'#fff', fontSize:13, padding:'10px 12px', fontFamily:'inherit', outline:'none', minHeight:80, resize:'vertical', lineHeight:1.5, marginBottom:10 }}
                            />
                            <div style={{ display:'flex', gap:8 }}>
                              <button onClick={()=>saveFeedback(sub.id)} disabled={saving} style={{ padding:'8px 18px', borderRadius:9, fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${LIME},#84cc16)`, color:'#000', border:'none', cursor:'pointer' }}>
                                {saving?'Saving…':'Submit Feedback'}
                              </button>
                              <button onClick={()=>{setFeedbackId(null);setFeedbackTxt('')}} style={{ padding:'8px 18px', borderRadius:9, fontSize:13, background:'transparent', color:MUTED, border:`1px solid ${BORDER}`, cursor:'pointer' }}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={()=>{setFeedbackId(sub.id);setFeedbackTxt('')}}
                            style={{ padding:'9px 18px', borderRadius:9, fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${LIME},#84cc16)`, color:'#000', border:'none', cursor:'pointer', boxShadow:`0 4px 12px rgba(173,255,47,0.25)` }}>
                            ✍️ Review &amp; Give Feedback
                          </button>
                        )}
                      </div>
                    )
                  })
            }
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Today's sessions */}
          <div className="ccard" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:GREEN, boxShadow:`0 0 8px ${GREEN}`, animation:'pulse 2s infinite' }}/>
              <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>Today's Sessions</span>
            </div>
            {loading
              ? [1,2].map(i=><Sk key={i} h={70} r={12} style={{marginBottom:10}}/>)
              : todaySess.length===0
                ? <div style={{ textAlign:'center', padding:'28px 20px', color:MUTED, fontSize:13 }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>📅</div>
                    No sessions today
                  </div>
                : todaySess.map((s,i)=>(
                  <div key={i} style={{ background:CARD2, border:`1px solid ${BLUE}30`, borderRadius:12, padding:'14px 16px', marginBottom:10, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, bottom:0, width:3, background:`linear-gradient(180deg,${LIME},${LIME}44)`, borderRadius:'3px 0 0 3px' }}/>
                    <div style={{ paddingLeft:8 }}>
                      <div style={{ fontSize:24, fontWeight:900, color:LIME, lineHeight:1, marginBottom:4, textShadow:`0 0 16px ${LIME}50` }}>
                        {new Date(s.scheduled_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                      </div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:2 }}>{s.title||'Coaching Session'}</div>
                      <div style={{ fontSize:11, color:MUTED }}>{s.max_students?`${s.max_students} max students`:''}</div>
                    </div>
                    {s.zoom_link
                      ? <a href={s.zoom_link} target="_blank" rel="noreferrer" style={{ display:'block', marginTop:10, textAlign:'center', background:`linear-gradient(135deg,${LIME},#84cc16)`, color:'#000', borderRadius:9, padding:'8px', fontSize:12, fontWeight:700, textDecoration:'none' }}>▶ Start Session</a>
                      : <div style={{ marginTop:10, textAlign:'center', background:CARD, borderRadius:9, padding:'8px', fontSize:12, color:MUTED, border:`1px solid ${BORDER}` }}>No link set</div>
                    }
                  </div>
                ))
            }
          </div>

          {/* Students */}
          <div className="ccard" style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span>👥</span>
                <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>My Students</span>
              </div>
              <div style={{ fontSize:12, color:MUTED }}>{students.length} total</div>
            </div>

            {/* Level breakdown mini chart */}
            {!loading && students.length>0 && (
              <div style={{ display:'flex', gap:6, marginBottom:14, padding:'10px 12px', background:CARD2, borderRadius:10, border:`1px solid ${BORDER}` }}>
                {Object.entries(
                  students.reduce((acc,s)=>{acc[s.level]=(acc[s.level]||0)+1;return acc},{})
                ).map(([lvl,cnt])=>{
                  const c=lvlColors[lvl]||MUTED
                  return (
                    <div key={lvl} style={{ flex:cnt, background:`${c}18`, border:`1px solid ${c}30`, borderRadius:6, padding:'4px 6px', textAlign:'center' }}>
                      <div style={{ fontSize:13, fontWeight:800, color:c }}>{cnt}</div>
                      <div style={{ fontSize:9, color:c, opacity:0.7 }}>{lvl.slice(0,3)}</div>
                    </div>
                  )
                })}
              </div>
            )}

            <div style={{ maxHeight:260, overflowY:'auto' }}>
              {loading
                ? [1,2,3,4].map(i=><div key={i} style={{display:'flex',gap:10,alignItems:'center',marginBottom:12}}><Sk w={32} h={32} r={16}/><div style={{flex:1}}><Sk h={12} w="65%" style={{marginBottom:4}}/><Sk h={9} w="40%"/></div></div>)
                : students.slice(0,8).map((s,i)=>{
                    const n=s.profile?.full_name||'Student'
                    const ini2=n.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
                    const lc=lvlColors[s.level]||MUTED
                    const rc=roleColors[s.playing_role]||BLUE
                    return (
                      <div key={i} className="stu-row" style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 6px' }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:`${lc}20`, border:`1px solid ${lc}40`, color:lc, fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{ini2}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, fontWeight:600, color:TEXT, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n}</div>
                          <div style={{ display:'flex', gap:4, marginTop:2 }}>
                            <span style={{ fontSize:9, color:lc, background:`${lc}12`, padding:'1px 5px', borderRadius:4 }}>{s.level}</span>
                            <span style={{ fontSize:9, color:rc, background:`${rc}12`, padding:'1px 5px', borderRadius:4 }}>{s.playing_role}</span>
                          </div>
                        </div>
                        <div style={{ width:7, height:7, borderRadius:'50%', background:s.profile?.is_active?GREEN:'#6b7280', boxShadow:s.profile?.is_active?`0 0 5px ${GREEN}`:'none', flexShrink:0 }}/>
                      </div>
                    )
                  })
              }
            </div>
            <button onClick={()=>navigate('/coach/students')} style={{ width:'100%', background:'transparent', border:`1px dashed ${BORDER}`, borderRadius:10, padding:'9px', color:MUTED, fontSize:12, cursor:'pointer', marginTop:8 }}>
              View all students →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
