import { useState, useEffect } from "react"
import api from "../../services/api"
import toast from "react-hot-toast"

const BG = "#0d1117"
const CARD = "#161b22"
const CARD2 = "#1c2128"
const BORDER = "#21262d"
const LIME = "#adff2f"

export default function AdminPayouts() {
  const [escrow, setEscrow] = useState(null)
  const [payoutRequests, setPayoutRequests] = useState([])
  const [activeTab, setActiveTab] = useState("escrow")
  const [loading, setLoading] = useState(true)
  const [confirmRelease, setConfirmRelease] = useState(null)
  const [rejectNote, setRejectNote] = useState("")
  const [rejectingId, setRejectingId] = useState(null)
  const [txSearch, setTxSearch] = useState("")
  const [txStatusFilter, setTxStatusFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [escrowRes, payoutsRes] = await Promise.all([
          api.get("/admin/escrow"),
          api.get("/admin/payouts"),
        ])
        setEscrow(escrowRes.data)
        setPayoutRequests(payoutsRes.data || [])
      } catch (err) {
        toast.error("Failed to load payments data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleRelease = async () => {
    if (!confirmRelease) return
    try {
      await api.post("/admin/escrow/release", { booking_id: confirmRelease.booking_id })
      setEscrow((prev) => ({
        ...prev,
        held: prev.held.filter((b) => b.booking_id !== confirmRelease.booking_id),
        total_held_inr: (prev.total_held_inr || 0) - (confirmRelease.amount_inr || 0),
        total_released_inr: (prev.total_released_inr || 0) + (confirmRelease.amount_inr || 0),
      }))
      toast.success("Payment released to coach")
    } catch {
      toast.error("Failed to release payment")
    } finally {
      setConfirmRelease(null)
    }
  }

  const handleApprove = async (payoutId) => {
    try {
      await api.post("/admin/payouts/approve", { payout_id: payoutId })
      setPayoutRequests((prev) =>
        prev.map((p) => (p.id === payoutId ? { ...p, status: "approved" } : p))
      )
      toast.success("Payout approved")
    } catch {
      toast.error("Failed to approve payout")
    }
  }

  const handleReject = async (payoutId) => {
    try {
      await api.post("/admin/payouts/reject", { payout_id: payoutId, note: rejectNote })
      setPayoutRequests((prev) =>
        prev.map((p) => (p.id === payoutId ? { ...p, status: "rejected", note: rejectNote } : p))
      )
      toast.success("Payout rejected")
    } catch {
      toast.error("Failed to reject payout")
    } finally {
      setRejectingId(null)
      setRejectNote("")
    }
  }

  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const pendingRequests = payoutRequests.filter((p) => p.status === "pending")
  const pastRequests = payoutRequests.filter((p) => p.status !== "pending")

  const allTransactions = escrow?.bookings || []
  const filteredTransactions = allTransactions.filter((tx) => {
    const matchSearch =
      txSearch === "" ||
      (tx.student_name || "").toLowerCase().includes(txSearch.toLowerCase()) ||
      (tx.coach_name || "").toLowerCase().includes(txSearch.toLowerCase()) ||
      (tx.topic || "").toLowerCase().includes(txSearch.toLowerCase())
    const matchStatus =
      txStatusFilter === "all" || tx.payment_status === txStatusFilter
    return matchSearch && matchStatus
  })

  const statusBadge = (status) => {
    const map = {
      completed: { bg: "#16a34a22", color: "#4ade80", label: "Completed" },
      pending: { bg: "#ca8a0422", color: "#fbbf24", label: "Pending" },
      approved: { bg: "#1d4ed822", color: "#60a5fa", label: "Approved" },
      rejected: { bg: "#dc262622", color: "#f87171", label: "Rejected" },
      held: { bg: "#ea580c22", color: "#fb923c", label: "In Escrow" },
      released: { bg: "#16a34a22", color: "#4ade80", label: "Released" },
      paid: { bg: "#16a34a22", color: "#4ade80", label: "Paid" },
      unpaid: { bg: "#ca8a0422", color: "#fbbf24", label: "Unpaid" },
    }
    const s = map[status] || { bg: "#21262d", color: "#8b949e", label: status || "—" }
    return (
      <span
        style={{
          background: s.bg,
          color: s.color,
          padding: "2px 10px",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {s.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8b949e",
          fontSize: 16,
        }}
      >
        Loading payments data...
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, padding: "32px 24px", fontFamily: "inherit" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: "#e6edf3", fontSize: 26, fontWeight: 700, margin: 0 }}>
            Payments &amp; Payouts
          </h1>
          <p style={{ color: "#8b949e", fontSize: 14, marginTop: 6 }}>
            Manage escrow balances, approve payout requests, and monitor transactions
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
          {[
            {
              label: "Held in Escrow",
              value: `₹${(escrow?.total_held_inr || 0).toLocaleString()}`,
              color: "#fb923c",
            },
            {
              label: "Total Released",
              value: `₹${(escrow?.total_released_inr || 0).toLocaleString()}`,
              color: "#4ade80",
            },
            {
              label: "Pending Requests",
              value: pendingRequests.length,
              color: "#fbbf24",
            },
            {
              label: "Platform Revenue",
              value: `₹${Math.round((escrow?.total_released_inr || 0) * 0.1).toLocaleString()}`,
              color: "#c084fc",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: "20px 22px",
              }}
            >
              <div style={{ color: "#8b949e", fontSize: 12, marginBottom: 8, fontWeight: 500 }}>
                {stat.label}
              </div>
              <div style={{ color: stat.color, fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 28,
            borderBottom: `1px solid ${BORDER}`,
            paddingBottom: 0,
          }}
        >
          {[
            { key: "escrow", label: "Escrow" },
            { key: "payouts", label: "Payout Requests" },
            { key: "transactions", label: "All Transactions" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? LIME : "transparent",
                color: activeTab === tab.key ? "#000" : "#8b949e",
                border: "none",
                borderRadius: "6px 6px 0 0",
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: activeTab === tab.key ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ESCROW TAB */}
        {activeTab === "escrow" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ color: "#e6edf3", fontSize: 18, fontWeight: 600, margin: 0 }}>
                Payments Held in Escrow
              </h2>
              <p style={{ color: "#8b949e", fontSize: 13, marginTop: 4 }}>
                Release payment to coach after confirming session completed
              </p>
            </div>

            {escrow?.held && escrow.held.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {escrow.held.map((booking) => (
                  <div
                    key={booking.booking_id}
                    style={{
                      background: CARD,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 10,
                      padding: "18px 22px",
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Left */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 2, minWidth: 220 }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          background: "#21262d",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: LIME,
                          fontWeight: 700,
                          fontSize: 15,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(booking.student_name)}
                      </div>
                      <div>
                        <div style={{ color: "#e6edf3", fontWeight: 600, fontSize: 14 }}>
                          {booking.student_name || "—"}
                        </div>
                        <div style={{ color: "#8b949e", fontSize: 12, marginTop: 2 }}>
                          {booking.session_date || "—"} · {booking.session_time || "—"}
                        </div>
                        <div style={{ color: "#8b949e", fontSize: 12 }}>{booking.topic || "—"}</div>
                      </div>
                    </div>

                    {/* Middle */}
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ color: "#8b949e", fontSize: 12 }}>Coach</div>
                      <div style={{ color: "#e6edf3", fontWeight: 600, fontSize: 14, marginTop: 2 }}>
                        {booking.coach_name || "—"}
                      </div>
                      <div style={{ color: LIME, fontWeight: 700, fontSize: 20, marginTop: 4 }}>
                        ₹{(booking.amount_inr || 0).toLocaleString()}
                      </div>
                    </div>

                    {/* Right */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                      {statusBadge(booking.session_status || "held")}
                      <button
                        onClick={() => setConfirmRelease(booking)}
                        style={{
                          background: LIME,
                          color: "#000",
                          border: "none",
                          borderRadius: 7,
                          padding: "8px 18px",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Release to Coach
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: "48px 24px",
                  textAlign: "center",
                  color: "#8b949e",
                  fontSize: 15,
                }}
              >
                No payments currently held in escrow.
              </div>
            )}
          </div>
        )}

        {/* PAYOUT REQUESTS TAB */}
        {activeTab === "payouts" && (
          <div>
            {/* Pending */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ color: "#e6edf3", fontSize: 17, fontWeight: 600, marginBottom: 14 }}>
                Pending Requests
              </h2>
              {pendingRequests.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      style={{
                        background: CARD,
                        border: `1px solid #ea580c55`,
                        borderLeft: `4px solid #fb923c`,
                        borderRadius: 10,
                        padding: "18px 22px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        {/* Coach info */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 2, minWidth: 200 }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              background: "#21262d",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fb923c",
                              fontWeight: 700,
                              fontSize: 14,
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(req.coach_name)}
                          </div>
                          <div>
                            <div style={{ color: "#e6edf3", fontWeight: 600, fontSize: 14 }}>
                              {req.coach_name || "—"}
                            </div>
                            <div style={{ color: "#8b949e", fontSize: 12, marginTop: 2 }}>
                              {req.sessions_count || 0} sessions · Requested{" "}
                              {req.requested_at ? new Date(req.requested_at).toLocaleDateString() : "—"}
                            </div>
                          </div>
                        </div>

                        {/* Amount + schedule */}
                        <div style={{ flex: 1, minWidth: 130 }}>
                          <div style={{ color: LIME, fontWeight: 700, fontSize: 20 }}>
                            ₹{(req.amount_inr || 0).toLocaleString()}
                          </div>
                          <div style={{ marginTop: 6 }}>
                            {statusBadge(req.schedule || "pending")}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                          <button
                            onClick={() => handleApprove(req.id)}
                            style={{
                              background: "#16a34a",
                              color: "#fff",
                              border: "none",
                              borderRadius: 7,
                              padding: "8px 18px",
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              setRejectingId(rejectingId === req.id ? null : req.id)
                            }
                            style={{
                              background: "#dc2626",
                              color: "#fff",
                              border: "none",
                              borderRadius: 7,
                              padding: "8px 18px",
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </div>

                      {/* Reject inline */}
                      {rejectingId === req.id && (
                        <div
                          style={{
                            marginTop: 14,
                            padding: "14px 16px",
                            background: CARD2,
                            borderRadius: 8,
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <input
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            placeholder="Enter rejection reason..."
                            style={{
                              flex: 1,
                              minWidth: 200,
                              background: "#0d1117",
                              border: `1px solid ${BORDER}`,
                              borderRadius: 7,
                              padding: "8px 12px",
                              color: "#e6edf3",
                              fontSize: 13,
                              outline: "none",
                            }}
                          />
                          <button
                            onClick={() => handleReject(req.id)}
                            style={{
                              background: "#dc2626",
                              color: "#fff",
                              border: "none",
                              borderRadius: 7,
                              padding: "8px 16px",
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Confirm Reject
                          </button>
                          <button
                            onClick={() => { setRejectingId(null); setRejectNote("") }}
                            style={{
                              background: "transparent",
                              color: "#8b949e",
                              border: `1px solid ${BORDER}`,
                              borderRadius: 7,
                              padding: "8px 14px",
                              fontSize: 13,
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: "32px 24px",
                    textAlign: "center",
                    color: "#8b949e",
                    fontSize: 14,
                  }}
                >
                  No pending payout requests.
                </div>
              )}
            </div>

            {/* Past requests */}
            {pastRequests.length > 0 && (
              <div>
                <h2 style={{ color: "#e6edf3", fontSize: 17, fontWeight: 600, marginBottom: 14 }}>
                  Past Requests
                </h2>
                <div
                  style={{
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: CARD2 }}>
                        {["Date", "Coach", "Amount", "Schedule", "Status"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "12px 16px",
                              textAlign: "left",
                              color: "#8b949e",
                              fontSize: 12,
                              fontWeight: 600,
                              borderBottom: `1px solid ${BORDER}`,
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pastRequests.map((req, i) => (
                        <tr
                          key={req.id}
                          style={{
                            borderBottom: i < pastRequests.length - 1 ? `1px solid ${BORDER}` : "none",
                          }}
                        >
                          <td style={{ padding: "12px 16px", color: "#8b949e", fontSize: 13 }}>
                            {req.requested_at ? new Date(req.requested_at).toLocaleDateString() : "—"}
                          </td>
                          <td style={{ padding: "12px 16px", color: "#e6edf3", fontSize: 13, fontWeight: 500 }}>
                            {req.coach_name || "—"}
                          </td>
                          <td style={{ padding: "12px 16px", color: LIME, fontSize: 13, fontWeight: 700 }}>
                            ₹{(req.amount_inr || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: "12px 16px", fontSize: 13 }}>
                            {statusBadge(req.schedule)}
                          </td>
                          <td style={{ padding: "12px 16px", fontSize: 13 }}>
                            {statusBadge(req.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ALL TRANSACTIONS TAB */}
        {activeTab === "transactions" && (
          <div>
            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <input
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                placeholder="Search by student, coach, or topic..."
                style={{
                  flex: 1,
                  minWidth: 220,
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: "9px 14px",
                  color: "#e6edf3",
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <select
                value={txStatusFilter}
                onChange={(e) => setTxStatusFilter(e.target.value)}
                style={{
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: "9px 14px",
                  color: "#e6edf3",
                  fontSize: 13,
                  outline: "none",
                  cursor: "pointer",
                  minWidth: 160,
                }}
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="held">In Escrow</option>
                <option value="released">Released</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div
              style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: CARD2 }}>
                    {["Student", "Coach", "Date", "Topic", "Amount", "Currency", "Pay Status", "Session Status"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 14px",
                            textAlign: "left",
                            color: "#8b949e",
                            fontSize: 12,
                            fontWeight: 600,
                            borderBottom: `1px solid ${BORDER}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx, i) => (
                      <tr
                        key={tx.booking_id || i}
                        style={{
                          borderBottom:
                            i < filteredTransactions.length - 1 ? `1px solid ${BORDER}` : "none",
                          background: i % 2 === 0 ? "transparent" : "#ffffff05",
                        }}
                      >
                        <td style={{ padding: "11px 14px", color: "#e6edf3", fontSize: 13 }}>
                          {tx.student_name || "—"}
                        </td>
                        <td style={{ padding: "11px 14px", color: "#e6edf3", fontSize: 13 }}>
                          {tx.coach_name || "—"}
                        </td>
                        <td style={{ padding: "11px 14px", color: "#8b949e", fontSize: 12, whiteSpace: "nowrap" }}>
                          {tx.session_date || "—"}
                        </td>
                        <td style={{ padding: "11px 14px", color: "#8b949e", fontSize: 12, maxWidth: 160 }}>
                          <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {tx.topic || "—"}
                          </span>
                        </td>
                        <td style={{ padding: "11px 14px", color: LIME, fontSize: 13, fontWeight: 700 }}>
                          ₹{(tx.amount_inr || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: "11px 14px", color: "#8b949e", fontSize: 12 }}>
                          {tx.currency || "INR"}
                        </td>
                        <td style={{ padding: "11px 14px", fontSize: 12 }}>
                          {statusBadge(tx.payment_status)}
                        </td>
                        <td style={{ padding: "11px 14px", fontSize: 12 }}>
                          {statusBadge(tx.session_status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        style={{ padding: "40px 24px", textAlign: "center", color: "#8b949e", fontSize: 14 }}
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CONFIRM RELEASE MODAL */}
      {confirmRelease && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setConfirmRelease(null)}
        >
          <div
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: "32px 36px",
              maxWidth: 420,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#e6edf3", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
              Release payment to coach?
            </h3>
            <p style={{ color: "#8b949e", fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>
              You are about to release{" "}
              <span style={{ color: LIME, fontWeight: 700 }}>
                ₹{(confirmRelease.amount_inr || 0).toLocaleString()}
              </span>{" "}
              to{" "}
              <span style={{ color: "#e6edf3", fontWeight: 600 }}>
                {confirmRelease.coach_name || "this coach"}
              </span>
              .
            </p>
            <p
              style={{
                color: "#f87171",
                fontSize: 13,
                fontWeight: 600,
                margin: "0 0 24px",
                padding: "10px 14px",
                background: "#dc262618",
                borderRadius: 7,
                border: "1px solid #dc262633",
              }}
            >
              This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setConfirmRelease(null)}
                style={{
                  background: "transparent",
                  color: "#8b949e",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 7,
                  padding: "9px 22px",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRelease}
                style={{
                  background: LIME,
                  color: "#000",
                  border: "none",
                  borderRadius: 7,
                  padding: "9px 22px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Confirm Release
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
