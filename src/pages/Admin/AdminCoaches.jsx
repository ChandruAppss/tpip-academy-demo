import { useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const MOCK_COACHES = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh.kumar@tpip.in', phone: '+91 98765 43210', specialty: 'Batting', students: 18, status: 'Active', joined: '2023-03-15' },
  { id: 2, name: 'Suresh Patel', email: 'suresh.patel@tpip.in', phone: '+91 87654 32109', specialty: 'Bowling', students: 14, status: 'Active', joined: '2023-06-01' },
  { id: 3, name: 'Anand Sharma', email: 'anand.sharma@tpip.in', phone: '+91 76543 21098', specialty: 'All-round', students: 22, status: 'Active', joined: '2022-11-20' },
  { id: 4, name: 'Priya Nair', email: 'priya.nair@tpip.in', phone: '+91 65432 10987', specialty: 'Fielding', students: 9, status: 'Pending', joined: '2023-09-05' },
  { id: 5, name: 'Vikram Singh', email: 'vikram.singh@tpip.in', phone: '+91 54321 09876', specialty: 'Batting', students: 16, status: 'Active', joined: '2024-01-10' },
  { id: 6, name: 'Deepa Menon', email: 'deepa.menon@tpip.in', phone: '+91 43210 98765', specialty: 'Bowling', students: 11, status: 'Pending', joined: '2024-02-28' },
];

const SPECIALTIES = ['Batting', 'Bowling', 'Fielding', 'All-round'];
const PAGE_SIZE = 5;

function getInitials(name) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminCoaches() {
  const [coaches, setCoaches] = useState(MOCK_COACHES);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', specialty: 'Batting' });

  const filtered = coaches.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(0);
  }

  function handleFormChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    setSubmitting(true);
    try {
      if (typeof adminAPI.createCoach === 'function') {
        await adminAPI.createCoach(form);
      }
      const newCoach = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        specialty: form.specialty,
        students: 0,
        status: 'Active',
        joined: new Date().toISOString().slice(0, 10),
      };
      setCoaches(c => [newCoach, ...c]);
      toast.success(`Coach ${form.name} added successfully`);
      setForm({ name: '', email: '', phone: '', specialty: 'Batting' });
      setShowModal(false);
    } catch {
      toast.error('Failed to add coach');
    } finally {
      setSubmitting(false);
    }
  }

  function handleDeactivate(id) {
    setCoaches(c => c.map(coach =>
      coach.id === id ? { ...coach, status: coach.status === 'Active' ? 'Inactive' : 'Active' } : coach
    ));
    toast.success('Coach status updated');
  }

  const inputStyle = { width: '100%', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: BG, color: '#fff' }
  const labelStyle = { display: 'block', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '1px' }}>COACHES</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 4, marginBottom: 0, fontSize: 14 }}>Manage your coaching staff</p>
        </div>
        <button
          style={{ background: LIME, color: '#000', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
          onClick={() => setShowModal(true)}>
          + Add Coach
        </button>
      </div>

      <div style={{ background: CARD, borderRadius: '12px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
          <input
            style={{ width: '340px', padding: '9px 14px', border: `1px solid ${BORDER}`, borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: BG, color: '#fff' }}
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Coach', 'Email', 'Specialty', 'Students', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', background: CARD2, borderBottom: `1px solid ${BORDER}` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(coach => (
              <tr key={coach.id}
                onMouseEnter={e => { e.currentTarget.style.background = CARD2; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
                <td style={{ padding: '14px 16px', fontSize: '14px', borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: LIME, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
                      {getInitials(coach.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#fff' }}>{coach.name}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Joined {coach.joined}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '14px', color: 'rgba(255,255,255,0.6)', borderBottom: `1px solid ${BORDER}` }}>{coach.email}</td>
                <td style={{ padding: '14px 16px', fontSize: '14px', color: 'rgba(255,255,255,0.6)', borderBottom: `1px solid ${BORDER}` }}>{coach.specialty}</td>
                <td style={{ padding: '14px 16px', fontSize: '14px', color: 'rgba(255,255,255,0.6)', borderBottom: `1px solid ${BORDER}` }}>{coach.students}</td>
                <td style={{ padding: '14px 16px', fontSize: '14px', borderBottom: `1px solid ${BORDER}` }}>
                  <span style={
                    coach.status === 'Active'
                      ? { background: LIME + '22', color: LIME, border: `1px solid ${LIME}44`, borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }
                      : coach.status === 'Pending'
                      ? { background: '#f9731622', color: '#f97316', border: '1px solid #f9731644', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }
                      : { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }
                  }>
                    {coach.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '14px', borderBottom: `1px solid ${BORDER}` }}>
                  <button style={{ background: '#3b82f622', color: '#3b82f6', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', marginRight: '6px' }}>
                    Edit
                  </button>
                  {coach.status === 'Pending' ? (
                    <button
                      style={{ background: LIME + '22', color: LIME, border: `1px solid ${LIME}44`, borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', fontWeight: 700 }}
                      onClick={() => {
                        setCoaches(c => c.map(co => co.id === coach.id ? { ...co, status: 'Active' } : co));
                        toast.success('Coach approved successfully!');
                      }}>
                      Approve
                    </button>
                  ) : (
                    <button
                      style={coach.status === 'Active'
                        ? { background: '#ef444422', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }
                        : { background: LIME + '22', color: LIME, border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}
                      onClick={() => handleDeactivate(coach.id)}>
                      {coach.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
                  No coaches found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            Showing {filtered.length === 0 ? 0 : page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} coaches
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{ background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '7px 14px', fontSize: '13px', cursor: page === 0 ? 'not-allowed' : 'pointer', color: page === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)' }}
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}>
              Previous
            </button>
            <button
              style={{ background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '7px 14px', fontSize: '13px', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', color: page >= totalPages - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)' }}
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: CARD, borderRadius: '16px', padding: '32px', width: '460px', border: `1px solid ${BORDER}` }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '24px', marginTop: 0 }}>Add New Coach</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} name="name" value={form.name} onChange={handleFormChange} placeholder="e.g. Rahul Dravid" required />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email *</label>
                <input style={inputStyle} type="email" name="email" value={form.email} onChange={handleFormChange} placeholder="coach@tpip.in" required />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Phone</label>
                <input style={inputStyle} name="phone" value={form.phone} onChange={handleFormChange} placeholder="+91 98765 43210" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Specialty</label>
                <select style={inputStyle} name="specialty" value={form.specialty} onChange={handleFormChange}>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" style={{ background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={{ background: LIME, color: '#000', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Coach'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
