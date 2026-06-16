import { useState } from 'react'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const skills = [
  { name: 'Batting', pct: 72, color: LIME },
  { name: 'Bowling', pct: 45, color: '#3b82f6' },
  { name: 'Fielding', pct: 68, color: '#f97316' },
  { name: 'Fitness', pct: 80, color: '#a855f7' },
  { name: 'Strategy', pct: 55, color: '#06b6d4' },
]

const monthlyData = [
  { month: 'Dec', hours: 8, sessions: 3 },
  { month: 'Jan', hours: 12, sessions: 5 },
  { month: 'Feb', hours: 10, sessions: 4 },
  { month: 'Mar', hours: 18, sessions: 7 },
  { month: 'Apr', hours: 22, sessions: 9 },
  { month: 'May', hours: 16, sessions: 6 },
]
const maxHours = Math.max(...monthlyData.map(d => d.hours))

const achievements = [
  { icon: '🏏', title: 'First Session', desc: 'Completed your first coaching session', earned: true, date: 'Jan 15' },
  { icon: '🔥', title: '10 Drills Completed', desc: 'Submitted 10 drill recordings', earned: true, date: 'Feb 20' },
  { icon: '📅', title: 'Month Streak', desc: '30 consecutive days active', earned: true, date: 'Mar 1' },
  { icon: '⭐', title: 'Top Performer', desc: 'Score 90+ on any drill', earned: false, date: null },
  { icon: '🎓', title: 'Course Graduate', desc: 'Complete your first full course', earned: false, date: null },
  { icon: '💪', title: 'Fitness Champion', desc: 'Fitness score exceeds 90%', earned: false, date: null },
]

export default function StudentProgress() {
  const totalHours = monthlyData.reduce((a, b) => a + b.hours, 0)
  const totalSessions = monthlyData.reduce((a, b) => a + b.sessions, 0)
  const overallProgress = Math.round(skills.reduce((a, s) => a + s.pct, 0) / skills.length)

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '1px' }}>MY PROGRESS</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 4, marginBottom: 0, fontSize: 14 }}>Track your sports development journey</p>
      </div>

      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Overall progress circle */}
        <div style={{
          background: CARD, borderRadius: 16, padding: '28px 24px',
          border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 24,
        }}>
          <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
            <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="45" cy="45" r="38" fill="none" stroke={BORDER} strokeWidth="8" />
              <circle
                cx="45" cy="45" r="38" fill="none"
                stroke={LIME} strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 38}`}
                strokeDashoffset={`${2 * Math.PI * 38 * (1 - overallProgress / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column',
            }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{overallProgress}%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Overall Progress</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Across all skill areas</div>
            <div style={{
              marginTop: 10, display: 'inline-block',
              background: LIME + '22', color: LIME,
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: `1px solid ${LIME}44`,
            }}>
              Intermediate Level
            </div>
          </div>
        </div>

        {/* Days streak */}
        <div style={{
          background: LIME + '18', borderRadius: 16, padding: '28px 24px',
          border: `1px solid ${LIME}44`,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Current Streak</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 48, fontWeight: 800, color: LIME }}>14</span>
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>days</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>🔥 Keep it going!</div>
        </div>

        {/* Total hours */}
        <div style={{ background: CARD, borderRadius: 16, padding: '28px 24px', border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Total Training</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: '#fff' }}>{totalHours}</span>
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)' }}>hours</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: LIME }}>{totalSessions}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Sessions</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: LIME }}>6</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Months</div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills + Monthly chart row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Skills */}
        <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>Skill Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {skills.map(skill => (
              <div key={skill.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{skill.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: skill.color }}>{skill.pct}%</span>
                </div>
                <div style={{ background: BORDER, borderRadius: 6, height: 10, position: 'relative' }}>
                  <div style={{
                    height: '100%', borderRadius: 6,
                    background: skill.color,
                    width: `${skill.pct}%`,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Peer comparison */}
          <div style={{
            marginTop: 20, background: LIME + '15', borderRadius: 10,
            padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
            border: `1px solid ${LIME}30`,
          }}>
            <span style={{ fontSize: 20 }}>📊</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: LIME }}>You're in the top 35%</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>of students at your level (anonymized)</div>
            </div>
          </div>
        </div>

        {/* Monthly chart */}
        <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>Monthly Activity</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>Training hours per month</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {monthlyData.map(d => (
              <div key={d.month} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', width: 28, flexShrink: 0 }}>{d.month}</span>
                <div style={{ flex: 1, background: BORDER, borderRadius: 6, height: 28, position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 6,
                    background: `linear-gradient(90deg, ${LIME}, ${LIME}99)`,
                    width: `${(d.hours / maxHours) * 100}%`,
                    display: 'flex', alignItems: 'center',
                    transition: 'width 0.5s',
                  }}>
                    <span style={{ fontSize: 11, color: '#000', fontWeight: 700, paddingLeft: 8, whiteSpace: 'nowrap' }}>
                      {d.hours}h
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', width: 50, flexShrink: 0 }}>{d.sessions} sess.</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>Achievements</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {achievements.map(a => (
            <div
              key={a.title}
              style={{
                borderRadius: 12, padding: '16px 18px',
                border: a.earned ? `1px solid ${LIME}44` : `1px dashed ${BORDER}`,
                background: a.earned ? LIME + '11' : CARD2,
                opacity: a.earned ? 1 : 0.6,
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}
            >
              <span style={{ fontSize: 28 }}>{a.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: a.earned ? LIME : 'rgba(255,255,255,0.35)' }}>{a.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4, marginTop: 2 }}>{a.desc}</div>
                {a.earned && a.date && (
                  <div style={{ fontSize: 10, color: LIME, marginTop: 4, fontWeight: 600 }}>Earned {a.date}</div>
                )}
                {!a.earned && (
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Not yet earned</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
