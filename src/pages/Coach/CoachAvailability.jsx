import { useState, useEffect } from "react"
import api from "../../services/api"
import toast from "react-hot-toast"

const BG = "#0d1117"
const CARD = "#161b22"
const CARD2 = "#1c2128"
const BORDER = "#21262d"
const LIME = "#adff2f"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
]

export default function CoachAvailability() {
  const [availability, setAvailability] = useState({
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
  })
  const [packages, setPackages] = useState([])
  const [payoutSchedule, setPayoutSchedule] = useState("biweekly")
  const [bankAccount, setBankAccount] = useState("")
  const [saving, setSaving] = useState(false)
  const [savingPayout, setSavingPayout] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const availRes = await api.get("/coach/availability")
        if (availRes.data && Array.isArray(availRes.data)) {
          const obj = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] }
          availRes.data.forEach(({ day, slots }) => {
            if (obj[day] !== undefined) {
              obj[day] = slots || []
            }
          })
          setAvailability(obj)
        }
      } catch (err) {
        // silently ignore
      }

      try {
        const pkgRes = await api.get("/packages/coach/c1")
        if (pkgRes.data) {
          setPackages(pkgRes.data)
        }
      } catch (err) {
        // silently ignore
      }
    }

    fetchData()
  }, [])

  const toggleSlot = (day, slot) => {
    setAvailability(prev => {
      const current = prev[day] || []
      const exists = current.includes(slot)
      return {
        ...prev,
        [day]: exists ? current.filter(s => s !== slot) : [...current, slot]
      }
    })
  }

  const handleSaveAvailability = async () => {
    setSaving(true)
    try {
      const slots = DAYS.map(day => ({ day, slots: availability[day] }))
      await api.put("/coach/availability", { slots })
      toast.success("Availability saved!")
    } catch (err) {
      toast.error("Failed to save availability")
    } finally {
      setSaving(false)
    }
  }

  const handlePackageChange = (index, field, value) => {
    setPackages(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleUpdatePackage = async (pkg, index) => {
    try {
      await api.put(`/packages/${pkg.id || pkg._id}`, pkg)
      toast.success("Package updated!")
    } catch (err) {
      toast.error("Failed to update package")
    }
  }

  const handleSavePayout = async () => {
    setSavingPayout(true)
    try {
      await api.put("/coach/payout-settings", {
        schedule: payoutSchedule,
        bank_account: bankAccount
      })
      toast.success("Payout settings saved!")
    } catch (err) {
      toast.error("Failed to save payout settings")
    } finally {
      setSavingPayout(false)
    }
  }

  return (
    <div style={{ backgroundColor: BG, minHeight: "100vh", padding: "32px 24px", color: "#e6edf3" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: "#e6edf3" }}>
            My Availability &amp; Settings
          </h1>
          <p style={{ color: "#8b949e", marginTop: 8, fontSize: 14 }}>
            Set your available time slots — students can only book times you mark as open
          </p>
        </div>

        {/* Section 1: Availability Grid */}
        <div style={{
          backgroundColor: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 24
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 20, color: "#e6edf3" }}>
            Weekly Availability
          </h2>

          {DAYS.map((day, dayIndex) => {
            const slots = availability[day] || []
            return (
              <div key={day}>
                {/* Day header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#e6edf3", minWidth: 36 }}>
                    {day}
                  </span>
                  <span style={{
                    backgroundColor: LIME,
                    color: "#000",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 20
                  }}>
                    {slots.length} slot{slots.length !== 1 ? "s" : ""} open
                  </span>
                </div>

                {/* Time chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  {TIME_SLOTS.map(slot => {
                    const isActive = slots.includes(slot)
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(day, slot)}
                        style={{
                          backgroundColor: isActive ? LIME : CARD2,
                          color: isActive ? "#000" : "#8b949e",
                          border: `1px solid ${isActive ? LIME : BORDER}`,
                          borderRadius: 6,
                          padding: "6px 12px",
                          fontSize: 13,
                          fontWeight: isActive ? 600 : 400,
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>

                {dayIndex < DAYS.length - 1 && (
                  <div style={{
                    borderTop: `1px solid ${BORDER}`,
                    margin: "12px 0"
                  }} />
                )}
              </div>
            )
          })}

          <button
            onClick={handleSaveAvailability}
            disabled={saving}
            style={{
              width: "100%",
              marginTop: 20,
              backgroundColor: saving ? "#7aad1f" : LIME,
              color: "#000",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              fontSize: 15,
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              transition: "background 0.15s ease"
            }}
          >
            {saving ? "Saving..." : "Save Availability"}
          </button>
        </div>

        {/* Section 2: My Packages */}
        <div style={{
          backgroundColor: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 24
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 20, color: "#e6edf3" }}>
            My Coaching Packages
          </h2>

          {packages.length === 0 ? (
            <p style={{ color: "#8b949e", fontSize: 14 }}>No packages found.</p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 16
            }}>
              {packages.map((pkg, index) => {
                const sessions = Number(pkg.sessions) || 0
                const pricePerSession = Number(pkg.price_per_session) || 0
                const total = sessions * pricePerSession
                return (
                  <div
                    key={pkg.id || pkg._id || index}
                    style={{
                      backgroundColor: CARD2,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 10,
                      padding: 18
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "#e6edf3" }}>
                        {pkg.title || pkg.name || "Package"}
                      </span>
                      {pkg.specialty && (
                        <span style={{
                          backgroundColor: "#1f2d3d",
                          color: "#58a6ff",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 20,
                          border: "1px solid #388bfd40"
                        }}>
                          {pkg.specialty}
                        </span>
                      )}
                    </div>

                    {pkg.description && (
                      <p style={{
                        color: "#8b949e",
                        fontSize: 13,
                        margin: "0 0 12px 0",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>
                        {pkg.description}
                      </p>
                    )}

                    <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                      <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 100 }}>
                        <span style={{ fontSize: 11, color: "#8b949e", fontWeight: 500 }}>Sessions</span>
                        <input
                          type="number"
                          min="1"
                          value={pkg.sessions || ""}
                          onChange={e => handlePackageChange(index, "sessions", e.target.value)}
                          style={{
                            backgroundColor: BG,
                            border: `1px solid ${BORDER}`,
                            borderRadius: 6,
                            color: "#e6edf3",
                            padding: "6px 10px",
                            fontSize: 14,
                            width: "100%",
                            boxSizing: "border-box"
                          }}
                        />
                      </label>

                      <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 120 }}>
                        <span style={{ fontSize: 11, color: "#8b949e", fontWeight: 500 }}>Price / Session (INR)</span>
                        <input
                          type="number"
                          min="0"
                          value={pkg.price_per_session || ""}
                          onChange={e => handlePackageChange(index, "price_per_session", e.target.value)}
                          style={{
                            backgroundColor: BG,
                            border: `1px solid ${BORDER}`,
                            borderRadius: 6,
                            color: "#e6edf3",
                            padding: "6px 10px",
                            fontSize: 14,
                            width: "100%",
                            boxSizing: "border-box"
                          }}
                        />
                      </label>
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 4
                    }}>
                      <span style={{ fontSize: 13, color: "#8b949e" }}>
                        Total:{" "}
                        <span style={{ color: LIME, fontWeight: 700, fontSize: 15 }}>
                          ₹{total.toLocaleString("en-IN")}
                        </span>
                      </span>
                      <button
                        onClick={() => handleUpdatePackage(pkg, index)}
                        style={{
                          backgroundColor: "transparent",
                          color: "#e6edf3",
                          border: `1px solid ${BORDER}`,
                          borderRadius: 6,
                          padding: "5px 14px",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Section 3: Payout Settings */}
        <div style={{
          backgroundColor: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: 24
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 20, color: "#e6edf3" }}>
            Payout Preferences
          </h2>

          <div style={{
            backgroundColor: CARD2,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: 20
          }}>
            {/* Payout Schedule */}
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 14, color: "#8b949e", display: "block", marginBottom: 10 }}>
                Payout Schedule:
              </span>
              <div style={{ display: "flex", gap: 10 }}>
                {["biweekly", "monthly"].map(option => {
                  const isSelected = payoutSchedule === option
                  return (
                    <button
                      key={option}
                      onClick={() => setPayoutSchedule(option)}
                      style={{
                        backgroundColor: isSelected ? "#6e40c9" : "transparent",
                        color: isSelected ? "#fff" : "#8b949e",
                        border: `1px solid ${isSelected ? "#6e40c9" : BORDER}`,
                        borderRadius: 8,
                        padding: "8px 20px",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        textTransform: "capitalize",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  )
                })}
              </div>

              <p style={{ color: "#8b949e", fontSize: 13, marginTop: 10, marginBottom: 0 }}>
                {payoutSchedule === "biweekly"
                  ? "Paid on 1st and 15th of each month"
                  : "Paid on 1st of each month"}
              </p>
            </div>

            {/* Bank Account */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block" }}>
                <span style={{ fontSize: 14, color: "#8b949e", display: "block", marginBottom: 8 }}>
                  Bank Account (last 4 digits shown):
                </span>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  placeholder="Enter bank account number"
                  style={{
                    backgroundColor: BG,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 8,
                    color: "#e6edf3",
                    padding: "10px 14px",
                    fontSize: 14,
                    width: "100%",
                    maxWidth: 360,
                    boxSizing: "border-box"
                  }}
                />
              </label>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSavePayout}
              disabled={savingPayout}
              style={{
                backgroundColor: savingPayout ? "#7aad1f" : LIME,
                color: "#000",
                border: "none",
                borderRadius: 8,
                padding: "10px 28px",
                fontSize: 14,
                fontWeight: 700,
                cursor: savingPayout ? "not-allowed" : "pointer",
                transition: "background 0.15s ease"
              }}
            >
              {savingPayout ? "Saving..." : "Save Payout Settings"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
