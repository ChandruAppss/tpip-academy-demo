import { useState } from 'react';
import { coachAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LIME = '#adff2f';
const BG = '#0d1117';
const CARD = '#161b22';
const CARD2 = '#1c2128';
const BORDER = '#21262d';

const SPECIALIZATIONS = ['Batting', 'Bowling', 'Fielding', 'Wicketkeeping'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOTS = ['Morning', 'Afternoon', 'Evening'];

const INITIAL_PROFILE = {
  fullName: 'Vikram Kapoor',
  email: 'vikram.kapoor@tpip.in',
  phone: '+91 98765 43210',
  specializations: ['Batting', 'Bowling'],
  bio: 'Former state-level athlete with 12 years of coaching experience. Specializes in performance technique and athletic development. Trained 200+ students across India.',
  hourlyRate: 1500,
  yearsExperience: 12,
  certifications: ['Nationally Certified', 'Nationally Certified', 'Sports Science Diploma'],
  availability: {
    Mon: { Morning: true, Afternoon: true, Evening: false },
    Tue: { Morning: true, Afternoon: false, Evening: true },
    Wed: { Morning: false, Afternoon: true, Evening: false },
    Thu: { Morning: true, Afternoon: true, Evening: true },
    Fri: { Morning: true, Afternoon: false, Evening: false },
    Sat: { Morning: false, Afternoon: true, Evening: true },
    Sun: { Morning: false, Afternoon: false, Evening: false },
  },
};

export default function CoachProfile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [form, setForm] = useState(INITIAL_PROFILE);
  const [newCert, setNewCert] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleSpec = (s) => {
    const has = form.specializations.includes(s);
    setForm({ ...form, specializations: has ? form.specializations.filter(x => x !== s) : [...form.specializations, s] });
  };

  const toggleAvail = (day, slot) => {
    setForm({ ...form, availability: { ...form.availability, [day]: { ...form.availability[day], [slot]: !form.availability[day][slot] } } });
  };

  const addCert = () => {
    if (!newCert.trim()) return;
    setForm({ ...form, certifications: [...form.certifications, newCert.trim()] });
    setNewCert('');
  };

  const removeCert = (i) => setForm({ ...form, certifications: form.certifications.filter((_, idx) => idx !== i) });

  const handleSave = async () => {
    setSaving(true);
    try { await coachAPI.updateProfile(form); } catch {}
    setProfile(form);
    toast.success('Profile updated!');
    setSaving(false);
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: BG, color: '#fff' };
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' };

  const ratingStars = (n) => Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < n ? '#eab308' : BORDER, fontSize: 18 }}>★</span>
  ));

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>COACH PROFILE</h1>
        <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>Manage your profile and availability</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Profile Card */}
        <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}`, position: 'sticky', top: 24 }}>
          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 32, fontWeight: 800, color: '#000' }}>
              {profile.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#fff' }}>{profile.fullName}</h2>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Sports Coach</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{ratingStars(4)}</div>
          </div>

          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16, marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{profile.bio.length > 120 ? profile.bio.slice(0, 120) + '...' : profile.bio}</p>
          </div>

          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Hourly Rate</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: LIME }}>₹{profile.hourlyRate}/hr</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Experience</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{profile.yearsExperience} years</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Specializations</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {profile.specializations.map(s => (
                  <span key={s} style={{ background: LIME + '22', color: LIME, border: `1px solid ${LIME}44`, padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div>
          {/* Basic Info */}
          <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}`, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#fff' }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email (read-only)</label>
                <input value={form.email} readOnly style={{ ...inputStyle, background: CARD2, color: 'rgba(255,255,255,0.3)', cursor: 'not-allowed' }} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Hourly Rate (₹)</label>
                <input type="number" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: parseInt(e.target.value) })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Years of Experience</label>
                <input type="number" value={form.yearsExperience} onChange={e => setForm({ ...form, yearsExperience: parseInt(e.target.value) })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Profile Photo</label>
                <div style={{ ...inputStyle, background: CARD2, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📷</span> Upload Photo
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Bio</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
          </div>

          {/* Specializations */}
          <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}`, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#fff' }}>Specializations</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {SPECIALIZATIONS.map(s => {
                const active = form.specializations.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggleSpec(s)} style={{ padding: '8px 18px', borderRadius: 8, border: `2px solid ${active ? LIME : BORDER}`, background: active ? LIME + '22' : 'transparent', color: active ? LIME : 'rgba(255,255,255,0.5)', fontWeight: 600, cursor: 'pointer', fontSize: 14, transition: 'all 0.15s' }}>{s}</button>
                );
              })}
            </div>
          </div>

          {/* Availability */}
          <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}`, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#fff' }}>Availability</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}></th>
                    {SLOTS.map(slot => (
                      <th key={slot} style={{ padding: '8px 16px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{slot}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day => (
                    <tr key={day} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{day}</td>
                      {SLOTS.map(slot => {
                        const checked = form.availability[day]?.[slot] || false;
                        return (
                          <td key={slot} style={{ padding: '10px 16px', textAlign: 'center' }}>
                            <div onClick={() => toggleAvail(day, slot)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${checked ? LIME : BORDER}`, background: checked ? LIME : 'transparent', cursor: 'pointer', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {checked && <span style={{ color: '#000', fontSize: 13, fontWeight: 700 }}>✓</span>}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Certifications */}
          <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}`, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#fff' }}>Certifications</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              {form.certifications.map((cert, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: LIME + '22', border: `1px solid ${LIME}44`, color: LIME, padding: '5px 10px', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
                  {cert}
                  <button type="button" onClick={() => removeCert(i)} style={{ background: 'none', border: 'none', color: LIME, cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={newCert} onChange={e => setNewCert(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCert())} placeholder="Add certification..." style={{ ...inputStyle, flex: 1 }} />
              <button type="button" onClick={addCert} style={{ padding: '9px 18px', border: 'none', borderRadius: 8, background: LIME, color: '#000', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Add</button>
            </div>
          </div>

          {/* Save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleSave} disabled={saving} style={{ padding: '12px 32px', border: 'none', borderRadius: 10, background: saving ? LIME + '88' : LIME, color: '#000', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 16 }}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
