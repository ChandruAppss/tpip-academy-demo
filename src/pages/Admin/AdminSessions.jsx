import { useState } from 'react'
import toast from 'react-hot-toast'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const BORDER = '#21262d'

const MOCK_SESSIONS = [
  { id: 1, title: 'Performance Masterclass – Day 1', coach: 'Rahul Sharma', students: 14, date: '2026-06-02', time: '09:00', duration: 90, type: 'Video Call', status: 'Upcoming', description: 'Coach leads a structured video session covering stance, footwork, and technique fundamentals.' },
  { id: 2, title: 'Pace Bowling Drills', coach: 'Anil Mehta', students: 8, date: '2026-06-03', time: '11:00', duration: 60, type: 'In-Person', status: 'Upcoming', description: 'On-ground drill session focusing on run-up, seam position, and variation deliveries at the academy.' },
  { id: 3, title: 'Agility & Field Techniques', coach: 'Sunita Rao', students: 20, date: '2026-06-01', time: '16:00', duration: 60, type: 'Video Call', status: 'Live', description: 'Live video session demonstrating agility drills, field positioning, and movement mechanics.' },
  { id: 4, title: 'Spin Bowling Workshop', coach: 'Kapil Dev Jr', students: 12, date: '2026-06-01', time: '10:00', duration: 90, type: 'Group Session', status: 'Live', description: 'Multi-student group session exploring off-spin, leg-spin, and flight variation in a workshop format.' },
  { id: 5, title: 'Sports Fitness Boot Camp', coach: 'Rahul Sharma', students: 25, date: '2026-05-20', time: '07:00', duration: 90, type: 'In-Person', status: 'Completed', description: 'Physical conditioning at the academy ground — agility ladders, sprints, and sport-specific endurance work.' },
  { id: 6, title: 'Mental Toughness Session', coach: 'Priya Singh', students: 18, date: '2026-05-18', time: '15:00', duration: 60, type: 'Video Call', status: 'Completed', description: 'Video call session on mental preparation, pressure situations, and building a pre-match routine.' },
  { id: 7, title: 'Advanced Performance – Day 2', coach: 'Anil Mehta', students: 10, date: '2026-05-15', time: '09:00', duration: 60, type: 'Video Call', status: 'Cancelled', description: 'Continuation of performance masterclass covering power training and technical skills. Cancelled due to technical issues.' },
  { id: 8, title: 'Junior Sports Intro', coach: 'Sunita Rao', students: 30, date: '2026-05-10', time: '11:00', duration: 30, type: 'Group Session', status: 'Cancelled', description: 'Introductory group session for young athletes — cancelled due to insufficient enrollment.' },
]

const ALL_TABS = ['All', 'Upcoming', 'Live', 'Completed', 'Cancelled']

const STATUS_COLORS = {
  Live: { bg: '#adff2f22', color: '#adff2f', border: '#adff2f44' },
  Upcoming: { bg: '#3b82f622', color: '#3b82f6', border: '#3b82f644' },
  Completed: { bg: '#ffffff14', color: 'rgba(255,255,255,0.45)', border: '#ffffff22' },
  Cancelled: { bg: '#ef444422', color: '#ef4444', border: '#ef444444' },
}

const TYPE_ICONS = {
  'Video Call': '📹',
  'In-Person': '🏟️',
  'Group Session': '🎓',
}

const TYPE_COLORS = {
  'Video Call': { bg: '#7c3aed22', color: '#a78bfa', border: '#7c3aed44' },
  'In-Person': { bg: '#d9770622', color: '#fb923c', border: '#d9770644' },
  'Group Session': { bg: '#0891b222', color: '#22d3ee', border: '#0891b244' },
}

