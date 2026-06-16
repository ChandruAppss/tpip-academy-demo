import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

// ── Nexsas exact color palette ─────────────────────────────────────────
const BG6    = '#0d1017'    // background-6 (dark main)
const BG5    = '#11141d'    // background-5
const BG14   = '#12161f'    // background-14
const BG7    = '#f8f9fa'    // background-7 (white section)
const PURPLE = '#8d59ff'    // opai-purple
const YELLOW = '#fff049'    // opai-yellow
const BLUE   = '#227eff'    // opai-blue
const LEMON  = '#d0ff00'    // opai-lemon
const GREEN  = '#09f647'    // opai-green
const STR    = 'rgba(124,142,165,0.18)'  // stroke-3/18

function useReveal(t = 0.06) {
  const ref = useRef(null); const [v, setV] = useState(false)
  useEffect(() => {
    const fb = setTimeout(() => setV(true), 2000)
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); clearTimeout(fb) } }, { threshold: t, rootMargin: '0px 0px -40px 0px' })
    if (ref.current) obs.observe(ref.current)
    return () => { obs.disconnect(); clearTimeout(fb) }
  }, [t])
  return [ref, v]
}

function Counter({ n, s = '', d = 1800, dec = 0, fixed = false }) {
  const [c, setC] = useState(fixed ? n : 0)
  const [ref, v] = useReveal(0.1)
  useEffect(() => {
    if (!v || fixed) return
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / d, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      const val = parseFloat((ease * n).toFixed(dec))
      setC(val)
      if (p < 1) requestAnimationFrame(tick)
      else setC(n)
    }
    requestAnimationFrame(tick)
  }, [v, n, d, dec, fixed])
  return <span ref={ref}>{fixed ? n : dec ? c.toFixed(dec) : Math.floor(c)}{s}</span>
}

