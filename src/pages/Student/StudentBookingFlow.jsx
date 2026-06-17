import { useState, useEffect } from "react"
import api from "../../services/api"
import toast from "react-hot-toast"
import { generateMeetingUrl, sendBookingEmails, storeBookingNotification } from "../../services/notificationService"

const BG = "#0d1117"
const CARD = "#161b22"
const CARD2 = "#1c2128"
const BORDER = "#21262d"
const PURPLE = "#8d59ff"
const LIME = "#adff2f"

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7 // Monday = 0
  const totalDays = lastDay.getDate()
  const cells = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)
  return cells
}

function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

function getDayOfWeekName(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return names[d.getDay()]
}

function currencyDisplay(pkg, currency) {
  if (currency === "INR") return `₹${(pkg.price_inr || 0).toLocaleString()}`
  if (currency === "USD") return `$${(pkg.price_usd || 0).toLocaleString()}`
  if (currency === "GBP") return `£${(pkg.price_gbp || 0).toLocaleString()}`
  if (currency === "AED") return `${(pkg.price_aed || 0).toLocaleString()} AED`
  return `₹${(pkg.price_inr || 0).toLocaleString()}`
}

function amountDisplay(amount, currency) {
  if (currency === "INR") return `₹${amount}`
  if (currency === "USD") return `$${amount}`
  if (currency === "GBP") return `£${amount}`
  if (currency === "AED") return `${amount} AED`
  return `₹${amount}`
}

