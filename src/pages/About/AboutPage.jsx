import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const BG6   = '#0d1017'
const BG5   = '#11141d'
const BG14  = '#12161f'
const PURPLE= '#8d59ff'
const BLUE  = '#227eff'
const GREEN = '#09f647'
const LEMON = '#d0ff00'
const YELLOW= '#fff049'
const STR   = 'rgba(124,142,165,0.18)'

const TIMELINE = [
  { year:'2022', event:'TPIP Founded', desc:'Started with 3 coaches and 12 students in Chennai. First 1-on-1 online coaching sessions delivered via Zoom.' },
  { year:'2023', event:'100 Students', desc:'Reached 100 enrolled students. Introduced video submission and feedback system. First batch of NSDC certificates issued.' },
  { year:'2024', event:'LMS Platform Launch', desc:'Launched the full Learning Management System — student dashboard, coach portal, admin panel, progress tracking, and automated reports.' },
  { year:'2025', event:'128K+ Students', desc:'Expanded to 6 programs. Coaches with state and national sports backgrounds. 95% client satisfaction rate.' },
]

const VALUES = [
  { icon:'🎯', title:'Tactical, not just physical', color:PURPLE, desc:'We teach decision-making, match-up analysis, and game intelligence — not just drill repetition.' },
  { icon:'📊', title:'Data-driven development', color:BLUE, desc:'Every student has real numbers: movement speed, reaction speed, economy rate, success rate. Progress is measured, not assumed.' },
  { icon:'🎬', title:'Video as the core tool', color:GREEN, desc:'Frame-accurate coaching feedback on every clip. You see exactly what to fix, not just hear it.' },
  { icon:'🤝', title:'Embedded, not external', color:YELLOW, desc:'Your TPIP coach is your dedicated analyst, not a generic session trainer. They know your game inside out.' },
]

const STATS = [
  { end:95,   suffix:'%',   label:'Performance Gains',  sub:'Athletes who improved measurably',    color:'#adff2f' },
  { end:4.9,  suffix:'★',   label:'Average Rating',     sub:'Across all coaches & programs',       color:'#fff049', decimals:1 },
  { end:128,  suffix:'K+',  label:'Students Trained',   sub:'Athletes across all sports & levels', color:'#8d59ff' },
  { end:2020, suffix:'',    label:'Since',              sub:'5 years of building champions',        color:'#227eff', noCount:true },
]

