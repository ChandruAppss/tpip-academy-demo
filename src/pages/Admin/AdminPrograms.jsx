import { useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const COACHES = ['Rajesh Kumar', 'Suresh Patel', 'Anand Sharma', 'Priya Nair', 'Vikram Singh', 'Deepa Menon'];

const MOCK_PROGRAMS = [
  { id: 1, name: 'Elite Performance Program', description: 'Advanced performance techniques for competitive athletes. Focus on shot selection, footwork, and mental toughness.', duration: '6 months', price: 18000, enrolled: 18, maxStudents: 20, coach: 'Rajesh Kumar', status: 'Active' },
  { id: 2, name: 'Speed & Agility Mastery', description: 'Comprehensive speed and agility course covering power, control, timing, and accuracy. Suitable for intermediate athletes.', duration: '4 months', price: 14000, enrolled: 14, maxStudents: 15, coach: 'Suresh Patel', status: 'Active' },
  { id: 3, name: 'All-Sport Development', description: 'Holistic sports development covering technique, fitness, and tactics. Ideal for players aiming for selection.', duration: '1 year', price: 30000, enrolled: 22, maxStudents: 25, coach: 'Anand Sharma', status: 'Active' },
  { id: 4, name: 'Junior Sports Foundation', description: 'Introductory program for young athletes aged 8–14. Learn fundamentals in a fun environment.', duration: '3 months', price: 8000, enrolled: 9, maxStudents: 30, coach: 'Priya Nair', status: 'Active' },
  { id: 5, name: 'Agility & Positioning Clinic', description: 'Specialist agility program — positioning, movement accuracy, reaction training, and spatial awareness.', duration: '2 months', price: 7000, enrolled: 11, maxStudents: 20, coach: 'Deepa Menon', status: 'Draft' },
  { id: 6, name: 'Power & Explosiveness Training', description: 'Explosive power skills tailored for competitive sport. Speed, strength, and strike efficiency.', duration: '2 months', price: 9500, enrolled: 0, maxStudents: 18, coach: 'Vikram Singh', status: 'Draft' },
];

const DURATIONS = ['1 month', '2 months', '3 months', '4 months', '6 months', '1 year'];

export default function AdminPrograms() {
  const [programs, setPrograms] = useState(MOCK_PROGRAMS);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', duration: '3 months', price: '', maxStudents: '', coach: COACHES[0],
  });

  function handleFormChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    setSubmitting(true);
    try {
      if (typeof adminAPI.createProgram === 'function') {
        await adminAPI.createProgram(form);
      }
      const newProgram = {
        id: Date.now(),
        name: form.name,
        description: form.description,
        duration: form.duration,
        price: Number(form.price),
        maxStudents: Number(form.maxStudents) || 20,
        enrolled: 0,
        coach: form.coach,
        status: 'Draft',
      };
      setPrograms(p => [newProgram, ...p]);
      toast.success(`Program "${form.name}" created`);
      setForm({ name: '', description: '', duration: '3 months', price: '', maxStudents: '', coach: COACHES[0] });
      setShowModal(false);
    } catch {
      toast.error('Failed to create program');
    } finally {
      setSubmitting(false);
    }
  }

  function toggleStatus(id) {
    setPrograms(p => p.map(prog =>
      prog.id === id ? { ...prog, status: prog.status === 'Active' ? 'Draft' : 'Active' } : prog
    ));
    toast.success('Status updated');
  }

  function handleDelete(id) {
    setPrograms(p => p.filter(prog => prog.id !== id));
    toast.success('Program deleted');
    setConfirmDelete(null);
  }

  const inputStyle = { width: '100%', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: BG, color: '#fff' }
  const labelStyle = { display: 'block', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '1px' }}>PROGRAMS</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 4, marginBottom: 0, fontSize: 14 }}>Create and manage coaching programs</p>
        </div>
        <button
          style={{ background: LIME, color: '#000', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
          onClick={() => setShowModal(true)}>
          + New Program
        </button>
      </div>

      {/* Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {programs.map(prog => (
          <div key={prog.id} style={{ background: CARD, borderRadius: '12px', border: `1px solid ${BORDER}`, padding: '24px', display: 'flex', flexDirection: 'column' }}>
            {/* Top: name + status */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', lineHeight: '1.3', flex: 1, marginRight: '12px' }}>{prog.name}</div>
              <button
                title={`Toggle status (currently ${prog.status})`}
                onClick={() => toggleStatus(prog.id)}
                style={{
                  background: prog.status === 'Active' ? LIME + '22' : CARD2,
                  color: prog.status === 'Active' ? LIME : 'rgba(255,255,255,0.4)',
                  border: prog.status === 'Active' ? `1px solid ${LIME}44` : `1px solid ${BORDER}`,
                  borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                {prog.status}
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.5', margin: '0 0 16px 0' }}>{prog.description}</p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {[
                { label: 'Duration', value: prog.duration },
                { label: 'Price', value: `₹${prog.price.toLocaleString('en-IN')}` },
                { label: 'Enrolled', value: `${prog.enrolled} / ${prog.maxStudents}` },
                { label: 'Coach', value: prog.coach.split(' ')[0] },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: CARD2, borderRadius: '8px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Enrollment bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ background: BORDER, borderRadius: '999px', height: '6px' }}>
                <div style={{ background: LIME, width: `${Math.min(100, Math.round((prog.enrolled / prog.maxStudents) * 100))}%`, height: '100%', borderRadius: '999px' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
                {Math.round((prog.enrolled / prog.maxStudents) * 100)}% capacity
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button style={{ flex: 1, background: '#3b82f622', color: '#3b82f6', border: 'none', borderRadius: '8px', padding: '9px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                Edit
              </button>
              <button
                style={{ flex: 1, background: '#ef444422', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '9px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                onClick={() => setConfirmDelete(prog.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm dialog */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: CARD, borderRadius: '16px', padding: '28px', width: '360px', border: `1px solid ${BORDER}` }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '10px', marginTop: 0 }}>Delete Program?</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>This action cannot be undone. All enrolled students will be affected.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button style={{ background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '9px 18px', fontSize: '14px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }} onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }} onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* New Program Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: CARD, borderRadius: '16px', padding: '32px', width: '500px', border: `1px solid ${BORDER}`, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '24px', marginTop: 0 }}>New Program</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Program Name *</label>
                <input style={inputStyle} name="name" value={form.name} onChange={handleFormChange} placeholder="e.g. T20 Specialist Program" required />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} name="description" value={form.description} onChange={handleFormChange} placeholder="Describe the program goals and content..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Duration</label>
                  <select style={inputStyle} name="duration" value={form.duration} onChange={handleFormChange}>
                    {DURATIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Price (₹) *</label>
                  <input style={inputStyle} type="number" name="price" value={form.price} onChange={handleFormChange} placeholder="15000" required min="0" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Max Students</label>
                  <input style={inputStyle} type="number" name="maxStudents" value={form.maxStudents} onChange={handleFormChange} placeholder="20" min="1" />
                </div>
                <div>
                  <label style={labelStyle}>Assign Coach</label>
                  <select style={inputStyle} name="coach" value={form.coach} onChange={handleFormChange}>
                    {COACHES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" style={{ background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={{ background: LIME, color: '#000', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
