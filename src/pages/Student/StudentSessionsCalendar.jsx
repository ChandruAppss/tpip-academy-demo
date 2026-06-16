import { useState, useEffect } from "react"
import api from "../../services/api"
import toast from "react-hot-toast"
import StudentBookingFlow from "./StudentBookingFlow"

const BG = "#0d1117"
const CARD = "#161b22"
const CARD2 = "#1c2128"
const BORDER = "#21262d"
const LIME = "#adff2f"

const STATUS_COLORS = {
  confirmed: "#adff2f",
  completed: "#3b82f6",
  pending_payment: "#eab308",
  cancelled: "#ef4444",
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function getDaysInMonth(year, month) {
  // month is 1-indexed
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()

  // getDay(): 0=Sun, 1=Mon ... 6=Sat; we want Mon=0
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const grid = []
  // Fill leading empty cells
  for (let i = 0; i < startDow; i++) {
    const prevMonthLastDay = new Date(year, month - 1, 0)
    const day = prevMonthLastDay.getDate() - startDow + 1 + i
    grid.push({ day, inMonth: false, date: new Date(year, month - 2, day) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push({ day: d, inMonth: true, date: new Date(year, month - 1, d) })
  }
  // Fill trailing empty cells to complete last row
  const remaining = 7 - (grid.length % 7)
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      grid.push({ day: d, inMonth: false, date: new Date(year, month, d) })
    }
  }
  return grid
}

function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
}

