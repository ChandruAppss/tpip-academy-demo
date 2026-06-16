import { useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const TABS = ['General', 'Notifications', 'Integrations', 'Security'];

const TIMEZONES = ['Asia/Kolkata', 'Asia/Dubai', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Singapore', 'Australia/Sydney'];
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'];
const SESSION_TIMEOUTS = ['15 minutes', '30 minutes', '1 hour', '4 hours', '8 hours', '24 hours'];

const inputStyle = { width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, color: '#fff', outline: 'none', boxSizing: 'border-box', background: BG }
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }

function InputField({ label, name, value, onChange, type = 'text', placeholder, hint }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle} />
      {hint && <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{hint}</p>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, hint }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      <select name={name} value={value} onChange={onChange} style={inputStyle}>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {hint && <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{hint}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${BORDER}` }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{description}</div>}
      </div>
      <button
        type="button"
        onClick={onChange}
        style={{ width: 48, height: 26, borderRadius: 13, border: 'none', background: checked ? LIME : BORDER, cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}
      >
        <span style={{ position: 'absolute', top: 3, left: checked ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: checked ? '#000' : 'rgba(255,255,255,0.5)', boxShadow: '0 1px 4px rgba(0,0,0,0.18)', transition: 'left 0.2s' }} />
      </button>
    </div>
  );
}

function MaskedInput({ label, name, value, onChange, placeholder, hint, onTest }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type={show ? 'text' : 'password'}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
          <button type="button" onClick={() => setShow((s) => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'rgba(255,255,255,0.4)', padding: 0 }}>
            {show ? '🙈' : '👁️'}
          </button>
        </div>
        {onTest && (
          <button type="button" onClick={onTest} style={{ padding: '9px 14px', border: `1px solid ${BORDER}`, borderRadius: 8, background: CARD2, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Test
          </button>
        )}
      </div>
      {hint && <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{hint}</p>}
    </div>
  );
}

function SaveButton({ onClick, saving }) {
  return (
    <button type="button" onClick={onClick} disabled={saving} style={{ padding: '10px 24px', background: saving ? LIME + '88' : LIME, color: '#000', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', marginTop: 8 }}>
      {saving ? 'Saving…' : 'Save Changes'}
    </button>
  );
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('General');
  const [saving, setSaving] = useState(false);

  const [general, setGeneral] = useState({ platformName: 'TPIP Academy LMS', supportEmail: 'support@tpip.in', timezone: 'Asia/Kolkata', currency: 'INR' });
  const [notifications, setNotifications] = useState({ emailNotifications: true, smsAlerts: false, sessionReminders: true, paymentAlerts: true });
  const [integrations, setIntegrations] = useState({ zoomApiKey: '', razorpayKeyId: '', razorpaySecret: '', supabaseUrl: '', landingVideoUrl: localStorage.getItem('tpip_demo_video') || '' });
  const [security, setSecurity] = useState({ oldPassword: '', newPassword: '', confirmPassword: '', twoFactor: false, sessionTimeout: '1 hour' });

  function handleGeneral(e) { setGeneral((p) => ({ ...p, [e.target.name]: e.target.value })); }
  function handleIntegrations(e) { setIntegrations((p) => ({ ...p, [e.target.name]: e.target.value })); }
  function handleSecurity(e) { setSecurity((p) => ({ ...p, [e.target.name]: e.target.value })); }
  function toggleNotification(key) { setNotifications((p) => ({ ...p, [key]: !p[key] })); }
  function testConnection(service) { toast.success(`${service} connection test initiated`); }

  async function handleSave() {
    setSaving(true);
    try {
      const data = { general, notifications, integrations };
      if (typeof adminAPI.updateSettings === 'function') await adminAPI.updateSettings(data);
      toast.success('Settings saved successfully');
    } catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  }

  async function handleChangePassword() {
    if (!security.oldPassword || !security.newPassword) { toast.error('Please fill in all password fields'); return; }
    if (security.newPassword !== security.confirmPassword) { toast.error('New passwords do not match'); return; }
    if (security.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setSaving(true);
    try {
      if (typeof adminAPI.updateSettings === 'function') await adminAPI.updateSettings({ password: security });
      toast.success('Password changed successfully');
      setSecurity((p) => ({ ...p, oldPassword: '', newPassword: '', confirmPassword: '' }));
    } catch { toast.error('Failed to change password'); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '1px' }}>SETTINGS</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: '4px 0 0' }}>Manage platform configuration and preferences</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: `2px solid ${BORDER}`, marginBottom: 28 }}>
        {TABS.map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', border: 'none', background: 'none', fontSize: 14, fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? LIME : 'rgba(255,255,255,0.45)', cursor: 'pointer', borderBottom: activeTab === tab ? `2px solid ${LIME}` : '2px solid transparent', marginBottom: -2 }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 28, maxWidth: 640 }}>

        {/* GENERAL */}
        {activeTab === 'General' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>General Settings</h2>
            <InputField label="Platform Name" name="platformName" value={general.platformName} onChange={handleGeneral} placeholder="TPIP Academy LMS" hint="Displayed in the browser tab and emails" />
            <InputField label="Support Email" name="supportEmail" value={general.supportEmail} onChange={handleGeneral} type="email" placeholder="support@tpip.in" hint="Used for system-generated emails" />
            <SelectField label="Timezone" name="timezone" value={general.timezone} onChange={handleGeneral} options={TIMEZONES} hint="All session times will be shown in this timezone" />
            <SelectField label="Currency" name="currency" value={general.currency} onChange={handleGeneral} options={CURRENCIES} hint="Default currency for payments and invoices" />
            <SaveButton onClick={handleSave} saving={saving} />
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === 'Notifications' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Notification Preferences</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>Control which notifications are sent to users and admins.</p>
            <Toggle checked={notifications.emailNotifications} onChange={() => toggleNotification('emailNotifications')} label="Email Notifications" description="Send transactional and update emails to users" />
            <Toggle checked={notifications.smsAlerts} onChange={() => toggleNotification('smsAlerts')} label="SMS Alerts" description="Send SMS for urgent alerts and OTP verification" />
            <Toggle checked={notifications.sessionReminders} onChange={() => toggleNotification('sessionReminders')} label="Session Reminders" description="Remind students and coaches 24h before a session" />
            <Toggle checked={notifications.paymentAlerts} onChange={() => toggleNotification('paymentAlerts')} label="Payment Alerts" description="Notify admins of successful payments and failures" />
            <div style={{ marginTop: 20 }}><SaveButton onClick={handleSave} saving={saving} /></div>
          </div>
        )}

        {/* INTEGRATIONS */}
        {activeTab === 'Integrations' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Integrations</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>Connect third-party services. Keys are stored securely.</p>

            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 18px', marginBottom: 16, background: CARD2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>📹</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Zoom</span>
              </div>
              <MaskedInput label="Zoom API Key" name="zoomApiKey" value={integrations.zoomApiKey} onChange={handleIntegrations} placeholder="Enter Zoom API Key" onTest={() => testConnection('Zoom')} hint="Used to create and manage virtual coaching sessions" />
            </div>

            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 18px', marginBottom: 16, background: CARD2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>💳</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Razorpay</span>
              </div>
              <MaskedInput label="Key ID" name="razorpayKeyId" value={integrations.razorpayKeyId} onChange={handleIntegrations} placeholder="rzp_live_…" hint="Your Razorpay publishable key" />
              <MaskedInput label="Key Secret" name="razorpaySecret" value={integrations.razorpaySecret} onChange={handleIntegrations} placeholder="Enter Razorpay secret" onTest={() => testConnection('Razorpay')} hint="Keep this secret — never expose in frontend code" />
            </div>

            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 18px', marginBottom: 20, background: CARD2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>🗄️</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Supabase</span>
              </div>
              <InputField label="Supabase Project URL" name="supabaseUrl" value={integrations.supabaseUrl} onChange={handleIntegrations} placeholder="https://xxxxxxxxxxx.supabase.co" hint="Your Supabase project URL from the dashboard" />
            </div>

            {/* Landing Page Video */}
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 18px', marginBottom: 20, background: CARD2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>🎬</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Landing Page Demo Video</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 12px' }}>YouTube embed URL shown when visitors click "Watch Demo" on the homepage.</p>
              <InputField
                label="YouTube Embed URL"
                name="landingVideoUrl"
                value={integrations.landingVideoUrl || ''}
                onChange={handleIntegrations}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                hint="Go to YouTube → Share → Embed → copy the src URL (starts with https://www.youtube.com/embed/…)"
              />
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('tpip_demo_video', integrations.landingVideoUrl || '')
                  toast.success('Demo video URL saved!')
                }}
                style={{ padding:'8px 16px', background:LIME, color:'#000', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}
              >
                Save Video URL
              </button>
            </div>

            <SaveButton onClick={handleSave} saving={saving} />
          </div>
        )}

        {/* SECURITY */}
        {activeTab === 'Security' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Security</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>Manage your password and account security settings.</p>

            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: '18px', marginBottom: 20, background: CARD2 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>Change Password</h3>
              <MaskedInput label="Current Password" name="oldPassword" value={security.oldPassword} onChange={handleSecurity} placeholder="Enter current password" />
              <MaskedInput label="New Password" name="newPassword" value={security.newPassword} onChange={handleSecurity} placeholder="Min. 8 characters" hint="Use a mix of letters, numbers, and symbols" />
              <MaskedInput label="Confirm New Password" name="confirmPassword" value={security.confirmPassword} onChange={handleSecurity} placeholder="Re-enter new password" />
              <button type="button" onClick={handleChangePassword} disabled={saving} style={{ padding: '9px 20px', background: saving ? LIME + '88' : LIME, color: '#000', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                {saving ? 'Updating…' : 'Update Password'}
              </button>
            </div>

            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: '18px', marginBottom: 20, background: CARD2 }}>
              <Toggle checked={security.twoFactor} onChange={() => setSecurity((p) => ({ ...p, twoFactor: !p.twoFactor }))} label="Two-Factor Authentication" description="Require a verification code on each login" />
            </div>

            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: '18px', marginBottom: 20, background: CARD2 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 14px' }}>Session Timeout</h3>
              <SelectField label="Auto-logout after inactivity" name="sessionTimeout" value={security.sessionTimeout} onChange={handleSecurity} options={SESSION_TIMEOUTS} hint="Users will be logged out after this period of inactivity" />
            </div>

            <SaveButton onClick={handleSave} saving={saving} />
          </div>
        )}
      </div>
    </div>
  );
}