/* ── Dashboard Mockup SVG ── */
function DashMockup() {
  return (
    <div style={{
      width: '100%', maxWidth: 1100, margin: '0 auto',
      background: BG14, border: `1px solid ${STR}`,
      borderRadius: 12, overflow: 'hidden',
      boxShadow: `0 0 0 1px ${STR}, 0 40px 120px rgba(141,89,255,0.18), 0 80px 120px rgba(0,0,0,0.5)`,
    }}>
      {/* Browser bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: BG5, borderBottom: `1px solid ${STR}` }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div style={{ flex: 1, background: BG6, borderRadius: 5, padding: '4px 0', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', maxWidth: 340, margin: '0 auto' }}>
          app.tpipcricket.com/student/dashboard
        </div>
      </div>

      {/* App body */}
      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', minHeight: 420 }}>
        {/* Sidebar */}
        <div style={{ background: '#0c0f16', borderRight: `1px solid ${STR}`, padding: '16px 0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0 14px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: `linear-gradient(135deg,${PURPLE},#5b21b6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>🏏</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>TPIP Academy</span>
          </div>
          <div style={{ padding: '0 8px', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '1.5px', marginBottom: 6, paddingLeft: 14 }}>STUDENT PANEL</div>
          {[['Dashboard','#adff2f',true],['My Sessions','#3b82f6',false],['Submissions','#a855f7',false],['Progress','#facc15',false],['Payments','#10b981',false],['Messages','#f97316',false]].map(([label, color, active]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', margin: '1px 6px', borderRadius: 6, background: active ? PURPLE : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.38)', fontSize: 10, fontWeight: active ? 600 : 400 }}>
              <div style={{ width: 5, height: 5, borderRadius: 1, background: active ? '#fff' : color, flexShrink: 0 }} />
              {label}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: '12px 14px', borderTop: `1px solid ${STR}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>AK</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>Arjun Kapoor</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>Student</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ background: BG6, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>MY DASHBOARD</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Track your sports journey</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ background: `${PURPLE}22`, border: `1px solid ${PURPLE}44`, borderRadius: 20, padding: '4px 10px', fontSize: 9, fontWeight: 700, color: PURPLE }}>Week 18 of 24</div>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>AK</div>
            </div>
          </div>

          {/* Welcome banner */}
          <div style={{ background: `linear-gradient(135deg, ${PURPLE}33 0%, ${BLUE}18 100%)`, border: `1px solid ${PURPLE}30`, borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>WELCOME BACK, ARJUN 👋</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>2 sessions this week · 3 practice videos pending feedback</div>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {[['78%','OVERALL',PURPLE],['18','SESSIONS',BLUE],['12','UPLOADS',LEMON]].map(([v,l,c])=>(
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: c }}>{v}</div>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {[['PROGRAM','6-Month Batting','Individual Plan',PURPLE],['SESSIONS DONE','18 / 24','75% attendance',BLUE],['COACH SCORE','8.4','avg rating',YELLOW],['COMPLETION','78%','6 weeks left','#a855f7']].map(([l,v,s,c])=>(
              <div key={l} style={{ background: BG14, border: `1px solid ${STR}`, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.28)', letterSpacing: '1px', marginBottom: 6 }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{v}</div>
                <div style={{ fontSize: 9, color: c, fontWeight: 600 }}>{s}</div>
              </div>
            ))}
          </div>

          {/* Calendar + feedback row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 8 }}>
            <div style={{ background: BG14, border: `1px solid ${STR}`, borderRadius: 8, padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>SESSION CALENDAR</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>APRIL 2026</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
                {'Su Mo Tu We Th Fr Sa'.split(' ').map(d=><div key={d} style={{textAlign:'center',fontSize:7,color:'rgba(255,255,255,0.25)',paddingBottom:3}}>{d}</div>)}
                {[null,null,null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map((d,i)=>(
                  <div key={i} style={{height:16,borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,background:d===14?PURPLE:[3,7,10,17,21,24,28].includes(d)?`${BLUE}30`:'transparent',color:d===14?'#fff':[3,7,10,17,21,24,28].includes(d)?BLUE:'rgba(255,255,255,0.35)',fontWeight:d===14?700:400}}>
                    {d||''}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: BG14, border: `1px solid ${STR}`, borderRadius: 8, padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>MY FEEDBACK</div>
              {[5,4,5].map((stars,i)=>(
                <div key={i} style={{ background: BG5, borderRadius: 6, padding: '6px 8px' }}>
                  <div style={{ display: 'flex', gap: 1, marginBottom: 3 }}>
                    {Array.from({length:5}).map((_,j)=><span key={j} style={{fontSize:9,color:j<stars?YELLOW:'rgba(255,255,255,0.15)'}}>★</span>)}
                  </div>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>Excellent footwork. Keep working on follow-through.</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// [label, anchor or path, isPage]
const NAV_LINKS = [['Programs','programs',false],['Coaches','coaches',false],['Students','students',false],['Pricing','pricing',false],['About','/about',true]]

const FEATURES = [
  { icon:'📹', label:'Video Analysis',       color:BLUE,   desc:'Upload your practice clip. Your coach sends back timestamped, frame-by-frame feedback on every technical flaw — for any sport.' },
  { icon:'🎯', label:'Personal Dev Report',  color:PURPLE, desc:'Daily breakdown of technical tendencies, performance metrics, improvement roadmap, and training focus areas tailored to your sport.' },
  { icon:'📅', label:'Live 1-on-1 Sessions', color:LEMON,  desc:'Real-time correction via Zoom with certified coaches across all sports. Not a recorded class — actual coaching, every single day.' },
  { icon:'🏆', label:'NSDC Certificate',     color:YELLOW, desc:'Government-recognised certification on program completion. Valid for selection panels, academies, and professional sports organisations.' },
  { icon:'📊', label:'Progress Dashboard',   color:GREEN,  desc:'Track speed, accuracy, endurance, session streaks, and rank against 128K+ students across all sports on your personal dashboard.' },
  { icon:'🧠', label:'Tactical Coaching',    color:PURPLE, desc:'Sport-specific game plans, opposition match-up analysis, and decision-quality training — turning passion into a true profession.' },
]

const _onl = () => Math.random() > 0.45
const COACHES = [
  // CRICKET
  { name:'Rahul Kumar',    role:'Fast Bowling Coach',         sub:'Level 3 Certified · 12 yrs',   initials:'RK', color:BLUE,      sport:'Cricket',    students:48, rating:'4.9', exp:'12y', online:_onl(), bio:'Former TN state-level pacer. Specialises in seam position, swing control, and yorker execution under pressure. Athletes average +28 km/h pace improvement.',         specialties:['Seam & swing control','Yorker precision','Pace biomechanics','Economy optimisation'] },
  { name:'Vikram Singh',   role:'Batting Specialist',         sub:'Former State Player · 9 yrs',   initials:'VS', color:PURPLE,    sport:'Cricket',    students:34, rating:'4.8', exp:'9y',  online:_onl(), bio:'Former TN state-level batsman. Focuses on footwork, shot selection, and building innings in T20 and ODI formats. Students average 40% batting average improvement.', specialties:['Cover & on-drive mechanics','Footwork under pressure','T20 shot selection','Innings building'] },
  { name:'Priya Nair',     role:'Fielding & Fitness Coach',   sub:'Nationally Certified · 7 yrs',  initials:'PN', color:GREEN,     sport:'Cricket',    students:29, rating:'4.9', exp:'7y',  online:_onl(), bio:'Nationally certified agility coach and former national-level athlete. Her reflex & fielding program is rated 5★ by 96% of students.',                                specialties:['Reflex & reaction training','Ground fielding technique','Catch geometry','Agility drills'] },
  { name:'Deepak Sharma',  role:'Spin Bowling Coach',         sub:'BCCI Level 2 · 8 yrs',          initials:'DS', color:'#f59e0b', sport:'Cricket',    students:31, rating:'4.7', exp:'8y',  online:_onl(), bio:'Former Ranji-level off-spinner. Teaches flight, drift, turn, and deception through well-structured variation drills.',                                            specialties:['Off-break & doosra','Flight & drift control','Wicket-taking plans','Variation deception'] },
  { name:'Anita Menon',    role:'Wicketkeeping Coach',        sub:'SAI Certified · 6 yrs',         initials:'AM', color:'#a855f7', sport:'Cricket',    students:22, rating:'4.8', exp:'6y',  online:_onl(), bio:'SAI-certified keeper and former U-23 state player. Specialises in glove work, stumping mechanics, and keeper-batter footwork.',                                  specialties:['Glove work & stumping','Keeper-batter technique','Dive & gather drills','Low ball collection'] },
  { name:'Suresh Pillai',  role:'Opening Batsman Coach',      sub:'KSCA Certified · 10 yrs',       initials:'SP', color:'#22d3ee', sport:'Cricket',    students:27, rating:'4.6', exp:'10y', online:_onl(), bio:'Former Kerala opener with 5000+ first-class runs. Teaches openers how to read swing, negotiate pace, and build big partnerships.',                             specialties:['New ball tactics','Swing negotiation','Partnership building','Mental discipline'] },
  { name:'Manju Krishnan', role:'Junior Cricket Coach',       sub:'NCA Empanelled · 9 yrs',        initials:'MK', color:LEMON,    sport:'Cricket',    students:63, rating:'4.9', exp:'9y',  online:_onl(), bio:'NCA-empanelled junior development coach. Works with U-14 to U-19 athletes on technique foundations and tournament preparation.',                               specialties:['Junior technique foundation','Tournament prep','Mental toughness','Allround development'] },

  // FOOTBALL
  { name:'Arjun Bose',     role:'Football Performance Coach', sub:'AFC Certified · 9 yrs',         initials:'AB', color:BLUE,      sport:'Football',   students:38, rating:'4.8', exp:'9y',  online:_onl(), bio:'AFC-certified coach and former I-League youth player. Focuses on pressing triggers, positional play, and explosive burst speed.',                               specialties:['Pressing & pressing triggers','Positional play','Sprint & burst speed','Set-piece design'] },
  { name:'Ravi Thomas',    role:'Goalkeeper Coach',           sub:'AIFF Certified · 11 yrs',       initials:'RT', color:PURPLE,    sport:'Football',   students:19, rating:'4.7', exp:'11y', online:_onl(), bio:'Former state-level GK and AIFF-certified coach. Specialises in shot-stopping, distribution, and commanding the box.',                                          specialties:['Shot stopping','1v1 positioning','Distribution & sweeping','Box command'] },
  { name:'Kavitha Raj',    role:'Midfield Tactics Coach',     sub:'AFC B Licence · 7 yrs',         initials:'KR', color:GREEN,     sport:'Football',   students:24, rating:'4.9', exp:'7y',  online:_onl(), bio:'Former women national camp footballer. Teaches midfield structure, pressing, and transition play at advanced level.',                                        specialties:['Midfield press shape','Transition play','Ball retention','Vertical passing lines'] },
  { name:'Samuel Nair',    role:'Striker Development Coach',  sub:'Former I-League · 8 yrs',       initials:'SN', color:'#f97316', sport:'Football',   students:29, rating:'4.8', exp:'8y',  online:_onl(), bio:'Former I-League forward with 80+ goals. Works with strikers on finishing technique, movement, and reading the last line.',                                     specialties:['Finishing technique','Off-ball movement','1v1 vs defenders','Aerial duels'] },
  { name:'Dev Pillai',     role:'Youth Football Coach',       sub:'AFC Grassroots · 6 yrs',        initials:'DP', color:'#f59e0b', sport:'Football',   students:44, rating:'4.7', exp:'6y',  online:_onl(), bio:'Specialises in youth football development from U-10 to U-16. Combines technical drills with game intelligence from an early age.',                            specialties:['Technical foundations','Game intelligence','Ball mastery','Positional awareness'] },
  { name:'Mohan Iyer',     role:'Fitness & Conditioning',     sub:'FIFA Fitness · 10 yrs',         initials:'MI', color:'#22d3ee', sport:'Football',   students:31, rating:'4.6', exp:'10y', online:_onl(), bio:'FIFA-licensed fitness coach who works with clubs and academies to build match fitness, recovery protocols, and injury prevention programs.',                  specialties:['Match fitness periodisation','Sprint capacity','Recovery protocols','Injury prevention'] },

  // ATHLETICS
  { name:'Senthil Kumar',  role:'Sprint Coach',               sub:'AFI Certified · 13 yrs',        initials:'SK', color:BLUE,      sport:'Athletics',  students:36, rating:'4.9', exp:'13y', online:_onl(), bio:'AFI-certified sprint coach and former national-level 100m athlete. Athletes under Senthil average 0.4s improvement in 60 days.',                              specialties:['100m & 200m mechanics','Block start technique','Acceleration phase','Race strategy'] },
  { name:'Lakshmi Devi',   role:'Throws & Jumps Coach',       sub:'AFI Level 2 · 8 yrs',           initials:'LD', color:GREEN,     sport:'Athletics',  students:21, rating:'4.8', exp:'8y',  online:_onl(), bio:'Former national javelin silver medalist. Teaches rotational power, release mechanics, and approach run for all throwing events.',                             specialties:['Javelin approach & release','Shot put technique','Rotational power','Approach mechanics'] },
  { name:'Pradeep Raj',    role:'Long Distance Coach',        sub:'RUPA Certified · 10 yrs',       initials:'PR', color:PURPLE,    sport:'Athletics',  students:18, rating:'4.7', exp:'10y', online:_onl(), bio:'RUPA-certified endurance coach. Builds aerobic base, lactate threshold, and race-day pacing strategy for 1500m–10,000m athletes.',                          specialties:['Lactate threshold training','Pacing strategy','Aerobic base building','Race-day prep'] },
  { name:'Meena Subramanian',role:'Agility & Speed Coach',   sub:'SAI Empanelled · 7 yrs',        initials:'MS', color:LEMON,    sport:'Athletics',  students:27, rating:'4.9', exp:'7y',  online:_onl(), bio:'SAI-empanelled coach focusing on agility, plyometric power, and change-of-direction speed for multi-sport athletes.',                                         specialties:['Plyometric power','Change of direction','Agility ladder systems','Reactive speed'] },
  { name:'Babu Krishnan',  role:'Hurdles & Steeplechase',     sub:'AFI Certified · 9 yrs',         initials:'BK', color:'#f97316', sport:'Athletics',  students:14, rating:'4.6', exp:'9y',  online:_onl(), bio:'Former state champion hurdler. Teaches trail leg mechanics, rhythm patterning, and water jump technique for steeplechase.',                                 specialties:['Hurdle trail leg','Rhythm patterning','Water jump technique','Sprint-hurdle transition'] },
  { name:'Geetha Anand',   role:'Sprints & Relay Coach',      sub:'National Camp Coach · 11 yrs',  initials:'GA', color:'#22d3ee', sport:'Athletics',  students:33, rating:'4.8', exp:'11y', online:_onl(), bio:'National camp coach specialising in 400m and relay baton exchange. Works with sub-élite athletes targeting national-level selection.',                       specialties:['400m periodisation','Baton exchange mechanics','Bend running technique','Relay strategy'] },

  // BADMINTON
  { name:'Sneha Rao',      role:'Badminton Technique Coach',  sub:'BAI Certified · 8 yrs',         initials:'SR', color:'#f97316', sport:'Badminton',  students:52, rating:'4.9', exp:'8y',  online:_onl(), bio:'Former national-level badminton player. Known for footwork drills and smash technique — produced 5 state-ranked players.',                                    specialties:['Footwork patterns','Smash & net kill','Singles strategy','Court coverage'] },
  { name:'Arun Mathew',    role:'Doubles Tactics Coach',      sub:'BWF Certified · 9 yrs',         initials:'AM', color:BLUE,      sport:'Badminton',  students:31, rating:'4.8', exp:'9y',  online:_onl(), bio:'Former state doubles champion and BWF-certified coach. Teaches doubles rotation, service patterns, and deceptive attack combinations.',                      specialties:['Doubles rotation','Service patterns','Deceptive strokes','Attack combinations'] },
  { name:'Divya Menon',    role:'Women Singles Coach',      sub:'BAI Level 2 · 6 yrs',           initials:'DM', color:PURPLE,    sport:'Badminton',  students:23, rating:'4.9', exp:'6y',  online:_onl(), bio:'Former All-India women circuit player. Specialises in net play finesse, rear-court control, and endurance-based rally strategy.',                           specialties:['Net play finesse','Rear-court control','Rally endurance','Cross-court deception'] },
  { name:'Kumar Selvam',   role:'Junior Badminton Coach',     sub:'BAI Grassroots · 7 yrs',        initials:'KS', color:GREEN,     sport:'Badminton',  students:67, rating:'4.7', exp:'7y',  online:_onl(), bio:'Specialises in junior development from U-13 upward. Builds grip, swing, and court awareness before moving into competitive strategy.',                       specialties:['Grip & swing fundamentals','Court awareness','Multi-shuttle drills','Competition prep'] },
  { name:'Ranjith Nair',   role:'Smash Power Coach',          sub:'SAI Empanelled · 8 yrs',        initials:'RN', color:LEMON,    sport:'Badminton',  students:29, rating:'4.8', exp:'8y',  online:_onl(), bio:'SAI-empanelled power coach. Focuses on jump smash mechanics, shoulder rotation, and shuttlecock trajectory control for attacking players.',                  specialties:['Jump smash mechanics','Shoulder rotation','Trajectory control','Attacking systems'] },
  { name:'Pooja Balan',    role:'Fitness & Footwork Coach',   sub:'Sports Science · 5 yrs',        initials:'PB', color:'#22d3ee', sport:'Badminton',  students:18, rating:'4.7', exp:'5y',  online:_onl(), bio:'Sports science graduate specialising in badminton-specific conditioning and six-point footwork systems for junior and senior athletes.',                      specialties:['Six-point footwork','Court fitness','Split step timing','Lunge & recovery'] },

  // TENNIS
  { name:'Arjun Mehta',    role:'Tennis Performance Coach',   sub:'ITF Certified · 10 yrs',        initials:'AM', color:LEMON,    sport:'Tennis',     students:41, rating:'4.7', exp:'10y', online:_onl(), bio:'ITF-certified coach with a decade coaching junior and senior players. Specialises in serve mechanics and mental toughness under match pressure.',             specialties:['Serve mechanics & power','Baseline rally consistency','Return of serve','Mental resilience'] },
  { name:'Sunita Patel',   role:'Women Tennis Coach',       sub:'AITA Certified · 8 yrs',        initials:'SP', color:PURPLE,    sport:'Tennis',     students:27, rating:'4.8', exp:'8y',  online:_onl(), bio:'AITA-certified women tennis coach and former national circuit player. Known for her two-handed backhand and clay-court tactical systems.',                    specialties:['Two-hand backhand mechanics','Clay-court tactics','Cross-court patterns','Slice & approach'] },
  { name:'Kiran Bose',     role:'Junior Tennis Coach',        sub:'ITF L1 Certified · 6 yrs',      initials:'KB', color:BLUE,      sport:'Tennis',     students:55, rating:'4.9', exp:'6y',  online:_onl(), bio:'ITF Level 1 certified junior coach. Structures age-appropriate programs for U-12 to U-18 with emphasis on technique before tactics.',                        specialties:['Junior technique building','Forehand & backhand grips','Movement fundamentals','Match play intro'] },
  { name:'Naveen Thomas',  role:'Serve & Volley Specialist',  sub:'ITF L2 · 9 yrs',                initials:'NT', color:GREEN,     sport:'Tennis',     students:22, rating:'4.7', exp:'9y',  online:_onl(), bio:'Specialises in serve-and-volley systems, net approach technique, and first-strike tennis patterns for players looking to dominate short points.',             specialties:['Serve placement patterns','Volley technique','Net approach angles','First strike tennis'] },
  { name:'Deepa Krishnan', role:'Fitness & Tennis Coach',     sub:'AITA + Sports Science · 7 yrs', initials:'DK', color:'#f97316', sport:'Tennis',     students:19, rating:'4.8', exp:'7y',  online:_onl(), bio:'Combines sports science with tennis-specific conditioning. Builds on-court speed, recovery, and injury-prevention into every session.',                      specialties:['On-court speed','Recovery conditioning','Injury prevention','Split step & court coverage'] },
  { name:'Rajesh Varma',   role:'Advanced Match Tactics',     sub:'AITA NTI · 11 yrs',             initials:'RV', color:'#22d3ee', sport:'Tennis',     students:17, rating:'4.9', exp:'11y', online:_onl(), bio:'AITA NTI coach who works exclusively with advanced players preparing for ITF Juniors and national ranking events. Heavy focus on match-day decision-making.',specialties:['Match-day game plans','ITF Junior prep','Tactical IQ building','Second-serve pressure'] },

  // SWIMMING
  { name:'Karan Bose',     role:'Swimming & Endurance Coach', sub:'FINA Certified · 11 yrs',       initials:'KB', color:'#22d3ee', sport:'Swimming',   students:37, rating:'4.8', exp:'11y', online:_onl(), bio:'FINA-certified coach specialising in freestyle and butterfly stroke. Has trained junior swimmers who went on to compete at national championships.',         specialties:['Stroke efficiency','Flip turn mechanics','Open water prep','Endurance periodisation'] },
  { name:'Ananya Menon',   role:'Backstroke & IM Coach',      sub:'SAI Empanelled · 7 yrs',        initials:'AM', color:PURPLE,    sport:'Swimming',   students:22, rating:'4.7', exp:'7y',  online:_onl(), bio:'SAI-empanelled coach and former national backstroke qualifier. Teaches body rotation, shoulder-lead mechanics, and individual medley transitions.',          specialties:['Backstroke rotation','Shoulder-lead mechanics','IM transition turns','Start & pushoff'] },
  { name:'Raj Pillai',     role:'Sprint Swimming Coach',      sub:'FINA L2 · 9 yrs',               initials:'RP', color:GREEN,     sport:'Swimming',   students:28, rating:'4.9', exp:'9y',  online:_onl(), bio:'FINA Level 2 coach focused on explosive sprint swimming. Builds underwater dolphin kick, reaction starts, and race-pace 50m and 100m programs.',            specialties:['Underwater dolphin kick','Reaction start','Sprint pace 50m/100m','Stroke rate control'] },
  { name:'Gita Varman',    role:'Junior Swimming Coach',      sub:'ASI Certified · 5 yrs',         initials:'GV', color:LEMON,    sport:'Swimming',   students:71, rating:'4.8', exp:'5y',  online:_onl(), bio:'ASI-certified junior coach working with beginner to intermediate swimmers, focusing on water confidence, technique fundamentals, and stroke development.',  specialties:['Water confidence','Freestyle & breaststroke basics','Breathing technique','Stroke development'] },
  { name:'Mahesh Rao',     role:'Open Water Coach',           sub:'FINA OW Certified · 8 yrs',     initials:'MR', color:'#f97316', sport:'Swimming',   students:16, rating:'4.7', exp:'8y',  online:_onl(), bio:'Specialist in open-water swimming preparation. Covers sighting, drafting, wetsuit racing, and mental strategies for long-distance aquatic events.',          specialties:['Sighting & navigation','Drafting strategy','Wetsuit transition','Long-distance pacing'] },
  { name:'Preethi Iyer',   role:'Breaststroke Specialist',    sub:'SAI Coach · 6 yrs',             initials:'PI', color:BLUE,      sport:'Swimming',   students:24, rating:'4.8', exp:'6y',  online:_onl(), bio:'Specialises in breaststroke pullout, frog kick timing, and turn mechanics. Her athletes have shaved up to 4 seconds from personal bests in 6 weeks.',     specialties:['Breaststroke pullout','Frog kick timing','Wall turn mechanics','Race strategy'] },
]
const COACH_SPORTS = ['All','Cricket','Football','Athletics','Badminton','Tennis','Swimming']

const REVIEWS = [
  { initials:'AK', name:'Arjun Kumar',    role:'Batting · Chennai',      text:'"Batting average went from 22 to 61 in 4 months. The personal development report every month is what separates TPIP from any other academy."' },
  { initials:'RM', name:'Rahul Menon',    role:'Bowling · Coimbatore',   text:'"Ball speed went from 108 to 136 km/h. Coach Vikram’s video feedback is so precise — I could see exactly where my run-up was breaking down."' },
  { initials:'DS', name:'Dev Sharma',     role:'Fielding · Madurai',     text:'"Catch success rate jumped from 48% to 89%. Got selected for district U-23 after 5 months. TPIP coaches are world class."' },
  { initials:'PK', name:'Praveen Kumar',  role:'All-round · Trichy',     text:'"State U-19 selection happened 6 months into the program. The tactical coaching is different from anything I have experienced."' },
  { initials:'SK', name:'Sanjay Krishnan',role:'Batting · Salem',        text:'"They don’t just give you drills. They build a game plan for you. My decision-making at the crease has completely changed."' },
  { initials:'VR', name:'Vijay Rajan',    role:'Pace Bowling · Vellore', text:'"Economy rate dropped from 8.4 to 4.1 in T20s. The opposition match-up analysis before every practice game was the real difference."' },
  { initials:'MK', name:'Manoj Kumar',    role:'Fielding · Tirunelveli', text:'"I used to drop every second catch. After 3 months of TPIP reflex program, I am my team safest fielder. Results are real."' },
  { initials:'RN', name:'Ravi Narayanan', role:'Batting · Puducherry',   text:'"The progress dashboard shows everything — movement speed, session count, coach rating. Proper data-driven coaching, not just gut feel."' },
]

const PLANS = [
  {
    tab:'Batting', name:'Batting Fundamentals', price:'₹16,600', period:'/6 months', popular:false,
    tagline:'Master the core performance techniques',
    features:['24 live 1-on-1 coach sessions','Weekly video feedback & analysis','Batting biomechanics breakdown','Shot selection & footwork drills','Monthly personal dev report','NSDC Certificate on completion']
  },
  {
    tab:'Bowling', name:'Fast Bowling Elite', price:'₹20,750', period:'/6 months', popular:false,
    tagline:'Develop pace, swing & seam with elite coaches',
    features:['Live coach-led sessions','Pace & swing analysis','Line & length control drills','Biomechanics video feedback','Fitness & conditioning plans','NSDC Certificate']
  },
  {
    tab:'Fielding', name:'Wicketkeeper Program', price:'₹18,250', period:'/6 months', popular:false,
    tagline:'Agility specialist program',
    features:['Glove work & footwork drills','Live session coaching','Video analysis every week','Fitness & agility plans','Catching geometry training','NSDC Certificate'],
  },
  {
    tab:'Custom', name:'Elite Performance Program', price:'₹24,900', period:'/6 months', popular:true,
    tagline:'Advanced program for serious athletes',
    features:['36 live coach-led sessions','AI video & biomechanics analysis','1-on-1 tactical coaching calls','Custom training & game plans','Opposition match-up analysis','Priority feedback within 6hrs','NSDC Certificate']
  },
]

/* ── Floating sports icon positions (seeded random feel) ── */
const FLOAT_ICONS = [
  { icon:'🏏', x:4,  y:12, size:28, delay:0,   dur:8  },
  { icon:'🎯', x:88, y:8,  size:22, delay:1.5, dur:10 },
  { icon:'🏆', x:15, y:55, size:20, delay:3,   dur:12 },
  { icon:'⚾', x:78, y:60, size:26, delay:0.8, dur:9  },
  { icon:'🏏', x:92, y:35, size:18, delay:2,   dur:11 },
  { icon:'🎯', x:6,  y:80, size:24, delay:4,   dur:7  },
  { icon:'🏆', x:50, y:5,  size:16, delay:1,   dur:13 },
  { icon:'⚾', x:35, y:88, size:20, delay:2.5, dur:8  },
  { icon:'🏏', x:68, y:82, size:22, delay:3.5, dur:10 },
  { icon:'🎯', x:22, y:28, size:16, delay:0.5, dur:9  },
  { icon:'⚾', x:58, y:70, size:18, delay:4.5, dur:12 },
  { icon:'🏆', x:82, y:20, size:14, delay:2.2, dur:11 },
]

function ProgressBar({ pct, playerIdx, delay }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    setWidth(0)
    const t = setTimeout(() => setWidth(pct), 80 + delay * 1000)
    return () => clearTimeout(t)
  }, [playerIdx, pct, delay])
  return (
    <div style={{ height:6, borderRadius:99, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
      <div style={{
        height:'100%', borderRadius:99,
        background:'linear-gradient(90deg,#ef4444 0%,#f97316 45%,#22c55e 100%)',
        width:`${width}%`,
        transition:'width 1.6s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </div>
  )
}

function ChipCounter({ from, to, suffix, playerIdx }) {
  const [val, setVal] = useState(from)
  useEffect(() => {
    setVal(from)
    const start = typeof from === 'number' ? from : parseFloat(from)
    const end   = typeof to   === 'number' ? to   : parseFloat(to)
    const dur = 1200
    const startTime = Date.now()
    const isDecimal = String(to).includes('.')
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / dur, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = start + (end - start) * eased
      setVal(isDecimal ? current.toFixed(2) : Math.round(current))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [playerIdx, from, to])
  return (
    <span style={{ fontSize:11, color:'#fff', fontWeight:700, fontFamily:"'IBM Plex Mono',monospace" }}>
      {val}{suffix}
    </span>
  )
}

function TypeWriter({ words, color = '#fff' }) {
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => { setDeleting(true); setPaused(false) }, 1800)
      return () => clearTimeout(t)
    }
    const word = words[wordIdx]
    if (!deleting) {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
        return () => clearTimeout(t)
      } else {
        setPaused(true)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
        return () => clearTimeout(t)
      } else {
        setDeleting(false)
        setWordIdx(i => (i + 1) % words.length)
      }
    }
  }, [displayed, deleting, paused, wordIdx, words])
  return (
    <span style={{ color, fontStyle:'italic', whiteSpace:'nowrap' }}>
      {displayed}
      <span style={{ display:'inline-block', width:2, height:'0.85em', background:color, marginLeft:2, marginBottom:-2, verticalAlign:'middle', animation:'blink 1s step-start infinite', borderRadius:1 }} />
    </span>
  )
}

function ReviewSlider({ reviews }) {
  const trackRef = useRef(null)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let pos = 0
    const speed = 0.5
    let raf
    function step() {
      pos += speed
      if (pos >= track.scrollWidth / 2) pos = 0
      track.style.transform = `translateX(-${pos}px)`
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])
  const doubled = [...reviews, ...reviews]
  return (
    <div style={{ overflow:'hidden', width:'100%' }}>
      <div ref={trackRef} style={{ display:'flex', gap:16, width:'max-content', willChange:'transform' }}>
        {doubled.map((r, i) => (
          <div key={i} style={{
            width:280, flexShrink:0,
            background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:14, padding:'20px 20px',
            transition:'border-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(141,89,255,0.45)'; e.currentTarget.style.transform='translateY(-3px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.transform='none' }}
          >
            <div style={{ display:'flex', gap:2, marginBottom:10 }}>
              {[...Array(5)].map((_,j)=><span key={j} style={{fontSize:12,color:'#f59e0b'}}>★</span>)}
            </div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:'165%', margin:'0 0 14px', fontStyle:'italic' }}>{r.text}</p>
            <div style={{ display:'flex', alignItems:'center', gap:8, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'#2d1a66', border:'1px solid rgba(141,89,255,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#8d59ff', flexShrink:0 }}>{r.initials}</div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{r.name}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{r.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  /* videoUrl can be set from admin dashboard via localStorage */
  const [videoUrl, setVideoUrl] = useState(() =>
    localStorage.getItem('tpip_demo_video') || 'https://www.youtube.com/embed/dwkSLxMbByI'
  )

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* Close modal on Escape */
  useEffect(() => {
    if (!videoOpen) return
    const fn = (e) => { if (e.key === 'Escape') setVideoOpen(false) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [videoOpen])

  const [impRef,  impV]  = useReveal(0.05)
  const [featRef, featV] = useReveal(0.05)
  const [pricRef, pricV] = useReveal(0.05)
  const [testRef, testV] = useReveal(0.05)
  const [heroRef, heroV] = useReveal(0.01)
  const [coachFilter, setCoachFilter] = useState('All')
  const [coachOpen, setCoachOpen] = useState(null)
  const [pricingTab, setPricingTab] = useState(0)

  // Rotating players: 0=batter, 1=bowler, 2=fielder
  const [playerIdx, setPlayerIdx] = useState(0)
  const [playerFade, setPlayerFade] = useState(true)
  useEffect(() => {
    const timer = setInterval(() => {
      setPlayerFade(false)
      setTimeout(() => {
        setPlayerIdx(i => (i + 1) % 3)
        setPlayerFade(true)
      }, 400)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const PLAYERS = [
    { initials:'AK', name:'Arjun Kumar',  city:'Chennai, TN',   role:'Batsman', months:'8 months', color: PURPLE,    bg:'#2d1a66', img:'/batter.png'  },
    { initials:'RM', name:'Rahul Menon',  city:'Coimbatore, TN',role:'Bowler',  months:'6 months', color: BLUE,      bg:'#0f2a55', img:'/bowler.png'  },
    { initials:'DS', name:'Dev Sharma',   city:'Madurai, TN',   role:'Fielder', months:'5 months', color:'#10b981',  bg:'#073d2a', img:'/fielder.png' },
  ]

  const STAT_SETS = [
    [ // Batsman — before is red, after is green
      { label: 'Bat Speed',     before: 118, after: 142, unit: 'km/h' },
      { label: 'Shot Accuracy', before: 61,  after: 94,  unit: '%'    },
      { label: 'Avg Score',     before: 28,  after: 67,  unit: 'runs' },
      { label: 'Footwork',      before: 52,  after: 91,  unit: '%'    },
    ],
    [ // Bowler
      { label: 'Bowl Speed',    before: 108, after: 138, unit: 'km/h' },
      { label: 'Line & Length', before: 58,  after: 92,  unit: '%'    },
      { label: 'Wickets/Match', before: 1.1, after: 3.8, unit: 'wkts' },
      { label: 'Economy Rate',  before: 8.2, after: 4.1, unit: ''     },
    ],
    [ // Fielder
      { label: 'Catch %',       before: 48,  after: 89,  unit: '%'    },
      { label: 'Reflex Speed',  before: 0.52,after: 0.19,unit: 's'    },
      { label: 'Run Outs',      before: 34,  after: 87,  unit: '%'    },
      { label: 'Fitness Score', before: 58,  after: 94,  unit: '/100' },
    ],
  ]

  return (
    <div style={{ fontFamily:"'Inter Tight','Inter',system-ui,sans-serif", overflowX:'hidden', background:BG6 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Sora:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${BG6}}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:${PURPLE}44;border-radius:4px}
        a{text-decoration:none;color:inherit}

        .nav-link{color:rgba(255,255,255,0.5);font-size:13px;font-weight:400;padding:8px 10px;border-radius:100px;transition:color 0.3s;font-family:'IBM Plex Mono',monospace;letter-spacing:0.2px;text-transform:capitalize}
        .nav-link:hover{color:#fff}

        @keyframes float-icon{0%,100%{transform:translateY(0px) rotate(0deg);opacity:0.12}25%{transform:translateY(-18px) rotate(5deg);opacity:0.22}50%{transform:translateY(-8px) rotate(-3deg);opacity:0.18}75%{transform:translateY(-22px) rotate(2deg);opacity:0.25}}
        @keyframes glow{0%,100%{opacity:0.6}50%{opacity:1}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:none}}
        @keyframes modal-in{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
        @keyframes chipIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes shimmer-gold{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes shimmer-purple{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes shimmer-green{0%{background-position:200% center}100%{background-position:-200% center}}
        .shine-gold{background:linear-gradient(90deg,#f59e0b 0%,#fde68a 30%,#f97316 50%,#fbbf24 70%,#f59e0b 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-gold 3s linear infinite}
        .shine-purple{background:linear-gradient(90deg,#a855f7 0%,#e879f9 25%,#8d59ff 50%,#c084fc 75%,#a855f7 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-purple 2.5s linear infinite}
        .shine-green{background:linear-gradient(90deg,#4ade80 0%,#a3e635 25%,#22d3ee 50%,#4ade80 75%,#a3e635 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-green 3.5s linear infinite}
        .shine-h{background:linear-gradient(90deg,#c4b5fd 0%,#93c5fd 30%,#c4b5fd 60%,#93c5fd 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-purple 4s linear infinite}
        .shine-h-dark{background:linear-gradient(90deg,#7c3aed 0%,#1d4ed8 35%,#7c3aed 70%,#1d4ed8 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-purple 4s linear infinite}
        @keyframes shimmer-gold{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes shimmer-purple{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes shimmer-green{0%{background-position:200% center}100%{background-position:-200% center}}
        .shine-gold{background:linear-gradient(90deg,#facc15 0%,#fff 40%,#facc15 60%,#f97316 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-gold 3s linear infinite}
        .shine-purple{background:linear-gradient(90deg,#a855f7 0%,#fff 35%,#8d59ff 55%,#ec4899 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-purple 3.5s linear infinite}
        .shine-green{background:linear-gradient(90deg,#4ade80 0%,#fff 38%,#22d3ee 60%,#4ade80 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-green 4s linear infinite}
        @keyframes chipInR{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}
        @keyframes rolePill{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes halo-pulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
        @keyframes light-sweep{0%{background-position:200% center}100%{background-position:-200% center}}
        .video-halo{animation:halo-pulse 4s ease-in-out infinite}
        .player-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.2);border:none;cursor:pointer;padding:0;transition:all 0.25s}
        .player-dot.active{background:#fff;transform:scale(1.3)}

        .cta-primary{transition:box-shadow 0.3s,transform 0.3s;cursor:pointer}
        .cta-primary:hover{transform:translateY(-1px);box-shadow:0 8px 40px rgba(141,89,255,0.7)!important}
        .cta-play{transition:transform 0.3s;cursor:pointer}
        .cta-play:hover{transform:scale(1.05)}

        .feat-card{transition:transform 0.3s,border-color 0.3s}
        .feat-card:hover{transform:translateY(-4px);border-color:${PURPLE}55!important}
        .coach-list-home::-webkit-scrollbar{width:4px}
        .coach-list-home::-webkit-scrollbar-track{background:transparent}
        .coach-list-home::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
        @keyframes chevron-pulse{0%,100%{opacity:0.35;filter:drop-shadow(0 0 0px currentColor)}60%{opacity:1;filter:drop-shadow(0 0 6px currentColor)}}
        @keyframes online-blink{0%,100%{opacity:1}50%{opacity:0.4}}
        .chevron-glow{animation:chevron-pulse 2s ease-in-out infinite}
        .online-dot{animation:online-blink 2.2s ease-in-out infinite}
        .plan-card{transition:transform 0.3s}
        .plan-card:hover{transform:translateY(-4px)}
        .impact-card{transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.4s ease,border-color 0.3s ease}
        .impact-card:hover{transform:translateY(-10px) scale(1.02) !important}
        @keyframes card-float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
        @keyframes shine-sweep{0%{left:-100%}100%{left:200%}}
        @keyframes number-glow{0%,100%{text-shadow:none}50%{text-shadow:0 0 24px currentColor}}
        @keyframes icon-pulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(0,0,0,0.1)}60%{transform:scale(1.12);box-shadow:0 0 0 8px rgba(0,0,0,0)}}
        .impact-card .card-icon{animation:icon-pulse 2.5s ease-in-out infinite}
        .impact-card:nth-child(2) .card-icon{animation-delay:0.4s}
        .impact-card:nth-child(3) .card-icon{animation-delay:0.8s}
        .impact-card:nth-child(4) .card-icon{animation-delay:1.2s}
        .impact-card:nth-child(1){animation-delay:0s}
        .impact-card:nth-child(2){animation-delay:0.1s}
        .impact-card:nth-child(3){animation-delay:0.2s}
        .impact-card:nth-child(4){animation-delay:0.3s}
        .card-shine{position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.7) 50%,transparent 60%);pointer-events:none;animation:shine-sweep 3.5s ease-in-out infinite}
        .impact-card:nth-child(2) .card-shine{animation-delay:0.8s}
        .impact-card:nth-child(3) .card-shine{animation-delay:1.6s}
        .impact-card:nth-child(4) .card-shine{animation-delay:2.4s}
        .accent-bar{transition:width 1s ease,opacity 0.5s ease}
        .impact-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.25)!important}
        .foot-link{color:rgba(255,255,255,0.38);font-size:13px;transition:color 0.2s}
        .foot-link:hover{color:#fff}
      `}</style>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FLOATING PILL NAVBAR  (exact Nexsas)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header style={{ position:'fixed', top:24, left:'50%', transform:'translateX(-50%)', zIndex:100, width:'100%', maxWidth:960, padding:'0 16px' }}>
        <nav style={{
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:'8px 8px',
          background: scrolled ? 'rgba(13,16,23,0.95)' : 'rgba(13,16,23,0.72)',
          backdropFilter:'blur(24px)',
          border:`1px solid ${STR}`,
          borderRadius:100,
          transition:'all 0.3s',
          boxShadow: scrolled ? '0 8px 48px rgba(0,0,0,0.55)' : 'none',
          gap:0,
        }}>
          {/* LEFT NAV — Programs, Coaches, Students */}
          <div style={{ display:'flex', alignItems:'center' }}>
            <a href="#programs" className="nav-link">Programs</a>
            <a href="#coaches" className="nav-link">Coaches</a>
            <a href="#students" className="nav-link">Students</a>
          </div>

          {/* CENTER LOGO */}
          <Link to="/" style={{ display:'flex', alignItems:'center', flexShrink:0, textDecoration:'none', margin:'0 6px' }}>
            <img
              src="/tpip-logo.png"
              alt="TPIP Academy"
              style={{ width:190, height:52, objectFit:'contain', display:'block', mixBlendMode:'screen', transition:'transform 0.25s ease, filter 0.25s ease', filter:'brightness(1.15)' }}
              onMouseEnter={e => { e.currentTarget.style.transform='scale(1.06)'; e.currentTarget.style.filter='brightness(1.4) drop-shadow(0 0 10px rgba(173,255,47,0.7))' }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.filter='brightness(1.15)' }}
            />
          </Link>

          {/* RIGHT NAV — Pricing, About */}
          <div style={{ display:'flex', alignItems:'center' }}>
            <a href="#pricing" className="nav-link">Pricing</a>
            <Link to="/about" className="nav-link" style={{ display:'inline-block' }}>About</Link>
          </div>

          {/* ACTIONS — pushed to far right */}
          <div style={{ display:'flex', alignItems:'center', gap:4, marginLeft:'auto', paddingLeft:8 }}>
            <Link to="/login" style={{ fontSize:13, color:'rgba(255,255,255,0.65)', padding:'8px 16px', borderRadius:100, fontFamily:"'IBM Plex Mono',monospace", fontWeight:500, border:'1px solid rgba(255,255,255,0.12)', transition:'all 0.2s', textDecoration:'none', letterSpacing:'0.2px' }}
              onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='rgba(255,255,255,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.65)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.12)' }}>
              Login
            </Link>
            <Link to="/register" className="cta-primary" style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', background:BG7, borderRadius:100, padding:'5px 6px 5px 18px', gap:6, boxShadow:'0 3px 18px rgba(141,89,255,0.8)', fontSize:13, color:BG6, fontWeight:600, letterSpacing:'-0.1px', textDecoration:'none', whiteSpace:'nowrap', flexShrink:0 }}>
              <span>Enroll Now</span>
              <div style={{ width:30, height:30, borderRadius:'50%', background:BG6, boxShadow:'0 4px 4px rgba(0,0,0,0.4), 0 0 8px rgba(255,255,255,0.5) inset', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform:'rotate(-45deg)' }}>
                  <path d="M7 17L17 7"/><path d="M7 7H17V17"/>
                </svg>
              </div>
            </Link>
          </div>
        </nav>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          YOUTUBE VIDEO MODAL
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {videoOpen && (
        <div
          onClick={() => setVideoOpen(false)}
          style={{ position:'fixed', inset:0, zIndex:999, background:'rgba(0,0,0,0.88)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, backdropFilter:'blur(8px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width:'100%', maxWidth:900, background:'#0d1017', border:`1px solid ${STR}`, borderRadius:16, overflow:'hidden', boxShadow:`0 0 0 1px ${PURPLE}33, 0 40px 120px rgba(0,0,0,0.9)`, animation:'modal-in 0.25s ease both', position:'relative' }}
          >
            {/* Header bar */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:`1px solid ${STR}`, background:'#11141d' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${PURPLE},#5b21b6)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏏</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Performance Masterclass — Gary Palmer Sports Coaching</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>Perfect technique for all conditions</div>
                </div>
              </div>
              <button onClick={() => setVideoOpen(false)} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:`1px solid ${STR}`, color:'rgba(255,255,255,0.6)', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>×</button>
            </div>
            {/* YouTube embed — 16:9 */}
            <div style={{ position:'relative', paddingBottom:'56.25%', height:0 }}>
              <iframe
                src={videoUrl.includes('?') ? `${videoUrl}&autoplay=1` : `${videoUrl}?autoplay=1`}
                title="TPIP Academy Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO SECTION  — floating sports icons BG
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={heroRef} style={{ position:'relative', overflow:'hidden', paddingTop:180, paddingBottom:0, background:'#0d1017' }}>

        {/* ── FULL-BLEED background video ── */}
        <div aria-hidden style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
          {/* Video covers entire section */}
          <video
            src="/hero.mp4"
            autoPlay loop muted playsInline
            style={{
              position:'absolute', inset:0,
              width:'100%', height:'100%',
              objectFit:'cover', objectPosition:'center 30%',
              opacity:0.55,
            }}
          />
          {/* Dark scrim — ensures text is always readable */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(13,16,23,0.75) 0%, rgba(13,16,23,0.55) 50%, rgba(13,16,23,0.80) 100%)' }} />
          {/* Bottom fade into next section */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'38%', background:'linear-gradient(to top, #0d1017 0%, transparent 100%)' }} />
          {/* Top fade from navbar */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'12%', background:'linear-gradient(to bottom, #0d1017 0%, transparent 100%)' }} />
          {/* Purple tint at bottom for brand continuity */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:300, background:`radial-gradient(ellipse at 40% 100%, ${PURPLE}33 0%, transparent 70%)` }} />
        </div>

        {/* ── Hero inner — centered ── */}
        <div style={{ maxWidth:860, margin:'0 auto', padding:'0 32px', position:'relative', zIndex:2 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'88vh', textAlign:'center' }}>

            <div style={{ animation:'fadeUp 0.8s ease both', width:'100%' }}>

              {/* Badge */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(141,89,255,0.12)', border:'1px solid rgba(141,89,255,0.3)', borderRadius:100, padding:'5px 16px 5px 10px', marginBottom:28 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:PURPLE, display:'inline-block', boxShadow:`0 0 8px ${PURPLE}` }} />
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1px' }}>#1 LMS For Sports Data Analytics · Since 2020</span>
              </div>

              {/* Headline */}
              <h1 style={{
                fontFamily:"'Sora',sans-serif", fontWeight:400,
                lineHeight:'108%', letterSpacing:'-3.2px',
                fontSize:'clamp(42px,6vw,82px)',
                margin:'0 0 24px', color:'rgba(255,255,255,0.92)',
              }}>
                <span className="shine-h">Modern Sport Is Not Won By</span><br />
                <em style={{ fontStyle:'italic' }} className="shine-h">Talent Alone.</em>
              </h1>

              {/* Tagline */}
              <p style={{ fontFamily:"'Inter Tight',sans-serif", fontSize:16, color:'rgba(255,255,255,0.55)', maxWidth:520, margin:'0 auto 10px', lineHeight:'160%', fontWeight:400 }}>
                Structured Coaching · Video Analytics · Tactical Development
              </p>

              {/* Body */}
              <p style={{ fontFamily:"'Inter Tight',sans-serif", fontSize:14, color:'rgba(255,255,255,0.32)', maxWidth:500, margin:'0 auto 40px', lineHeight:'170%', fontWeight:400 }}>
                Transform Passion Into Profession — TPIP gives serious athletes a dedicated coach, a personal performance report every month, and a data-backed improvement system built for every sport. Because passion without structure only takes you so far.
              </p>

              {/* CTA row */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20, marginBottom:56 }}>
                <div style={{ position:'relative', display:'inline-block' }}>
                  <span style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', height:68, width:'108%', minWidth:220, borderRadius:100, border:'1px solid rgba(255,255,255,0.18)', pointerEvents:'none' }} />
                  <span style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', height:84, width:'116%', minWidth:240, borderRadius:100, border:'1px solid rgba(255,255,255,0.09)', pointerEvents:'none' }} />
                  <Link to="/register" className="cta-primary" style={{ display:'inline-flex', alignItems:'center', background:'#f8f9fa', borderRadius:100, padding:'5px 6px 5px 24px', gap:10, position:'relative', zIndex:1 }}>
                    <span style={{ fontSize:14, color:'#11141d', fontWeight:500, fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'0.2px', whiteSpace:'nowrap' }}>Start for free</span>
                    <div style={{ width:42, height:42, borderRadius:'50%', background:'#11141d', boxShadow:'0 4px 4px rgba(0,0,0,0.4), 0 0 8px rgba(255,255,255,0.5) inset', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 7H17M11 1L17 7L11 13"/></svg>
                    </div>
                  </Link>
                </div>
                <button onClick={() => setVideoOpen(true)} style={{ display:'inline-flex', alignItems:'center', gap:10, background:'transparent', border:'none', cursor:'pointer', padding:0 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(141,89,255,0.18)', border:'1px solid rgba(141,89,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.2s' }}>
                    <svg width="12" height="14" viewBox="0 0 12 14" fill="rgba(255,255,255,0.8)"><path d="M0 1.8C0 0.37 1.46-0.44 2.59 0.27L10.87 5.47C11.93 6.12 11.93 7.62 10.87 8.27L2.59 13.47C1.46 14.18 0 13.37 0 11.94V1.8Z"/></svg>
                  </div>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.55)', fontFamily:"'IBM Plex Mono',monospace", fontWeight:500, letterSpacing:'0.2px' }}>Watch Demo</span>
                </button>
              </div>

              {/* Divider line */}
              <div style={{ width:'100%', height:1, background:`linear-gradient(to right, transparent, ${STR} 20%, ${STR} 80%, transparent)`, marginBottom:32 }} />

              {/* Stats row */}
              <div style={{ display:'flex', justifyContent:'center', gap:0 }}>
                {[['128K+','Students Trained'],['6K+','Sessions Done'],['4.9★','Coach Rating'],['95%','Performance Gains']].map(([v,l], i, arr) => (
                  <div key={l} style={{ flex:1, maxWidth:180, padding:'0 24px', borderRight: i < arr.length-1 ? `1px solid ${STR}` : 'none' }}>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:400, color:'#fff', letterSpacing:'-0.5px' }}>{v}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:4, letterSpacing:'0.5px' }}>{l}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ── Bottom merges seamlessly into the white Impact section ── */}
        <div style={{ position:'relative', zIndex:4, marginTop:-60 }}>
          <div style={{ height:100, background:`linear-gradient(to bottom, transparent, ${BG7}55)` }} />
          <div style={{ height:80,  background:`linear-gradient(to bottom, ${BG7}55, ${BG7}cc)` }} />
          <div style={{ height:60,  background:`linear-gradient(to bottom, ${BG7}cc, ${BG7})` }} />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          OUR IMPACT — WHITE SECTION (exact Nexsas)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={impRef} id="about" style={{ background:BG7, padding:'60px 24px 96px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(28px,4vw,48px)', fontWeight:400, letterSpacing:'-2.4px', color:'rgba(13,16,23,0.9)', lineHeight:'108%' }}>
              <span className="shine-h-dark">Our <TypeWriter words={['impact','results','students','coaches','programs']} color='#1d4ed8' /></span><br />
              <em style={{ fontStyle:'italic', color:'rgba(13,16,23,0.28)' }}>in numbers</em>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {[
              { n:95,   s:'%',  label:'Performance Gains',  sub:'Athletes who improved measurably',    icon:LEMON,  emoji:'📈', bg:'rgba(208,255,0,0.1)'   },
              { n:4.9,  s:'★',  label:'Average Rating',     sub:'Across all coaches & programs',       icon:YELLOW, emoji:'⭐', bg:'rgba(255,240,73,0.1)', dec:1 },
              { n:128,  s:'K+', label:'Students Trained',   sub:'Athletes across all sports & levels', icon:PURPLE, emoji:'🏅', bg:'rgba(141,89,255,0.1)'  },
              { n:2020, s:'',   label:'Since',              sub:'5 years of building champions',        icon:BLUE,   emoji:'🚀', bg:'rgba(34,126,255,0.1)', fixed:true },
            ].map((item, i) => (
              <div key={item.label} className="impact-card" style={{
                background:'#fff', borderRadius:20,
                padding:'32px 28px',
                minHeight:260, display:'flex', flexDirection:'column', gap:20,
                opacity: impV ? 1 : 0,
                transform: impV ? 'none' : 'translateY(32px)',
                transition:`opacity 0.7s ease ${i*0.12}s, transform 0.7s ease ${i*0.12}s`,
                border:`1.5px solid ${item.icon}22`,
                boxShadow:`0 4px 24px ${item.icon}18`,
                cursor:'default',
                position:'relative',
                overflow:'hidden',
              }}>
                {/* Shine sweep */}
                <div className="card-shine" />

                {/* Top gradient glow strip */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${item.icon}, transparent)`, borderRadius:'20px 20px 0 0' }} />

                {/* Icon + stars row */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div className="card-icon" style={{ width:52, height:52, borderRadius:16, background:item.bg, border:`1.5px solid ${item.icon}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>
                    {item.emoji}
                  </div>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:item.icon, borderRadius:100, padding:'5px 12px' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 7L4 4L6 6L9 2" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontSize:11, fontWeight:700, color:'#000', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'0.3px' }}>Verified</span>
                  </div>
                </div>

                {/* Number */}
                <div>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(36px,4vw,52px)', fontWeight:400, color:'#0d1017', lineHeight:1, letterSpacing:'-2px', marginBottom:6 }}>
                    <Counter n={item.n} s={item.s} dec={item.dec} fixed={item.fixed} />
                  </div>
                  <p style={{ fontSize:14, fontWeight:700, color:'rgba(13,16,23,0.75)', margin:'0 0 4px' }}>{item.label}</p>
                  <p style={{ fontSize:12, color:'rgba(13,16,23,0.35)', margin:0 }}>{item.sub}</p>
                </div>

                {/* Bottom accent bar */}
                <div className="accent-bar" style={{ height:4, borderRadius:100, background:`linear-gradient(90deg, ${item.icon}, ${item.icon}55, transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          WHY TPIP IS DIFFERENT — video merged section
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background:'linear-gradient(135deg, #1a0a3d 0%, #0d1017 40%, #0a1a2e 100%)', padding:'100px 24px 100px', borderTop:'1px solid rgba(141,89,255,0.2)', position:'relative', overflow:'hidden' }}>
        {/* Shining halo behind the video — this is what makes it glow */}
        <div style={{ position:'absolute', left:'-5%', top:'50%', transform:'translateY(-50%)', width:'55%', height:'140%', background:'radial-gradient(ellipse at 40% 50%, rgba(141,89,255,0.28) 0%, rgba(34,126,255,0.12) 35%, transparent 70%)', pointerEvents:'none', filter:'blur(40px)' }} />
        {/* Sparkle shimmer ring */}
        <div style={{ position:'absolute', left:'5%', top:'50%', transform:'translateY(-50%)', width:'42%', aspectRatio:'1', borderRadius:'50%', background:'transparent', border:'1px solid rgba(141,89,255,0.12)', boxShadow:'0 0 80px 20px rgba(141,89,255,0.08), inset 0 0 60px rgba(141,89,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:'-5%', bottom:'-10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(34,126,255,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center', position:'relative', zIndex:1 }}>
          {/* LEFT — sports player video, merged into background */}
          <div style={{ position:'relative', aspectRatio:'4/3' }}>
            {/* Outer glow ring */}
            <div style={{ position:'absolute', inset:-20, borderRadius:24, background:'radial-gradient(ellipse, rgba(141,89,255,0.2) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />
            <video src="/sports-player.mp4" autoPlay loop muted playsInline
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:16, opacity:0.88, position:'relative', zIndex:1 }} />
            {/* 4-edge fade to blend into section background */}
            <div style={{ position:'absolute', inset:0, borderRadius:16, zIndex:2, pointerEvents:'none',
              background:`
                linear-gradient(to right,  #1a0a3d 0%, transparent 18%),
                linear-gradient(to left,   #0d1017 0%, transparent 18%),
                linear-gradient(to bottom, #1a0a3d 0%, transparent 18%),
                linear-gradient(to top,    #0d1017 0%, transparent 22%)
              `}} />
            {/* Purple colour tint */}
            <div style={{ position:'absolute', inset:0, borderRadius:16, zIndex:3, pointerEvents:'none', background:'linear-gradient(135deg, rgba(141,89,255,0.18) 0%, transparent 60%)' }} />
            {/* Floating stat card */}
            <div style={{ position:'absolute', bottom:28, left:28, zIndex:10, background:'rgba(13,16,23,0.85)', backdropFilter:'blur(20px)', border:'1px solid rgba(141,89,255,0.4)', borderRadius:14, padding:'14px 18px', boxShadow:'0 8px 32px rgba(141,89,255,0.25)' }}>
              <div style={{ fontSize:30, fontWeight:700, color:'#fff', fontFamily:"'Sora',sans-serif", letterSpacing:'-1px' }}>87%</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginTop:1 }}>students improved state rank</div>
            </div>
            <div style={{ position:'absolute', top:20, right:20, zIndex:10, background:'linear-gradient(135deg,#8d59ff,#5b21b6)', borderRadius:100, padding:'6px 16px', fontSize:11, fontWeight:700, color:'#fff', boxShadow:'0 4px 20px rgba(141,89,255,0.6)' }}>EMBEDDED COACHING</div>
          </div>

          {/* RIGHT — content */}
          <div>
            <div style={{ display:'inline-block', fontSize:11, fontFamily:"'IBM Plex Mono',monospace", color:'#a78bfa', letterSpacing:'2px', marginBottom:16, textTransform:'uppercase', background:'rgba(141,89,255,0.12)', border:'1px solid rgba(141,89,255,0.3)', borderRadius:100, padding:'4px 14px' }}>Why TPIP is different</div>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(20px,2vw,28px)', fontWeight:400, letterSpacing:'-1px', color:'#fff', lineHeight:'130%', margin:'0 0 16px' }}>
              <span className="shine-h">We Turn Dedicated Athletes</span><br />
              <span className="shine-h">Into Unstoppable Professionals.</span><br />
              <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.45)', fontSize:'0.88em' }}>Coached Every Single Day. Across Every Sport.</em>
            </h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', lineHeight:'170%', margin:'0 0 28px' }}>
              Most coaching platforms give you recordings and drills. TPIP gives you a dedicated coach who reviews your video, builds your game plan, and tracks your numbers every single day — across every sport.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                ['🎬', PURPLE, 'Video feedback', 'Timestamped corrections on every clip — not generic advice.'],
                ['📋', BLUE,   'Personal dev report', 'Monthly breakdown of technical tendencies and improvement roadmap.'],
                ['🎯', '#10b981', 'Tactical coaching', 'Phase-wise plans and match-up analysis. Decision quality over muscle memory.'],
                ['📈', LEMON, 'Progress tracking', 'Real numbers: movement speed, reaction speed, economy, success rate — on your dashboard.'],
                ['🏅', YELLOW, 'NSDC Certificate', 'Government-recognised credential on program completion.'],
              ].map(([icon, color, title, desc]) => (
                <div key={title} style={{ display:'flex', gap:14, alignItems:'flex-start', background:'rgba(255,255,255,0.04)', border:`1px solid ${color}22`, borderLeft:`3px solid ${color}`, borderRadius:10, padding:'12px 16px' }}>
                  <span style={{ fontSize:20, flexShrink:0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:'#fff', marginBottom:2 }}>{title}</div>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:'150%' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/register" style={{ display:'inline-flex', alignItems:'center', gap:10, marginTop:28, background:'linear-gradient(135deg,#8d59ff,#5b21b6)', color:'#fff', borderRadius:100, padding:'13px 28px', fontSize:14, fontWeight:600, textDecoration:'none', boxShadow:'0 8px 32px rgba(141,89,255,0.5)' }}>
              Start your program →
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HOW IT WORKS — colourful steps
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background:'linear-gradient(180deg, #0d1117 0%, #111827 100%)', padding:'100px 24px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(26px,3.5vw,42px)', fontWeight:400, letterSpacing:'-1.6px', color:'#fff', lineHeight:'108%', marginBottom:14 }}>
              <span className="shine-h">How TPIP works</span><br />
              <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.35)' }}>four steps to real improvement</em>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {[
              { step:'01', icon:'📝', color:PURPLE, bg:'rgba(141,89,255,0.12)', border:'rgba(141,89,255,0.35)', title:'Enroll', desc:'Choose your program — Batting, Bowling, Fielding, or the Elite full-athlete plan. Instant access.' },
              { step:'02', icon:'📅', color:BLUE,   bg:'rgba(34,126,255,0.12)', border:'rgba(34,126,255,0.35)', title:'Train Live', desc:'Book 1-on-1 Zoom sessions with your certified coach. Real coaching, not recordings.' },
              { step:'03', icon:'📹', color:'#f59e0b', bg:'rgba(245,158,11,0.12)', border:'rgba(245,158,11,0.35)', title:'Submit Clips', desc:'Upload practice videos. Coach sends timestamped frame-accurate feedback within 24 hours.' },
              { step:'04', icon:'📊', color:'#10b981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.35)', title:'Track & Improve', desc:'Get your monthly Personal Development Report. Watch your numbers grow on your dashboard.' },
            ].map((s, i) => (
              <div key={s.step} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:16, padding:'32px 24px', textAlign:'center', transition:'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-6px)'}
                onMouseLeave={e => e.currentTarget.style.transform='none'}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:`linear-gradient(135deg, ${s.color}33, ${s.color}11)`, border:`2px solid ${s.color}66`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 18px', boxShadow:`0 8px 24px ${s.color}33` }}>{s.icon}</div>
                <div style={{ fontSize:11, fontFamily:"'IBM Plex Mono',monospace", color:s.color, letterSpacing:'2px', marginBottom:8, fontWeight:600 }}>STEP {s.step}</div>
                <div style={{ fontSize:17, fontWeight:700, color:'#fff', fontFamily:"'Sora',sans-serif", marginBottom:10 }}>{s.title}</div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:'165%', margin:0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FEATURES — vibrant coloured cards
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="programs" ref={featRef} style={{ background:'linear-gradient(135deg, #0a1628 0%, #0d1017 50%, #0f0a1e 100%)', padding:'100px 24px', borderTop:'1px solid rgba(34,126,255,0.15)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-15%', left:'50%', transform:'translateX(-50%)', width:800, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(34,126,255,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(26px,3.5vw,42px)', fontWeight:400, letterSpacing:'-1.6px', color:'#fff', lineHeight:'115%', maxWidth:700, margin:'0 auto 14px' }}>
              <span className="shine-h">Empower Your</span>{' '}
              <TypeWriter words={['Football','Cricket','Basketball','Athletics','Swimming','Tennis']} color='#c4b5fd' />{' '}
              <span className="shine-h">Skills</span><br />
              <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.35)' }}>Sports Development Ecosystem</em>
            </h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.55)', maxWidth:480, margin:'0 auto', lineHeight:'160%' }}>
              A complete all-sports development ecosystem — from video analysis to certified coaching.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {FEATURES.map((f, i) => (
              <div key={f.label} className="feat-card" style={{ background:`linear-gradient(135deg, ${f.color}0d 0%, rgba(13,16,23,0.8) 100%)`, border:`1px solid ${f.color}33`, borderRadius:16, padding:'28px 24px', opacity:featV?1:0, transform:featV?'none':'translateY(20px)', transition:`all 0.6s ease ${i*0.08}s`, cursor:'default' }}
              onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${f.color}77`;e.currentTarget.style.boxShadow=`0 12px 40px ${f.color}25`;e.currentTarget.style.transform='translateY(-4px)'}}
              onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${f.color}33`;e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='none'}}
              >
                <div style={{ width:52, height:52, borderRadius:12, background:`${f.color}22`, border:`1px solid ${f.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:16 }}>{f.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:8, fontFamily:"'Sora',sans-serif" }}>{f.label}</div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:'170%', margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          COACHES — expandable rows with filter
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="coaches" style={{ background:'linear-gradient(135deg, #071a12 0%, #0d1017 50%, #0c1a1a 100%)', padding:'100px 24px', borderTop:'1px solid rgba(9,246,71,0.12)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', bottom:'-20%', right:'-10%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(9,246,71,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(26px,3.5vw,40px)', fontWeight:400, letterSpacing:'-1.6px', color:'rgba(255,255,255,0.9)', lineHeight:'108%', marginBottom:14 }}>
              <span className="shine-h">Learn from the</span><br />
              <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.22)' }}>Best in All Sports</em>
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.35)' }}>Certified coaches who've played and coached at state & national level across all sports.</p>
          </div>

          {/* Filter pills */}
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
            {COACH_SPORTS.map(sport => {
              const active = coachFilter === sport
              return (
                <button key={sport} onClick={() => { setCoachFilter(sport); setCoachOpen(null) }} style={{
                  cursor:'pointer', border:`1px solid ${active ? GREEN : STR}`, borderRadius:100, padding:'5px 16px',
                  fontSize:12, fontFamily:"'IBM Plex Mono',monospace", fontWeight:500, whiteSpace:'nowrap',
                  background: active ? `${GREEN}18` : 'transparent',
                  color: active ? GREEN : 'rgba(255,255,255,0.4)',
                  transition:'all 0.15s',
                }}>{sport}</button>
              )
            })}
            <Link to="/coaches" style={{ marginLeft:'auto', fontSize:12, color:PURPLE, fontFamily:"'IBM Plex Mono',monospace", textDecoration:'none', borderBottom:`1px solid ${PURPLE}55`, paddingBottom:1, whiteSpace:'nowrap' }}>Meet all coaches →</Link>
          </div>

          {/* Table header */}
          <div style={{ display:'grid', gridTemplateColumns:'36px 44px 1fr 110px 80px 60px 90px 28px', alignItems:'center', gap:12, padding:'9px 16px', marginBottom:4, borderRadius:8, background:'rgba(255,255,255,0.02)', border:`1px solid ${STR}` }}>
            {['#','','COACH','SPORT','RATING','EXP.','STATUS',''].map((h,i) => (
              <span key={i} style={{ fontSize:10, color:'rgba(255,255,255,0.25)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1px' }}>{h}</span>
            ))}
          </div>

          {/* Scrollable rows */}
          <div style={{ border:`1px solid ${STR}`, borderRadius:14, overflow:'hidden', background:BG14, maxHeight:440, overflowY:'auto' }}
            className="coach-list-home">
            {(coachFilter === 'All' ? COACHES : COACHES.filter(c => c.sport === coachFilter)).map((c, i, arr) => {
              const isOpen = coachOpen === c.name
              return (
                <div key={c.name} style={{ borderBottom: i < arr.length-1 ? `1px solid ${STR}` : 'none' }}>
                  {/* Row */}
                  <div onClick={() => setCoachOpen(prev => prev === c.name ? null : c.name)}
                    style={{ display:'grid', gridTemplateColumns:'36px 44px 1fr 110px 80px 60px 90px 28px', alignItems:'center', gap:12, padding:'14px 16px', cursor:'pointer', background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent', transition:'background 0.15s' }}
                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background='rgba(255,255,255,0.025)' }}
                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background='transparent' }}>
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.2)', fontWeight:600, fontFamily:"'IBM Plex Mono',monospace" }}>0{i+1}</span>
                    <div style={{ position:'relative', width:40, height:40, flexShrink:0 }}>
                      <div style={{ width:40, height:40, borderRadius:'50%', background:`${c.color}20`, border:`1.5px solid ${c.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:c.color, fontFamily:"'IBM Plex Mono',monospace" }}>{c.initials}</div>
                      <div className={c.online ? 'online-dot' : ''} style={{ position:'absolute', bottom:1, right:1, width:9, height:9, borderRadius:'50%', background: c.online ? '#09f647' : '#555', border:'1.5px solid #0d1017' }} title={c.online ? 'Online now' : 'Offline'} />
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:'#fff', fontFamily:"'Sora',sans-serif", marginBottom:1 }}>{c.name}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{c.role}</div>
                    </div>
                    <span style={{ fontSize:11, background:`${c.color}18`, border:`1px solid ${c.color}33`, color:c.color, padding:'3px 12px', borderRadius:100, fontFamily:"'IBM Plex Mono',monospace", display:'inline-block' }}>{c.sport}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:14, fontWeight:600, color:'#fff' }}>{c.rating}</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="#f59e0b"><path d="M6 1l1.2 3L11 4.2l-2.5 2.2.7 3.3L6 8l-3.2 1.7.7-3.3L1 4.2 4.8 4z"/></svg>
                    </div>
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{c.exp}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <div className={c.online ? 'online-dot' : ''} style={{ width:7, height:7, borderRadius:'50%', background: c.online ? '#09f647' : '#555', flexShrink:0 }} />
                      <span style={{ fontSize:11, color: c.online ? '#09f647' : 'rgba(255,255,255,0.25)', fontFamily:"'IBM Plex Mono',monospace" }}>{c.online ? 'Online' : 'Offline'}</span>
                    </div>
                    <svg className={isOpen ? '' : 'chevron-glow'} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.22s', color: isOpen ? GREEN : c.color, flexShrink:0 }} width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {/* Expanded */}
                  <div style={{ maxHeight: isOpen ? 400 : 0, overflow:'hidden', opacity: isOpen ? 1 : 0, transition:'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease' }}>
                    <div style={{ padding:'20px 16px 24px 108px', borderTop:`1px solid ${STR}`, background:'rgba(0,0,0,0.25)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:5, background: c.online ? 'rgba(9,246,71,0.1)' : 'rgba(255,255,255,0.05)', border:`1px solid ${c.online ? 'rgba(9,246,71,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius:100, padding:'3px 10px' }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background: c.online ? '#09f647' : '#666' }} />
                          <span style={{ fontSize:11, color: c.online ? '#09f647' : 'rgba(255,255,255,0.35)', fontFamily:"'IBM Plex Mono',monospace", fontWeight:500 }}>{c.online ? 'Online now' : 'Offline'}</span>
                        </div>
                      </div>
                      <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:'160%', marginBottom:16, maxWidth:520 }}>{c.bio}</p>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18 }}>
                        {c.specialties.map(s => (
                          <span key={s} style={{ fontSize:11, border:`1px solid ${STR}`, borderRadius:100, padding:'3px 12px', color:'rgba(255,255,255,0.45)' }}>{s}</span>
                        ))}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:24 }}>
                        {[[c.students,'Students'],[c.exp,'Exp.'],[c.rating+'★','Rating']].map(([v,l]) => (
                          <div key={l}>
                            <div style={{ fontSize:17, fontWeight:700, color:c.color, fontFamily:"'Sora',sans-serif" }}>{v}</div>
                            <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:2 }}>{l}</div>
                          </div>
                        ))}
                        <Link to="/register" style={{ marginLeft:'auto', background:PURPLE, color:'#fff', padding:'9px 20px', borderRadius:100, fontSize:12, fontWeight:600, textDecoration:'none', whiteSpace:'nowrap' }}>Book session →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SPORTS AI — World First Block
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background:'linear-gradient(135deg, #05080f 0%, #0a0d1a 50%, #060b16 100%)', padding:'110px 24px', borderTop:'1px solid rgba(141,89,255,0.2)', position:'relative', overflow:'hidden' }}>
        {/* Ambient glows */}
        <div style={{ position:'absolute', top:'-10%', left:'-5%', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle, rgba(141,89,255,0.12) 0%, transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(34,126,255,0.1) 0%, transparent 65%)', pointerEvents:'none' }} />
        <style>{`
          @keyframes ai-scan{0%{top:0%}100%{top:100%}}
          @keyframes ai-float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-10px)}}
          @keyframes ai-ring{0%{transform:scale(1);opacity:0.5}100%{transform:scale(1.7);opacity:0}}
          @keyframes ai-blink{0%,100%{opacity:1}50%{opacity:0.3}}
          @keyframes tag-slide{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
          .ai-pill-tag{animation:tag-slide 0.4s ease both}
        `}</style>

        <div style={{ maxWidth:1060, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>

          {/* LEFT — copy */}
          <div>
            {/* World first badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,rgba(141,89,255,0.15),rgba(34,126,255,0.1))', border:'1px solid rgba(141,89,255,0.35)', borderRadius:100, padding:'6px 16px', marginBottom:28 }}>
              <span style={{ fontSize:16 }}>🌍</span>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1.5px', fontWeight:600 }}>WORLD FIRST · SPORTS AI COACHING</span>
            </div>

            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(28px,3.8vw,50px)', fontWeight:400, letterSpacing:'-2px', lineHeight:'108%', color:'#fff', marginBottom:20 }}>
              <span style={{ background:'linear-gradient(90deg,#c4b5fd,#818cf8,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>The first AI that</span><br />
              <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.22)' }}>knows your whole game.</em>
            </h2>

            <p style={{ fontSize:15, color:'rgba(255,255,255,0.42)', lineHeight:'168%', marginBottom:32, maxWidth:440 }}>
              TPIP Sports AI reads your video submissions, session history, coach notes, and performance scores — then builds a complete picture of where you are and exactly what to fix next. No guesswork. No generic advice.
            </p>

            {/* Feature rows */}
            {[
              { icon:'🎥', color:'#8d59ff', label:'Video Pattern Analysis',  desc:'Detects technical flaws frame by frame across every clip you submit' },
              { icon:'📊', color:'#227eff', label:'Full Profile Intelligence', desc:'Cross-references session logs, ratings, drills, and coach feedback in one view' },
              { icon:'🧠', color:'#09f647', label:'Personalised Action Plan',  desc:'Generates a next-step improvement roadmap based on your actual data — not a template' },
              { icon:'⚡', color:'#d0ff00', label:'Real-time Suggestions',     desc:'AI responds as you train — flags regressions, celebrates milestones, adjusts targets' },
            ].map((f, i) => (
              <div key={f.label} style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:20, animation:`tag-slide 0.4s ease ${i*0.08}s both` }}>
                <div style={{ width:40, height:40, borderRadius:10, background:`${f.color}18`, border:`1px solid ${f.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:'#fff', marginBottom:3, fontFamily:"'Sora',sans-serif" }}>{f.label}</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.38)', lineHeight:'150%' }}>{f.desc}</div>
                </div>
              </div>
            ))}

            <div style={{ display:'flex', gap:12, marginTop:36, flexWrap:'wrap' }}>
              <Link to="/register" style={{ background:'linear-gradient(135deg,#8d59ff,#5b21b6)', color:'#fff', padding:'13px 28px', borderRadius:100, fontSize:14, fontWeight:600, textDecoration:'none', boxShadow:'0 4px 30px rgba(141,89,255,0.5)' }}>
                Try TPIP AI for free →
              </Link>
              <a href="#programs" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.65)', padding:'13px 24px', borderRadius:100, fontSize:14, fontWeight:500, textDecoration:'none' }}>
                See how it works
              </a>
            </div>
          </div>

          {/* RIGHT — AI Chat mockup */}
          <div style={{ position:'relative' }}>
            {/* Ambient ring */}
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:420, height:420, borderRadius:'50%', border:'1px solid rgba(141,89,255,0.08)', animation:'ai-ring 4s ease-out infinite' }} />

            {/* Chat card */}
            <div style={{ background:'linear-gradient(160deg,#0f1220 0%,#111528 100%)', border:'1px solid rgba(141,89,255,0.28)', borderRadius:24, overflow:'hidden', position:'relative', zIndex:1, boxShadow:'0 28px 80px rgba(141,89,255,0.22), 0 0 0 1px rgba(141,89,255,0.12)', animation:'ai-float 5s ease-in-out infinite' }}>

              {/* Top bar */}
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 18px', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                {/* AI avatar */}
                <div style={{ position:'relative', width:36, height:36, flexShrink:0 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#8d59ff,#227eff)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="rgba(255,255,255,0.9)"/>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none"/>
                      <path d="M8 9.5C8 8.67 8.67 8 9.5 8S11 8.67 11 9.5 10.33 11 9.5 11 8 10.33 8 9.5zM13 9.5C13 8.67 13.67 8 14.5 8S16 8.67 16 9.5 15.33 11 14.5 11 13 10.33 13 9.5zM7 14s1-2 5-2 5 2 5 2" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    </svg>
                  </div>
                  <div style={{ position:'absolute', bottom:0, right:0, width:10, height:10, borderRadius:'50%', background:'#09f647', border:'2px solid #0f1220', animation:'ai-blink 2s ease-in-out infinite' }} />
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#fff', fontFamily:"'Sora',sans-serif", lineHeight:1 }}>TPIP Sports AI</div>
                  <div style={{ fontSize:10, color:'#09f647', fontFamily:"'IBM Plex Mono',monospace", marginTop:3 }}>● Online · Analysing your profile</div>
                </div>
                <div style={{ marginLeft:'auto', background:'rgba(141,89,255,0.15)', border:'1px solid rgba(141,89,255,0.3)', borderRadius:100, padding:'3px 10px', fontSize:10, color:'#c4b5fd', fontFamily:"'IBM Plex Mono',monospace", fontWeight:600 }}>WORLD FIRST 🌍</div>
              </div>

              {/* Chat messages */}
              <div style={{ padding:'18px 16px', display:'flex', flexDirection:'column', gap:14 }}>

                {/* AI message 1 */}
                <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#8d59ff,#227eff)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="white" opacity="0.9"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>
                  </div>
                  <div style={{ background:'rgba(141,89,255,0.12)', border:'1px solid rgba(141,89,255,0.2)', borderRadius:'4px 16px 16px 16px', padding:'10px 14px', maxWidth:'85%' }}>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', lineHeight:'155%' }}>
                      Hi Arjun! I have scanned your last <span style={{ color:'#c4b5fd', fontWeight:600 }}>12 sessions</span>, <span style={{ color:'#c4b5fd', fontWeight:600 }}>8 video clips</span>, and your coach feedback. I found <span style={{ color:'#f97316', fontWeight:600 }}>3 areas</span> that need your attention right now.
                    </div>
                  </div>
                </div>

                {/* User message */}
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <div style={{ background:'rgba(34,126,255,0.15)', border:'1px solid rgba(34,126,255,0.25)', borderRadius:'16px 4px 16px 16px', padding:'10px 14px', maxWidth:'80%' }}>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)', lineHeight:'155%' }}>What should I focus on first?</div>
                  </div>
                </div>

                {/* AI message 2 — insight */}
                <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#8d59ff,#227eff)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="white" opacity="0.9"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8, maxWidth:'87%' }}>
                    <div style={{ background:'rgba(141,89,255,0.12)', border:'1px solid rgba(141,89,255,0.2)', borderRadius:'4px 16px 16px 16px', padding:'10px 14px' }}>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', lineHeight:'155%', marginBottom:10 }}>
                        Your <span style={{ color:'#d0ff00', fontWeight:600 }}>front-foot trigger</span> is delayed by ~14ms — I caught it in 6 of your last 8 clips. Fix this first. Here is your priority plan:
                      </div>
                      {/* Priority chips */}
                      {[
                        { n:'01', label:'Trigger movement drill', tag:'HIGH IMPACT', tc:'#f97316', bc:'rgba(249,115,22,0.12)', br:'rgba(249,115,22,0.25)' },
                        { n:'02', label:'Shot selection under pace', tag:'MEDIUM', tc:'#d0ff00', bc:'rgba(208,255,0,0.08)', br:'rgba(208,255,0,0.2)' },
                        { n:'03', label:'Mental reset routine', tag:'QUICK WIN', tc:'#09f647', bc:'rgba(9,246,71,0.08)', br:'rgba(9,246,71,0.2)' },
                      ].map(p => (
                        <div key={p.n} style={{ display:'flex', alignItems:'center', gap:8, background:p.bc, border:`1px solid ${p.br}`, borderRadius:8, padding:'7px 10px', marginBottom:6 }}>
                          <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', fontFamily:"'IBM Plex Mono',monospace", flexShrink:0 }}>{p.n}</span>
                          <span style={{ fontSize:12, color:'rgba(255,255,255,0.7)', flex:1 }}>{p.label}</span>
                          <span style={{ fontSize:9, fontWeight:700, color:p.tc, fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'0.5px', flexShrink:0 }}>{p.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Typing indicator */}
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#8d59ff,#227eff)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="white" opacity="0.9"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>
                  </div>
                  <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'4px 16px 16px 16px', padding:'10px 16px', display:'flex', gap:5, alignItems:'center' }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'rgba(141,89,255,0.7)', animation:`ai-blink 1.2s ease-in-out ${i*0.2}s infinite` }} />
                    ))}
                  </div>
                  <span style={{ fontSize:10, color:'rgba(255,255,255,0.2)', fontFamily:"'IBM Plex Mono',monospace" }}>AI is preparing your drill plan…</span>
                </div>
              </div>

              {/* Input bar */}
              <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:10, alignItems:'center' }}>
                <div style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:100, padding:'8px 16px', fontSize:12, color:'rgba(255,255,255,0.25)', fontFamily:"'IBM Plex Mono',monospace" }}>Ask your AI coach anything…</div>
                <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#8d59ff,#5b21b6)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </div>
              </div>

              {/* Scan line */}
              <div style={{ position:'absolute', inset:0, borderRadius:24, overflow:'hidden', pointerEvents:'none' }}>
                <div style={{ position:'absolute', left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(141,89,255,0.35),transparent)', animation:'ai-scan 4s linear infinite' }} />
              </div>
            </div>

            {/* Floating tag — bottom left */}
            <div style={{ position:'absolute', bottom:-14, left:-18, background:'#0f1220', border:'1px solid rgba(9,246,71,0.3)', borderRadius:12, padding:'9px 14px', display:'flex', alignItems:'center', gap:8, zIndex:2, boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#09f647', animation:'ai-blink 2s ease-in-out infinite' }} />
              <span style={{ fontSize:11, color:'#09f647', fontFamily:"'IBM Plex Mono',monospace", fontWeight:600 }}>+18% in 60 days</span>
            </div>

            {/* Floating tag — top right */}
            <div style={{ position:'absolute', top:-14, right:-14, background:'#0f1220', border:'1px solid rgba(208,255,0,0.3)', borderRadius:12, padding:'9px 14px', display:'flex', alignItems:'center', gap:8, zIndex:2, boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>
              <span style={{ fontSize:13 }}>🧠</span>
              <span style={{ fontSize:11, color:'#d0ff00', fontFamily:"'IBM Plex Mono',monospace", fontWeight:600 }}>AI-Powered</span>
            </div>
          </div>
        </div>
      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          WHAT EVERY STUDENT GETS — gold tint
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background:'linear-gradient(135deg, #1a1200 0%, #0d1017 40%, #1a0d00 100%)', padding:'100px 24px', borderTop:'1px solid rgba(255,240,73,0.12)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', width:700, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,240,73,0.05) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(26px,3.5vw,42px)', fontWeight:400, letterSpacing:'-1.6px', color:'#fff', lineHeight:'108%', marginBottom:14 }}>
              <span className="shine-h">What every student</span><br />
              <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.22)' }}>receives at TPIP</em>
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.35)', maxWidth:400, margin:'0 auto' }}>This converts training sessions into long-term sports development.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'center' }}>
            {/* Left — list */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {[
                { icon:'📊', title:'Personal Performance Breakdown', desc:'Batting avg, reaction speed, economy, success rate — every number tracked from day one.', color:PURPLE },
                { icon:'🎯', title:'Technical Tendency Analysis', desc:'Where you leak runs, where your technique breaks — identified precisely with video.', color:BLUE },
                { icon:'🗺️', title:'Improvement Roadmap', desc:'Month-by-month plan built around your weaknesses. Not a generic curriculum.', color:'#f59e0b' },
                { icon:'💬', title:'Video Feedback within 24hrs', desc:'Timestamped coach comments on every clip you submit. Frame-accurate corrections.', color:GREEN },
                { icon:'🎓', title:'Role Clarity Evaluation', desc:"Sport role, tactical phase, field position — we define where you best fit in a team.", color:YELLOW },
                { icon:'🏅', title:'NSDC Certificate', desc:'Government-recognised on completion. Accepted by selection panels and academies.', color:'#ec4899' },
              ].map((item) => (
                <div key={item.title} style={{ background:`linear-gradient(135deg, ${item.color}0f 0%, rgba(13,16,23,0.8) 100%)`, border:`1px solid ${item.color}33`, borderRadius:14, padding:'22px 20px',
                  transition:'border-color 0.2s, transform 0.2s, box-shadow 0.2s', cursor:'default' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=`${item.color}66`; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 32px ${item.color}20` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=`${item.color}33`; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}>
                  <div style={{ fontSize:28, marginBottom:12 }}>{item.icon}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:7, lineHeight:'130%' }}>{item.title}</div>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.58)', lineHeight:'158%', margin:0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
            {/* Right — analysis metrics video, merged into gold section bg */}
            <div style={{ position:'relative', aspectRatio:'3/4' }}>
              {/* Gold glow halo behind video */}
              <div style={{ position:'absolute', inset:-30, borderRadius:24, background:'radial-gradient(ellipse, rgba(245,158,11,0.22) 0%, rgba(255,240,73,0.08) 40%, transparent 70%)', pointerEvents:'none', zIndex:0, filter:'blur(30px)' }} />
              {/* Shimmer ring */}
              <div style={{ position:'absolute', inset:-8, borderRadius:20, border:'1px solid rgba(245,158,11,0.15)', boxShadow:'0 0 60px rgba(245,158,11,0.08)', pointerEvents:'none', zIndex:0 }} />
              <video src="/analysis-metrics.mp4" autoPlay loop muted playsInline
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:14, opacity:0.9, position:'relative', zIndex:1 }} />
              {/* 4-edge fade blending into section background #1a1200 / #0d1017 */}
              <div style={{ position:'absolute', inset:0, borderRadius:14, zIndex:2, pointerEvents:'none',
                background:`
                  linear-gradient(to left,   #0d1017 0%, transparent 20%),
                  linear-gradient(to right,  #1a1200 0%, transparent 16%),
                  linear-gradient(to bottom, #1a1200 0%, transparent 20%),
                  linear-gradient(to top,    #0d1017 0%, transparent 24%)
                `}} />
              {/* Gold shimmer tint */}
              <div style={{ position:'absolute', inset:0, borderRadius:14, zIndex:3, pointerEvents:'none', background:'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, transparent 55%)' }} />
              {/* Live badge */}
              <div style={{ position:'absolute', top:20, left:20, zIndex:10, display:'flex', alignItems:'center', gap:6, background:'rgba(13,16,23,0.88)', backdropFilter:'blur(14px)', border:'1px solid rgba(245,158,11,0.4)', borderRadius:100, padding:'5px 14px', boxShadow:'0 4px 16px rgba(245,158,11,0.2)' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#f59e0b', display:'inline-block', boxShadow:'0 0 10px #f59e0b' }} />
                <span style={{ fontSize:11, color:'#fbbf24', fontFamily:"'IBM Plex Mono',monospace", fontWeight:600, letterSpacing:'1px' }}>LIVE ANALYSIS</span>
              </div>
              {/* Quote card at bottom */}
              <div style={{ position:'absolute', bottom:20, left:16, right:16, zIndex:10, background:'rgba(13,16,23,0.86)', backdropFilter:'blur(16px)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:12, padding:'16px 18px' }}>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.82)', fontStyle:'italic', lineHeight:'155%', margin:'0 0 12px' }}>
                  "I don't just train anymore — I know exactly what to fix each month."
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:PURPLE, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', flexShrink:0 }}>PK</div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>Praveen Kumar</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>State U-19 · Elite Performance Program</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PRICING — tabbed switcher
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="pricing" ref={pricRef} style={{ background:'linear-gradient(135deg, #0d1117 0%, #150d25 50%, #0d1117 100%)', padding:'100px 24px', borderTop:'1px solid rgba(141,89,255,0.15)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'20%', right:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(141,89,255,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:860, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(26px,3.5vw,40px)', fontWeight:400, letterSpacing:'-1.6px', color:'#fff', lineHeight:'108%', marginBottom:10 }}>
              <span className="shine-h">Simple, transparent</span><br />
              <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.35)' }}>pricing</em>
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)' }}>No hidden fees. Cancel anytime.</p>
          </div>

          {/* Tab switcher */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:40 }}>
            <div style={{ display:'inline-flex', background:'rgba(255,255,255,0.04)', border:`1px solid ${STR}`, borderRadius:100, padding:4, gap:2 }}>
              {PLANS.map((p, i) => (
                <button key={p.tab} onClick={() => setPricingTab(i)} style={{
                  padding:'9px 24px', borderRadius:100, border:'none', cursor:'pointer',
                  background: pricingTab === i ? PURPLE : 'transparent',
                  color: pricingTab === i ? '#fff' : 'rgba(255,255,255,0.45)',
                  fontSize:13, fontWeight:600,
                  fontFamily:"'IBM Plex Mono',monospace",
                  transition:'all 0.25s',
                  boxShadow: pricingTab === i ? `0 4px 20px ${PURPLE}55` : 'none',
                }}>
                  {p.tab}
                </button>
              ))}
            </div>
          </div>

          {/* Active plan card */}
          {PLANS.map((p, i) => i !== pricingTab ? null : (
            <div key={p.tab} style={{
              background: p.popular ? `linear-gradient(135deg,${PURPLE}18,${BLUE}0a)` : BG14,
              border: p.popular ? `2px solid ${PURPLE}66` : `1px solid ${STR}`,
              borderRadius:20, padding:'48px 52px',
              boxShadow: p.popular ? `0 0 80px ${PURPLE}22` : 'none',
              display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center',
              opacity: pricV ? 1 : 0, transition:'opacity 0.5s ease',
              animation:'chipIn 0.4s ease both',
            }}>
              {/* Left: price + name */}
              <div>
                {p.popular && (
                  <div style={{ display:'inline-block', background:PURPLE, color:'#fff', fontSize:10, fontWeight:700, padding:'4px 16px', borderRadius:100, letterSpacing:'1px', marginBottom:16 }}>
                    BEST VALUE
                  </div>
                )}
                <div style={{ fontSize:14, fontWeight:600, color:'#fff', marginBottom:4, fontFamily:"'Sora',sans-serif" }}>{p.name}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.38)', marginBottom:16, lineHeight:'150%' }}>{p.tagline}</div>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(38px,5vw,60px)', fontWeight:400, color:'#fff', letterSpacing:'-2px', lineHeight:1, marginBottom:4 }}>
                  {p.price}
                </div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)', marginBottom:32 }}>{p.period}</div>
                <Link to="/register" style={{
                  display:'inline-flex', alignItems:'center', gap:10,
                  background: p.popular ? PURPLE : 'rgba(255,255,255,0.08)',
                  color:'#fff', fontWeight:600, fontSize:14,
                  padding:'13px 28px', borderRadius:100, border:'none',
                  textDecoration:'none',
                  boxShadow: p.popular ? `0 4px 24px ${PURPLE}55` : 'none',
                  transition:'all 0.2s',
                }}>
                  Get Started →
                </Link>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.2)', marginTop:14, fontFamily:"'IBM Plex Mono',monospace" }}>
                  No hidden fees · Cancel anytime
                </div>
              </div>

              {/* Right: feature list */}
              <div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:'1.5px', marginBottom:18 }}>WHAT'S INCLUDED</div>
                <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:12 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display:'flex', gap:12, fontSize:15, color:'rgba(255,255,255,0.75)', alignItems:'center' }}>
                      <div style={{ width:22, height:22, borderRadius:'50%', background:`${PURPLE}25`, border:`1px solid ${PURPLE}55`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke={PURPLE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TESTIMONIALS — white (like Nexsas light sections)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={testRef} style={{ background:BG7, padding:'100px 24px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(26px,3.5vw,40px)', fontWeight:400, letterSpacing:'-1.6px', textAlign:'center', color:'rgba(13,16,23,0.9)', marginBottom:52, lineHeight:'108%' }}>
            <span className="shine-h-dark">Results that</span><br />
            <em style={{ fontStyle:'italic', color:'rgba(13,16,23,0.22)' }}>speak for themselves</em>
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {REVIEWS.slice(0,3).map((t, i) => (
              <div key={t.name} style={{ background:'#fff', border:'1.5px solid rgba(7,8,5,0.08)', borderRadius:14, padding:'24px', opacity:testV?1:0, transform:testV?'none':'translateY(20px)', transition:`all 0.6s ease ${i*0.1}s`, cursor:'default' }}
              onMouseEnter={e=>{e.currentTarget.style.border=`1.5px solid ${PURPLE}`;e.currentTarget.style.boxShadow=`0 8px 32px ${PURPLE}18`}}
              onMouseLeave={e=>{e.currentTarget.style.border='1.5px solid rgba(7,8,5,0.08)';e.currentTarget.style.boxShadow='none'}}
              >
                <div style={{ display:'flex', gap:2, marginBottom:14 }}>
                  {[...Array(5)].map((_,j)=><span key={j} style={{fontSize:13,color:PURPLE}}>★</span>)}
                </div>
                <p style={{ fontSize:13, color:'rgba(13,16,23,0.55)', lineHeight:'170%', margin:'0 0 18px', fontStyle:'italic' }}>{t.text}</p>
                <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:14, borderTop:'1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:`${PURPLE}18`, border:`1px solid ${PURPLE}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:PURPLE, flexShrink:0, fontFamily:"'Sora',sans-serif" }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#0d1017' }}>{t.name}</div>
                    <div style={{ fontSize:11, color:'rgba(13,16,23,0.4)', marginTop:1 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CTA — dark with purple glow
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background:'linear-gradient(135deg, #1a0a3d 0%, #0d1117 40%, #0d1a2e 100%)', padding:'100px 24px', borderTop:'1px solid rgba(141,89,255,0.2)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(141,89,255,0.18) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:740, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(30px,4vw,52px)', fontWeight:400, color:'#fff', letterSpacing:'-2px', marginBottom:16, lineHeight:'108%' }}>
            <span className="shine-h">Ready to start</span><br /><em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.35)' }}>training like a champion?</em>
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.6)', marginBottom:44 }}>Join 128K+ athletes already on their path to excellence.</p>

          {/* Same exact button style as hero */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:48, position:'relative' }}>
            <div style={{ position:'relative', display:'inline-block' }}>
              <span style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', height:68, width:'107%', minWidth:220, borderRadius:100, border:'1px solid rgba(255,255,255,0.18)', pointerEvents:'none' }} />
              <span style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', height:84, width:'115%', minWidth:240, borderRadius:100, border:'1px solid rgba(255,255,255,0.09)', pointerEvents:'none' }} />
              <span style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', height:100, width:'123%', minWidth:260, borderRadius:100, border:'1px solid rgba(255,255,255,0.05)', pointerEvents:'none' }} />
              <Link to="/register" className="cta-primary" style={{ display:'inline-flex', alignItems:'center', background:BG7, borderRadius:100, padding:'5px 6px 5px 24px', gap:12, boxShadow:`0 3px 18px rgba(141,89,255,0.8)`, position:'relative', zIndex:1 }}>
                <span style={{ fontSize:15, color:BG6, fontWeight:600, fontFamily:"'Inter Tight',sans-serif" }}>Enroll Now</span>
                <div style={{ width:42, height:42, borderRadius:'50%', background:BG6, boxShadow:'0 4px 4px rgba(0,0,0,0.4), 0 0 8px rgba(255,255,255,0.5) inset', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform:'rotate(-45deg)' }}><path d="M7 17L17 7"/><path d="M7 7H17V17"/></svg>
                </div>
              </Link>
            </div>
            <Link to="/login" style={{ fontSize:14, color:'rgba(255,255,255,0.4)', padding:'12px 20px', borderRadius:100, border:`1px solid ${STR}`, background:'transparent', transition:'all 0.2s' }}>
              Sign in instead
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FOOTER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer style={{ background:BG5, borderTop:`1px solid ${STR}`, padding:'56px 24px 28px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:48 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:`linear-gradient(135deg,${PURPLE},#5b21b6)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🏏</div>
                <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:13, color:'#fff' }}>TPIP Academy</span>
              </div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.28)', lineHeight:'170%', maxWidth:240, margin:'0 0 18px' }}>India's leading sports LMS connecting aspiring athletes with elite coaches across all sports.</p>
            </div>
            {[
              { title:'Platform', links:[['Dashboard','/login'],['Programs','/programs'],['Live Sessions','/login'],['Certificates','/login']] },
              { title:'Company',  links:[['About Us','/about'],['Coaches','/coaches'],['Pricing','#pricing'],['Contact','#']] },
              { title:'Legal',    links:[['Privacy','#'],['Terms','#'],['Refund Policy','#']] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.22)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:14 }}>{col.title}</div>
                <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10 }}>
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      {href.startsWith('/') ? <Link to={href} className="foot-link">{label}</Link> : <a href={href} className="foot-link">{label}</a>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', paddingTop:20, borderTop:`1px solid ${STR}` }}>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.18)' }}>© 2025 TPIP Academy. All rights reserved.</span>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.18)' }}>Built with ❤️ for All Sports</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
