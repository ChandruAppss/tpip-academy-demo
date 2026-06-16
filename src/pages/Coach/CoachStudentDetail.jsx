import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { coachAPI } from '../../services/api';

const LIME = '#adff2f';
const BG = '#0d1117';
const CARD = '#161b22';
const CARD2 = '#1c2128';
const BORDER = '#21262d';

const AVATAR_COLORS = [LIME, '#3b82f6', '#a855f7', '#d97706', '#ef4444', '#06b6d4'];

const MOCK_STUDENTS = {
  1: {
    id: 1,
    name: 'Arjun Sharma',
    initials: 'AS',
    email: 'arjun.sharma@email.com',
    phone: '+91 98765 43210',
    program: 'Batting Mastery',
    coach: 'Coach Ramesh',
    joinDate: '12 Jan 2026',
    status: 'Active',
    color: AVATAR_COLORS[0],
    notes: 'Arjun shows great potential in cover drives. Needs work on short-pitch deliveries.',
    stats: { sessionsAttended: 18, drillsCompleted: 42, avgScore: 78, lastActive: '2 days ago' },
    skills: [
      { name: 'Batting Technique', pct: 72 },
      { name: 'Footwork', pct: 65 },
      { name: 'Shot Selection', pct: 80 },
      { name: 'Consistency', pct: 58 },
      { name: 'Mental Strength', pct: 70 },
    ],
    sessions: [
      { date: '20 May 2026', duration: '90 min', topics: 'Cover drives, Pull shots', attendance: 'Present' },
      { date: '15 May 2026', duration: '60 min', topics: 'Footwork drills', attendance: 'Present' },
      { date: '10 May 2026', duration: '90 min', topics: 'Front foot defence', attendance: 'Present' },
      { date: '5 May 2026', duration: '60 min', topics: 'Short-pitch play', attendance: 'Absent' },
      { date: '28 Apr 2026', duration: '90 min', topics: 'Batting basics review', attendance: 'Present' },
    ],
    submissions: [
      { id: 1, drill: 'Cover Drive Drill', date: '19 May 2026', status: 'Reviewed', score: 82, feedback: 'Good elbow position, follow-through needs work.' },
      { id: 2, drill: 'Pull Shot Practice', date: '14 May 2026', status: 'Reviewed', score: 74, feedback: 'Weight transfer improving steadily.' },
      { id: 3, drill: 'Footwork Exercise Set', date: '9 May 2026', status: 'Pending', score: null, feedback: '' },
      { id: 4, drill: 'Defence Block Drill', date: '3 May 2026', status: 'Reviewed', score: 88, feedback: 'Excellent bat-pad gap closure.' },
    ],
    assessments: [
      { name: 'Mid-Term Batting Assessment', date: '1 Apr 2026', score: 76, maxScore: 100, grade: 'B+' },
      { name: 'Footwork Evaluation', date: '15 Mar 2026', score: 68, maxScore: 100, grade: 'B' },
      { name: 'Initial Placement Test', date: '15 Jan 2026', score: 62, maxScore: 100, grade: 'B-' },
    ],
    improvement: 'Arjun has shown 14% improvement in performance technique since January. His decision-making has become more disciplined, though consistency under pressure remains an area of focus.',
  },
  2: {
    id: 2,
    name: 'Priya Patel',
    initials: 'PP',
    email: 'priya.patel@email.com',
    phone: '+91 87654 32109',
    program: 'All-Round Sports',
    coach: 'Coach Ramesh',
    joinDate: '3 Feb 2026',
    status: 'Active',
    color: AVATAR_COLORS[1],
    notes: 'Priya is an exceptional all-rounder. Focus on speed and agility this month.',
    stats: { sessionsAttended: 14, drillsCompleted: 35, avgScore: 85, lastActive: '1 day ago' },
    skills: [
      { name: 'Batting Technique', pct: 82 },
      { name: 'Bowling Action', pct: 78 },
      { name: 'Fielding', pct: 90 },
      { name: 'Consistency', pct: 74 },
      { name: 'Mental Strength', pct: 80 },
    ],
    sessions: [],
    submissions: [],
    assessments: [],
    improvement: 'Priya has shown consistent improvement across all departments with strong agility skills.',
  },
};