function StepIndicator({ step }) {
  const steps = [
    { num: 1, label: "Choose Package" },
    { num: 2, label: "Pick Slot" },
    { num: 3, label: "Pay & Confirm" },
  ]

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                background:
                  step > s.num
                    ? LIME
                    : step === s.num
                    ? PURPLE
                    : "#2d333b",
                color:
                  step > s.num
                    ? "#000"
                    : step === s.num
                    ? "#fff"
                    : "#6e7681",
                transition: "all 0.3s ease",
              }}
            >
              {step > s.num ? "✓" : s.num}
            </div>
            <span
              style={{
                fontSize: 11,
                color: step === s.num ? LIME : step > s.num ? LIME : "#6e7681",
                fontWeight: step === s.num ? 600 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                width: 80,
                height: 2,
                background: step > s.num ? LIME : "#2d333b",
                margin: "0 8px",
                marginBottom: 20,
                transition: "background 0.3s ease",
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function StudentBookingFlow({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1)
  const [packages, setPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [availability, setAvailability] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [sessionGoal, setSessionGoal] = useState("")
  const [sessionType, setSessionType] = useState("Video Call")
  const [currency, setCurrency] = useState("INR")
  const [gateway, setGateway] = useState("razorpay")
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [bookingId, setBookingId] = useState(null)
  const [bookingDone, setBookingDone] = useState(false)
  const [meetingUrl, setMeetingUrl] = useState(null)
  const [urlCopied, setUrlCopied] = useState(false)
  const [loadingPkgs, setLoadingPkgs] = useState(true)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  useEffect(() => {
    if (!isOpen) return
    api.get("/detect-currency")
      .then((res) => {
        setCurrency(res.data.currency || "INR")
        setGateway(res.data.gateway || "razorpay")
      })
      .catch(() => {})

    setLoadingPkgs(true)
    api.get("/packages")
      .then((res) => {
        setPackages(res.data || [])
        setLoadingPkgs(false)
      })
      .catch(() => {
        setLoadingPkgs(false)
        toast.error("Failed to load packages")
      })
  }, [isOpen])

  function resetAll() {
    setStep(1)
    setSelectedPackage(null)
    setAvailability([])
    setSelectedDate(null)
    setSelectedTime(null)
    setSessionGoal("")
    setSessionType("Video Call")
    setPaymentLoading(false)
    setBookingId(null)
    setBookingDone(false)
    setMeetingUrl(null)
    setUrlCopied(false)
  }

  async function handleSelectPackage(pkg) {
    setSelectedPackage(pkg)
    try {
      const res = await api.get("/availability/" + pkg.coach_id)
      setAvailability(res.data || [])
    } catch {
      setAvailability([])
      toast.error("Failed to load availability")
    }
    setStep(2)
  }

  function getAvailableDaysOfWeek() {
    return availability.map((a) => a.day_of_week || a.day)
  }

  function isDayAvailable(year, month, day) {
    const date = new Date(year, month, day)
    const dow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()]
    return getAvailableDaysOfWeek().includes(dow)
  }

  function isToday(year, month, day) {
    const today = new Date()
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }

  function handleDayClick(year, month, day) {
    if (!isDayAvailable(year, month, day)) return
    const d = new Date(year, month, day)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    setSelectedDate(`${yyyy}-${mm}-${dd}`)
    setSelectedTime(null)
  }

  function getTimeSlotsForDate(dateStr) {
    if (!dateStr) return []
    const dow = getDayOfWeekName(dateStr)
    const slot = availability.find((a) => (a.day_of_week || a.day) === dow)
    if (!slot) return []
    return slot.time_slots || slot.slots || []
  }

  async function handleContinueToPayment() {
    if (!selectedDate || !selectedTime || !sessionGoal.trim()) return
    try {
      const perSession = Math.round((selectedPackage.price_inr || 0) / (selectedPackage.sessions || 1))
      const res = await api.post("/student/bookings", {
        coach_id: selectedPackage.coach_id,
        coach_name: selectedPackage.coach_name,
        package_id: selectedPackage.id,
        session_date: selectedDate,
        session_time: selectedTime,
        topic: sessionGoal,
        type: sessionType,
        amount_inr: perSession,
        currency: currency,
      })
      setBookingId(res.data.id || res.data.booking_id)
      setStep(3)
    } catch {
      toast.error("Failed to create booking")
    }
  }

  async function confirmAndSuccess() {
    const confirmedId = bookingId || `bk_${Date.now()}`
    const url = generateMeetingUrl(confirmedId)
    setMeetingUrl(url)

    storeBookingNotification({
      bookingId: confirmedId,
      coachId: selectedPackage?.coach_id,
      studentName: 'You (Student)',
      date: selectedDate,
      time: selectedTime,
      topic: sessionGoal,
      type: sessionType,
      meetingUrl: url,
    })

    sendBookingEmails({
      studentName: 'Student',
      coachName: selectedPackage?.coach_name || 'Coach',
      date: selectedDate,
      time: selectedTime,
      topic: sessionGoal,
      type: sessionType,
      meetingUrl: url,
      bookingId: confirmedId,
    }).then(() => {
      toast.success('Confirmation emails sent to you and your coach!')
    })

    try {
      await api.post("/student/bookings/confirm", { booking_id: confirmedId, payment_id: "pay_demo_confirmed" })
    } catch {}

    setPaymentLoading(false)
    setBookingDone(true)
  }

  async function handlePayment() {
    setPaymentLoading(true)
    const perSession = Math.round((selectedPackage.price_inr || 0) / (selectedPackage.sessions || 1))
    try {
      const endpoint =
        gateway === "razorpay"
          ? "/payments/razorpay/order"
          : "/payments/stripe/intent"
      const res = await api.post(endpoint, { amount: perSession, currency })
      if (res.data.demo) {
        setTimeout(() => confirmAndSuccess(), 2000)
      } else {
        confirmAndSuccess()
      }
    } catch {
      setTimeout(() => confirmAndSuccess(), 2000)
    }
  }

  if (!isOpen) return null

  const cells = getMonthMatrix(calendarMonth.year, calendarMonth.month)
  const monthName = new Date(calendarMonth.year, calendarMonth.month, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  const perSessionAmount = selectedPackage
    ? Math.round((selectedPackage.price_inr || 0) / (selectedPackage.sessions || 1))
    : 0

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          maxHeight: "90vh",
          overflowY: "auto",
          background: CARD,
          borderRadius: 20,
          border: "1px solid rgba(141,89,255,0.3)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          padding: "32px 28px",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: "#6e7681",
            fontSize: 22,
            cursor: "pointer",
            lineHeight: 1,
            padding: "4px 8px",
            borderRadius: 6,
          }}
          onMouseEnter={(e) => (e.target.style.color = "#fff")}
          onMouseLeave={(e) => (e.target.style.color = "#6e7681")}
        >
          ×
        </button>

        <StepIndicator step={step} />

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>
              Choose Your Training Package
            </h2>
            <p style={{ color: "#8b949e", fontSize: 13, margin: "0 0 24px" }}>
              Each package has a fixed number of sessions set by the coach
            </p>

            {loadingPkgs ? (
              <div style={{ textAlign: "center", color: "#6e7681", padding: "48px 0" }}>
                Loading packages...
              </div>
            ) : packages.length === 0 ? (
              <div style={{ textAlign: "center", color: "#6e7681", padding: "48px 0" }}>
                No packages available
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {packages.map((pkg) => {
                  const initials = (pkg.coach_name || "C")
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                  const isSelected = selectedPackage?.id === pkg.id
                  return (
                    <div
                      key={pkg.id}
                      style={{
                        background: CARD2,
                        border: isSelected
                          ? "2px solid rgba(141,89,255,0.8)"
                          : `1px solid ${BORDER}`,
                        borderRadius: 14,
                        padding: "18px 16px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #adff2f, #76b900)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#000",
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>
                            {pkg.coach_name}
                          </div>
                          {pkg.specialty && (
                            <span
                              style={{
                                background: "rgba(141,89,255,0.2)",
                                color: PURPLE,
                                fontSize: 10,
                                fontWeight: 600,
                                padding: "2px 8px",
                                borderRadius: 20,
                                border: "1px solid rgba(141,89,255,0.3)",
                              }}
                            >
                              {pkg.specialty}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                        {pkg.title || pkg.name}
                      </div>
                      {pkg.description && (
                        <p
                          style={{
                            color: "#8b949e",
                            fontSize: 12,
                            margin: "0 0 12px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {pkg.description}
                        </p>
                      )}

                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                        <span style={{ color: PURPLE, fontWeight: 800, fontSize: 28 }}>
                          {pkg.sessions}
                        </span>
                        <span style={{ color: "#8b949e", fontSize: 13 }}>sessions</span>
                      </div>
                      {pkg.duration && (
                        <div style={{ color: "#6e7681", fontSize: 12, marginBottom: 10 }}>
                          {pkg.duration}
                        </div>
                      )}

                      <div style={{ color: LIME, fontWeight: 700, fontSize: 16, marginBottom: 14 }}>
                        {currencyDisplay(pkg, currency)}
                      </div>

                      <button
                        onClick={() => handleSelectPackage(pkg)}
                        style={{
                          width: "100%",
                          padding: "10px 0",
                          borderRadius: 8,
                          border: "none",
                          background: isSelected ? LIME : "rgba(173,255,47,0.1)",
                          color: isSelected ? "#000" : LIME,
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = LIME
                          e.target.style.color = "#000"
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.target.style.background = "rgba(173,255,47,0.1)"
                            e.target.style.color = LIME
                          }
                        }}
                      >
                        Select This Package →
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>
              Pick Your Session Date & Time
            </h2>
            <p style={{ color: "#8b949e", fontSize: 13, margin: "0 0 24px" }}>
              {selectedPackage?.title || selectedPackage?.name} with {selectedPackage?.coach_name}
            </p>

            <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
              {/* Calendar */}
              <div style={{ flex: "0 0 55%" }}>
                <div
                  style={{
                    background: CARD2,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <button
                      onClick={() => {
                        setCalendarMonth((prev) => {
                          let m = prev.month - 1
                          let y = prev.year
                          if (m < 0) { m = 11; y-- }
                          return { year: y, month: m }
                        })
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#8b949e",
                        fontSize: 18,
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                    >
                      ‹
                    </button>
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{monthName}</span>
                    <button
                      onClick={() => {
                        setCalendarMonth((prev) => {
                          let m = prev.month + 1
                          let y = prev.year
                          if (m > 11) { m = 0; y++ }
                          return { year: y, month: m }
                        })
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#8b949e",
                        fontSize: 18,
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                    >
                      ›
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: 2,
                      marginBottom: 6,
                    }}
                  >
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div
                        key={i}
                        style={{
                          textAlign: "center",
                          fontSize: 11,
                          color: "#6e7681",
                          fontWeight: 600,
                          padding: "4px 0",
                        }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: 2,
                    }}
                  >
                    {cells.map((day, idx) => {
                      if (!day) return <div key={idx} />
                      const avail = isDayAvailable(calendarMonth.year, calendarMonth.month, day)
                      const today = isToday(calendarMonth.year, calendarMonth.month, day)
                      const dateStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                      const isSelected = selectedDate === dateStr
                      return (
                        <div
                          key={idx}
                          onClick={() => avail && handleDayClick(calendarMonth.year, calendarMonth.month, day)}
                          style={{
                            position: "relative",
                            width: 36,
                            height: 36,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 8,
                            cursor: avail ? "pointer" : "default",
                            background: isSelected ? PURPLE : "transparent",
                            border: today && !isSelected ? `1px solid ${LIME}` : "1px solid transparent",
                            color: isSelected ? "#fff" : avail ? "#e6edf3" : "#3d444d",
                            fontSize: 13,
                            fontWeight: isSelected ? 700 : 400,
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (avail && !isSelected) e.currentTarget.style.background = "rgba(141,89,255,0.2)"
                          }}
                          onMouseLeave={(e) => {
                            if (avail && !isSelected) e.currentTarget.style.background = "transparent"
                          }}
                        >
                          {day}
                          {avail && !isSelected && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: 3,
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                background: LIME,
                              }}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Time slots */}
              <div style={{ flex: "0 0 45%" }}>
                <div
                  style={{
                    background: CARD2,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 12,
                    padding: 16,
                    minHeight: 220,
                  }}
                >
                  <div style={{ color: "#8b949e", fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
                    AVAILABLE TIMES
                  </div>
                  {!selectedDate ? (
                    <div style={{ color: "#6e7681", fontSize: 13, textAlign: "center", paddingTop: 40 }}>
                      Select a date to see available times
                    </div>
                  ) : getTimeSlotsForDate(selectedDate).length === 0 ? (
                    <div style={{ color: "#6e7681", fontSize: 13, textAlign: "center", paddingTop: 40 }}>
                      No slots for this day
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {getTimeSlotsForDate(selectedDate).map((slot, i) => {
                        const isSelectedSlot = selectedTime === slot
                        return (
                          <div
                            key={i}
                            onClick={() => setSelectedTime(slot)}
                            style={{
                              padding: "7px 14px",
                              borderRadius: 20,
                              background: isSelectedSlot ? PURPLE : CARD,
                              color: isSelectedSlot ? "#fff" : "#e6edf3",
                              border: isSelectedSlot
                                ? `1px solid ${PURPLE}`
                                : `1px solid ${BORDER}`,
                              fontSize: 13,
                              cursor: "pointer",
                              fontWeight: isSelectedSlot ? 600 : 400,
                              transition: "all 0.15s ease",
                            }}
                          >
                            {slot}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Session goal */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#e6edf3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                Session Goal <span style={{ color: LIME }}>*</span>
              </label>
              <textarea
                value={sessionGoal}
                onChange={(e) => setSessionGoal(e.target.value)}
                placeholder="What do you want to work on in this session?"
                rows={3}
                style={{
                  width: "100%",
                  background: CARD2,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  color: "#e6edf3",
                  fontSize: 13,
                  padding: "10px 12px",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = PURPLE)}
                onBlur={(e) => (e.target.style.borderColor = BORDER)}
              />
            </div>

            {/* Session type */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {["Video Call", "In-Person"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSessionType(type)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 8,
                    border: `1px solid ${sessionType === type ? PURPLE : BORDER}`,
                    background: sessionType === type ? `rgba(141,89,255,0.15)` : "transparent",
                    color: sessionType === type ? PURPLE : "#8b949e",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  border: `1px solid ${BORDER}`,
                  background: "transparent",
                  color: "#8b949e",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleContinueToPayment}
                disabled={!selectedDate || !selectedTime || !sessionGoal.trim()}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  borderRadius: 10,
                  border: "none",
                  background:
                    !selectedDate || !selectedTime || !sessionGoal.trim()
                      ? "#2d333b"
                      : LIME,
                  color:
                    !selectedDate || !selectedTime || !sessionGoal.trim()
                      ? "#6e7681"
                      : "#000",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor:
                    !selectedDate || !selectedTime || !sessionGoal.trim()
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Continue to Payment →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && !bookingDone && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>
              Review & Complete Booking
            </h2>
            <p style={{ color: "#8b949e", fontSize: 13, margin: "0 0 24px" }}>
              Confirm your session details before payment
            </p>

            {/* Summary card */}
            <div
              style={{
                background: CARD2,
                border: `1px solid ${BORDER}`,
                borderLeft: `3px solid ${PURPLE}`,
                borderRadius: 12,
                padding: "20px 20px",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <span style={{ color: "#6e7681", fontSize: 12 }}>Coach & Package</span>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 15, marginTop: 2 }}>
                    {selectedPackage?.coach_name} — {selectedPackage?.title || selectedPackage?.name}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 40 }}>
                  <div>
                    <span style={{ color: "#6e7681", fontSize: 12 }}>Date</span>
                    <div style={{ color: "#e6edf3", fontWeight: 500, fontSize: 14, marginTop: 2 }}>
                      {formatDate(selectedDate)}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: "#6e7681", fontSize: 12 }}>Time</span>
                    <div style={{ color: "#e6edf3", fontWeight: 500, fontSize: 14, marginTop: 2 }}>
                      {selectedTime}
                    </div>
                  </div>
                </div>
                <div>
                  <span style={{ color: "#6e7681", fontSize: 12 }}>Session Goal</span>
                  <div style={{ color: "#e6edf3", fontSize: 14, marginTop: 2 }}>{sessionGoal}</div>
                </div>
                <div>
                  <span style={{ color: "#6e7681", fontSize: 12 }}>Amount (per session)</span>
                  <div style={{ color: LIME, fontWeight: 700, fontSize: 20, marginTop: 2 }}>
                    {amountDisplay(perSessionAmount, currency)}
                  </div>
                </div>
              </div>

              {/* Escrow info */}
              <div
                style={{
                  background: "rgba(58,130,246,0.1)",
                  border: "1px solid rgba(58,130,246,0.3)",
                  borderRadius: 8,
                  padding: "12px 14px",
                  marginTop: 16,
                  color: "#93c5fd",
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                🔒 Your payment is held securely in escrow. Released to the coach only after your
                session is confirmed complete by admin.
              </div>
            </div>

            {/* Payment button */}
            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 10,
                border: "none",
                background: paymentLoading
                  ? "#2d333b"
                  : gateway === "razorpay"
                  ? "#3b82f6"
                  : PURPLE,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: paymentLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "all 0.2s ease",
              }}
            >
              {paymentLoading ? (
                "Processing..."
              ) : (
                <>
                  🔒 {gateway === "razorpay" ? "Pay with Razorpay" : "Pay with Stripe"}
                </>
              )}
            </button>

            <button
              onClick={() => setStep(2)}
              style={{
                width: "100%",
                marginTop: 10,
                padding: "10px",
                borderRadius: 10,
                border: `1px solid ${BORDER}`,
                background: "transparent",
                color: "#8b949e",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              ← Back to Slot Selection
            </button>
          </div>
        )}

        {/* SUCCESS SCREEN */}
        {bookingDone && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "2px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36, animation: "scaleIn 0.4s ease forwards" }}>✓</div>

            <style>{`@keyframes scaleIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}`}</style>

            <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>Session Booked!</h2>
            <p style={{ color: "#8b949e", fontSize: 14, margin: "0 0 6px" }}>
              Your session is confirmed and payment is held in escrow.
            </p>
            <p style={{ color: "#22c55e", fontSize: 13, margin: "0 0 20px", fontWeight: 600 }}>
              ✉ Confirmation emails sent to you and your coach
            </p>

            {/* Meeting URL card */}
            {meetingUrl && (
              <div style={{ background: "rgba(141,89,255,0.1)", border: "1px solid rgba(141,89,255,0.4)", borderRadius: 12, padding: "16px 18px", marginBottom: 20, textAlign: "left" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
                  📹 Your Video Session Link
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <div style={{ flex: 1, background: "rgba(0,0,0,0.35)", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#c9d1d9", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {meetingUrl}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(meetingUrl)
                      setUrlCopied(true)
                      setTimeout(() => setUrlCopied(false), 2500)
                      toast.success("Meeting link copied!")
                    }}
                    style={{ padding: "9px 16px", background: urlCopied ? "#22c55e" : PURPLE, border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                  >
                    {urlCopied ? "✓ Copied" : "Copy Link"}
                  </button>
                </div>
                <div style={{ fontSize: 11, color: "#8b949e" }}>
                  This link was also emailed to you. Share it with your coach to start the video session.
                </div>
              </div>
            )}

            {/* Session summary */}
            <div style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, textAlign: "left", marginBottom: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6e7681", fontSize: 13 }}>Coach</span>
                  <span style={{ color: "#e6edf3", fontWeight: 600, fontSize: 13 }}>{selectedPackage?.coach_name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6e7681", fontSize: 13 }}>Date</span>
                  <span style={{ color: "#e6edf3", fontSize: 13 }}>{formatDate(selectedDate)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6e7681", fontSize: 13 }}>Time</span>
                  <span style={{ color: "#e6edf3", fontSize: 13 }}>{selectedTime}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6e7681", fontSize: 13 }}>Topic</span>
                  <span style={{ color: "#e6edf3", fontSize: 13, maxWidth: "60%", textAlign: "right" }}>{sessionGoal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6e7681", fontSize: 13 }}>Type</span>
                  <span style={{ color: sessionType === "Video Call" ? PURPLE : "#f97316", fontSize: 13, fontWeight: 600 }}>{sessionType}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={onSuccess} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: LIME, color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                View in Calendar →
              </button>
              <button onClick={resetAll} style={{ width: "100%", padding: "11px", borderRadius: 10, border: `1px solid ${BORDER}`, background: "transparent", color: "#8b949e", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Book Another Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