function CountUp({ end, suffix, decimals = 0, noCount, color }) {
  const [display, setDisplay] = useState(noCount ? end : 0)
  const ref = useRef()
  const started = useRef(false)

  useEffect(() => {
    if (noCount) { setDisplay(end); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1800
        const startTime = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          setDisplay(parseFloat((ease * end).toFixed(decimals)))
          if (progress < 1) requestAnimationFrame(tick)
          else setDisplay(end)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, decimals, noCount])

  return (
    <span ref={ref} style={{ color }}>
      {noCount ? end : decimals ? display.toFixed(decimals) : Math.floor(display)}{suffix}
    </span>
  )
}

export default function AboutPage() {
  return (
    <div style={{ background:BG6, minHeight:'100vh', fontFamily:"'Inter',system-ui,sans-serif", color:'#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none;color:inherit}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
      `}</style>

      {/* Nav */}
      <nav style={{ padding:'20px 48px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${STR}`, position:'sticky', top:0, background:BG6, zIndex:100 }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${PURPLE},#5b21b6)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏏</div>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:15, color:'#fff' }}>TPIP Academy</span>
        </Link>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <Link to="/programs" style={{ fontSize:13, color:'rgba(255,255,255,0.5)', padding:'8px 16px', fontFamily:"'IBM Plex Mono',monospace" }}>Programs</Link>
          <Link to="/coaches" style={{ fontSize:13, color:'rgba(255,255,255,0.5)', padding:'8px 16px', fontFamily:"'IBM Plex Mono',monospace" }}>Coaches</Link>
          <Link to="/login" style={{ fontSize:13, color:'rgba(255,255,255,0.65)', padding:'8px 16px', border:`1px solid ${STR}`, borderRadius:100, fontFamily:"'IBM Plex Mono',monospace" }}>Login</Link>
          <Link to="/register" style={{ fontSize:13, color:'#000', background:'#f8f9fa', padding:'9px 20px', borderRadius:100, fontWeight:600 }}>Enroll Now</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding:'100px 48px 80px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`rgba(141,89,255,0.1)`, border:`1px solid rgba(141,89,255,0.25)`, borderRadius:100, padding:'5px 16px', marginBottom:24, fontSize:11, color:'rgba(255,255,255,0.55)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1.5px' }}>
              FOUNDED 2022 · CHENNAI, INDIA
            </div>
            <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(32px,4.5vw,58px)', fontWeight:400, letterSpacing:'-2px', lineHeight:'110%', marginBottom:24 }}>
              <span style={{ background:'linear-gradient(90deg,#c4b5fd,#93c5fd,#c4b5fd)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>We don't sell classes.</span><br />
              <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.28)' }}>We build champions.</em>
            </h1>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.45)', lineHeight:'170%', marginBottom:24 }}>
              TPIP was built on one belief: modern sport is not won by talent alone. It is won by structured coaching, tactical intelligence, and real-time data feedback.
            </p>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.35)', lineHeight:'170%', marginBottom:36 }}>
              We set out to give every serious athlete across India — regardless of academy access — the same quality of coaching that state and national players receive.
            </p>
            <div style={{ display:'flex', gap:12 }}>
              <Link to="/register" style={{ background:PURPLE, color:'#fff', padding:'12px 24px', borderRadius:100, fontSize:13, fontWeight:600, boxShadow:`0 4px 20px ${PURPLE}44` }}>Start your journey →</Link>
              <Link to="/programs" style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.7)', padding:'12px 24px', borderRadius:100, fontSize:13, fontWeight:600, border:`1px solid ${STR}` }}>View programs</Link>
            </div>
          </div>
          <div style={{ position:'relative' }}>
            <div style={{ borderRadius:20, overflow:'hidden', aspectRatio:'3/4', position:'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80"
                alt="Sports coaching"
                style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}
              />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(13,16,23,0.4) 0%, transparent 50%)' }} />
            </div>
            {/* Floating stats */}
            <div style={{ position:'absolute', bottom:-20, left:-20, background:'rgba(13,16,23,0.92)', backdropFilter:'blur(20px)', border:`1px solid ${STR}`, borderRadius:16, padding:'20px 24px' }}>
              <div style={{ fontSize:32, fontWeight:700, fontFamily:"'Sora',sans-serif", letterSpacing:'-1px', color:'#adff2f' }}>128K+</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Athletes trained since 2020</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background:BG5, borderTop:`1px solid ${STR}`, padding:'80px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div style={{ fontSize:11, fontFamily:"'IBM Plex Mono',monospace", color:'rgba(255,255,255,0.3)', letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Our Impact</div>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(22px,3vw,36px)', fontWeight:400, letterSpacing:'-1.5px', color:'#fff' }}>
              <span style={{ background:'linear-gradient(90deg,#c4b5fd,#93c5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Our coaching</span>{' '}
              <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.3)' }}>in numbers</em>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ textAlign:'center', padding:'32px 16px', background:BG14, border:`1px solid ${STR}`, borderRadius:20, animation:`fadeUp 0.5s ease ${i*0.1}s both`, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(36px,4vw,54px)', fontWeight:400, letterSpacing:'-2px', marginBottom:10 }}>
                  <CountUp end={s.end} suffix={s.suffix} decimals={s.decimals} noCount={s.noCount} color={s.color} />
                </div>
                <div style={{ fontSize:15, fontWeight:600, color:'rgba(255,255,255,0.8)', marginBottom:6 }}>{s.label}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', lineHeight:'150%' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission statement */}
      <section style={{ padding:'100px 48px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
          <div style={{ borderRadius:16, overflow:'hidden', aspectRatio:'16/10', position:'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1540747913346-19212a4b733e?w=900&q=80"
              alt="Sports analytics"
              style={{ width:'100%', height:'100%', objectFit:'cover' }}
            />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(13,16,23,0.8) 0%, transparent 60%)' }} />
            <div style={{ position:'absolute', bottom:24, left:24, right:24 }}>
              <p style={{ fontSize:16, color:'#fff', fontStyle:'italic', lineHeight:'155%', fontFamily:"'Sora',sans-serif", fontWeight:400 }}>
                "Modern sport is not won by talent alone. Margins are razor thin. One wrong decision. One delayed move. That is the difference between qualification and elimination."
              </p>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:10 }}>— The principle behind TPIP</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, fontFamily:"'IBM Plex Mono',monospace", color:PURPLE, letterSpacing:'2px', marginBottom:16, textTransform:'uppercase' }}>Our mission</div>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(24px,3vw,38px)', fontWeight:400, letterSpacing:'-1.5px', color:'#fff', lineHeight:'115%', marginBottom:24 }}>
              Making elite-level coaching<br />
              <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.3)' }}>accessible to every athlete.</em>
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)', lineHeight:'170%', marginBottom:20 }}>
              State and national players get dedicated analysts, video intelligence systems, and tactical war rooms. Club athletes don't. We're changing that.
            </p>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.35)', lineHeight:'170%', marginBottom:32 }}>
              Every TPIP student gets a personal coach, frame-accurate video feedback, monthly development reports, and tactical coaching — the same system used by professional teams.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {['Embedded coaching — your coach knows your game inside out','Tactical intelligence, not just drills','Data feedback every month, not just at the end','NSDC certification for every program completer'].map(point => (
                <div key={point} style={{ display:'flex', gap:12, alignItems:'center', fontSize:14, color:'rgba(255,255,255,0.6)' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7.5" stroke={PURPLE} strokeOpacity="0.4"/><path d="M5 8l2 2 4-4" stroke={PURPLE} strokeWidth="1.5" strokeLinecap="round"/></svg>
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our values */}
      <section style={{ background:BG5, borderTop:`1px solid ${STR}`, padding:'100px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(26px,3.5vw,40px)', fontWeight:400, letterSpacing:'-1.5px', color:'#fff', marginBottom:12 }}>
              <span style={{ background:'linear-gradient(90deg,#c4b5fd,#93c5fd,#c4b5fd)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>What we stand for</span>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {VALUES.map((v, i) => (
              <div key={v.title} style={{ background:BG14, border:`1px solid ${STR}`, borderRadius:16, padding:'28px 24px', animation:`fadeUp 0.5s ease ${i*0.1}s both` }}>
                <div style={{ fontSize:32, marginBottom:16 }}>{v.icon}</div>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:600, color:'#fff', marginBottom:12, lineHeight:'130%' }}>{v.title}</h3>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:'160%' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding:'100px 48px', maxWidth:900, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:60 }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(26px,3.5vw,40px)', fontWeight:400, letterSpacing:'-1.5px', color:'#fff', marginBottom:12 }}>
            Our journey
          </h2>
        </div>
        <div style={{ position:'relative' }}>
          {/* Vertical line */}
          <div style={{ position:'absolute', left:79, top:0, bottom:0, width:1, background:`linear-gradient(to bottom, ${PURPLE}44, ${BLUE}44, transparent)` }} />
          <div style={{ display:'flex', flexDirection:'column', gap:40 }}>
            {TIMELINE.map((item, i) => (
              <div key={item.year} style={{ display:'flex', gap:32, alignItems:'flex-start', animation:`fadeUp 0.5s ease ${i*0.1}s both` }}>
                <div style={{ width:80, textAlign:'right', flexShrink:0 }}>
                  <span style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:700, color:PURPLE }}>{item.year}</span>
                </div>
                <div style={{ width:16, height:16, borderRadius:'50%', background:`linear-gradient(135deg,${PURPLE},${BLUE})`, flexShrink:0, marginTop:3, boxShadow:`0 0 12px ${PURPLE}66` }} />
                <div>
                  <div style={{ fontSize:16, fontWeight:600, color:'#fff', marginBottom:6, fontFamily:"'Sora',sans-serif" }}>{item.event}</div>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', lineHeight:'160%' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:BG5, borderTop:`1px solid ${STR}`, padding:'80px 48px', textAlign:'center' }}>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(24px,3.5vw,40px)', fontWeight:400, letterSpacing:'-1.5px', color:'#fff', marginBottom:16 }}>
          Be part of the TPIP story.
        </h2>
        <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', maxWidth:400, margin:'0 auto 32px', lineHeight:'160%' }}>
          Join 128K+ athletes already improving with real coaching, real feedback, and real data.
        </p>
        <div style={{ display:'flex', gap:16, justifyContent:'center' }}>
          <Link to="/register" style={{ background:PURPLE, color:'#fff', padding:'13px 28px', borderRadius:100, fontSize:14, fontWeight:600, boxShadow:`0 4px 24px ${PURPLE}55` }}>Enroll Now →</Link>
          <Link to="/coaches" style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.7)', padding:'13px 28px', borderRadius:100, fontSize:14, fontWeight:600, border:`1px solid ${STR}` }}>Meet our Coaches</Link>
        </div>
      </section>
    </div>
  )
}
