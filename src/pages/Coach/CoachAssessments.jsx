import { useState } from 'react';
import { coachAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LIME = '#adff2f';
const BG = '#0d1117';
const CARD = '#161b22';
const CARD2 = '#1c2128';
const BORDER = '#21262d';

const MOCK_ASSESSMENTS = [
  {
    id: 1, title: 'Batting Fundamentals Test', program: 'Elite Performance Program', questions: 10, submitted: 8, avgScore: 76.5, status: 'Active', dueDate: '2026-06-01',
    results: [
      { student: 'Arjun Sharma', score: 88, submitted: '2026-05-25' },
      { student: 'Priya Patel', score: 72, submitted: '2026-05-24' },
      { student: 'Rohit Verma', score: 65, submitted: '2026-05-23' },
      { student: 'Sneha Iyer', score: 80, submitted: '2026-05-22' },
      { student: 'Kiran Nair', score: 91, submitted: '2026-05-21' },
      { student: 'Dev Mehta', score: 70, submitted: '2026-05-20' },
      { student: 'Anika Singh', score: 74, submitted: '2026-05-19' },
      { student: 'Raj Patel', score: 58, submitted: '2026-05-18' },
    ]
  },
  {
    id: 2, title: 'Bowling Mechanics Quiz', program: 'Fast Bowling Academy', questions: 8, submitted: 5, avgScore: 68.0, status: 'Active', dueDate: '2026-06-05',
    results: [
      { student: 'Rohit Verma', score: 78, submitted: '2026-05-25' },
      { student: 'Kiran Nair', score: 62, submitted: '2026-05-24' },
      { student: 'Dev Mehta', score: 74, submitted: '2026-05-23' },
      { student: 'Raj Patel', score: 55, submitted: '2026-05-22' },
      { student: 'Anika Singh', score: 71, submitted: '2026-05-21' },
    ]
  },
  {
    id: 3, title: 'Fielding Positions & Rules', program: 'All-Rounder Bootcamp', questions: 12, submitted: 12, avgScore: 82.3, status: 'Closed', dueDate: '2026-05-15',
    results: [
      { student: 'Arjun Sharma', score: 90, submitted: '2026-05-14' },
      { student: 'Priya Patel', score: 85, submitted: '2026-05-13' },
      { student: 'Sneha Iyer', score: 78, submitted: '2026-05-12' },
    ]
  },
  {
    id: 4, title: 'Sports Fitness Standards', program: 'Fitness & Conditioning', questions: 6, submitted: 3, avgScore: 71.0, status: 'Active', dueDate: '2026-06-10',
    results: [
      { student: 'Dev Mehta', score: 68, submitted: '2026-05-25' },
      { student: 'Kiran Nair', score: 77, submitted: '2026-05-24' },
      { student: 'Anika Singh', score: 68, submitted: '2026-05-23' },
    ]
  },
];

const PROGRAMS = ['Elite Performance Program', 'Fast Bowling Academy', 'All-Rounder Bootcamp', 'Fitness & Conditioning'];

export default function CoachAssessments() {
  const [assessments, setAssessments] = useState(MOCK_ASSESSMENTS);
  const [showCreate, setShowCreate] = useState(false);
  const [viewResults, setViewResults] = useState(null);
  const [form, setForm] = useState({ title: '', program: PROGRAMS[0], dueDate: '', questions: [{ text: '', points: 10 }] });

  const addQuestion = () => setForm({ ...form, questions: [...form.questions, { text: '', points: 10 }] });
  const removeQuestion = (i) => setForm({ ...form, questions: form.questions.filter((_, idx) => idx !== i) });
  const updateQuestion = (i, field, val) => setForm({ ...form, questions: form.questions.map((q, idx) => idx === i ? { ...q, [field]: val } : q) });

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await coachAPI.createAssessment(form); } catch {}
    const newA = { id: Date.now(), title: form.title, program: form.program, questions: form.questions.length, submitted: 0, avgScore: 0, status: 'Active', dueDate: form.dueDate, results: [] };
    setAssessments([...assessments, newA]);
    toast.success('Assessment created!');
    setShowCreate(false);
    setForm({ title: '', program: PROGRAMS[0], dueDate: '', questions: [{ text: '', points: 10 }] });
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: BG, color: '#fff' };
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' };

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>ASSESSMENTS</h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>{assessments.filter(a => a.status === 'Active').length} active assessments</p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{ background: LIME, color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ Create Assessment</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {assessments.map(a => (
          <div key={a.id} style={{ background: CARD, borderRadius: 12, padding: 24, border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#fff' }}>{a.title}</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{a.program}</p>
              </div>
              <span style={{
                background: a.status === 'Active' ? LIME + '22' : CARD2,
                color: a.status === 'Active' ? LIME : 'rgba(255,255,255,0.35)',
                border: a.status === 'Active' ? `1px solid ${LIME}44` : `1px solid ${BORDER}`,
                padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginLeft: 12
              }}>{a.status}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              {[['Questions', a.questions], ['Submitted', a.submitted], ['Avg Score', a.avgScore > 0 ? a.avgScore.toFixed(1) : '-']].map(([label, val]) => (
                <div key={label} style={{ background: CARD2, borderRadius: 8, padding: '10px 12px', textAlign: 'center', border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: LIME }}>{val}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Due: {a.dueDate}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setViewResults(a)} style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, background: LIME, color: '#000', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>View Results</button>
              <button onClick={() => toast.success('Edit assessment coming soon')} style={{ flex: 1, padding: '8px 0', border: `1px solid ${BORDER}`, borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: CARD, borderRadius: 16, padding: 32, width: 580, maxHeight: '85vh', overflowY: 'auto', border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' }}>Create Assessment</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="Assessment title" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Program</label>
                  <select value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} style={inputStyle}>
                    {PROGRAMS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} style={inputStyle} />
                </div>
              </div>

              {/* Questions Builder */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Questions</label>
                  <button type="button" onClick={addQuestion} style={{ padding: '4px 12px', border: `1px solid ${LIME}`, borderRadius: 6, background: LIME + '22', color: LIME, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>+ Add</button>
                </div>
                {form.questions.map((q, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: LIME, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 8 }}>{i + 1}</div>
                    <input value={q.text} onChange={e => updateQuestion(i, 'text', e.target.value)} placeholder="Question text..." style={{ ...inputStyle, flex: 1 }} />
                    <input type="number" value={q.points} onChange={e => updateQuestion(i, 'points', parseInt(e.target.value))} min={1} style={{ ...inputStyle, width: 70 }} />
                    {form.questions.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18, padding: '6px 4px' }}>×</button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{ padding: '9px 20px', border: `1px solid ${BORDER}`, borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" style={{ padding: '9px 24px', border: 'none', borderRadius: 8, background: LIME, color: '#000', cursor: 'pointer', fontWeight: 700 }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {viewResults && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: CARD, borderRadius: 16, padding: 32, width: 560, maxHeight: '80vh', overflowY: 'auto', border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' }}>{viewResults.title}</h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{viewResults.submitted} submissions</p>
              </div>
              <button onClick={() => setViewResults(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>×</button>
            </div>
            {viewResults.results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>No submissions yet</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: CARD2 }}>
                    {['Student', 'Score', 'Grade', 'Submitted'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {viewResults.results.sort((a, b) => b.score - a.score).map((r, i) => {
                    const scoreColor = r.score >= 75 ? LIME : r.score >= 50 ? '#eab308' : '#ef4444';
                    return (
                      <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }}
                        onMouseEnter={e => { e.currentTarget.style.background = CARD2; }}
                        onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
                        <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 500, color: '#fff' }}>{r.student}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, background: BORDER, borderRadius: 4, height: 6, overflow: 'hidden' }}>
                              <div style={{ height: '100%', background: scoreColor, width: `${r.score}%` }} />
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', minWidth: 30 }}>{r.score}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: scoreColor + '22', color: scoreColor, border: `1px solid ${scoreColor}44`, padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                            {r.score >= 75 ? 'Pass' : r.score >= 50 ? 'Average' : 'Needs Work'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{r.submitted}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
