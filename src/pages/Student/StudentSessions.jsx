import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import VideoCallModal from '../../components/student/VideoCallModal'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const INITIAL_ENROLLMENTS = [
  { id: 'e1', program: 'Elite Performance Masterclass', coach: 'Rahul Sharma', totalSessions: 16, usedSessions: 10, color: '#16a34a' },
  { id: 'e2', program: 'Fast Bowling Intensive', coach: 'Vikram Singh', totalSessions: 8, usedSessions: 5, color: '#3b82f6' },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']
const MOCK_WEEK_START = new Date('2026-05-25')

const mockTimetableSessions = [
  { id: 't1', dayIndex: 0, timeSlot: '10:00 AM', coach: 'Rahul Sharma', topic: 'Cover Drive Technique', duration: '60 min', type: 'Zoom', zoomLink: 'https://zoom.us/j/123456789', color: LIME + '18', textColor: LIME },
  { id: 't2', dayIndex: 2, timeSlot: '3:00 PM', coach: 'Vikram Singh', topic: 'Swing Bowling Basics', duration: '45 min', type: 'Zoom', zoomLink: 'https://zoom.us/j/987654321', color: '#3b82f618', textColor: '#3b82f6' },
  { id: 't3', dayIndex: 4, timeSlot: '11:00 AM', coach: 'Priya Nair', topic: 'Fielding Drills', duration: '90 min', type: 'In-person', location: 'TPIP Ground A', color: '#f9731618', textColor: '#f97316' },
  { id: 't4', dayIndex: 6, timeSlot: '9:00 AM', coach: 'Rahul Sharma', topic: 'Mental Game & Strategy', duration: '30 min', type: 'Zoom', zoomLink: 'https://zoom.us/j/112233445', color: '#a855f718', textColor: '#a855f7' },
]

const mockUpcoming = [
  { id: 'u1', coach: 'Rahul Sharma', coachInitials: 'RS', date: '2026-05-30', time: '10:00 AM', duration: '60 min', type: 'Zoom', topic: 'Cover Drive Technique', zoomLink: 'https://zoom.us/j/123456789', daysUntil: 3 },
  { id: 'u2', coach: 'Vikram Singh', coachInitials: 'VS', date: '2026-06-02', time: '3:00 PM', duration: '45 min', type: 'In-person', topic: 'Yorker Training', location: 'TPIP Ground A', daysUntil: 6 },
  { id: 'u3', coach: 'Priya Nair', coachInitials: 'PN', date: '2026-06-05', time: '11:00 AM', duration: '90 min', type: 'Zoom', topic: 'Fielding Drills', zoomLink: 'https://zoom.us/j/987654321', daysUntil: 9 },
]

const mockPast = [
  { id: 'p1', coach: 'Rahul Sharma', coachInitials: 'RS', date: '2026-05-20', time: '10:00 AM', duration: '60 min', type: 'Zoom', topic: 'Batting Stance Correction', notes: 'Great progress on stance. Keep head still on back foot shots. More follow-through needed.', feedback: 'Excellent session — Arjun showed real improvement in footwork. Focus area: late cut shot.' },
  { id: 'p2', coach: 'Vikram Singh', coachInitials: 'VS', date: '2026-05-15', time: '3:00 PM', duration: '45 min', type: 'In-person', topic: 'Swing Bowling Intro', notes: 'Covered seam position and wrist angle for outswing.', feedback: 'Good effort. Seam position much improved. Work on release point consistency.' },
  { id: 'p3', coach: 'Priya Nair', coachInitials: 'PN', date: '2026-05-10', time: '11:00 AM', duration: '30 min', type: 'Zoom', topic: 'Mental Game Intro', notes: 'Discussed pre-match routines and handling pressure situations.', feedback: null },
]

const COACHES = ['Rahul Sharma', 'Vikram Singh', 'Priya Nair']
const DURATIONS = ['30 min', '45 min', '60 min', '90 min']
const TABS = ['Timetable', 'Upcoming', 'Past', 'All']

function formatShortDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function barColor(remaining, total) {
  const pct = total > 0 ? remaining / total : 0
  if (pct > 0.5) return LIME
  if (pct > 0.25) return '#f97316'
  return '#ef4444'
}

function textColor(remaining) {
  if (remaining > 8) return LIME
  if (remaining >= 4) return '#f97316'
  return '#ef4444'
}

export default function StudentSessions() {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState(INITIAL_ENROLLMENTS)
  const [activeTab, setActiveTab] = useState('Timetable')
  const [weekOffset, setWeekOffset] = useState(0)
  const [showBookModal, setShowBookModal] = useState(false)
  const [expandedNotes, setExpandedNotes] = useState(new Set())
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [tutorWaiting, setTutorWaiting] = useState({})
  const [bookForm, setBookForm] = useState({
    coach: '', date: '', time: '', duration: '60 min', type: 'Zoom', topic: '', enrollmentId: '',
  })

  // Listen for tutor presence updates
  useEffect(() => {
    // Check localStorage for any active tutor requests
    const checkTutorPresence = () => {
      const newWaiting = {}
      mockTimetableSessions.forEach(session => {
        const tutorData = localStorage.getItem(`tutor_request_${session.id}`)
        if (tutorData) {
          try {
            newWaiting[session.id] = JSON.parse(tutorData)
          } catch (e) {
            // Invalid JSON, skip
          }
        }
      })
      setTutorWaiting(newWaiting)
    }

    // Check immediately on mount
    checkTutorPresence()

    // Also listen for storage events (from other tabs)
    const handleStorageChange = (e) => {
      if (e.key?.startsWith('tutor_request_')) {
        checkTutorPresence()
      }
    }

    // Poll for changes every 500ms (fallback for same-tab changes)
    const pollInterval = setInterval(checkTutorPresence, 500)

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(pollInterval)
    }
  }, [])

  const weekStart = new Date(MOCK_WEEK_START)
  weekStart.setDate(weekStart.getDate() + weekOffset * 7)
  const weekDates = DAYS.map((_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })
  const weekLabel = `${formatShortDate(weekDates[0])} – ${formatShortDate(weekDates[6])} ${weekDates[0].getFullYear()}`
  const todayDay = new Date('2026-05-27').getDay()
  const todayColIndex = ((todayDay + 6) % 7)

  const totalRemaining = enrollments.reduce((sum, e) => sum + (e.totalSessions - e.usedSessions), 0)

  const handleBook = () => {
    const { coach, date, time, topic, enrollmentId } = bookForm
    if (!coach || !date || !time || !topic.trim()) { toast.error('Please fill all required fields'); return }
    if (totalRemaining <= 0) { toast.error('No sessions remaining. Please top up first.'); return }
    const targetId = enrollmentId || enrollments.find(e => e.totalSessions - e.usedSessions > 0)?.id
    if (targetId) {
      setEnrollments(prev => prev.map(e => e.id === targetId ? { ...e, usedSessions: e.usedSessions + 1 } : e))
    }
    toast.success('Session booked successfully! 1 session deducted.')
    setShowBookModal(false)
    setBookForm({ coach: '', date: '', time: '', duration: '60 min', type: 'Zoom', topic: '', enrollmentId: '' })
  }

  const toggleNotes = (id) => {
    setExpandedNotes(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const inputStyle = {
    width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 8,
    padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box',
    color: '#fff', fontFamily: 'inherit',
  }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>

      {/* Session Balance Banner */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
          Session Balances
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {enrollments.map(enroll => {
            const remaining = enroll.totalSessions - enroll.usedSessions
            const pct = (enroll.usedSessions / enroll.totalSessions) * 100
            const bc = barColor(remaining, enroll.totalSessions)
            const tc = textColor(remaining)
            const isZero = remaining === 0
            return (
              <div key={enroll.id} style={{ background: CARD2, border: `1px solid ${isZero ? '#ef444440' : BORDER}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{enroll.program}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginLeft: 8 }}>Coach: {enroll.coach}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: tc }}>{remaining} of {enroll.totalSessions} remaining</span>
                  </div>
                  <div style={{ height: 6, background: BORDER, borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${100 - pct}%`, background: bc, borderRadius: 99 }} />
                  </div>
                </div>
                <button onClick={() => navigate('/student/payments')} style={{ padding: '7px 14px', borderRadius: 8, background: isZero ? '#ef4444' : 'transparent', color: isZero ? '#fff' : LIME, border: isZero ? 'none' : `1px solid ${LIME}`, cursor: 'pointer', fontWeight: 600, fontSize: 12, flexShrink: 0 }}>
                  Top Up →
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* How Sessions Work */}
<div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', width: '100%', marginBottom: 8 }}>How Sessions Work</div>
  <div style={{ flex: 1, minWidth: 200, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
    <span style={{ fontSize: 20 }}>📹</span>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Video Call Sessions</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Click "Join Session" at your scheduled time. Your coach joins from their end — you'll be connected instantly via our in-platform video call. No Zoom or third-party app needed.</div>
    </div>
  </div>
  <div style={{ flex: 1, minWidth: 200, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
    <span style={{ fontSize: 20 }}>🏟️</span>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>In-Person Sessions</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Head to the location shown (e.g. TPIP Ground A). Your coach marks your attendance after the session. Notes and feedback appear here within 24 hours.</div>
    </div>
  </div>
  <div style={{ flex: 1, minWidth: 200, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
    <span style={{ fontSize: 20 }}>📅</span>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Booking a Session</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Each program comes with a set number of sessions. Click "+ Book Session", pick your coach, date and topic — 1 session credit is deducted from your balance on confirmation.</div>
    </div>
  </div>
</div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '1px' }}>MY SESSIONS</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 4, marginBottom: 0, fontSize: 14 }}>View your timetable and manage coaching sessions</p>
        </div>
        <button
          onClick={() => {
            if (totalRemaining === 0) { toast.error('No sessions remaining. Please top up first.'); return }
            setShowBookModal(true)
          }}
          style={{ padding: '10px 22px', background: totalRemaining === 0 ? '#374151' : LIME, color: totalRemaining === 0 ? 'rgba(255,255,255,0.5)' : '#000', border: 'none', borderRadius: 10, cursor: totalRemaining === 0 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14 }}
        >
          + Book Session
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '6px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: activeTab === tab ? LIME : 'transparent', color: activeTab === tab ? '#000' : 'rgba(255,255,255,0.5)' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* TIMETABLE TAB */}
      {activeTab === 'Timetable' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, background: CARD, borderRadius: 12, padding: '12px 20px', border: `1px solid ${BORDER}`, width: 'fit-content' }}>
            <button onClick={() => setWeekOffset(p => p - 1)} style={{ background: CARD2, border: `1px solid ${BORDER}`, cursor: 'pointer', borderRadius: 8, padding: '6px 14px', fontWeight: 600, color: '#fff', fontSize: 14 }}>← Prev Week</button>
            <span style={{ fontWeight: 600, color: '#fff', fontSize: 15, minWidth: 220, textAlign: 'center' }}>{weekLabel}</span>
            <button onClick={() => setWeekOffset(p => p + 1)} style={{ background: CARD2, border: `1px solid ${BORDER}`, cursor: 'pointer', borderRadius: 8, padding: '6px 14px', fontWeight: 600, color: '#fff', fontSize: 14 }}>Next Week →</button>
          </div>

          <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: `2px solid ${BORDER}` }}>
              <div style={{ padding: '12px 8px', background: CARD2 }} />
              {DAYS.map((day, i) => {
                const isToday = weekOffset === 0 && i === todayColIndex
                return (
                  <div key={day} style={{ padding: '12px 8px', textAlign: 'center', background: isToday ? LIME + '15' : CARD2, borderLeft: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isToday ? LIME : 'rgba(255,255,255,0.7)' }}>{day}</div>
                    <div style={{ fontSize: 12, color: isToday ? LIME + 'aa' : 'rgba(255,255,255,0.35)', marginTop: 2 }}>{formatShortDate(weekDates[i])}</div>
                  </div>
                )
              })}
            </div>
            {TIME_SLOTS.map((slot, rowIdx) => (
              <div key={slot} style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: rowIdx < TIME_SLOTS.length - 1 ? `1px solid ${BORDER}` : 'none', minHeight: 64 }}>
                <div style={{ padding: '8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: 10, paddingTop: 10 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500, whiteSpace: 'nowrap' }}>{slot}</span>
                </div>
                {DAYS.map((_, dayIdx) => {
                  const isToday = weekOffset === 0 && dayIdx === todayColIndex
                  const session = mockTimetableSessions.find(s => s.dayIndex === dayIdx && s.timeSlot === slot)
                  return (
                    <div key={dayIdx} style={{ borderLeft: `1px solid ${BORDER}`, background: isToday ? LIME + '05' : 'transparent', padding: 4 }}>
                      {session && (
                        <div style={{ background: session.color, borderRadius: 8, padding: '8px 10px', height: '100%', borderLeft: `3px solid ${session.textColor}`, position: 'relative' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{session.topic}</div>
                          <div style={{ fontSize: 10, color: '#fff', marginBottom: 3, opacity: 0.8 }}>{session.coach} · {session.duration}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>📹 Video</span>
                            {tutorWaiting[session.id] && (
                              <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 10, background: LIME, color: '#000', animation: 'pulse 2s infinite' }}>🟢 Tutor here</span>
                            )}
                            {session.type === 'Zoom' && (
                              <button
                                onClick={() => { setSelectedSession(session); setShowVideoCall(true); }}
                                style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: LIME, color: '#000', border: 'none', cursor: 'pointer' }}
                                title="Start video call"
                              >
                                Join
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPCOMING TAB */}
      {activeTab === 'Upcoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mockUpcoming.map(s => (
            <div key={s.id} style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: LIME, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{s.coachInitials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>{s.topic}</span>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.type === 'Zoom' ? '#3b82f620' : '#f9731620', color: s.type === 'Zoom' ? '#3b82f6' : '#f97316' }}>{s.type === 'Zoom' ? 'Video Call' : s.type}</span>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: LIME + '20', color: LIME }}>in {s.daysUntil} day{s.daysUntil !== 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>with {s.coach}</div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>📅 {s.date}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>🕐 {s.time}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>⏱ {s.duration}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {s.type === 'Zoom' && (
                    <button onClick={() => { setSelectedSession(s); setShowVideoCall(true); }} style={{ padding: '8px 18px', borderRadius: 8, background: LIME, color: '#000', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>📹 Join Session</button>
                  )}
                  <button onClick={() => toast('Reschedule feature coming soon!', { icon: '📅' })} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${BORDER}`, background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}>Reschedule</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAST TAB */}
      {activeTab === 'Past' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mockPast.map(s => (
            <div key={s.id} style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#374151', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{s.coachInitials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>{s.topic}</span>
                      <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: BORDER, color: 'rgba(255,255,255,0.5)' }}>Past</span>
                    </div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>with {s.coach}</div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>📅 {s.date}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>🕐 {s.time}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>⏱ {s.duration}</span>
                    </div>
                  </div>
                  {s.notes && (
                    <button onClick={() => toggleNotes(s.id)} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${BORDER}`, background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500, fontSize: 13, flexShrink: 0 }}>
                      {expandedNotes.has(s.id) ? 'Hide Notes' : 'View Notes'}
                    </button>
                  )}
                </div>
                {expandedNotes.has(s.id) && s.notes && (
                  <div style={{ marginTop: 16, background: CARD2, borderRadius: 10, padding: '14px 16px', borderLeft: `4px solid rgba(255,255,255,0.2)` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Session Notes</div>
                    <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{s.notes}</p>
                    {s.feedback && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: LIME, marginBottom: 4, letterSpacing: '1px', textTransform: 'uppercase' }}>Coach Feedback</div>
                        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{s.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ALL TAB */}
      {activeTab === 'All' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Upcoming Sessions ({mockUpcoming.length})</div>
          {mockUpcoming.map(s => (
            <div key={s.id} style={{ background: CARD, borderRadius: 12, border: `1px solid ${BORDER}`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: LIME, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{s.coachInitials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{s.topic}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{s.coach} · {s.date} {s.time} · {s.duration}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {s.type === 'Zoom' && (
                  <button
                    onClick={() => {
                      setSelectedSession(s)
                      setShowVideoCall(true)
                    }}
                    style={{ padding: '8px 16px', borderRadius: 8, background: '#227eff', border: 'none', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => e.target.style.background = '#1b5fd9'}
                    onMouseOut={e => e.target.style.background = '#227eff'}
                  >
                    📹 Join Call
                  </button>
                )}
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: LIME + '20', color: LIME }}>● Upcoming</span>
              </div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4, marginTop: 8 }}>Past Sessions ({mockPast.length})</div>
          {mockPast.map(s => (
            <div key={s.id} style={{ background: CARD, borderRadius: 12, border: `1px solid ${BORDER}`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#374151', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{s.coachInitials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{s.topic}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{s.coach} · {s.date} {s.time} · {s.duration}</div>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: BORDER, color: 'rgba(255,255,255,0.5)' }}>Past</span>
            </div>
          ))}
        </div>
      )}

      {/* VIDEO CALL MODAL */}
      <VideoCallModal
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        remotePeerId={selectedSession?.peerId}
        sessionId={selectedSession?.id}
        role="student"
      />

      {/* BOOK SESSION MODAL */}
      {showBookModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 28, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>Book a Session</h2>
              <button onClick={() => setShowBookModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'rgba(255,255,255,0.5)' }}>×</button>
            </div>

            <div style={{ background: totalRemaining > 4 ? LIME + '15' : totalRemaining > 0 ? '#f9731615' : '#ef444415', border: `1px solid ${totalRemaining > 4 ? LIME + '40' : totalRemaining > 0 ? '#f9731640' : '#ef444440'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: 13, fontWeight: 600, color: totalRemaining > 4 ? LIME : totalRemaining > 0 ? '#f97316' : '#ef4444' }}>
              {totalRemaining > 0 ? `Sessions remaining: ${totalRemaining} — booking will deduct 1 session` : '❌ No sessions remaining. Please top up first.'}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Deduct from Program</label>
              <select value={bookForm.enrollmentId} onChange={e => setBookForm(p => ({ ...p, enrollmentId: e.target.value }))} style={inputStyle}>
                <option value="">Auto-select first available</option>
                {enrollments.filter(e => e.totalSessions - e.usedSessions > 0).map(e => (
                  <option key={e.id} value={e.id}>{e.program} ({e.totalSessions - e.usedSessions} remaining)</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Select Coach *</label>
                <select value={bookForm.coach} onChange={e => setBookForm(p => ({ ...p, coach: e.target.value }))} style={inputStyle}>
                  <option value="">Choose a coach...</option>
                  {COACHES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Date *</label>
                  <input type="date" value={bookForm.date} onChange={e => setBookForm(p => ({ ...p, date: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Time *</label>
                  <input type="time" value={bookForm.time} onChange={e => setBookForm(p => ({ ...p, time: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Duration</label>
                  <select value={bookForm.duration} onChange={e => setBookForm(p => ({ ...p, duration: e.target.value }))} style={inputStyle}>
                    {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Session Type</label>
                  <select value={bookForm.type} onChange={e => setBookForm(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
                    <option value="Zoom">Zoom</option>
                    <option value="In-person">In-person</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Topic / Goal *</label>
                <input type="text" placeholder="e.g. Improve my pull shot technique" value={bookForm.topic} onChange={e => setBookForm(p => ({ ...p, topic: e.target.value }))} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowBookModal(false)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1px solid ${BORDER}`, background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>Cancel</button>
              <button onClick={handleBook} disabled={totalRemaining === 0} style={{ flex: 1, padding: '11px', borderRadius: 10, background: totalRemaining === 0 ? '#374151' : LIME, color: totalRemaining === 0 ? 'rgba(255,255,255,0.4)' : '#000', border: 'none', cursor: totalRemaining === 0 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14 }}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
