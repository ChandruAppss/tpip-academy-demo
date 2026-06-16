import { useState } from 'react'
import { Link } from 'react-router-dom'

const BG6   = '#0d1017'
const BG5   = '#11141d'
const BG14  = '#12161f'
const PURPLE= '#8d59ff'
const BLUE  = '#227eff'
const LEMON = '#d0ff00'
const GREEN = '#09f647'
const YELLOW= '#fff049'
const STR   = 'rgba(124,142,165,0.18)'

const PROGRAMS = [
  {
    slug:'performance-fundamentals',
    title:'Batting Fundamentals',
    role:'Batting',
    icon:'🏏',
    color:PURPLE,
    img:'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    duration:'6 months',
    sessions:24,
    price:'₹16,600',
    level:'Beginner – Intermediate',
    desc:'Master the core performance techniques. Cover drive, pull shot, footwork, and shot selection — all with video analysis after every session.',
    features:[
      '24 live 1-on-1 coaching sessions',
      'Weekly video feedback & frame analysis',
      'Batting biomechanics breakdown',
      'Shot selection & footwork drills',
      'Monthly personal development report',
      'Progress dashboard with real stats',
      'NSDC Certificate on completion',
    ],
    outcomes:['Batting average improvement by 40%+','Shot selection accuracy +60%','State-level competition readiness'],
  },
  {
    slug:'elite-performance-program',
    title:'Elite Performance Program',
    role:'Batting',
    icon:'⚡',
    color:YELLOW,
    img:'https://images.unsplash.com/photo-1540747913346-19212a4b733e?w=800&q=80',
    duration:'6 months',
    sessions:36,
    price:'₹24,900',
    level:'Advanced',
    popular:true,
    desc:'Advanced program for serious athletes eyeing state or national selection. AI video analysis, tactical coaching, and opposition match-up preparation.',
    features:[
      '36 live 1-on-1 coaching sessions',
      'AI video & biomechanics analysis',
      '1-on-1 tactical coaching calls',
      'Custom training & game plans',
      'Opposition match-up analysis',
      'Priority video feedback within 6hrs',
      'Monthly personal development report',
      'NSDC Certificate on completion',
    ],
    outcomes:['Avg improvement from 24 to 60+','State team selection readiness','T20 strike rate optimised'],
  },
  {
    slug:'speed-agility-elite',
    title:'Fast Bowling Elite',
    role:'Bowling',
    icon:'🎯',
    color:BLUE,
    img:'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80',
    duration:'6 months',
    sessions:null,
    price:'₹20,750',
    level:'Intermediate – Advanced',
    desc:'Develop genuine pace, swing, and seam movement. From run-up biomechanics to yorker execution — built by former first-class players.',
    features:[
      'Live coach-led training sessions',
      'Pace & swing mechanics analysis',
      'Line & length control drills',
      'Biomechanics video feedback',
      'Fitness & conditioning plans',
      'Wrist position & seam training',
      'Monthly performance report',
      'NSDC Certificate on completion',
    ],
    outcomes:['Ball speed +20-30 km/h in 6 months','Economy rate drop by 30-40%','Swing mastery in all conditions'],
  },
  {
    slug:'agility-specialist-program',
    title:'Wicketkeeper Program',
    role:'Fielding',
    icon:'🧤',
    color:GREEN,
    img:'https://images.unsplash.com/photo-1578836537282-3171d77f8632?w=800&q=80',
    duration:'6 months',
    sessions:null,
    price:'₹18,250',
    level:'All levels',
    desc:'Specialised agility program covering positioning, footwork, reaction training, and sport-specific fitness. Designed by national-level coaches.',
    features:[
      'Glove work & footwork drills',
      'Live session coaching via Zoom',
      'Video analysis of keeping stance',
      'Stumping speed & reflex training',
      'Fitness & agility plans',
      'Catching geometry techniques',
      'Monthly personal report',
      'NSDC Certificate on completion',
    ],
    outcomes:['Stumping rate +50%','Catch success rate 85%+','Keeper-batter combination skills'],
  },
  {
    slug:'junior-allrounder',
    title:'Junior Allrounder',
    role:'All-round',
    icon:'🏆',
    color:LEMON,
    img:'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    duration:'6 months',
    sessions:null,
    price:'₹14,900',
    level:'Under-19',
    desc:'Comprehensive program for young athletes across multiple sports disciplines. Technique, speed, agility drills, and mental conditioning — all in one plan.',
    features:[
      'Technique & speed coaching',
      'Fielding & agility drills',
      'Mental conditioning sessions',
      'Progress reports every month',
      'School & club sports preparation',
      'Selection panel readiness',
      'NSDC Certificate on completion',
    ],
    outcomes:['U-19 state selection readiness','Complete skill development','Mental game foundations'],
  },
  {
    slug:'academy-group-plan',
    title:'Academy Group Plan',
    role:'Academy',
    icon:'🎓',
    color:PURPLE,
    img:'https://images.unsplash.com/photo-1540747913346-19212a4b733e?w=800&q=80',
    duration:'6 months',
    sessions:null,
    price:'Custom',
    level:'Up to 30 students',
    desc:'Bulk coaching plan for academies and clubs. Dedicated admin dashboard, group session scheduling, and custom curriculum design for your team.',
    features:[
      'Up to 30 students per batch',
      'Dedicated academy admin dashboard',
      'Custom session scheduling',
      'Group video analysis sessions',
      'Tournament preparation coaching',
      'Individual progress reports per student',
      'Custom pricing based on batch size',
    ],
    outcomes:['Team-wide improvement tracking','Tournament win rate improvement','Academy-level NSDC certification'],
  },
]

