import { Link } from 'react-router-dom'
import { useState } from 'react'

const BG6   = '#0d1017'
const BG5   = '#11141d'
const BG14  = '#12161f'
const PURPLE= '#8d59ff'
const BLUE  = '#227eff'
const GREEN = '#09f647'
const LEMON = '#d0ff00'
const STR   = 'rgba(124,142,165,0.18)'

const COACHES = [
  {
    name:'Rahul Kumar',
    role:'Speed & Agility Coach',
    badge:'Level 3 Certified · 12 yrs',
    sport:'Athletics',
    exp:'12 years',
    students:48,
    rating:'4.9',
    color:BLUE,
    bio:'Former state-level sprinter. Specialises in run-up biomechanics, sprint mechanics, and explosive power development. Athletes under Rahul average 18% speed improvement within 4 months.',
    specialties:['Sprint biomechanics','Explosive power training','Agility ladder drills','Reaction time improvement'],
    programs:['Speed & Agility Elite'],
    achievements:['TN State Athletics Team (2009–2016)','National Games participant','Avg. +18% speed improvement'],
  },
  {
    name:'Vikram Singh',
    role:'Performance Specialist',
    badge:'Former State Player · 9 yrs',
    sport:'Football',
    exp:'9 years',
    students:34,
    rating:'4.8',
    color:PURPLE,
    bio:'Former state-level football player. Focuses on tactical positioning, endurance, and explosive speed development. His students average a 40% performance improvement within 6 months.',
    specialties:['Tactical positioning','Endurance training','Explosive speed','Set-piece execution'],
    programs:['Football Performance','Elite Athlete Program'],
    achievements:['TN State Football Team (2011–2018)','District U-23 Champion','NSDC Certified Trainer'],
  },
  {
    name:'Priya Nair',
    role:'Agility & Fitness Coach',
    badge:'Nationally Certified · 7 yrs',
    sport:'Multi-Sport',
    exp:'7 years',
    students:29,
    rating:'4.9',
    color:GREEN,
    bio:'Nationally certified agility & fitness coach and former national-level athlete. Specialises in sport-specific conditioning, reflex training, and field positioning across multiple disciplines.',
    specialties:['Reflex & reaction training','Field positioning','Sport-specific fitness','Agility circuit design'],
    programs:['Allrounder Fitness','Junior Development'],
    achievements:['TN State Team','National Sports Certification','Avg. 85%+ student success rate'],
  },
  {
    name:'Arjun Mehta',
    role:'Tennis Performance Coach',
    badge:'ITF Certified · 10 yrs',
    sport:'Tennis',
    exp:'10 years',
    students:41,
    rating:'4.7',
    color:LEMON,
    bio:'ITF-certified coach with a decade coaching junior and senior players. Specialises in serve mechanics, baseline consistency, and mental toughness under pressure.',
    specialties:['Serve mechanics & power','Baseline rally consistency','Return of serve strategy','Mental resilience training'],
    programs:['Tennis Foundations','Advanced Match Play'],
    achievements:['ITF Level 2 Coach','Produced 3 national-ranked juniors','AITA registered trainer'],
  },
  {
    name:'Sneha Rao',
    role:'Badminton Technique Coach',
    badge:'BAI Certified · 8 yrs',
    sport:'Badminton',
    exp:'8 years',
    students:52,
    rating:'4.9',
    color:'#f97316',
    bio:'Former national-level badminton player and BAI certified coach. Known for her footwork drills and smash technique programs that have produced 5 state-ranked players.',
    specialties:['Footwork patterns','Smash & net kill technique','Singles vs doubles strategy','Court coverage drills'],
    programs:['Badminton Fundamentals','Smash Masterclass'],
    achievements:['National Circuit participant','BAI Level 2 Certified','5 state-ranked students'],
  },
  {
    name:'Karan Bose',
    role:'Swimming & Endurance Coach',
    badge:'FINA Certified · 11 yrs',
    sport:'Swimming',
    exp:'11 years',
    students:37,
    rating:'4.8',
    color:'#22d3ee',
    bio:'FINA-certified swimming coach specialising in freestyle and butterfly stroke mechanics. Has trained junior swimmers who went on to compete at national championships.',
    specialties:['Stroke technique & efficiency','Flip turn mechanics','Open water conditioning','Endurance periodisation'],
    programs:['Swim Technique Clinic','Endurance Builder'],
    achievements:['FINA Level 2 Certified','3 national championship qualifiers','SAI empanelled coach'],
  },
]

