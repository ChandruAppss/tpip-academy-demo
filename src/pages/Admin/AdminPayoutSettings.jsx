import { useState, useEffect } from "react"
import api from "../../services/api"
import toast from "react-hot-toast"

const BG = "#0d1117"
const CARD = "#161b22"
const BORDER = "#21262d"
const LIME = "#adff2f"

export default function AdminPayoutSettings() {
  const [settings, setSettings] = useState({
    platform_fee_pct: 10,
    default_schedule: "biweekly",
    razorpay_key_id: "",
    razorpay_key_secret: "",
    stripe_publishable_key: "",
    stripe_secret_key: "",
  })
  const [saving, setSaving] = useState(false)
  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false)
  const [showStripeSecret, setShowStripeSecret] = useState(false)

  useEffect(() => {
    api.get("/admin/payout-settings")
      .then((res) => setSettings(res.data))
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put("/admin/payout-settings", settings)
      toast.success("Settings saved successfully")
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const sessionAmount = 750
  const platformKeeps = ((sessionAmount * settings.platform_fee_pct) / 100).toFixed(2)
  const coachReceives = (sessionAmount - parseFloat(platformKeeps)).toFixed(2)

  return (
    <div style={{ backgroundColor: BG, minHeight: "100vh", padding: "32px", color: "#e6edf3", fontFamily: "sans-serif" }}>
      {/* Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>Payment &amp; Payout Settings</h1>
          <p style={{ margin: "6px 0 0", color: "#8b949e", fontSize: "14px" }}>
            Configure gateways, platform fees, and payout schedules
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            backgroundColor: LIME,
            color: "#0d1117",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>

      {/* Section 1 — Platform Commission */}
      <div
        style={{
          backgroundColor: CARD,
          border: `1px solid ${BORDER}`,
          borderLeft: "4px solid #f97316",
          borderRadius: "10px",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>Platform Commission Fee</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <label style={{ fontSize: "14px", color: "#8b949e" }}>Fee Percentage (%)</label>
          <input
            type="number"
            min={0}
            max={50}
            step={0.5}
            value={settings.platform_fee_pct}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, platform_fee_pct: parseFloat(e.target.value) || 0 }))
            }
            style={{
              backgroundColor: BG,
              border: `1px solid ${BORDER}`,
              borderRadius: "6px",
              padding: "8px 12px",
              color: "#e6edf3",
              fontSize: "14px",
              width: "100px",
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: "#1c2128",
            border: `1px solid ${BORDER}`,
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "10px",
            fontSize: "14px",
          }}
        >
          For a <strong>Rs.{sessionAmount}</strong> session: Platform keeps{" "}
          <strong style={{ color: "#f97316" }}>Rs.{platformKeeps}</strong>, Coach receives{" "}
          <strong style={{ color: LIME }}>Rs.{coachReceives}</strong>
        </div>
        <p style={{ margin: 0, fontSize: "12px", color: "#8b949e" }}>
          Applied to all released payments before coach payout
        </p>
      </div>

      {/* Section 2 — Payout Schedule */}
      <div
        style={{
          backgroundColor: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: "10px",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>Default Payout Schedule</h2>
        <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
          {["biweekly", "monthly"].map((option) => (
            <button
              key={option}
              onClick={() => setSettings((prev) => ({ ...prev, default_schedule: option }))}
              style={{
                backgroundColor: settings.default_schedule === option ? LIME : BG,
                color: settings.default_schedule === option ? "#0d1117" : "#8b949e",
                border: `1px solid ${settings.default_schedule === option ? LIME : BORDER}`,
                borderRadius: "6px",
                padding: "8px 20px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {option === "biweekly" ? "Biweekly" : "Monthly"}
            </button>
          ))}
        </div>
        <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#c9d1d9" }}>
          {settings.default_schedule === "biweekly"
            ? "Coaches are paid on the 1st and 15th of each month"
            : "Coaches are paid on the 1st of each month"}
        </p>
        <p style={{ margin: 0, fontSize: "12px", color: "#8b949e" }}>
          Coaches can change their own schedule in their settings
        </p>
      </div>

      {/* Section 3 — Razorpay */}
      <div
        style={{
          backgroundColor: CARD,
          border: `1px solid ${BORDER}`,
          borderLeft: "4px solid #1a73e8",
          borderRadius: "10px",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Razorpay</h2>
          {settings.razorpay_key_id ? (
            <span
              style={{
                backgroundColor: "#1a4731",
                color: "#3fb950",
                border: "1px solid #2ea043",
                borderRadius: "12px",
                padding: "2px 10px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Live Keys Active
            </span>
          ) : (
            <span
              style={{
                backgroundColor: "#3d2f0d",
                color: "#e3b341",
                border: "1px solid #9e6a03",
                borderRadius: "12px",
                padding: "2px 10px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Demo Mode
            </span>
          )}
        </div>
        <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#8b949e" }}>For Indian payments (INR)</p>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "#8b949e", marginBottom: "6px" }}>
            Razorpay Key ID
          </label>
          <input
            type="text"
            placeholder="rzp_live_..."
            value={settings.razorpay_key_id}
            onChange={(e) => setSettings((prev) => ({ ...prev, razorpay_key_id: e.target.value }))}
            style={{
              width: "100%",
              boxSizing: "border-box",
              backgroundColor: BG,
              border: `1px solid ${BORDER}`,
              borderRadius: "6px",
              padding: "9px 12px",
              color: "#e6edf3",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "#8b949e", marginBottom: "6px" }}>
            Razorpay Key Secret
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showRazorpaySecret ? "text" : "password"}
              placeholder="••••••••••••"
              value={settings.razorpay_key_secret}
              onChange={(e) => setSettings((prev) => ({ ...prev, razorpay_key_secret: e.target.value }))}
              style={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: BG,
                border: `1px solid ${BORDER}`,
                borderRadius: "6px",
                padding: "9px 40px 9px 12px",
                color: "#e6edf3",
                fontSize: "14px",
              }}
            />
            <button
              onClick={() => setShowRazorpaySecret((v) => !v)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#8b949e",
                cursor: "pointer",
                fontSize: "13px",
                padding: 0,
              }}
            >
              {showRazorpaySecret ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#8b949e" }}>
          Get your keys at{" "}
          <a href="https://razorpay.com" target="_blank" rel="noreferrer" style={{ color: "#1a73e8" }}>
            razorpay.com
          </a>
        </p>

        <div
          style={{
            backgroundColor: "#0d1b2a",
            border: "1px solid #1a3a5c",
            borderRadius: "6px",
            padding: "10px 14px",
            fontSize: "13px",
            color: "#8b949e",
          }}
        >
          Indian students (detected by IP) will see Razorpay checkout
        </div>
      </div>

      {/* Section 4 — Stripe */}
      <div
        style={{
          backgroundColor: CARD,
          border: `1px solid ${BORDER}`,
          borderLeft: "4px solid #635bff",
          borderRadius: "10px",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Stripe</h2>
          {settings.stripe_publishable_key ? (
            <span
              style={{
                backgroundColor: "#1a4731",
                color: "#3fb950",
                border: "1px solid #2ea043",
                borderRadius: "12px",
                padding: "2px 10px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Live Keys Active
            </span>
          ) : (
            <span
              style={{
                backgroundColor: "#3d2f0d",
                color: "#e3b341",
                border: "1px solid #9e6a03",
                borderRadius: "12px",
                padding: "2px 10px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Demo Mode
            </span>
          )}
        </div>
        <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#8b949e" }}>For international payments</p>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "#8b949e", marginBottom: "6px" }}>
            Stripe Publishable Key
          </label>
          <input
            type="text"
            placeholder="pk_live_..."
            value={settings.stripe_publishable_key}
            onChange={(e) => setSettings((prev) => ({ ...prev, stripe_publishable_key: e.target.value }))}
            style={{
              width: "100%",
              boxSizing: "border-box",
              backgroundColor: BG,
              border: `1px solid ${BORDER}`,
              borderRadius: "6px",
              padding: "9px 12px",
              color: "#e6edf3",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "#8b949e", marginBottom: "6px" }}>
            Stripe Secret Key
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showStripeSecret ? "text" : "password"}
              placeholder="••••••••••••"
              value={settings.stripe_secret_key}
              onChange={(e) => setSettings((prev) => ({ ...prev, stripe_secret_key: e.target.value }))}
              style={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: BG,
                border: `1px solid ${BORDER}`,
                borderRadius: "6px",
                padding: "9px 40px 9px 12px",
                color: "#e6edf3",
                fontSize: "14px",
              }}
            />
            <button
              onClick={() => setShowStripeSecret((v) => !v)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#8b949e",
                cursor: "pointer",
                fontSize: "13px",
                padding: 0,
              }}
            >
              {showStripeSecret ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#8b949e" }}>
          Get your keys at{" "}
          <a href="https://stripe.com" target="_blank" rel="noreferrer" style={{ color: "#635bff" }}>
            stripe.com
          </a>
        </p>

        <div
          style={{
            backgroundColor: "#130f2a",
            border: "1px solid #2d2566",
            borderRadius: "6px",
            padding: "10px 14px",
            fontSize: "13px",
            color: "#8b949e",
          }}
        >
          International students pay in their local currency via Stripe
        </div>
      </div>

      {/* Section 5 — Currency Rules */}
      <div
        style={{
          backgroundColor: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: "10px",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>Currency Detection Rules</h2>

        <div
          style={{
            backgroundColor: "#0d1117",
            border: `1px solid ${BORDER}`,
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          {[
            { region: "India (IN)", currency: "INR", gateway: "Razorpay" },
            { region: "US / UK / EU / AU", currency: "Local currency", gateway: "Stripe" },
            { region: "Coach payouts", currency: "Coach country currency", gateway: "" },
          ].map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "10px 0",
                borderBottom: i < 2 ? `1px solid ${BORDER}` : "none",
                fontSize: "14px",
              }}
            >
              <span style={{ width: "160px", color: "#c9d1d9", fontWeight: 500 }}>{row.region}</span>
              <span style={{ color: "#8b949e" }}>→</span>
              <span style={{ width: "160px", color: "#e6edf3" }}>{row.currency}</span>
              {row.gateway && (
                <>
                  <span style={{ color: "#8b949e" }}>→</span>
                  <span
                    style={{
                      color: row.gateway === "Razorpay" ? "#1a73e8" : "#635bff",
                      fontWeight: 600,
                    }}
                  >
                    {row.gateway}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>

        {[
          { label: "Auto-detect currency by student IP", key: "auto_detect_currency" },
          { label: "Allow students to override their currency", key: "allow_currency_override" },
        ].map((toggle) => (
          <div
            key={toggle.key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderTop: `1px solid ${BORDER}`,
            }}
          >
            <span style={{ fontSize: "14px", color: "#c9d1d9" }}>{toggle.label}</span>
            <label style={{ position: "relative", display: "inline-block", width: "44px", height: "24px" }}>
              <input
                type="checkbox"
                defaultChecked
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: LIME,
                  borderRadius: "24px",
                  transition: "0.2s",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    height: "18px",
                    width: "18px",
                    left: "22px",
                    bottom: "3px",
                    backgroundColor: "#0d1117",
                    borderRadius: "50%",
                    transition: "0.2s",
                  }}
                />
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