const ROLES = ['All', 'Batting', 'Bowling', 'Fielding', 'All-round', 'Academy']

export default function ProgramsPage() {
  const [activeRole, setActiveRole] = useState('All')
  const filtered = activeRole === 'All' ? PROGRAMS : PROGRAMS.filter(p => p.role === activeRole)

  return (
    <div style={{ background:BG6, minHeight:'100vh', fontFamily:"'Inter',system-ui,sans-serif", color:'#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none;color:inherit}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        .prog-card{transition:all 0.25s;cursor:default}
        .prog-card:hover{transform:translateY(-5px);box-shadow:0 20px 60px rgba(0,0,0,0.4)!important}
      `}</style>

      {/* Nav */}
      <nav style={{ padding:'20px 48px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${STR}`, position:'sticky', top:0, background:BG6, zIndex:100, backdropFilter:'blur(20px)' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${PURPLE},#5b21b6)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏏</div>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:15, color:'#fff' }}>TPIP Academy</span>
        </Link>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <Link to="/coaches" style={{ fontSize:13, color:'rgba(255,255,255,0.5)', padding:'8px 16px', fontFamily:"'IBM Plex Mono',monospace" }}>Coaches</Link>
          <Link to="/about" style={{ fontSize:13, color:'rgba(255,255,255,0.5)', padding:'8px 16px', fontFamily:"'IBM Plex Mono',monospace" }}>About</Link>
          <Link to="/login" style={{ fontSize:13, color:'rgba(255,255,255,0.65)', padding:'8px 16px', border:`1px solid ${STR}`, borderRadius:100, fontFamily:"'IBM Plex Mono',monospace" }}>Login</Link>
          <Link to="/register" style={{ fontSize:13, color:'#000', background:'#f8f9fa', padding:'9px 20px', borderRadius:100, fontWeight:600 }}>Enroll Now</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding:'80px 48px 60px', maxWidth:1100, margin:'0 auto', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`rgba(141,89,255,0.1)`, border:`1px solid rgba(141,89,255,0.25)`, borderRadius:100, padding:'5px 16px', marginBottom:24, fontSize:11, color:'rgba(255,255,255,0.55)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1.5px' }}>
          6 PROGRAMS · ALL LEVELS
        </div>
        <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(32px,5vw,64px)', fontWeight:400, letterSpacing:'-2px', lineHeight:'108%', marginBottom:20 }}>
          <span style={{ background:'linear-gradient(90deg,#c4b5fd,#93c5fd,#c4b5fd)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'shimmer 4s linear infinite' }}>Find your program.</span><br />
          <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.28)' }}>Start your development.</em>
        </h1>
        <p style={{ fontSize:16, color:'rgba(255,255,255,0.4)', maxWidth:480, margin:'0 auto 40px', lineHeight:'160%' }}>
          Every TPIP program includes live 1-on-1 coaching, video analysis, a personal development report, and an NSDC certificate.
        </p>

        {/* Filter tabs */}
        <div style={{ display:'inline-flex', gap:4, background:'rgba(255,255,255,0.04)', border:`1px solid ${STR}`, borderRadius:100, padding:4 }}>
          {ROLES.map(r => (
            <button key={r} onClick={() => setActiveRole(r)} style={{
              padding:'8px 20px', borderRadius:100, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
              background:activeRole===r ? PURPLE : 'transparent',
              color:activeRole===r ? '#fff' : 'rgba(255,255,255,0.45)',
              transition:'all 0.2s', fontFamily:"inherit",
            }}>{r}</button>
          ))}
        </div>
      </section>

      {/* Programs grid */}
      <section style={{ padding:'0 48px 100px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {filtered.map((prog, i) => (
            <div key={prog.slug} className="prog-card" style={{
              background:BG14, border:`1px solid ${STR}`, borderRadius:16, overflow:'hidden',
              animation:`fadeUp 0.5s ease ${i*0.08}s both`,
              position:'relative',
            }}>
              {prog.popular && (
                <div style={{ position:'absolute', top:16, right:16, zIndex:5, background:PURPLE, color:'#fff', fontSize:10, fontWeight:700, padding:'4px 12px', borderRadius:100, letterSpacing:'1px' }}>
                  MOST POPULAR
                </div>
              )}
              {/* Image */}
              <div style={{ height:180, overflow:'hidden', position:'relative' }}>
                <img src={prog.img} alt={prog.title} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, ${BG14} 0%, transparent 60%)` }} />
                <div style={{ position:'absolute', bottom:14, left:16, display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:22 }}>{prog.icon}</span>
                  <span style={{ fontSize:11, fontWeight:600, color:`${prog.color}`, background:`${prog.color}18`, border:`1px solid ${prog.color}44`, borderRadius:100, padding:'3px 10px', fontFamily:"'IBM Plex Mono',monospace" }}>{prog.role}</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding:'20px 22px 24px' }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:6, fontFamily:"'IBM Plex Mono',monospace" }}>{prog.level}</div>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:600, color:'#fff', marginBottom:8, lineHeight:'120%' }}>{prog.title}</h3>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:'155%', marginBottom:18 }}>{prog.desc}</p>

                {/* Features */}
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
                  {prog.features.slice(0,4).map(f => (
                    <div key={f} style={{ display:'flex', gap:10, alignItems:'center', fontSize:12, color:'rgba(255,255,255,0.6)' }}>
                      <div style={{ width:16, height:16, borderRadius:'50%', background:`${prog.color}18`, border:`1px solid ${prog.color}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l1.5 1.5 3.5-3.5" stroke={prog.color} strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                      {f}
                    </div>
                  ))}
                  {prog.features.length > 4 && <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', paddingLeft:26 }}>+{prog.features.length - 4} more included</div>}
                </div>

                {/* Price + CTA */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:16, borderTop:`1px solid ${STR}` }}>
                  <div>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>{prog.price}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{prog.duration}{prog.sessions ? ` · ${prog.sessions} sessions` : ''}</div>
                  </div>
                  <Link to="/register" style={{
                    background:prog.popular ? PURPLE : 'rgba(255,255,255,0.08)',
                    color:'#fff', borderRadius:100, padding:'9px 20px',
                    fontSize:13, fontWeight:600, border:`1px solid ${prog.popular ? PURPLE : STR}`,
                    transition:'all 0.2s',
                    boxShadow:prog.popular ? `0 4px 20px ${PURPLE}44` : 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background=PURPLE; e.currentTarget.style.boxShadow=`0 4px 20px ${PURPLE}55` }}
                  onMouseLeave={e => { e.currentTarget.style.background=prog.popular ? PURPLE : 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow=prog.popular ? `0 4px 20px ${PURPLE}44` : 'none' }}>
                    Enroll →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background:BG5, borderTop:`1px solid ${STR}`, padding:'80px 48px', textAlign:'center' }}>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(24px,3.5vw,40px)', fontWeight:400, letterSpacing:'-1.5px', color:'#fff', marginBottom:16 }}>
          Not sure which program?
        </h2>
        <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', marginBottom:32, maxWidth:400, margin:'0 auto 32px' }}>
          Talk to a coach. We'll recommend the right program based on your current level and goals.
        </p>
        <div style={{ display:'flex', gap:16, justifyContent:'center' }}>
          <Link to="/register" style={{ background:PURPLE, color:'#fff', padding:'13px 28px', borderRadius:100, fontSize:14, fontWeight:600, boxShadow:`0 4px 24px ${PURPLE}55` }}>Start Free Assessment →</Link>
          <Link to="/coaches" style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.7)', padding:'13px 28px', borderRadius:100, fontSize:14, fontWeight:600, border:`1px solid ${STR}` }}>Meet the Coaches</Link>
        </div>
      </section>
    </div>
  )
}