const HOW_WE_COACH = [
  {
    icon:'📅',
    title:'Live 1-on-1 Sessions',
    color:PURPLE,
    desc:'Every coach session is a real-time Zoom call. Not a recording. Your coach watches you bat, bowl, or field live — and corrects in the moment.',
    points:['Screen-share your practice clips','Real-time correction & feedback','Session notes sent afterwards'],
  },
  {
    icon:'📹',
    title:'Video Review System',
    color:BLUE,
    desc:'Upload practice clips to your dashboard after sessions. Your coach watches them, adds timestamped comments, and sends back a correction video within 24 hours.',
    points:['Frame-accurate coaching notes','Timestamped corrections','Side-by-side technique comparison'],
  },
  {
    icon:'📊',
    title:'Monthly Dev Report',
    color:GREEN,
    desc:'Every month, your coach sends a personal development report. It covers your technical tendencies, numbers, what improved, and an improvement roadmap for the next month.',
    points:['Technical tendency analysis','Performance numbers tracked','Next-month improvement roadmap'],
  },
]

export default function CoachesPage() {
  const [openId, setOpenId] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const toggle = (name) => setOpenId(prev => prev === name ? null : name)

  const SPORTS = ['All', ...Array.from(new Set(COACHES.map(c => c.sport)))]
  const filtered = activeFilter === 'All' ? COACHES : COACHES.filter(c => c.sport === activeFilter)

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
          <Link to="/about" style={{ fontSize:13, color:'rgba(255,255,255,0.5)', padding:'8px 16px', fontFamily:"'IBM Plex Mono',monospace" }}>About</Link>
          <Link to="/login" style={{ fontSize:13, color:'rgba(255,255,255,0.65)', padding:'8px 16px', border:`1px solid ${STR}`, borderRadius:100, fontFamily:"'IBM Plex Mono',monospace" }}>Login</Link>
          <Link to="/register" style={{ fontSize:13, color:'#000', background:'#f8f9fa', padding:'9px 20px', borderRadius:100, fontWeight:600 }}>Enroll Now</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding:'80px 48px 60px', maxWidth:1100, margin:'0 auto', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`rgba(141,89,255,0.1)`, border:`1px solid rgba(141,89,255,0.25)`, borderRadius:100, padding:'5px 16px', marginBottom:24, fontSize:11, color:'rgba(255,255,255,0.55)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1.5px' }}>
          NATIONALLY CERTIFIED · FORMER STATE & NATIONAL PLAYERS
        </div>
        <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(32px,5vw,64px)', fontWeight:400, letterSpacing:'-2px', lineHeight:'108%', marginBottom:20 }}>
          <span style={{ background:'linear-gradient(90deg,#c4b5fd,#93c5fd,#c4b5fd)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Learn from coaches</span><br />
          <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.28)' }}>who've played the game.</em>
        </h1>
        <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', maxWidth:520, margin:'0 auto', lineHeight:'160%' }}>
          Every TPIP coach is Certified, has played at state or national level, and is trained in video analysis and player development reporting.
        </p>
      </section>

      {/* Coach list — expandable rows */}
      <section style={{ padding:'0 48px 80px', maxWidth:1100, margin:'0 auto' }}>
        <style>{`
          .coach-row-item { transition: background 0.15s; cursor: pointer; }
          .coach-row-item:hover { background: rgba(255,255,255,0.03) !important; }
          .coach-expand { overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease; }
          .chevron-icon { transition: transform 0.25s ease; }
          .filter-pill { cursor: pointer; transition: all 0.15s ease; border: 1px solid; border-radius: 100px; padding: 6px 18px; font-size: 13px; font-family: 'IBM Plex Mono', monospace; font-weight: 500; white-space: nowrap; }
          .coach-list-scroll::-webkit-scrollbar { width: 4px; }
          .coach-list-scroll::-webkit-scrollbar-track { background: transparent; }
          .coach-list-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        `}</style>

        {/* Filter pills */}
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1px', marginRight:4 }}>FILTER BY SPORT</span>
          {SPORTS.map(sport => {
            const isActive = activeFilter === sport
            return (
              <button
                key={sport}
                className="filter-pill"
                onClick={() => { setActiveFilter(sport); setOpenId(null) }}
                style={{
                  background: isActive ? PURPLE : 'transparent',
                  borderColor: isActive ? PURPLE : STR,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                }}
              >{sport}</button>
            )
          })}
          <span style={{ marginLeft:'auto', fontSize:12, color:'rgba(255,255,255,0.2)', fontFamily:"'IBM Plex Mono',monospace" }}>
            {filtered.length} coach{filtered.length !== 1 ? 'es' : ''}
          </span>
        </div>

        {/* Table header */}
        <div style={{ display:'grid', gridTemplateColumns:'40px 52px 1fr 160px 100px 80px 36px', alignItems:'center', gap:14, padding:'10px 20px', marginBottom:4, borderRadius:10, background:'rgba(255,255,255,0.02)', border:`1px solid ${STR}` }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.2)', fontFamily:"'IBM Plex Mono',monospace" }}>#</span>
          <span></span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1px' }}>COACH</span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1px' }}>SPORT</span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1px' }}>RATING</span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1px' }}>EXP.</span>
          <span></span>
        </div>

        {/* Scrollable rows container */}
        <div className="coach-list-scroll" style={{ border:`1px solid ${STR}`, borderRadius:16, overflow:'hidden', background:BG14, maxHeight:520, overflowY:'auto' }}>
          {filtered.length === 0 && (
            <div style={{ padding:'60px 20px', textAlign:'center', color:'rgba(255,255,255,0.2)', fontSize:14 }}>No coaches found for this sport.</div>
          )}
          {filtered.map((coach, i) => {
            const isOpen = openId === coach.name
            const initials = coach.name.split(' ').map(w => w[0]).join('')
            return (
              <div key={coach.name} style={{ borderBottom: i < filtered.length-1 ? `1px solid ${STR}` : 'none' }}>
                {/* Row */}
                <div
                  className="coach-row-item"
                  onClick={() => toggle(coach.name)}
                  style={{ display:'grid', gridTemplateColumns:'40px 52px 1fr 160px 100px 80px 36px', alignItems:'center', gap:14, padding:'16px 20px', background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                >
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.2)', fontWeight:600, fontFamily:"'IBM Plex Mono',monospace" }}>0{i+1}</span>

                  {/* Avatar */}
                  <div style={{ width:44, height:44, borderRadius:'50%', background:`${coach.color}22`, border:`1.5px solid ${coach.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:coach.color, fontFamily:"'IBM Plex Mono',monospace", flexShrink:0 }}>
                    {initials}
                  </div>

                  {/* Name + role */}
                  <div>
                    <div style={{ fontSize:15, fontWeight:600, color:'#fff', fontFamily:"'Sora',sans-serif", marginBottom:2 }}>{coach.name}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>{coach.role}</div>
                  </div>

                  {/* Sport badge */}
                  <div>
                    <span style={{ fontSize:12, background:`${coach.color}18`, border:`1px solid ${coach.color}33`, color:coach.color, padding:'4px 14px', borderRadius:100, fontFamily:"'IBM Plex Mono',monospace", fontWeight:500 }}>
                      {coach.sport}
                    </span>
                  </div>

                  {/* Rating */}
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ fontSize:15, fontWeight:600, color:'#fff', fontFamily:"'Sora',sans-serif" }}>{coach.rating}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="#f59e0b"><path d="M7 1l1.5 3.5L12 5l-2.5 2.5.6 3.5L7 9.5l-3.1 1.5.6-3.5L2 5l3.5-.5z"/></svg>
                  </div>

                  {/* Exp */}
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.45)' }}>{coach.exp}</span>

                  {/* Chevron */}
                  <svg className="chevron-icon" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', color:'rgba(255,255,255,0.3)' }} width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Expanded detail */}
                <div className="coach-expand" style={{ maxHeight: isOpen ? 500 : 0, opacity: isOpen ? 1 : 0 }}>
                  <div style={{ padding:'24px 20px 28px 116px', borderTop:`1px solid ${STR}`, background:'rgba(0,0,0,0.2)' }}>
                    <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)', lineHeight:'165%', marginBottom:20, maxWidth:600 }}>{coach.bio}</p>

                    {/* Specialties */}
                    <div style={{ marginBottom:20 }}>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1px', marginBottom:10 }}>SPECIALITIES</div>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                        {coach.specialties.map(s => (
                          <span key={s} style={{ fontSize:12, border:`1px solid ${STR}`, borderRadius:100, padding:'4px 14px', color:'rgba(255,255,255,0.5)' }}>{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div style={{ marginBottom:24 }}>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1px', marginBottom:10 }}>ACHIEVEMENTS</div>
                      <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                        {coach.achievements.map(a => (
                          <div key={a} style={{ display:'flex', gap:7, alignItems:'center', fontSize:13, color:'rgba(255,255,255,0.5)' }}>
                            <span style={{ width:5, height:5, borderRadius:'50%', background:'#facc15', flexShrink:0 }} />{a}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats row + CTA */}
                    <div style={{ display:'flex', alignItems:'center', gap:32 }}>
                      {[[coach.students,'Students'],[coach.exp,'Experience'],[coach.rating+'★','Rating']].map(([v,l]) => (
                        <div key={l}>
                          <div style={{ fontSize:20, fontWeight:700, color:coach.color, fontFamily:"'Sora',sans-serif" }}>{v}</div>
                          <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:2 }}>{l}</div>
                        </div>
                      ))}
                      <Link to="/register" style={{ marginLeft:'auto', background:PURPLE, color:'#fff', padding:'11px 24px', borderRadius:100, fontSize:13, fontWeight:600, boxShadow:`0 4px 20px ${PURPLE}44`, whiteSpace:'nowrap' }}>
                        Book a session →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* How we coach */}
      <section style={{ background:BG5, borderTop:`1px solid ${STR}`, padding:'100px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(26px,3.5vw,40px)', fontWeight:400, letterSpacing:'-1.5px', color:'#fff', marginBottom:14 }}>
              <span style={{ background:'linear-gradient(90deg,#c4b5fd,#93c5fd,#c4b5fd)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>How TPIP coaches</span><br />
              <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.22)' }}>actually work</em>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {HOW_WE_COACH.map((item) => (
              <div key={item.title} style={{ background:BG14, border:`1px solid ${STR}`, borderRadius:16, padding:'32px 28px' }}>
                <div style={{ width:52, height:52, borderRadius:12, background:`${item.color}14`, border:`1px solid ${item.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:20 }}>{item.icon}</div>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:600, color:'#fff', marginBottom:12 }}>{item.title}</h3>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', lineHeight:'160%', marginBottom:20 }}>{item.desc}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {item.points.map(p => (
                    <div key={p} style={{ display:'flex', gap:10, alignItems:'center', fontSize:13, color:'rgba(255,255,255,0.55)' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" stroke={item.color} strokeOpacity="0.4"/><path d="M4.5 7l1.5 1.5 3-3" stroke={item.color} strokeWidth="1.5" strokeLinecap="round"/></svg>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 48px', textAlign:'center', borderTop:`1px solid ${STR}` }}>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(24px,3.5vw,40px)', fontWeight:400, letterSpacing:'-1.5px', color:'#fff', marginBottom:16 }}>
          Ready to work with a TPIP coach?
        </h2>
        <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', maxWidth:400, margin:'0 auto 32px', lineHeight:'160%' }}>
          Enroll in a program and get matched with the right coach for your discipline and goals.
        </p>
        <div style={{ display:'flex', gap:16, justifyContent:'center' }}>
          <Link to="/register" style={{ background:PURPLE, color:'#fff', padding:'13px 28px', borderRadius:100, fontSize:14, fontWeight:600, boxShadow:`0 4px 24px ${PURPLE}55` }}>Enroll Now →</Link>
          <Link to="/programs" style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.7)', padding:'13px 28px', borderRadius:100, fontSize:14, fontWeight:600, border:`1px solid ${STR}` }}>View Programs</Link>
        </div>
      </section>
    </div>
  )
}
