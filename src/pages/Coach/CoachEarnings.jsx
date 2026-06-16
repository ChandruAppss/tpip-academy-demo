import { useState, useEffect } from "react"
import api from "../../services/api"
import toast from "react-hot-toast"

const BG = "#0d1117"
const CARD = "#161b22"
const CARD2 = "#1c2128"
const BORDER = "#21262d"
const LIME = "#adff2f"

function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN")
}

function nextPayoutLabel(schedule) {
  if (schedule === "biweekly") return "1 Jun or 15 Jun"
  return "1 Jun 2026"
}

export default function CoachEarnings() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [requestingPayout, setRequestingPayout] = useState(false)
  const [showReleased, setShowReleased] = useState(false)

  // Payout settings local state
  const [schedule, setSchedule] = useState("biweekly")
  const [bankAccount, setBankAccount] = useState("")
  const [savingSettings, setSavingSettings] = useState(false)

  useEffect(() => {
    api.get("/coach/earnings")
      .then(res => {
        setData(res.data)
        if (res.data.schedule) setSchedule(res.data.schedule)
        if (res.data.bank_account) setBankAccount(res.data.bank_account)
      })
      .catch(() => toast.error("Failed to load earnings"))
      .finally(() => setLoading(false))
  }, [])

  async function handlePayoutConfirm() {
    setRequestingPayout(true)
    try {
      await api.post("/coach/payout-request", {
        amount: data.pending_inr,
        schedule: data.schedule,
        sessions_count: (data.pending_bookings || []).length,
      })
      toast.success("Payout request submitted successfully!")
      setShowPayoutModal(false)
      // Refresh data
      const res = await api.get("/coach/earnings")
      setData(res.data)
    } catch {
      toast.error("Failed to submit payout request")
    } finally {
      setRequestingPayout(false)
    }
  }

  async function handleSaveSettings() {
    setSavingSettings(true)
    try {
      await api.put("/coach/payout-settings", { schedule, bank_account: bankAccount })
      toast.success("Payout settings saved!")
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setSavingSettings(false)
    }
  }

  const totalEarned = (data?.pending_inr || 0) + (data?.released_inr || 0)

  if (loading) {
    return (
      <div style={{ padding: "60px 32px", textAlign: "center", color: "rgba(255,255,255,0.45)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        Loading earnings...
      </div>
    )
  }

  return (
    <div style={{ padding: "28px 32px", fontFamily: "system-ui,-apple-system,sans-serif", color: "#fff", background: BG, minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "0.5px" }}>Earnings &amp; Payouts</h1>
        <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.45)", fontSize: 14 }}>Track your session income and request withdrawals</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {/* Total Earned */}
        <div style={{ background: CARD, borderRadius: 12, padding: 20, border: `1px solid ${BORDER}` }}>
          <p style={{ margin: "0 0 6px", fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>Total Earned</p>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: LIME }}>{fmt(totalEarned)}</p>
        </div>
        {/* Pending Release */}
        <div style={{ background: CARD, borderRadius: 12, padding: 20, border: `1px solid ${BORDER}`, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>Pending Release</p>
            <span title="Held in escrow until admin approves" style={{ cursor: "default", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>ⓘ</span>
          </div>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#f97316" }}>{fmt(data?.pending_inr)}</p>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Held in escrow</p>
        </div>
        {/* Total Released */}
        <div style={{ background: CARD, borderRadius: 12, padding: 20, border: `1px solid ${BORDER}` }}>
          <p style={{ margin: "0 0 6px", fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>Total Released</p>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#22c55e" }}>{fmt(data?.released_inr)}</p>
        </div>
        {/* Next Payout Date */}
        <div style={{ background: CARD, borderRadius: 12, padding: 20, border: `1px solid ${BORDER}` }}>
          <p style={{ margin: "0 0 6px", fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>Next Payout Date</p>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#3b82f6" }}>{nextPayoutLabel(data?.schedule)}</p>
        </div>
      </div>

      {/* Payout Request Card */}
      <div style={{ background: "linear-gradient(135deg, #2d1b69 0%, #1a1040 50%, #161b22 100%)", borderRadius: 14, padding: 28, border: "1px solid #4c1d95", marginBottom: 24 }}>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>Available to Request</p>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <span style={{ fontSize: 36, fontWeight: 800, color: LIME }}>{fmt(data?.pending_inr)}</span>
          <span style={{ background: "#6d28d9", color: "#e9d5ff", border: "1px solid #7c3aed", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
            {data?.schedule === "biweekly" ? "Biweekly" : "Monthly"}
          </span>
        </div>
        <button
          onClick={() => setShowPayoutModal(true)}
          disabled={!data?.pending_inr || data.pending_inr === 0}
          style={{
            width: "100%",
            height: 48,
            background: !data?.pending_inr || data.pending_inr === 0 ? "rgba(173,255,47,0.3)" : LIME,
            color: !data?.pending_inr || data.pending_inr === 0 ? "rgba(0,0,0,0.4)" : "#000",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 15,
            cursor: !data?.pending_inr || data.pending_inr === 0 ? "not-allowed" : "pointer",
            marginBottom: 12,
          }}
        >
          Request Payout
        </button>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
          Admin reviews and processes within 1-2 business days
        </p>
      </div>

      {/* Payout History Table */}
      <div style={{ background: CARD, borderRadius: 12, border: `1px solid ${BORDER}`, marginBottom: 24, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>Payout History</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: CARD2 }}>
                {["Date", "Amount", "Sessions", "Schedule", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.payout_requests || []).length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "24px 16px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No payout requests yet</td>
                </tr>
              ) : (data?.payout_requests || []).map((pr, i) => {
                const statusColor = pr.status === "approved" ? "#22c55e" : pr.status === "rejected" ? "#ef4444" : "#eab308"
                const statusBg = pr.status === "approved" ? "#22c55e22" : pr.status === "rejected" ? "#ef444422" : "#eab30822"
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{pr.date || pr.created_at || "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: LIME }}>{fmt(pr.amount)}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{pr.sessions_count ?? "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "rgba(255,255,255,0.6)", textTransform: "capitalize" }}>{pr.schedule || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: statusBg, color: statusColor, border: `1px solid ${statusColor}44`, padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>{pr.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Held in Escrow Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#fff" }}>Sessions Awaiting Release</h2>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Admin releases payment after confirming session completion</p>
        </div>
        {(data?.pending_bookings || []).length === 0 ? (
          <div style={{ background: CARD, borderRadius: 12, border: `1px solid ${BORDER}`, padding: "24px 20px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
            No sessions awaiting release
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {(data.pending_bookings).map((b, i) => (
              <div key={i} style={{ background: CARD, borderRadius: 12, padding: 18, border: `1px solid ${BORDER}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <p style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 600, color: "#fff" }}>{b.student_name || b.student || "Student"}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{b.date || b.session_date || "—"}</p>
                  </div>
                  <span style={{ background: "#f9731622", color: "#f97316", border: "1px solid #f9731644", padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>Held in Escrow</span>
                </div>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{b.topic || b.program || "—"}</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: LIME }}>{fmt(b.amount || b.coach_earning)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Released Payments (collapsible) */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => setShowReleased(v => !v)}
          style={{ background: "none", border: "none", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", padding: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}
        >
          Released Payments ({(data?.released_bookings || []).length})
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{showReleased ? "▴" : "▾"}</span>
        </button>
        {showReleased && (
          <div style={{ background: CARD, borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: CARD2 }}>
                    {["Student", "Date", "Topic", "Amount"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data?.released_bookings || []).length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: "20px 16px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No released payments yet</td>
                    </tr>
                  ) : (data.released_bookings).map((b, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }}>
                      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500, color: "#fff" }}>{b.student_name || b.student || "—"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{b.date || b.session_date || "—"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{b.topic || b.program || "—"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: "#22c55e" }}>{fmt(b.amount || b.coach_earning)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Payout Settings */}
      <div style={{ background: CARD, borderRadius: 12, padding: 24, border: `1px solid ${BORDER}` }}>
        <h2 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: "#fff" }}>Payout Settings</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Payout Schedule</p>
            <div style={{ display: "flex", gap: 8 }}>
              {["biweekly", "monthly"].map(s => (
                <button
                  key={s}
                  onClick={() => setSchedule(s)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 8,
                    border: `1px solid ${schedule === s ? LIME : BORDER}`,
                    background: schedule === s ? LIME + "22" : "transparent",
                    color: schedule === s ? LIME : "rgba(255,255,255,0.5)",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 13,
                    textTransform: "capitalize",
                  }}
                >
                  {s === "biweekly" ? "Biweekly" : "Monthly"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Bank Account</p>
            <input
              value={bankAccount}
              onChange={e => setBankAccount(e.target.value)}
              placeholder="Enter bank account number or UPI ID"
              style={{
                width: "100%",
                maxWidth: 400,
                padding: "10px 14px",
                borderRadius: 8,
                border: `1px solid ${BORDER}`,
                background: CARD2,
                color: "#fff",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              style={{
                padding: "10px 28px",
                borderRadius: 8,
                border: "none",
                background: savingSettings ? LIME + "66" : LIME,
                color: "#000",
                fontWeight: 700,
                fontSize: 14,
                cursor: savingSettings ? "not-allowed" : "pointer",
              }}
            >
              {savingSettings ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>

      {/* Payout Confirm Modal */}
      {showPayoutModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowPayoutModal(false) }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 1000,
          }}
        >
          <div style={{ background: CARD, borderRadius: 14, padding: 32, border: `1px solid ${BORDER}`, width: "100%", maxWidth: 420 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#fff" }}>Confirm Payout Request</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: CARD2, borderRadius: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Amount</span>
                <span style={{ color: LIME, fontWeight: 700, fontSize: 16 }}>{fmt(data?.pending_inr)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: CARD2, borderRadius: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Schedule</span>
                <span style={{ color: "#fff", fontWeight: 600, fontSize: 14, textTransform: "capitalize" }}>{data?.schedule || "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: CARD2, borderRadius: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Sessions</span>
                <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{(data?.pending_bookings || []).length}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowPayoutModal(false)}
                style={{ flex: 1, padding: "12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handlePayoutConfirm}
                disabled={requestingPayout}
                style={{ flex: 1, padding: "12px", borderRadius: 8, border: "none", background: requestingPayout ? LIME + "66" : LIME, color: "#000", fontWeight: 700, fontSize: 14, cursor: requestingPayout ? "not-allowed" : "pointer" }}
              >
                {requestingPayout ? "Submitting..." : "Confirm Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
