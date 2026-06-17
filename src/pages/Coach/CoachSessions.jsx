import { useState, useEffect } from 'react'
import { coachAPI } from '../../services/api'
import toast from 'react-hot-toast'
import VideoCallModal from '../../components/coach/VideoCallModal'
import { getBookingNotifications, clearNotification, markNotificationsRead } from '../../services/notificationService'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const STUDENTS = [
  { id: 1, name: 'Arjun Sharma', initials: 'AS' },
  { id: 2, name: 'Priya Patel', initials: 'PP' },
  { id: 3, name: 'Rohit Verma', initials: 'RV' },
  { id: 4, name: 'Sneha Iyer', initials: 'SI' },
  { id: 5, name: 'Kiran Nair', initials: 'KN' },
]

const MOCK_SESSIONS = [
  { id: 1, student: 'Arjun Sharma', studentInitials: 'AS', date: '2026-05-26', time: '09:00 AM', dayIndex: 0, timeSlot: '9:00 AM', duration: '60 min', type: 'Video Call', topic: 'Batting technique review', status: 'Upcoming', color: LIME + '18', textColor: LIME },
  { id: 2, student: 'Priya Patel', studentInitials: 'PP', date: '2026-05-26', time: '11:00 AM', dayIndex: 0, timeSlot: '11:00 AM', duration: '45 min', type: 'In-person', topic: 'Fielding drills', status: 'Upcoming', location: 'TPIP Ground A', color: '#f9731618', textColor: '#f97316' },
  { id: 3, student: 'Rohit Verma', studentInitials: 'RV', date: '2026-05-27', time: '10:00 AM', dayIndex: 1, timeSlot: '10:00 AM', duration: '90 min', type: 'Video Call', topic: 'Bowling analysis', status: 'Upcoming', color: '#3b82f618', textColor: '#3b82f6' },
  { id: 4, student: 'Sneha Iyer', studentInitials: 'SI', date: '2026-05-28', time: '2:00 PM', dayIndex: 2, timeSlot: '2:00 PM', duration: '60 min', type: 'In-person', topic: 'Fitness assessment', status: 'Upcoming', location: 'TPIP Gym', color: '#a855f718', textColor: '#a855f7' },
  { id: 5, student: 'Kiran Nair', studentInitials: 'KN', date: '2026-05-29', time: '9:00 AM', dayIndex: 3, timeSlot: '9:00 AM', duration: '60 min', type: 'Video Call', topic: 'Match preparation', status: 'Upcoming', color: '#ec489918', textColor: '#ec4899' },
  { id: 6, student: 'Arjun Sharma', studentInitials: 'AS', date: '2026-05-30', time: '4:00 PM', dayIndex: 4, timeSlot: '4:00 PM', duration: '45 min', type: 'In-person', topic: 'Tactical Fundamentals', status: 'Upcoming', location: 'TPIP Ground B', color: '#f9731618', textColor: '#f97316' },
  { id: 7, student: 'Priya Patel', studentInitials: 'PP', date: '2026-06-02', time: '10:00 AM', dayIndex: 0, timeSlot: '10:00 AM', duration: '60 min', type: 'Video Call', topic: 'Batting power game', status: 'Scheduled', color: LIME + '18', textColor: LIME },
  { id: 8, student: 'Rohit Verma', studentInitials: 'RV', date: '2026-06-03', time: '3:00 PM', dayIndex: 1, timeSlot: '3:00 PM', duration: '90 min', type: 'In-person', topic: 'Full practice session', status: 'Scheduled', location: 'TPIP Ground A', color: '#3b82f618', textColor: '#3b82f6' },
]

