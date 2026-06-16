import { useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const MOCK_COACHES = [
  { id: 1, name: 'Rajesh Kumar' },
  { id: 2, name: 'Suresh Patel' },
  { id: 3, name: 'Anand Sharma' },
  { id: 4, name: 'Priya Nair' },
  { id: 5, name: 'Vikram Singh' },
];

const MOCK_ACADEMIES = [
  { id: 1, name: 'Chennai Sports Academy', city: 'Chennai', address: '12 Anna Salai, Guindy, Chennai - 600032', headCoach: 'Rajesh Kumar', students: 48, programs: 5, status: 'Active', email: 'chennai@tpip.in' },
  { id: 2, name: 'Mumbai Batting Centre', city: 'Mumbai', address: '7 Andheri Sports Complex, Andheri West, Mumbai - 400058', headCoach: 'Suresh Patel', students: 62, programs: 7, status: 'Active', email: 'mumbai@tpip.in' },
  { id: 3, name: 'Delhi Speed Academy', city: 'Delhi', address: '3 Dwarka Sports Hub, Sector 10, Delhi - 110075', headCoach: 'Anand Sharma', students: 35, programs: 4, status: 'Active', email: 'delhi@tpip.in' },
  { id: 4, name: 'Bangalore Premier Sports Club', city: 'Bangalore', address: '88 Koramangala 4th Block, Bangalore - 560034', headCoach: 'Vikram Singh', students: 27, programs: 3, status: 'Inactive', email: 'bangalore@tpip.in' },
  { id: 5, name: 'Hyderabad Sports Hub', city: 'Hyderabad', address: '21 Gachibowli Stadium Road, Hyderabad - 500032', headCoach: 'Priya Nair', students: 41, programs: 6, status: 'Active', email: 'hyderabad@tpip.in' },
];

const EMPTY_FORM = { name: '', city: '', address: '', headCoach: '', email: '' };

export default function AdminAcademies() {
  const [academies, setAcademies] = useState(MOCK_ACADEMIES);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(academy) {
    setEditId(academy.id);
    setForm({ name: academy.name, city: academy.city, address: academy.address, headCoach: academy.headCoach, email: academy.email });
    setShowModal(true);
  }

  function handleFormChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.city) { toast.error('Academy name and city are required'); return; }
    setSubmitting(true);
    try {
      if (editId) {
        if (typeof adminAPI.updateAcademy === 'function') await adminAPI.updateAcademy(editId, form);
        setAcademies((prev) => prev.map((a) => a.id === editId ? { ...a, ...form } : a));
        toast.success('Academy updated');
      } else {
        if (typeof adminAPI.createAcademy === 'function') await adminAPI.createAcademy(form);
        setAcademies((prev) => [...prev, { id: Date.now(), ...form, students: 0, programs: 0, status: 'Active' }]);
        toast.success('Academy added');
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
    } catch {
      toast.error('Failed to save academy');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      if (typeof adminAPI.deleteAcademy === 'function') await adminAPI.deleteAcademy(id);
      setAcademies((prev) => prev.filter((a) => a.id !== id));
      toast.success('Academy deleted');
    } catch {
      toast.error('Failed to delete academy');
    } finally {
      setDeleteConfirm(null);
    }
  }

  function toggleStatus(id) {
    setAcademies((prev) => prev.map((a) => a.id === id ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' } : a));
    toast.success('Status updated');
  }

  const inputStyle = { width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, color: '#fff', outline: 'none', boxSizing: 'border-box', background: BG }
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '1px' }}>ACADEMIES</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: '4px 0 0' }}>
            Manage sports academy branches across locations
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ padding: '10px 20px', background: LIME, color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span style={{ fontSize: 16 }}>＋</span> Add Academy
        </button>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Academies', value: academies.length, icon: '🏫', color: '#3b82f6', bg: '#3b82f615', border: '#3b82f630' },
          { label: 'Active Academies', value: academies.filter((a) => a.status === 'Active').length, icon: '✅', color: LIME, bg: LIME + '15', border: LIME + '30' },
          { label: 'Total Students', value: academies.reduce((s, a) => s + a.students, 0), icon: '🎓', color: '#eab308', bg: '#eab30815', border: '#eab30830' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {academies.map((academy) => (
          <div key={academy.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Card header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 2 }}>{academy.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>📍</span> {academy.city}
                </div>
              </div>
              <span style={{
                display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: academy.status === 'Active' ? LIME + '22' : CARD2,
                color: academy.status === 'Active' ? LIME : 'rgba(255,255,255,0.35)',
                border: academy.status === 'Active' ? `1px solid ${LIME}44` : `1px solid ${BORDER}`,
              }}>
                {academy.status}
              </span>
            </div>

            {/* Details */}
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Head Coach</span>
                <span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{academy.headCoach}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Students</span>
                <span style={{ fontWeight: 500, color: LIME }}>{academy.students}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Active Programs</span>
                <span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{academy.programs}</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{academy.address}</div>
            </div>

            {/* Actions */}
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={() => toggleStatus(academy.id)}
                style={{
                  flex: 1, padding: '7px 0',
                  border: `1px solid ${academy.status === 'Active' ? '#ef444444' : LIME + '44'}`,
                  borderRadius: 6,
                  background: academy.status === 'Active' ? '#ef444415' : LIME + '15',
                  color: academy.status === 'Active' ? '#ef4444' : LIME,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}
              >
                {academy.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => openEdit(academy)}
                style={{ padding: '7px 14px', border: `1px solid ${BORDER}`, borderRadius: 6, background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => setDeleteConfirm(academy.id)}
                style={{ padding: '7px 10px', border: '1px solid #ef444444', borderRadius: 6, background: '#ef444415', color: '#ef4444', fontSize: 12, cursor: 'pointer' }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div style={{ background: CARD, borderRadius: 14, padding: 28, width: '100%', maxWidth: 520, border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' }}>
                {editId ? 'Edit Academy' : 'Add Academy'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { name: 'name', label: 'Academy Name', placeholder: 'e.g. Chennai Sports Academy', required: true },
                { name: 'city', label: 'City', placeholder: 'e.g. Chennai', required: true },
                { name: 'address', label: 'Address', placeholder: 'Full address' },
                { name: 'email', label: 'Contact Email', placeholder: 'academy@tpip.in', type: 'email' },
              ].map((field) => (
                <div key={field.name}>
                  <label style={labelStyle}>{field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}</label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleFormChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    style={inputStyle}
                  />
                </div>
              ))}

              <div>
                <label style={labelStyle}>Head Coach</label>
                <select name="headCoach" value={form.headCoach} onChange={handleFormChange} style={inputStyle}>
                  <option value="">Select a coach</option>
                  {MOCK_COACHES.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '10px 0', border: `1px solid ${BORDER}`, borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ flex: 2, padding: '10px 0', border: 'none', borderRadius: 8, background: submitting ? LIME + '88' : LIME, color: '#000', fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? 'Saving…' : editId ? 'Update Academy' : 'Add Academy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: CARD, borderRadius: 12, padding: 28, width: 360, border: `1px solid ${BORDER}`, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: '#fff' }}>Delete Academy?</h3>
            <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: '9px 0', border: `1px solid ${BORDER}`, borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{ flex: 1, padding: '9px 0', border: 'none', borderRadius: 8, background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