function formatTime(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
}

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export default function StudentSessionsCalendar({ onBookNew }) {
  const [bookings, setBookings] = useState([])
  const [view, setView] = useState("month")
  const [currentYear, setCurrentYear] = useState(2026)
  const [currentMonth, setCurrentMonth] = useState(5)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedDayBookings, setSelectedDayBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBookingFlow, setShowBookingFlow] = useState(false)

  const handleBookNew = () => {
    if (onBookNew) { onBookNew() } else { setShowBookingFlow(true) }
  }

  useEffect(() => {
    api.get("/student/bookings")
      .then((res) => {
        setBookings(res.data?.bookings || res.data || [])
      })
      .catch(() => {
        toast.error("Failed to load bookings")
      })
      .finally(() => setLoading(false))
  }, [])

  // Build a map: dateKey -> [bookings]
  const bookingsByDay = {}
  bookings.forEach((b) => {
    const key = toDateKey(new Date(b.scheduled_at || b.date || b.start_time))
    if (!bookingsByDay[key]) bookingsByDay[key] = []
    bookingsByDay[key].push(b)
  })

  function prevMonth() {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
    setSelectedDay(null)
  }

  function nextMonth() {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
    setSelectedDay(null)
  }

  function handleDayClick(cellDate, dayBookings) {
    if (!dayBookings || dayBookings.length === 0) return
    setSelectedDay(cellDate)
    setSelectedDayBookings(dayBookings)
  }

  const todayKey = toDateKey(new Date(2026, 4, 31)) // 2026-05-31

  // WEEK VIEW helpers
  const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8..20

  function getWeekDates(year, month) {
    // Show the week containing the 1st of the current month view (or today if in same month)
    const today = new Date(2026, 4, 31)
    let anchor
    if (year === today.getFullYear() && month === today.getMonth() + 1) {
      anchor = today
    } else {
      anchor = new Date(year, month - 1, 1)
    }
    const dow = anchor.getDay() === 0 ? 6 : anchor.getDay() - 1
    const monday = new Date(anchor)
    monday.setDate(anchor.getDate() - dow)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d
    })
  }

  const weekDates = getWeekDates(currentYear, currentMonth)

  function bookingsForWeekDayHour(date, hour) {
    const key = toDateKey(date)
    const dayBks = bookingsByDay[key] || []
    return dayBks.filter((b) => {
      const bHour = new Date(b.scheduled_at || b.date || b.start_time).getHours()
      return bHour === hour
    })
  }

  if (loading) {
    return (
      <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: LIME, fontSize: 18 }}>Loading sessions...</div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div style={{ background: BG, minHeight: "100vh", padding: "32px 24px" }}>
        <div style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: "64px 32px",
          textAlign: "center",
          maxWidth: 480,
          margin: "0 auto",
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📅</div>
          <div style={{ color: "#e6edf3", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No sessions yet</div>
          <div style={{ color: "#8b949e", fontSize: 14, marginBottom: 28 }}>You have no booked sessions. Start by booking your first session.</div>
          <button
            onClick={handleBookNew}
            style={{
              background: LIME,
              color: "#000",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Book your first session →
          </button>
        </div>
        <Legend />
      </div>
    )
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "32px 24px", fontFamily: "inherit" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: "#e6edf3", fontSize: 26, fontWeight: 700, margin: 0 }}>Session Calendar</h1>
          <p style={{ color: "#8b949e", fontSize: 14, margin: "4px 0 0" }}>All your booked and past sessions</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {/* Month/Week toggle */}
          <div style={{ display: "flex", background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
            <button
              onClick={() => setView("month")}
              style={{
                padding: "8px 18px",
                border: "none",
                background: view === "month" ? LIME : "transparent",
                color: view === "month" ? "#000" : "#8b949e",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Month
            </button>
            <button
              onClick={() => setView("week")}
              style={{
                padding: "8px 18px",
                border: "none",
                background: view === "week" ? LIME : "transparent",
                color: view === "week" ? "#000" : "#8b949e",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Week
            </button>
          </div>
          <button
            onClick={handleBookNew}
            style={{
              background: LIME,
              color: "#000",
              border: "none",
              borderRadius: 8,
              padding: "9px 18px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ＋ Book New Session
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {view === "month" && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
          {/* Month nav */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: `1px solid ${BORDER}`,
          }}>
            <button
              onClick={prevMonth}
              style={{ background: "none", border: `1px solid ${BORDER}`, color: "#8b949e", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 16 }}
            >
              ←
            </button>
            <span style={{ color: "#e6edf3", fontWeight: 700, fontSize: 16 }}>
              {MONTH_NAMES[currentMonth - 1]} {currentYear}
            </span>
            <button
              onClick={nextMonth}
              style={{ background: "none", border: `1px solid ${BORDER}`, color: "#8b949e", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 16 }}
            >
              →
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: `1px solid ${BORDER}` }}>
            {DAY_HEADERS.map((d) => (
              <div key={d} style={{ textAlign: "center", padding: "10px 0", color: "#8b949e", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {getDaysInMonth(currentYear, currentMonth).map((cell, idx) => {
              const key = toDateKey(cell.date)
              const dayBks = bookingsByDay[key] || []
              const isToday = key === todayKey
              const hasBookings = dayBks.length > 0
              const visibleBks = dayBks.slice(0, 2)
              const extra = dayBks.length - 2

              return (
                <div
                  key={idx}
                  onClick={() => handleDayClick(cell.date, dayBks)}
                  style={{
                    minHeight: 90,
                    border: `1px solid ${BORDER}`,
                    padding: 8,
                    cursor: hasBookings ? "pointer" : "default",
                    background: isToday ? "rgba(173,255,47,0.04)" : "transparent",
                    borderColor: isToday ? LIME : BORDER,
                    boxSizing: "border-box",
                    transition: "background 0.1s",
                  }}
                >
                  <div style={{
                    fontSize: 12,
                    fontWeight: isToday ? 700 : 400,
                    color: cell.inMonth ? (isToday ? LIME : "#e6edf3") : "#3d444d",
                    marginBottom: 4,
                  }}>
                    {cell.day}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {visibleBks.map((b, bi) => {
                      const color = STATUS_COLORS[b.status] || "#8b949e"
                      const time = formatTime(b.scheduled_at || b.date || b.start_time)
                      const coachName = b.coach_name || b.coach?.name || "Coach"
                      return (
                        <div
                          key={bi}
                          title={`${time} — ${coachName}`}
                          style={{
                            background: color + "33",
                            color: color,
                            fontSize: 10,
                            borderRadius: 4,
                            padding: "2px 5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}
                        >
                          {time} {coachName}
                        </div>
                      )
                    })}
                    {extra > 0 && (
                      <div style={{ fontSize: 10, color: "#8b949e" }}>+{extra} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {view === "week" && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
          {/* Week nav */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: `1px solid ${BORDER}`,
          }}>
            <button
              onClick={prevMonth}
              style={{ background: "none", border: `1px solid ${BORDER}`, color: "#8b949e", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 16 }}
            >
              ←
            </button>
            <span style={{ color: "#e6edf3", fontWeight: 700, fontSize: 16 }}>
              Week of {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <button
              onClick={nextMonth}
              style={{ background: "none", border: `1px solid ${BORDER}`, color: "#8b949e", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 16 }}
            >
              →
            </button>
          </div>

          {/* Week day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "56px repeat(7, 1fr)", borderBottom: `1px solid ${BORDER}` }}>
            <div />
            {weekDates.map((d, i) => {
              const isToday = toDateKey(d) === todayKey
              return (
                <div key={i} style={{ textAlign: "center", padding: "10px 0" }}>
                  <div style={{ fontSize: 11, color: "#8b949e", fontWeight: 600, letterSpacing: 1 }}>{DAY_HEADERS[i]}</div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: isToday ? 700 : 400,
                    color: isToday ? LIME : "#e6edf3",
                    marginTop: 2,
                  }}>
                    {d.getDate()}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time rows */}
          <div style={{ overflowY: "auto", maxHeight: 520 }}>
            {HOURS.map((hour) => (
              <div
                key={hour}
                style={{
                  display: "grid",
                  gridTemplateColumns: "56px repeat(7, 1fr)",
                  borderBottom: `1px solid ${BORDER}`,
                  minHeight: 52,
                }}
              >
                <div style={{ color: "#8b949e", fontSize: 11, padding: "6px 8px 0", textAlign: "right" }}>
                  {String(hour).padStart(2, "0")}:00
                </div>
                {weekDates.map((d, di) => {
                  const blocks = bookingsForWeekDayHour(d, hour)
                  return (
                    <div
                      key={di}
                      style={{ borderLeft: `1px solid ${BORDER}`, padding: "3px 4px", display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {blocks.map((b, bi) => {
                        const color = STATUS_COLORS[b.status] || "#8b949e"
                        const time = formatTime(b.scheduled_at || b.date || b.start_time)
                        const coachName = b.coach_name || b.coach?.name || "Coach"
                        const topic = b.topic || b.subject || ""
                        return (
                          <div
                            key={bi}
                            onClick={() => {
                              setSelectedDay(d)
                              setSelectedDayBookings(bookingsByDay[toDateKey(d)] || [])
                            }}
                            style={{
                              background: color + "26",
                              borderLeft: `3px solid ${color}`,
                              borderRadius: "0 4px 4px 0",
                              padding: "3px 6px",
                              cursor: "pointer",
                              fontSize: 11,
                            }}
                          >
                            <div style={{ color: color, fontWeight: 600 }}>{time}</div>
                            <div style={{ color: "#e6edf3", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{coachName}</div>
                            {topic && (
                              <div style={{ color: "#8b949e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{topic}</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SELECTED DAY PANEL */}
      {selectedDay && (
        <div style={{ marginTop: 24, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ color: "#e6edf3", fontSize: 16, fontWeight: 700, margin: 0 }}>
              Sessions on {formatDate(selectedDay)}
            </h2>
            <button
              onClick={() => setSelectedDay(null)}
              style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer", fontSize: 18, lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          {selectedDayBookings.length === 0 ? (
            <div style={{ color: "#8b949e", fontSize: 14 }}>No sessions on this day</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {selectedDayBookings.map((b, i) => {
                const color = STATUS_COLORS[b.status] || "#8b949e"
                const time = formatTime(b.scheduled_at || b.date || b.start_time)
                const coachName = b.coach_name || b.coach?.name || "Coach"
                const topic = b.topic || b.subject || "Session"
                const isVideo = b.type === "video" || b.session_type === "video"
                return (
                  <div
                    key={i}
                    style={{
                      background: CARD2,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 10,
                      padding: "14px 18px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          background: color + "22",
                          color: color,
                          borderRadius: 6,
                          padding: "3px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                        }}>
                          {time}
                        </span>
                        <span style={{ color: "#e6edf3", fontWeight: 700, fontSize: 15 }}>{coachName}</span>
                      </div>
                      <div style={{ color: "#8b949e", fontSize: 13 }}>{topic}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        background: color + "22",
                        color: color,
                        borderRadius: 6,
                        padding: "3px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}>
                        {b.status?.replace("_", " ") || "Unknown"}
                      </span>
                      {(b.type || b.session_type) && (
                        <span style={{
                          background: "#21262d",
                          color: "#8b949e",
                          borderRadius: 6,
                          padding: "3px 10px",
                          fontSize: 12,
                          textTransform: "capitalize",
                        }}>
                          {b.type || b.session_type}
                        </span>
                      )}
                      {b.status === "confirmed" && isVideo && (
                        <button style={{
                          background: LIME,
                          color: "#000",
                          border: "none",
                          borderRadius: 7,
                          padding: "6px 16px",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                        }}>
                          Join Session
                        </button>
                      )}
                      {b.status === "completed" && (
                        <button style={{
                          background: "transparent",
                          color: "#e6edf3",
                          border: `1px solid ${BORDER}`,
                          borderRadius: 7,
                          padding: "6px 16px",
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: "pointer",
                        }}>
                          View Notes
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* LEGEND */}
      <Legend />

      {/* BOOKING FLOW MODAL */}
      <StudentBookingFlow
        isOpen={showBookingFlow}
        onClose={() => setShowBookingFlow(false)}
        onSuccess={() => { setShowBookingFlow(false); api.get('/student/bookings').then(r => setBookings(r.data || [])) }}
      />
    </div>
  )
}

function Legend() {
  const items = [
    { label: "Confirmed", color: STATUS_COLORS.confirmed },
    { label: "Completed", color: STATUS_COLORS.completed },
    { label: "Pending Payment", color: STATUS_COLORS.pending_payment },
    { label: "Cancelled", color: STATUS_COLORS.cancelled },
  ]
  return (
    <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap", alignItems: "center" }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, display: "inline-block" }} />
          <span style={{ color: "#8b949e", fontSize: 12 }}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