const MOCK_PAST = [
  { id: 'p1', student: 'Arjun Sharma', studentInitials: 'AS', date: '2026-05-20', time: '10:00 AM', duration: '60 min', type: 'Video Call', topic: 'Stance correction', notes: 'Great session. Arjun showed significant improvement in foot positioning. Focus area for next session: weight transfer on the back foot.', status: 'Completed' },
  { id: 'p2', student: 'Priya Patel', studentInitials: 'PP', date: '2026-05-15', time: '3:00 PM', duration: '45 min', type: 'In-person', topic: 'Catching drills', notes: 'Covered high catches and reaction drills. Excellent intensity. Recommend 10 mins of hand-eye warm-up before every session.', status: 'Completed' },
  { id: 'p3', student: 'Rohit Verma', studentInitials: 'RV', date: '2026-05-10', time: '11:00 AM', duration: '90 min', type: 'Video Call', topic: 'Speed & Agility Intro', notes: null, status: 'Completed' },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']
const MOCK_WEEK_START = new Date('2026-05-25')
const TABS = ['Timetable', 'Upcoming', 'Past', 'All']
const DURATIONS = ['30 min', '45 min', '60 min', '90 min']

function formatShortDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function CoachSessions() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS)
  const [activeTab, setActiveTab] = useState('Timetable')
  const [weekOffset, setWeekOffset] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [expandedNotes, setExpandedNotes] = useState(new Set())
  const [studentWaiting, setStudentWaiting] = useState({})
  const [form, setForm] = useState({ studentId: '1', date: '', time: '', duration: '60 min', type: 'Video Call', topic: '' })
  const [bookingNotifs, setBookingNotifs] = useState([])
  const [showNotifPanel, setShowNotifPanel] = useState(false)

  useEffect(() => {
    const checkStudentPresence = () => {
      const newWaiting = {}
      sessions.forEach(session => {
        const studentData = localStorage.getItem(`student_request_${session.id}`)
        if (studentData) {
          try { newWaiting[session.id] = JSON.parse(studentData) } catch (e) {}
        }
      })
      setStudentWaiting(newWaiting)
    }
    checkStudentPresence()
    const handleStorageChange = (e) => {
      if (e.key?.startsWith('student_request_')) checkStudentPresence()
    }
    const pollInterval = setInterval(checkStudentPresence, 500)
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(pollInterval)
    }
  }, [sessions])

  useEffect(() => {
    const loadNotifs = () => setBookingNotifs(getBookingNotifications())
    loadNotifs()
    const id = setInterval(loadNotifs, 1000)
    window.addEventListener('storage', loadNotifs)
    return () => { clearInterval(id); window.removeEventListener('storage', loadNotifs) }
  }, [])

  const unreadCount = bookingNotifs.filter(n => !n.read).length

  const weekStart = new Date(MOCK_WEEK_START)
  weekStart.setDate(weekStart.getDate() + weekOffset * 7)
  const weekDates = DAYS.map((_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })
  const weekLabel = `${formatShortDate(weekDates[0])} – ${formatShortDate(weekDates[6])} ${weekDates[0].getFullYear()}`
  const todayColIndex = 1 // Tuesday 2026-05-27

  const upcomingSessions = sessions.filter(s => s.status === 'Upcoming' || s.status === 'Scheduled')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const student = STUDENTS.find(s => s.id === parseInt(form.studentId))
    const newSession = {
      id: Date.now(),
      student: student.name,
      studentInitials: student.initials,
      date: form.date,
      time: form.time,
      dayIndex: 0,
      timeSlot: form.time,
      duration: form.duration,
      type: form.type,
      topic: form.topic,
      status: 'Scheduled',
      color: LIME + '18',
      textColor: LIME,
    }
    try { await coachAPI.createSession(newSession) } catch {}
    setSessions([...sessions, newSession])
    toast.success('Session scheduled!')
    setShowModal(false)
    setForm({ studentId: '1', date: '', time: '', duration: '60 min', type: 'Video Call', topic: '' })
  }

  const cancelSession = (id) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, status: 'Cancelled' } : s))
    toast.success('Session cancelled')
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
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>

      {/* How Sessions Work Banner */}
      <div style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 24px', marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 14 }}>
          How Sessions Work
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260, background: '#3b82f610', border: '1px solid #3b82f630', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>📹</span>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>Video Call Sessions</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>A private in-platform video call connects you and your student directly. Click <strong style={{ color: LIME }}>"Join Session"</strong> at the scheduled time — both sides must be online for the call to start.</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 260, background: '#f9731610', border: '1px solid #f9731630', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>🏟️</span>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>In-Person Sessions</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>Student comes to the agreed location. Mark attendance here after the session and add your coaching notes so the student can review them.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '1px' }}>MY SESSIONS</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 4, marginBottom: 0, fontSize: 14 }}>Manage and track all your coaching sessions</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', position: 'relative' }}>
          {/* Notification bell */}
          <button
            onClick={() => { setShowNotifPanel(p => !p); markNotificationsRead(); setBookingNotifs(getBookingNotifications()) }}
            style={{ position: 'relative', padding: '10px 14px', background: unreadCount > 0 ? 'rgba(141,89,255,0.15)' : CARD, border: `1px solid ${unreadCount > 0 ? '#8d59ff' : BORDER}`, borderRadius: 10, cursor: 'pointer', fontSize: 18, color: '#fff', transition: 'all 0.15s' }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', fontSize: 10, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>{unreadCount}</span>
            )}
          </button>

          <button onClick={() => setShowModal(true)} style={{ padding: '10px 22px', background: LIME, color: '#000', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            + Schedule Session
          </button>

          {/* Notification dropdown */}
          {showNotifPanel && (
            <div style={{ position: 'absolute', top: '110%', right: 0, width: 380, background: '#161b22', border: '1px solid #21262d', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.7)', zIndex: 500, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #21262d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>📅 New Bookings</span>
                <button onClick={() => setShowNotifPanel(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
              </div>
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {bookingNotifs.length === 0 ? (
                  <div style={{ padding: '28px 18px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>No new bookings</div>
                ) : bookingNotifs.map(notif => (
                  <div key={notif.id} style={{ padding: '14px 18px', borderBottom: '1px solid #21262d', background: notif.read ? 'transparent' : 'rgba(141,89,255,0.07)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{notif.studentName}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{new Date(notif.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                      📅 {notif.date} · {notif.time}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                      🎯 {notif.topic} · {notif.type}
                    </div>
                    {notif.meetingUrl && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid #21262d', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: '#8d59ff', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {notif.meetingUrl}
                        </div>
                        <button
                          onClick={() => { navigator.clipboard.writeText(notif.meetingUrl); toast.success('Meeting link copied!') }}
                          style={{ padding: '6px 10px', background: '#8d59ff', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: 11, cursor: 'pointer', flexShrink: 0 }}
                        >Copy</button>
                      </div>
                    )}
                    <button
                      onClick={() => { clearNotification(notif.id); setBookingNotifs(getBookingNotifications()) }}
                      style={{ marginTop: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', padding: 0 }}
                    >Dismiss</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
                  const session = sessions.find(s => s.dayIndex === dayIdx && s.timeSlot === slot && (s.status === 'Upcoming' || s.status === 'Scheduled'))
                  return (
                    <div key={dayIdx} style={{ borderLeft: `1px solid ${BORDER}`, background: isToday ? LIME + '05' : 'transparent', padding: 4 }}>
                      {session && (
                        <div style={{ background: session.color, borderRadius: 8, padding: '8px 10px', height: '100%', borderLeft: `3px solid ${session.textColor}`, position: 'relative' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{session.topic}</div>
                          <div style={{ fontSize: 10, color: '#fff', marginBottom: 3, opacity: 0.8 }}>{session.student} · {session.duration}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                              {session.type === 'Video Call' ? '📹 Video' : '🏟️ In-person'}
                            </span>
                            {studentWaiting[session.id] && (
                              <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 10, background: LIME, color: '#000' }}>🟢 Student here</span>
                            )}
                            {session.type === 'Video Call' && (
                              <button
                                onClick={() => { setSelectedSession(session); setShowVideoCall(true) }}
                                style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: LIME, color: '#000', border: 'none', cursor: 'pointer' }}
                                title="Join video call"
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
          {upcomingSessions.length === 0 && (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '40px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>
              No upcoming sessions scheduled.
            </div>
          )}
          {upcomingSessions.map(s => (
            <div key={s.id} style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: s.textColor || LIME, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{s.studentInitials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>{s.topic}</span>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.type === 'Video Call' ? '#3b82f620' : '#f9731620', color: s.type === 'Video Call' ? '#3b82f6' : '#f97316' }}>
                      {s.type === 'Video Call' ? '📹 Video Call' : '🏟️ In-person'}
                    </span>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: LIME + '20', color: LIME }}>{s.status}</span>
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Student: <strong style={{ color: '#fff' }}>{s.student}</strong></div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>📅 {s.date}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>🕐 {s.time}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>⏱ {s.duration}</span>
                    {s.location && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>📍 {s.location}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {studentWaiting[s.id] && (
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '7px 12px', borderRadius: 8, background: LIME, color: '#000', whiteSpace: 'nowrap' }}>🟢 Student waiting</span>
                  )}
                  {s.type === 'Video Call' && (
                    <button
                      onClick={() => { setSelectedSession(s); setShowVideoCall(true) }}
                      style={{ padding: '8px 18px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                    >
                      📹 Join Session
                    </button>
                  )}
                  <button
                    onClick={() => toast('Notes feature coming soon!', { icon: '📝' })}
                    style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${BORDER}`, background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}
                  >
                    Notes
                  </button>
                  {s.status !== 'Cancelled' && (
                    <button
                      onClick={() => cancelSession(s.id)}
                      style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ef444440', background: '#ef444415', color: '#ef4444', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAST TAB */}
      {activeTab === 'Past' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {MOCK_PAST.map(s => (
            <div key={s.id} style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#374151', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{s.studentInitials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>{s.topic}</span>
                      <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: BORDER, color: 'rgba(255,255,255,0.5)' }}>Completed</span>
                      <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.type === 'Video Call' ? '#3b82f620' : '#f9731620', color: s.type === 'Video Call' ? '#3b82f6' : '#f97316' }}>
                        {s.type === 'Video Call' ? '📹 Video Call' : '🏟️ In-person'}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Student: <strong style={{ color: '#fff' }}>{s.student}</strong></div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>📅 {s.date}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>🕐 {s.time}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>⏱ {s.duration}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => toast('Add notes feature coming soon!', { icon: '📝' })}
                      style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${LIME}44`, background: LIME + '15', color: LIME, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                    >
                      + Add Notes
                    </button>
                    {s.notes && (
                      <button onClick={() => toggleNotes(s.id)} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${BORDER}`, background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}>
                        {expandedNotes.has(s.id) ? 'Hide Notes' : 'View Notes'}
                      </button>
                    )}
                  </div>
                </div>
                {expandedNotes.has(s.id) && s.notes && (
                  <div style={{ marginTop: 16, background: CARD2, borderRadius: 10, padding: '14px 16px', borderLeft: `4px solid ${LIME}` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: LIME, marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Coaching Notes</div>
                    <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{s.notes}</p>
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
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
            Upcoming Sessions ({upcomingSessions.length})
          </div>
          {upcomingSessions.map(s => (
            <div key={s.id} style={{ background: CARD, borderRadius: 12, border: `1px solid ${BORDER}`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: s.textColor || LIME, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{s.studentInitials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{s.topic}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{s.student} · {s.date} {s.time} · {s.duration}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {studentWaiting[s.id] && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: LIME, color: '#000' }}>🟢 Student waiting</span>
                )}
                {s.type === 'Video Call' && (
                  <button
                    onClick={() => { setSelectedSession(s); setShowVideoCall(true) }}
                    style={{ padding: '6px 14px', borderRadius: 8, background: '#3b82f6', border: 'none', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
                  >
                    📹 Join Session
                  </button>
                )}
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: LIME + '20', color: LIME }}>● {s.status}</span>
              </div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4, marginTop: 8 }}>
            Past Sessions ({MOCK_PAST.length})
          </div>
          {MOCK_PAST.map(s => (
            <div key={s.id} style={{ background: CARD, borderRadius: 12, border: `1px solid ${BORDER}`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#374151', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{s.studentInitials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{s.topic}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{s.student} · {s.date} {s.time} · {s.duration}</div>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: BORDER, color: 'rgba(255,255,255,0.5)' }}>Completed</span>
            </div>
          ))}
        </div>
      )}

      {/* VIDEO CALL MODAL */}
      <VideoCallModal
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        sessionId={selectedSession?.id}
      />

      {/* SCHEDULE SESSION MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 28, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>Schedule Session</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Student *</label>
                <select value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} style={inputStyle}>
                  {STUDENTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Date *</label>
                  <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Time *</label>
                  <input required type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Duration</label>
                  <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} style={inputStyle}>
                    {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Session Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                    <option value="Video Call">Video Call</option>
                    <option value="In-person">In-person</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Topic / Goal *</label>
                <input required value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} style={inputStyle} placeholder="e.g. Batting stance and footwork" />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1px solid ${BORDER}`, background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: 10, background: LIME, color: '#000', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
