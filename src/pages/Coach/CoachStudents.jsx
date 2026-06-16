import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const AVATAR_COLORS = [LIME, '#3b82f6', '#a855f7', '#f97316', '#ef4444', '#06b6d4', '#ec4899', '#eab308'];

const MOCK_STUDENTS = [
  { id: 1, name: 'Arjun Sharma', initials: 'AS', program: 'Batting Mastery', progress: 82, lastSession: '2 May 2026', status: 'Active', color: AVATAR_COLORS[0], totalSessions: 16, usedSessions: 14 },
  { id: 2, name: 'Priya Patel', initials: 'PP', program: 'All-Round Sports', progress: 68, lastSession: '5 May 2026', status: 'Active', color: AVATAR_COLORS[1], totalSessions: 16, usedSessions: 9 },
  { id: 3, name: 'Rohit Verma', initials: 'RV', program: 'Pace Bowling', progress: 91, lastSession: '1 May 2026', status: 'Active', color: AVATAR_COLORS[2], totalSessions: 24, usedSessions: 22 },
  { id: 4, name: 'Meena Krishnan', initials: 'MK', program: 'Junior Sports', progress: 55, lastSession: '20 Apr 2026', status: 'Inactive', color: AVATAR_COLORS[3], totalSessions: 8, usedSessions: 8 },
  { id: 5, name: 'Dev Anand', initials: 'DA', program: 'Spin Bowling', progress: 74, lastSession: '8 May 2026', status: 'Active', color: AVATAR_COLORS[4], totalSessions: 16, usedSessions: 12 },
  { id: 6, name: 'Kavya Reddy', initials: 'KR', program: 'Batting Mastery', progress: 60, lastSession: '3 May 2026', status: 'Active', color: AVATAR_COLORS[5], totalSessions: 8, usedSessions: 5 },
  { id: 7, name: 'Nikhil Joshi', initials: 'NJ', program: 'Fielding Excellence', progress: 88, lastSession: '10 May 2026', status: 'Active', color: AVATAR_COLORS[6], totalSessions: 24, usedSessions: 14 },
  { id: 8, name: 'Sana Sheikh', initials: 'SS', program: 'All-Round Sports', progress: 42, lastSession: '15 Apr 2026', status: 'Inactive', color: AVATAR_COLORS[7], totalSessions: 8, usedSessions: 7 },
];

const ALL_PROGRAMS = ['All Programs', ...Array.from(new Set(MOCK_STUDENTS.map((s) => s.program)))];

function sessionBarColor(remaining) {
  if (remaining > 8) return LIME;
  if (remaining >= 4) return '#f97316';
  return '#ef4444';
}

export default function CoachStudents() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [program, setProgram] = useState('All Programs');
  const [msgModal, setMsgModal] = useState(null);

  const filtered = MOCK_STUDENTS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.program.toLowerCase().includes(search.toLowerCase());
    const matchProgram = program === 'All Programs' || s.program === program;
    return matchSearch && matchProgram;
  });

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '1px' }}>MY STUDENTS</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 4, fontSize: 14, marginBottom: 0 }}>
            {filtered.length} student{filtered.length !== 1 ? 's' : ''} enrolled under you
          </p>
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              placeholder="Search students…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 32, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, color: '#fff', background: BG, outline: 'none', width: 220, boxSizing: 'border-box' }}
            />
          </div>
          <select
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            style={{ padding: '9px 14px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, color: '#fff', background: BG, outline: 'none', cursor: 'pointer' }}
          >
            {ALL_PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Student Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>
          No students match your search.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {filtered.map((student) => (
            <StudentCard key={student.id} student={student} onViewDetails={() => navigate(`/coach/students/${student.id}`)} onMessage={() => setMsgModal(student)} />
          ))}
        </div>
      )}

      {/* Message modal */}
      {msgModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, maxWidth: 420, width: '100%' }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 16 }}>Message Sent</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 24 }}>
              Message sent to <strong style={{ color: '#fff' }}>{msgModal.name}</strong>! Students can reply via their chat.
            </div>
            <button onClick={() => { setMsgModal(null); toast.success(`Message sent to ${msgModal.name}!`) }} style={{ padding: '10px 24px', background: LIME, color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentCard({ student, onViewDetails, onMessage }) {
  const remaining = student.totalSessions - student.usedSessions;
  const progressColor = student.progress >= 80 ? LIME : student.progress >= 60 ? '#f97316' : '#ef4444';
  const sessBarColor = sessionBarColor(remaining);
  const sessUsedPct = (student.usedSessions / student.totalSessions) * 100;

  const isNoSessions = remaining === 0;
  const isLowSessions = remaining > 0 && remaining <= 3;
  const avatarTextColor = student.color === LIME || student.color === '#eab308' ? '#000' : '#fff';

  return (
    <div style={{ background: CARD, borderRadius: 12, padding: 22, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Top row: avatar + status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: student.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: avatarTextColor, fontWeight: 700, fontSize: 17, flexShrink: 0 }}>
            {student.initials}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{student.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{student.program}</div>
          </div>
        </div>
        <span style={{
          display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
          background: student.status === 'Active' ? LIME + '22' : CARD2,
          color: student.status === 'Active' ? LIME : 'rgba(255,255,255,0.35)',
          border: student.status === 'Active' ? `1px solid ${LIME}44` : `1px solid ${BORDER}`,
        }}>
          {student.status}
        </span>
      </div>

      {/* Course Progress */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Course Progress</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: progressColor }}>{student.progress}%</span>
        </div>
        <div style={{ height: 7, background: BORDER, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${student.progress}%`, background: progressColor, borderRadius: 99 }} />
        </div>
      </div>

      {/* Sessions widget */}
      <div style={{
        background: isNoSessions ? '#ef444415' : isLowSessions ? '#f9731615' : CARD2,
        border: `1px solid ${isNoSessions ? '#ef444444' : isLowSessions ? '#f9731644' : BORDER}`,
        borderRadius: 10, padding: '10px 12px', marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Sessions</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isNoSessions && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', background: '#ef444422', border: '1px solid #ef444444', borderRadius: 20, padding: '1px 8px' }}>
                ❌ No sessions
              </span>
            )}
            {isLowSessions && !isNoSessions && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#f97316', background: '#f9731622', border: '1px solid #f9731644', borderRadius: 20, padding: '1px 8px' }}>
                ⚠️ Low sessions
              </span>
            )}
            <span style={{ fontSize: 12, fontWeight: 700, color: sessBarColor }}>{remaining} / {student.totalSessions}</span>
          </div>
        </div>
        <div style={{ height: 6, background: BORDER, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${sessUsedPct}%`, background: sessBarColor, borderRadius: 99 }} />
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
          {remaining} remaining · {student.usedSessions} used of {student.totalSessions} total
        </div>
      </div>

      {/* Last session */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <span style={{ fontSize: 13 }}>📅</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Last session: {student.lastSession}</span>
      </div>

      {/* Buttons row */}
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <button
          onClick={onMessage}
          style={{ flex: 1, padding: '9px 0', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          Message
        </button>
        <button
          onClick={onViewDetails}
          style={{ flex: 2, padding: '9px 0', background: LIME, border: 'none', borderRadius: 8, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          View Details →
        </button>
      </div>
    </div>
  );
}