function getWeekDays() {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function formatDate(d) {
  return d.toISOString().split('T')[0]
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function AdminSessions() {
  const [activeTab, setActiveTab] = useState('All')

  const weekDays = getWeekDays()
  const todayStr = formatDate(new Date())

  const filtered = activeTab === 'All'
    ? MOCK_SESSIONS
    : MOCK_SESSIONS.filter(s => s.status === activeTab)

  const stats = {
    total: MOCK_SESSIONS.length,
    live: MOCK_SESSIONS.filter(s => s.status === 'Live').length,
    upcoming: MOCK_SESSIONS.filter(s => s.status === 'Upcoming').length,
    completed: MOCK_SESSIONS.filter(s => s.status === 'Completed').length,
  }

  const handleMonitor = (s) => toast.success(`Opening monitor for: ${s.title}`)
  const handleView = (s) => toast.success(`Viewing session: ${s.title}`)

  return (
    <div style={{ background: BG, minHeight: '100vh', padding: '28px 32px', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: '#fff' }}>Sessions</h1>
        <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
          Monitor, track, and manage all coaching sessions across the academy.
        </p>
      </div>

      {/* How Sessions Work Banner */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          How Sessions Work
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            {
              icon: '📹',
              title: 'Video Call',
              color: '#a78bfa',
              bg: '#7c3aed18',
              border: '#7c3aed33',
              desc: 'Coach and student connect via in-platform video. Admin can monitor live sessions and view recordings after the session ends.',
            },
            {
              icon: '🏟️',
              title: 'In-Person',
              color: '#fb923c',
              bg: '#d9770618',
              border: '#d9770633',
              desc: 'Session happens at the academy ground. Coach marks attendance and uploads notes and performance summaries post-session.',
            },
            {
              icon: '🎓',
              title: 'Group Session',
              color: '#22d3ee',
              bg: '#0891b218',
              border: '#0891b233',
              desc: 'Multiple students join one coach session. Ideal for drills, workshops, and team training exercises.',
            },
          ].map(item => (
            <div key={item.title} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: item.color, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Sessions', value: stats.total, color: '#fff', icon: '📋' },
          { label: 'Live Now', value: stats.live, color: LIME, icon: '🔴' },
          { label: 'Upcoming', value: stats.upcoming, color: '#3b82f6', icon: '📅' },
          { label: 'Completed', value: stats.completed, color: 'rgba(255,255,255,0.45)', icon: '✅' },
        ].map(stat => (
          <div key={stat.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28 }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Timetable */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '20px 22px', marginBottom: 28 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: '#fff' }}>Weekly Overview</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {weekDays.map((d, i) => {
            const dateStr = formatDate(d)
            const daySessions = MOCK_SESSIONS.filter(s => s.date === dateStr)
            const isToday = dateStr === todayStr
            return (
              <div key={dateStr} style={{ background: isToday ? '#adff2f0d' : '#0d111780', border: `1px solid ${isToday ? LIME + '44' : BORDER}`, borderRadius: 10, padding: '10px 8px', minHeight: 90 }}>
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isToday ? LIME : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{DAY_LABELS[i]}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: isToday ? LIME : 'rgba(255,255,255,0.7)', lineHeight: 1.2 }}>{d.getDate()}</div>
                </div>
                {daySessions.length === 0 ? (
                  <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 8 }}>No sessions</div>
                ) : (
                  daySessions.map(s => {
                    const sc = STATUS_COLORS[s.status]
                    return (
                      <div key={s.id} style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 6, padding: '4px 6px', marginBottom: 4 }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: sc.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.time}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
                      </div>
                    )
                  })
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {ALL_TABS.map(tab => {
          const active = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: `1px solid ${active ? LIME + '66' : BORDER}`,
                background: active ? LIME + '18' : 'transparent',
                color: active ? LIME : 'rgba(255,255,255,0.5)',
                fontWeight: active ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab}
              {tab !== 'All' && (
                <span style={{ marginLeft: 6, background: active ? LIME + '33' : '#ffffff18', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>
                  {MOCK_SESSIONS.filter(s => s.status === tab).length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Session Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.length === 0 ? (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>
            No sessions found.
          </div>
        ) : (
          filtered.map(s => {
            const sc = STATUS_COLORS[s.status]
            const tc = TYPE_COLORS[s.type] || TYPE_COLORS['Video Call']
            const isLive = s.status === 'Live'
            return (
              <div
                key={s.id}
                style={{
                  background: CARD,
                  border: `1px solid ${isLive ? LIME + '33' : BORDER}`,
                  borderRadius: 14,
                  padding: '20px 22px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Live pulse bar */}
                {isLive && (
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: LIME, borderRadius: '14px 0 0 14px' }} />
                )}

                {/* Type Icon */}
                <div style={{ background: tc.bg, border: `1px solid ${tc.border}`, borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {TYPE_ICONS[s.type] || '📋'}
                </div>

                {/* Main content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>{s.title}</span>
                    {isLive && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: LIME }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: LIME, display: 'inline-block', boxShadow: `0 0 6px ${LIME}` }} />
                        LIVE
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
                    {s.description}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>👤</span> {s.coach}
                    </span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>📅</span> {s.date} at {s.time}
                    </span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>⏱</span> {s.duration} min
                    </span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>👥</span> {s.students} students
                    </span>
                  </div>
                </div>

                {/* Badges + Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {s.status}
                    </span>
                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>
                      {TYPE_ICONS[s.type]} {s.type}
                    </span>
                  </div>
                  {isLive ? (
                    <button
                      onClick={() => handleMonitor(s)}
                      style={{ padding: '8px 18px', borderRadius: 8, background: LIME, color: '#000', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      🔴 Monitor
                    </button>
                  ) : (
                    <button
                      onClick={() => handleView(s)}
                      style={{ padding: '8px 18px', borderRadius: 8, background: '#ffffff14', color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: 13, border: `1px solid ${BORDER}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      👁 View
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