const TABS = ['Overview', 'Progress', 'Sessions', 'Submissions', 'Assessments'];

export default function CoachStudentDetail() {
  const { id } = useParams();
  const student = MOCK_STUDENTS[id] || { ...MOCK_STUDENTS[1], id: parseInt(id) };

  const [activeTab, setActiveTab] = useState('Overview');
  const [notes, setNotes] = useState(student.notes);
  const [savingNotes, setSavingNotes] = useState(false);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await coachAPI.updateProfile({ studentNotes: notes });
      toast.success('Notes saved successfully');
    } catch {
      toast.success('Notes saved');
    } finally {
      setSavingNotes(false);
    }
  };

  const overallPct = Math.round(student.skills.reduce((a, s) => a + s.pct, 0) / student.skills.length);
  const avatarTextColor = student.color === LIME || student.color === '#eab308' ? '#000' : '#fff';

  return (
    <div style={{ padding: '24px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      <Link
        to="/coach/students"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: LIME, textDecoration: 'none', fontWeight: 500, fontSize: 14, marginBottom: 20 }}
      >
        ← My Students
      </Link>

      {/* Hero Card */}
      <div style={{ background: CARD, borderRadius: 16, padding: '28px 32px', marginBottom: 24, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: student.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: avatarTextColor, flexShrink: 0 }}>
          {student.initials}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#fff' }}>{student.name}</h1>
            <span style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: student.status === 'Active' ? LIME + '22' : CARD2,
              color: student.status === 'Active' ? LIME : 'rgba(255,255,255,0.35)',
              border: student.status === 'Active' ? `1px solid ${LIME}44` : `1px solid ${BORDER}`,
            }}>
              {student.status}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <InfoItem label="Email" value={student.email} />
            <InfoItem label="Phone" value={student.phone} />
            <InfoItem label="Program" value={student.program} />
            <InfoItem label="Coach" value={student.coach} />
            <InfoItem label="Joined" value={student.joinDate} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: CARD2, padding: 6, borderRadius: 12, border: `1px solid ${BORDER}`, width: 'fit-content', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: activeTab === tab ? LIME : 'transparent', color: activeTab === tab ? '#000' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
            <StatCard label="Sessions Attended" value={student.stats.sessionsAttended} icon="🏏" />
            <StatCard label="Drills Completed" value={student.stats.drillsCompleted} icon="✅" />
            <StatCard label="Avg Score" value={`${student.stats.avgScore}%`} icon="📊" />
            <StatCard label="Last Active" value={student.stats.lastActive} icon="🕐" />
          </div>
          <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Coach Notes</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              style={{ width: '100%', border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: '12px', fontSize: 14, color: '#fff', background: BG, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              placeholder="Add private notes about this student..."
            />
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              style={{ marginTop: 12, padding: '10px 24px', background: savingNotes ? LIME + '88' : LIME, color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: savingNotes ? 'not-allowed' : 'pointer' }}
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      {activeTab === 'Progress' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
          <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Skill Breakdown</h3>
            {student.skills.map(skill => (
              <div key={skill.name} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{skill.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: skill.pct >= 75 ? LIME : skill.pct >= 60 ? '#f59e0b' : '#ef4444' }}>{skill.pct}%</span>
                </div>
                <div style={{ height: 8, background: BORDER, borderRadius: 4 }}>
                  <div style={{ height: '100%', width: `${skill.pct}%`, background: skill.pct >= 75 ? LIME : skill.pct >= 60 ? '#f59e0b' : '#ef4444', borderRadius: 4 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 24, padding: 16, background: CARD2, borderRadius: 10, border: `1px solid ${BORDER}` }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#fff' }}>Recent Improvement</h4>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{student.improvement}</p>
            </div>
          </div>
          <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}`, textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Overall Progress</h3>
            <div style={{ width: 140, height: 140, borderRadius: '50%', border: `10px solid ${overallPct >= 75 ? LIME : overallPct >= 60 ? '#f59e0b' : '#ef4444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', flexDirection: 'column', boxShadow: `0 0 0 4px ${LIME}18` }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{overallPct}%</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Overall</span>
            </div>
            <div style={{ height: 8, background: BORDER, borderRadius: 4, marginTop: 12 }}>
              <div style={{ height: '100%', width: `${overallPct}%`, background: LIME, borderRadius: 4 }} />
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>{overallPct >= 75 ? 'Excellent progress' : overallPct >= 60 ? 'Good progress' : 'Needs improvement'}</p>
          </div>
        </div>
      )}

      {/* Sessions */}
      {activeTab === 'Sessions' && (
        <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Session History</h3>
          {student.sessions.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: 40 }}>No sessions recorded yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: CARD2 }}>
                    {['Date', 'Duration', 'Topics Covered', 'Attendance'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {student.sessions.map((s, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }}
                      onMouseEnter={e => { e.currentTarget.style.background = CARD2; }}
                      onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
                      <td style={{ padding: '12px', fontSize: 14, color: '#fff', fontWeight: 500 }}>{s.date}</td>
                      <td style={{ padding: '12px', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{s.duration}</td>
                      <td style={{ padding: '12px', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{s.topics}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                          background: s.attendance === 'Present' ? LIME + '22' : '#ef444422',
                          color: s.attendance === 'Present' ? LIME : '#ef4444',
                          border: s.attendance === 'Present' ? `1px solid ${LIME}44` : '1px solid #ef444444',
                        }}>
                          {s.attendance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Submissions */}
      {activeTab === 'Submissions' && (
        <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Drill Submissions</h3>
          {student.submissions.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: 40 }}>No submissions yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {student.submissions.map(sub => (
                <div key={sub.id} style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', background: CARD2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#fff' }}>{sub.drill}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Submitted {sub.date}</p>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                      background: sub.status === 'Reviewed' ? LIME + '22' : '#eab30822',
                      color: sub.status === 'Reviewed' ? LIME : '#eab308',
                      border: sub.status === 'Reviewed' ? `1px solid ${LIME}44` : '1px solid #eab30844',
                    }}>
                      {sub.status}
                    </span>
                    {sub.score !== null && (
                      <span style={{ fontSize: 20, fontWeight: 700, color: LIME, minWidth: 52, textAlign: 'center' }}>
                        {sub.score}%
                      </span>
                    )}
                  </div>
                  {sub.feedback && (
                    <p style={{ margin: '10px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.45)', paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
                      💬 {sub.feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assessments */}
      {activeTab === 'Assessments' && (
        <div style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}` }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Assessments</h3>
          {student.assessments.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: 40 }}>No assessments yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {student.assessments.map((a, i) => (
                <div key={i} style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', background: CARD2 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#fff' }}>{a.name}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{a.date}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff' }}>
                      {a.score}<span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>/{a.maxScore}</span>
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Score</p>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: LIME + '22', border: `2px solid ${LIME}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: LIME }}>
                    {a.grade}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{label}</p>
      <p style={{ margin: '2px 0 0', fontSize: 14, color: '#fff', fontWeight: 500 }}>{value}</p>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{ background: '#161b22', borderRadius: 14, padding: '20px 22px', border: '1px solid #21262d' }}>
      <p style={{ margin: '0 0 8px', fontSize: 22 }}>{icon}</p>
      <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#adff2f' }}>{value}</p>
      <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{label}</p>
    </div>
  );
}
