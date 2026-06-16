import { useState, useRef, useEffect } from 'react'
import { studentAPI } from '../../services/api'
import useAuthStore from '../../store/authStore'

const BG     = '#0d1117'
const CARD   = '#161b22'
const CARD2  = '#1c2128'
const BORDER = '#21262d'
const TEXT   = '#e6edf3'
const MUTED  = 'rgba(230,237,243,0.4)'
const PURPLE = '#8d59ff'

const PRIORITY_COLOR = { Critical:'#ef4444', High:'#f97316', Medium:'#eab308' }

export default function StudentAIAnalysis() {
  const { profile } = useAuthStore()

  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  // Chat
  const [chatOpen,    setChatOpen]    = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [chatInput,   setChatInput]   = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError,   setChatError]   = useState(null)

  // Limits (from server)
  const [dailyLimit,     setDailyLimit]     = useState(null)   // null = not loaded yet
  const [questionsUsed,  setQuestionsUsed]  = useState(0)
  const [packageName,    setPackageName]    = useState('')
  const [limitReached,   setLimitReached]   = useState(false)
  const [upgradeOptions, setUpgradeOptions] = useState([])

  const chatBottomRef = useRef(null)
  const a = data?.analysis

  const questionsLeft = dailyLimit === -1 ? Infinity : dailyLimit != null ? Math.max(0, dailyLimit - questionsUsed) : 8

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [chatHistory])

  async function runAnalysis() {
    setLoading(true); setError(null); setData(null); setChatHistory([])
    try {
      const res = await studentAPI.getAIAnalysis()
      setData(res.data)
    } catch(e) {
      setError(e.response?.data?.error || 'TPIP AI analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function sendChat(e) {
    e?.preventDefault()
    const userMsg = chatInput.trim()
    if (!userMsg || chatLoading || questionsLeft <= 0 || limitReached) return
    setChatInput('')
    setChatError(null)
    setChatHistory(h => [...h, { role:'user', content:userMsg }])
    setChatLoading(true)
    try {
      const res = await studentAPI.sendAIChat({
        message:           userMsg,
        history:           chatHistory,
        student_id:        's1',
        student_name:      profile?.full_name || 'Student',
        analysis_context:  a ? { overall_rating:a.overall_rating, performance_level:a.performance_level, monthly_focus:a.monthly_focus } : null,
      })
      const d = res.data
      setQuestionsUsed(d.questions_used || questionsUsed + 1)
      if (d.limit !== undefined) setDailyLimit(d.limit)
      if (d.package) setPackageName(d.package)

      // Build reply with YouTube suggestions appended
      let reply = d.reply
      const resources = d.suggested_resources || []

      setChatHistory(h => [
        ...h,
        { role:'assistant', content: reply, resources },
      ])
    } catch(e) {
      if (e.response?.status === 429) {
        const data = e.response.data
        setLimitReached(true)
        setDailyLimit(data.limit)
        setQuestionsUsed(data.used)
        setPackageName(data.package)
        setUpgradeOptions(data.upgrade_options || [])
        setChatHistory(h => h.slice(0, -1))
      } else {
        setChatError(e.response?.data?.error || 'TPIP AI is unavailable. Try again.')
        setChatHistory(h => h.slice(0, -1))
      }
    } finally {
      setChatLoading(false)
    }
  }

  const QUICK_QUESTIONS = [
    'What should I focus on in my next net session?',
    'Give me a drill to fix my weakest skill',
    'How do I improve my pull shot?',
    'What does my 3-month improvement look like?',
  ]

  const limitText = dailyLimit === -1 ? '∞ unlimited' : dailyLimit != null ? `${questionsLeft} of ${dailyLimit} remaining today` : `${questionsLeft} remaining`

  return (
    <div style={{ padding:'28px 32px', minHeight:'100%', background:BG, fontFamily:"'Inter',system-ui,sans-serif", color:TEXT }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes slideIn{ from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .drill-card { transition: all 0.2s; }
        .drill-card:hover { border-color: rgba(141,89,255,0.45) !important; transform: translateY(-3px); }
        .chat-input:focus { outline:none; border-color: rgba(141,89,255,0.5) !important; }
        .quick-q { transition: all 0.15s; cursor:pointer; }
        .quick-q:hover { background: rgba(141,89,255,0.12) !important; border-color: rgba(141,89,255,0.35) !important; }
        .yt-chip { transition: all 0.15s; }
        .yt-chip:hover { background: rgba(239,68,68,0.15) !important; border-color: rgba(239,68,68,0.5) !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(141,89,255,0.3); border-radius:4px; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#8d59ff,#5b21b6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, boxShadow:'0 4px 20px rgba(141,89,255,0.45)', flexShrink:0 }}>🤖</div>
          <div>
            <h1 style={{ margin:0, fontSize:20, fontWeight:700, color:TEXT }}>TPIP AI Performance Analyst</h1>
            <p style={{ margin:0, fontSize:12, color:MUTED, marginTop:2 }}>
              Analyses your sessions, assessments & coach feedback in real time
              {packageName && <span style={{ marginLeft:8, padding:'1px 8px', borderRadius:10, background:'rgba(141,89,255,0.15)', border:'1px solid rgba(141,89,255,0.3)', color:'#a78bfa', fontSize:11 }}>{packageName} plan</span>}
            </p>
          </div>
        </div>
        {a && (
          <button onClick={() => setChatOpen(o => !o)} style={{
            background: chatOpen ? 'rgba(141,89,255,0.2)' : 'linear-gradient(135deg,#8d59ff,#5b21b6)',
            color:'#fff', border: chatOpen ? '1px solid rgba(141,89,255,0.4)' : 'none',
            borderRadius:100, padding:'10px 22px', fontSize:13, fontWeight:600, cursor:'pointer',
            boxShadow: chatOpen ? 'none' : '0 4px 16px rgba(141,89,255,0.4)',
            display:'flex', alignItems:'center', gap:8,
          }}>
            💬 {chatOpen ? 'Hide Chat' : 'Ask TPIP AI'}
            <span style={{ background:'rgba(255,255,255,0.15)', borderRadius:10, padding:'1px 7px', fontSize:11 }}>{limitText}</span>
          </button>
        )}
      </div>

      {/* CTA */}
      {!a && !loading && !error && (
        <div style={{ background:'linear-gradient(135deg, #1a0a3d 0%, #0d1017 50%, #0a1528 100%)', border:'1px solid rgba(141,89,255,0.3)', borderRadius:16, padding:'60px 40px', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-20%', left:'50%', transform:'translateX(-50%)', width:500, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(141,89,255,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ fontSize:56, marginBottom:18 }}>🧠</div>
            <h2 style={{ fontSize:24, fontWeight:700, color:'#fff', marginBottom:10 }}>TPIP AI is Ready</h2>
            <p style={{ fontSize:15, color:MUTED, maxWidth:480, margin:'0 auto 28px', lineHeight:'165%' }}>
              Get a personalised sports performance breakdown — strengths, weaknesses, AI-recommended drills, and a 3-month improvement plan — all based on your real coach feedback.
            </p>
            <div style={{ display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap', marginBottom:32 }}>
              {[['📊','Coach feedback'],['💬','Session history'],['🎯','Drill plans'],['📹','YouTube resources']].map(([icon, label]) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color:'rgba(255,255,255,0.55)', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100, padding:'6px 14px' }}>
                  <span>{icon}</span>{label}
                </div>
              ))}
            </div>
            <button onClick={runAnalysis} style={{ background:'linear-gradient(135deg,#8d59ff,#5b21b6)', color:'#fff', border:'none', borderRadius:100, padding:'14px 40px', fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 8px 32px rgba(141,89,255,0.5)' }}>
              ⚡ Run TPIP AI Analysis
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ background:'linear-gradient(135deg, #1a0a3d 0%, #0d1017 50%, #0a1528 100%)', border:'1px solid rgba(141,89,255,0.3)', borderRadius:16, padding:'80px 40px', textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:18, display:'inline-block', animation:'spin 3s linear infinite' }}>🧠</div>
          <div style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:10 }}>TPIP AI is analysing your profile…</div>
          <div style={{ fontSize:13, color:MUTED, marginBottom:24 }}>Reading coach feedback, session notes & assessment history</div>
          <div style={{ display:'flex', justifyContent:'center', gap:6 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:PURPLE, animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:12, padding:'24px 28px' }}>
          <div style={{ fontSize:14, fontWeight:600, color:'#fca5a5', marginBottom:6 }}>Analysis failed</div>
          <div style={{ fontSize:13, color:'rgba(252,165,165,0.7)', marginBottom:16 }}>{error}</div>
          <button onClick={runAnalysis} style={{ background:'rgba(239,68,68,0.2)', border:'1px solid rgba(239,68,68,0.4)', color:'#fca5a5', borderRadius:8, padding:'8px 20px', fontSize:13, cursor:'pointer', fontWeight:600 }}>Try again</button>
        </div>
      )}

      {/* Results */}
      {a && !loading && (
        <div style={{ display:'grid', gridTemplateColumns: chatOpen ? '1fr 360px' : '1fr', gap:20, alignItems:'start', animation:'fadeUp 0.4s ease' }}>

          {/* LEFT — Analysis */}
          <div>
            {/* Hero score */}
            <div style={{ background:'linear-gradient(135deg, #1a0a3d 0%, #0d1017 60%, #0a1528 100%)', border:'1px solid rgba(141,89,255,0.3)', borderRadius:16, padding:'24px 28px', marginBottom:16, display:'grid', gridTemplateColumns:'auto 1fr', gap:28, alignItems:'center', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:'-30%', right:'-5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(141,89,255,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />
              <div style={{ textAlign:'center', background:'rgba(141,89,255,0.12)', border:'1px solid rgba(141,89,255,0.3)', borderRadius:14, padding:'20px 28px', position:'relative', zIndex:1 }}>
                <div style={{ fontSize:58, fontWeight:900, color:'#fff', lineHeight:1 }}>{a.overall_rating}<span style={{ fontSize:24, color:'rgba(255,255,255,0.3)' }}>/10</span></div>
                <div style={{ fontSize:11, color:'#a78bfa', marginTop:8, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' }}>{a.performance_level}</div>
              </div>
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:8 }}>TPIP AI Summary</div>
                <p style={{ fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:'165%', margin:'0 0 14px', fontStyle:'italic' }}>"{a.summary}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(141,89,255,0.1)', border:'1px solid rgba(141,89,255,0.25)', borderRadius:10, padding:'10px 14px' }}>
                  <span style={{ fontSize:18 }}>🎯</span>
                  <div>
                    <div style={{ fontSize:10, color:'#a78bfa', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginBottom:1 }}>This Month's Focus</div>
                    <div style={{ fontSize:14, color:'#fff', fontWeight:600 }}>{a.monthly_focus}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths + Weaknesses */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div style={{ background:'rgba(16,185,129,0.05)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:14, padding:'18px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <span>💪</span>
                  <span style={{ fontSize:11, fontWeight:700, color:'#10b981', letterSpacing:'1px', textTransform:'uppercase' }}>Strengths</span>
                </div>
                {a.strengths?.map((s, i) => (
                  <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:12, paddingBottom:12, borderBottom: i < a.strengths.length-1 ? '1px solid rgba(16,185,129,0.1)' : 'none' }}>
                    <div style={{ width:32, height:32, borderRadius:7, background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontSize:14, fontWeight:900, color:'#10b981' }}>{s.score}</span>
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:2 }}>{s.skill}</div>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,0.48)', lineHeight:'148%' }}>{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(239,68,68,0.05)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:14, padding:'18px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <span>⚠️</span>
                  <span style={{ fontSize:11, fontWeight:700, color:'#ef4444', letterSpacing:'1px', textTransform:'uppercase' }}>Areas to Fix</span>
                </div>
                {a.weaknesses?.map((w, i) => (
                  <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:12, paddingBottom:12, borderBottom: i < a.weaknesses.length-1 ? '1px solid rgba(239,68,68,0.1)' : 'none' }}>
                    <div style={{ padding:'3px 9px', background:`${PRIORITY_COLOR[w.priority]||'#6b7280'}18`, border:`1px solid ${PRIORITY_COLOR[w.priority]||'#6b7280'}40`, borderRadius:6, fontSize:9, fontWeight:700, color:PRIORITY_COLOR[w.priority]||'#6b7280', flexShrink:0, whiteSpace:'nowrap', marginTop:2 }}>{w.priority}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:2 }}>{w.skill}</div>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,0.48)', lineHeight:'148%' }}>{w.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drills */}
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:'18px 20px', marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <span>🏋️</span>
                <span style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'1px', textTransform:'uppercase' }}>TPIP AI Drill Recommendations</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                {a.drills?.map((drill, i) => (
                  <div key={i} className="drill-card" style={{ background:'linear-gradient(135deg, rgba(141,89,255,0.07), rgba(13,16,23,0.8))', border:'1px solid rgba(141,89,255,0.18)', borderRadius:12, padding:'16px' }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:7 }}>{drill.name}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)', lineHeight:'152%', marginBottom:10 }}>{drill.description}</div>
                    <div style={{ fontSize:11, background:'rgba(141,89,255,0.15)', color:'#a78bfa', padding:'3px 9px', borderRadius:10, fontWeight:600, display:'inline-block', marginBottom:5 }}>⏱ {drill.duration}</div>
                    <div style={{ fontSize:11, color:'rgba(34,126,255,0.75)', fontStyle:'italic' }}>→ {drill.targets}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prediction + Coach */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div style={{ background:'rgba(34,126,255,0.06)', border:'1px solid rgba(34,126,255,0.2)', borderRadius:14, padding:'18px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}><span>📈</span><span style={{ fontSize:11, fontWeight:700, color:'#60a5fa', letterSpacing:'1px', textTransform:'uppercase' }}>3-Month Prediction</span></div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:'158%', margin:0 }}>{a.prediction}</p>
              </div>
              <div style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:14, padding:'18px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}><span>💬</span><span style={{ fontSize:11, fontWeight:700, color:'#fbbf24', letterSpacing:'1px', textTransform:'uppercase' }}>TPIP AI Coach Says</span></div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:'158%', margin:0, fontStyle:'italic' }}>"{a.coach_message}"</p>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)' }}>
                Generated {new Date(data.generated_at).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })} · {data.source === 'ai' ? 'AI-powered' : 'TPIP Analytics'}
              </div>
              <button onClick={runAnalysis} style={{ background:'rgba(141,89,255,0.12)', border:'1px solid rgba(141,89,255,0.3)', color:'#a78bfa', borderRadius:100, padding:'7px 18px', fontSize:12, fontWeight:600, cursor:'pointer' }}>↻ Re-analyse</button>
            </div>
          </div>

          {/* RIGHT — Chat */}
          {chatOpen && (
            <div style={{ background:'linear-gradient(180deg, #130a2a 0%, #0d1017 100%)', border:'1px solid rgba(141,89,255,0.3)', borderRadius:16, display:'flex', flexDirection:'column', height:700, position:'sticky', top:20, overflow:'hidden', animation:'slideIn 0.25s ease' }}>
              {/* Chat header */}
              <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(141,89,255,0.15)', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#8d59ff,#5b21b6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🤖</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>TPIP AI Coach</div>
                  <div style={{ fontSize:11, color:'rgba(141,89,255,0.7)' }}>
                    {limitReached ? '⛔ Daily limit reached' : dailyLimit === -1 ? '∞ Unlimited questions' : `${questionsLeft} questions left today`}
                  </div>
                </div>
                {/* Usage bar */}
                {dailyLimit > 0 && dailyLimit !== -1 && (
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
                    <div style={{ fontSize:10, color:MUTED }}>{questionsUsed}/{dailyLimit}</div>
                    <div style={{ width:60, height:4, background:'rgba(255,255,255,0.1)', borderRadius:2, overflow:'hidden' }}>
                      <div style={{ width:`${Math.min(100, (questionsUsed/dailyLimit)*100)}%`, height:'100%', background: questionsUsed/dailyLimit > 0.8 ? '#ef4444' : questionsUsed/dailyLimit > 0.5 ? '#f97316' : PURPLE, borderRadius:2 }} />
                    </div>
                  </div>
                )}
                <div style={{ width:8, height:8, borderRadius:'50%', background: limitReached ? '#ef4444' : '#22c55e', boxShadow:`0 0 6px ${limitReached ? '#ef4444' : '#22c55e'}` }} />
              </div>

              {/* Messages */}
              <div style={{ flex:1, overflowY:'auto', padding:'14px 12px', display:'flex', flexDirection:'column', gap:10 }}>
                {chatHistory.length === 0 && !limitReached && (
                  <div>
                    <div style={{ textAlign:'center', marginBottom:14 }}>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginBottom:10 }}>Ask TPIP AI about your performance</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                        {QUICK_QUESTIONS.map(q => (
                          <button key={q} onClick={() => { setChatInput(q); setTimeout(() => sendChat(), 50) }} className="quick-q"
                            style={{ background:'rgba(141,89,255,0.06)', border:'1px solid rgba(141,89,255,0.18)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'rgba(255,255,255,0.65)', textAlign:'left' }}>
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {chatHistory.map((msg, i) => (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', animation:'slideIn 0.2s ease' }}>
                    {msg.role === 'assistant' && (
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                        <div style={{ width:20, height:20, borderRadius:5, background:'linear-gradient(135deg,#8d59ff,#5b21b6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>🤖</div>
                        <span style={{ fontSize:10, color:'rgba(141,89,255,0.7)', fontWeight:600 }}>TPIP AI</span>
                      </div>
                    )}
                    <div style={{
                      maxWidth:'90%', padding:'10px 13px',
                      borderRadius: msg.role === 'user' ? '14px 14px 3px 14px' : '3px 14px 14px 14px',
                      background: msg.role === 'user' ? 'linear-gradient(135deg,#8d59ff,#5b21b6)' : 'rgba(255,255,255,0.06)',
                      border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      fontSize:13, color:'rgba(255,255,255,0.88)', lineHeight:'155%', whiteSpace:'pre-wrap',
                    }}>
                      {msg.content}
                    </div>
                    {/* YouTube suggestions */}
                    {msg.role === 'assistant' && msg.resources?.length > 0 && (
                      <div style={{ maxWidth:'90%', marginTop:6, display:'flex', flexDirection:'column', gap:5 }}>
                        <div style={{ fontSize:10, color:'rgba(239,68,68,0.6)', fontWeight:600, letterSpacing:'0.5px' }}>📹 SUGGESTED VIDEOS</div>
                        {msg.resources.map(r => (
                          <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="yt-chip"
                            style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, textDecoration:'none', transition:'all 0.15s' }}>
                            <span style={{ fontSize:14 }}>▶</span>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:12, fontWeight:600, color:'#fca5a5', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.title}</div>
                              <div style={{ fontSize:10, color:'rgba(252,165,165,0.5)' }}>{r.category}</div>
                            </div>
                            <span style={{ fontSize:10, color:'rgba(252,165,165,0.4)' }}>↗</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {chatLoading && (
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:20, height:20, borderRadius:5, background:'linear-gradient(135deg,#8d59ff,#5b21b6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>🤖</div>
                    <div style={{ display:'flex', gap:4, padding:'10px 13px', background:'rgba(255,255,255,0.06)', borderRadius:'3px 14px 14px 14px', border:'1px solid rgba(255,255,255,0.08)' }}>
                      {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:PURPLE, animation:`pulse 1s ease-in-out ${i*0.2}s infinite` }} />)}
                    </div>
                  </div>
                )}

                {chatError && (
                  <div style={{ fontSize:12, color:'#fca5a5', padding:'8px 12px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8 }}>{chatError}</div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Limit reached wall */}
              {limitReached ? (
                <div style={{ padding:'16px', borderTop:'1px solid rgba(141,89,255,0.15)', flexShrink:0 }}>
                  <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:10, padding:'14px', textAlign:'center' }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#fca5a5', marginBottom:4 }}>Daily limit reached ({packageName} plan)</div>
                    <div style={{ fontSize:12, color:'rgba(252,165,165,0.6)', marginBottom:12 }}>Resets at midnight. Upgrade for more questions.</div>
                    {upgradeOptions.length > 0 && (
                      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                        {upgradeOptions.map(pkg => (
                          <div key={pkg.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(141,89,255,0.1)', border:'1px solid rgba(141,89,255,0.25)', borderRadius:8, padding:'8px 12px' }}>
                            <div>
                              <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{pkg.name}</div>
                              <div style={{ fontSize:11, color:MUTED }}>{pkg.daily_limit === -1 ? 'Unlimited' : `${pkg.daily_limit} questions/day`}</div>
                            </div>
                            <div style={{ fontSize:12, fontWeight:700, color:'#a78bfa' }}>₹{pkg.price_inr?.toLocaleString('en-IN')}/mo</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={sendChat} style={{ padding:'10px 12px', borderTop:'1px solid rgba(141,89,255,0.15)', display:'flex', gap:8, flexShrink:0 }}>
                  <input
                    className="chat-input"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask about your sports performance…"
                    disabled={chatLoading}
                    style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'9px 13px', fontSize:13, color:'#fff', fontFamily:'inherit' }}
                  />
                  <button type="submit" disabled={chatLoading || !chatInput.trim()} style={{ width:38, height:38, borderRadius:10, background: chatInput.trim() ? 'linear-gradient(135deg,#8d59ff,#5b21b6)' : 'rgba(141,89,255,0.15)', border:'none', cursor: chatInput.trim() ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                    ↑
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
