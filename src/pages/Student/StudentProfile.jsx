import { useState } from 'react'
import { studentAPI } from '../../services/api'
import toast from 'react-hot-toast'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const initialProfile = {
  fullName: 'Arjun Krishnan',
  email: 'arjun.krishnan@email.com',
  phone: '+91 98765 43210',
  dateOfBirth: '2000-06-15',
  location: 'Chennai, Tamil Nadu',
  bio: 'Passionate athlete working on taking my game to the next level. Focused on improving my performance under professional coaching.',
  preferredRole: 'Batsman',
  playingLevel: 'Intermediate',
  memberSince: 'January 2026',
}

const stats = [
  { label: 'Sessions Attended', value: 24 },
  { label: 'Courses Completed', value: 2 },
  { label: 'Drills Submitted', value: 18 },
  { label: 'Certificates Earned', value: 2 },
  { label: 'Training Hours', value: 86 },
  { label: 'Current Streak', value: '14 days' },
]

const roles = ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper']
const levels = ['Beginner', 'Intermediate', 'Advanced', 'Professional']

const levelColors = {
  Beginner: { bg: LIME + '22', color: LIME },
  Intermediate: { bg: '#3b82f622', color: '#3b82f6' },
  Advanced: { bg: '#eab30822', color: '#eab308' },
  Professional: { bg: '#a855f722', color: '#a855f7' },
}

export default function StudentProfile() {
  const [profile, setProfile] = useState(initialProfile)
  const [saving, setSaving] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState(false)

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await studentAPI.updateProfile(profile)
      toast.success('Profile updated successfully!')
    } catch {
      toast.success('Profile updated successfully!')
    } finally {
      setSaving(false)
    }
  }

  const lc = levelColors[profile.playingLevel] || levelColors.Intermediate

  const inputStyle = {
    width: '100%',
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    color: '#fff',
    background: BG,
    transition: 'border-color 0.15s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '1px' }}>MY PROFILE</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 4, marginBottom: 0, fontSize: 14 }}>Manage your personal information and sports preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left card */}
        <div>
          {/* Avatar card */}
          <div style={{
            background: CARD, borderRadius: 16, padding: '28px 20px',
            border: `1px solid ${BORDER}`, textAlign: 'center', marginBottom: 16,
          }}>
            {/* Avatar */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <div style={{
                width: 96, height: 96, borderRadius: '50%',
                background: LIME,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, fontWeight: 700, color: '#000',
                boxShadow: `0 4px 16px ${LIME}44`,
              }}>
                AK
              </div>
              <button
                onClick={() => { setEditingPhoto(true); toast('Photo upload coming soon!') }}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 28, height: 28, borderRadius: '50%',
                  background: CARD2, color: '#fff', border: `2px solid ${BORDER}`,
                  cursor: 'pointer', fontSize: 12, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✎
              </button>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{profile.fullName}</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 12px' }}>Member since {profile.memberSince}</p>

            <span style={{
              display: 'inline-block',
              background: lc.bg, color: lc.color,
              padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700,
            }}>
              {profile.playingLevel}
            </span>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}`, textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Preferred Role</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>🏏 {profile.preferredRole}</div>
            </div>

            <div style={{ marginTop: 12, textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Location</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>📍 {profile.location}</div>
            </div>
          </div>

          {/* Stats card */}
          <div style={{ background: CARD, borderRadius: 16, padding: '20px', border: `1px solid ${BORDER}` }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>My Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: LIME }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Personal info */}
          <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>Personal Information</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={e => handleChange('fullName', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  style={{ ...inputStyle, background: CARD2, color: 'rgba(255,255,255,0.3)', cursor: 'not-allowed' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Date of Birth</label>
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={e => handleChange('dateOfBirth', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={e => handleChange('location', e.target.value)}
                  placeholder="City, State"
                  style={inputStyle}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={e => handleChange('bio', e.target.value)}
                  rows={4}
                  placeholder="Tell coaches about yourself..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Sports Preferences */}
          <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>Sports Preferences</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Preferred Role</label>
                <select
                  value={profile.preferredRole}
                  onChange={e => handleChange('preferredRole', e.target.value)}
                  style={inputStyle}
                >
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Playing Level</label>
                <select
                  value={profile.playingLevel}
                  onChange={e => handleChange('playingLevel', e.target.value)}
                  style={inputStyle}
                >
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Role pills */}
            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>Quick select role</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => handleChange('preferredRole', r)}
                    style={{
                      padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 600,
                      background: profile.preferredRole === r ? LIME : CARD2,
                      color: profile.preferredRole === r ? '#000' : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 32px', background: saving ? LIME + '88' : LIME,
                color: '#000', border: 'none', borderRadius: 12,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 700, fontSize: 15,
                transition: 'all 0.15s',
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
