import { useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const PROGRAMS = ['Elite Performance Program', 'Speed & Agility Mastery', 'All-Sport Development', 'Junior Sports Foundation', 'Agility & Positioning'];

const MOCK_STUDENTS = [
  { id: 1, name: 'Arjun Kapoor', email: 'arjun.k@gmail.com', phone: '+91 91234 56789', program: 'Elite Performance Program', coach: 'Rajesh Kumar', joinDate: '2024-01-15', status: 'Active', progress: 72, sessions: ['Batting drills – 12 May', 'Net practice – 08 May', 'Video analysis – 03 May'] },
  { id: 2, name: 'Rohit Mishra', email: 'rohit.m@gmail.com', phone: '+91 82345 67890', program: 'Speed & Agility Mastery', coach: 'Suresh Patel', joinDate: '2024-02-01', status: 'Active', progress: 58, sessions: ['Run-up mechanics – 10 May', 'Yorker training – 06 May'] },
  { id: 3, name: 'Sneha Reddy', email: 'sneha.r@gmail.com', phone: '+91 73456 78901', program: 'Junior Sports Foundation', coach: 'Anand Sharma', joinDate: '2024-03-10', status: 'Active', progress: 45, sessions: ['Performance Training – 11 May', 'Agility Drills – 07 May'] },
  { id: 4, name: 'Karan Bhatia', email: 'karan.b@gmail.com', phone: '+91 64567 89012', program: 'All-Sport Development', coach: 'Anand Sharma', joinDate: '2023-11-20', status: 'Inactive', progress: 90, sessions: ['Match simulation – 05 May', 'Conditioning – 01 May'] },
  { id: 5, name: 'Meera Iyer', email: 'meera.i@gmail.com', phone: '+91 55678 90123', program: 'Agility & Positioning', coach: 'Priya Nair', joinDate: '2024-04-01', status: 'Active', progress: 33, sessions: ['Reaction Drills – 13 May', 'Field Positioning – 09 May'] },
  { id: 6, name: 'Dev Chauhan', email: 'dev.c@gmail.com', phone: '+91 46789 01234', program: 'Elite Performance Program', coach: 'Vikram Singh', joinDate: '2024-01-28', status: 'Active', progress: 65, sessions: ['Pull shot technique – 14 May', 'Footwork – 10 May'] },
  { id: 7, name: 'Pooja Verma', email: 'pooja.v@gmail.com', phone: '+91 37890 12345', program: 'Speed & Agility Mastery', coach: 'Deepa Menon', joinDate: '2023-12-05', status: 'Active', progress: 80, sessions: ['Speed Training – 12 May', 'Pace training – 08 May'] },
  { id: 8, name: 'Aditya Joshi', email: 'aditya.j@gmail.com', phone: '+91 28901 23456', program: 'Junior Sports Foundation', coach: 'Rajesh Kumar', joinDate: '2024-05-02', status: 'Inactive', progress: 20, sessions: ['Intro session – 04 May'] },
];

function getInitials(name) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminStudents() {
  const [students] = useState(MOCK_STUDENTS);
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [drawerStudent, setDrawerStudent] = useState(null);
  const [enrollDropdown, setEnrollDropdown] = useState(false);

  const filtered = students.filter(s => {
    const matchesTab = tab === 'All' || s.status === tab;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  function handleDeactivate(id) {
    toast.success('Student status updated');
  }

  function handleEnroll(program) {
    toast.success(`Enrolled in ${program}`);
    setEnrollDropdown(false);
  }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '1px' }}>STUDENTS</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 4, marginBottom: 0, fontSize: 14 }}>Manage enrolled students</p>
        </div>
      </div>

      <div style={{ background: CARD, borderRadius: '12px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        {/* Tabs + Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['All', 'Active', 'Inactive'].map(t => (
              <button
                key={t}
                style={{
                  padding: '7px 16px', borderRadius: '8px', border: 'none',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  background: tab === t ? LIME : 'transparent',
                  color: tab === t ? '#000' : 'rgba(255,255,255,0.5)',
                }}
                onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
          <input
            style={{ width: '300px', padding: '9px 14px', border: `1px solid ${BORDER}`, borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: BG, color: '#fff' }}
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Student', 'Email', 'Program', 'Coach', 'Join Date', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', background: CARD2, borderBottom: `1px solid ${BORDER}` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id}
                onMouseEnter={e => { e.currentTarget.style.background = CARD2; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
                <td style={{ padding: '14px 16px', fontSize: '14px', borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: LIME, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
                      {getInitials(student.name)}
                    </div>
                    <div style={{ fontWeight: '600', color: '#fff' }}>{student.name}</div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '14px', color: 'rgba(255,255,255,0.6)', borderBottom: `1px solid ${BORDER}` }}>{student.email}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', borderBottom: `1px solid ${BORDER}` }}>{student.program}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', borderBottom: `1px solid ${BORDER}` }}>{student.coach}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.35)', borderBottom: `1px solid ${BORDER}` }}>{student.joinDate}</td>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}` }}>
                  <span style={student.status === 'Active'
                    ? { background: LIME + '22', color: LIME, border: `1px solid ${LIME}44`, borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }
                    : { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }}>
                    {student.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}` }}>
                  <button
                    style={{ background: '#3b82f622', color: '#3b82f6', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', marginRight: '6px' }}
                    onClick={() => { setDrawerStudent(student); setEnrollDropdown(false); }}>
                    View
                  </button>
                  <button
                    style={{ background: '#ef444422', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}
                    onClick={() => handleDeactivate(student.id)}>
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Side drawer */}
      {drawerStudent && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50 }}
            onClick={() => setDrawerStudent(null)}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: '380px',
            background: CARD, zIndex: 51, borderLeft: `1px solid ${BORDER}`,
            overflowY: 'auto', display: 'flex', flexDirection: 'column'
          }}>
            {/* Drawer header */}
            <div style={{ padding: '24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>Student Details</span>
              <button
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}
                onClick={() => setDrawerStudent(null)}>
                ×
              </button>
            </div>

            <div style={{ padding: '24px', flex: 1 }}>
              {/* Avatar + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: LIME, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '18px', flexShrink: 0 }}>
                  {getInitials(drawerStudent.name)}
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{drawerStudent.name}</div>
                  <div>
                    <span style={drawerStudent.status === 'Active'
                      ? { background: LIME + '22', color: LIME, border: `1px solid ${LIME}44`, borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '600' }
                      : { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '600' }}>
                      {drawerStudent.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info rows */}
              {[
                { label: 'Email', value: drawerStudent.email },
                { label: 'Phone', value: drawerStudent.phone },
                { label: 'Coach', value: drawerStudent.coach },
                { label: 'Join Date', value: drawerStudent.joinDate },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{value}</div>
                </div>
              ))}

              {/* Program */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Enrolled Program</div>
                <div style={{ background: LIME + '15', border: `1px solid ${LIME}30`, borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: LIME, fontWeight: '600' }}>
                  {drawerStudent.program}
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px' }}>Progress</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: LIME }}>{drawerStudent.progress}%</span>
                </div>
                <div style={{ background: BORDER, borderRadius: '999px', height: '8px' }}>
                  <div style={{ background: LIME, width: `${drawerStudent.progress}%`, height: '100%', borderRadius: '999px', transition: 'width 0.4s' }} />
                </div>
              </div>

              {/* Recent sessions */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Recent Sessions</div>
                {drawerStudent.sessions.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < drawerStudent.sessions.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: LIME, flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{s}</span>
                  </div>
                ))}
              </div>

              {/* Enroll button */}
              <div style={{ position: 'relative' }}>
                <button
                  style={{ width: '100%', background: LIME, color: '#000', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
                  onClick={() => setEnrollDropdown(v => !v)}>
                  Enroll in Program ▾
                </button>
                {enrollDropdown && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: CARD2, border: `1px solid ${BORDER}`, borderRadius: '8px', zIndex: 10, overflow: 'hidden' }}>
                    {PROGRAMS.map(prog => (
                      <div
                        key={prog}
                        style={{ padding: '11px 16px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', borderBottom: `1px solid ${BORDER}` }}
                        onMouseEnter={e => { e.currentTarget.style.background = LIME + '15'; e.currentTarget.style.color = LIME; }}
                        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                        onClick={() => handleEnroll(prog)}>
                        {prog}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
