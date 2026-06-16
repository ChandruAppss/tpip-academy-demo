import { useState } from 'react';
import { coachAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LIME = '#adff2f';
const BG = '#0d1117';
const CARD = '#161b22';
const CARD2 = '#1c2128';
const BORDER = '#21262d';

const MOCK_DRILLS = [
  { id: 1, name: 'Cover Drive Basics', category: 'Batting', difficulty: 'Easy', description: 'Foundation cover drive technique focusing on front foot placement and bat swing.', students: 12, videoUrl: 'https://youtube.com/watch?v=abc', instructions: 'Stand in crease, move front foot towards ball, swing bat through line.' },
  { id: 2, name: 'Off-Spin Variation', category: 'Bowling', difficulty: 'Hard', description: 'Advanced off-spin with flight, dip and turn variations for experienced bowlers.', students: 5, videoUrl: '', instructions: 'Grip ball with index and middle finger across seam. Pivot on front foot.' },
  { id: 3, name: 'Slip Catching', category: 'Agility', difficulty: 'Medium', description: 'Reaction-based catching drills for slip cordon positions.', students: 8, videoUrl: 'https://youtube.com/watch?v=def', instructions: 'Start in ready position. Focus eyes on bat edge. React to ball.' },
  { id: 4, name: 'Interval Sprint Training', category: 'Fitness', difficulty: 'Hard', description: 'High-intensity sprint intervals to build sport-specific endurance.', students: 15, videoUrl: '', instructions: '10x 30m sprints with 45 second rest. 3 sets total.' },
  { id: 5, name: 'Pull Shot Mechanics', category: 'Batting', difficulty: 'Medium', description: 'Short-pitched delivery handling with controlled pull shot.', students: 9, videoUrl: 'https://youtube.com/watch?v=ghi', instructions: 'Get inside the line. Roll wrists on contact. Play into gaps.' },
  { id: 6, name: 'Yorker Delivery', category: 'Bowling', difficulty: 'Medium', description: 'Consistent yorker execution at full pace targeting base of stumps.', students: 6, videoUrl: 'https://youtube.com/watch?v=jkl', instructions: 'Full run-up. Drive through crease. Release at toe level.' },
  { id: 7, name: 'Sprint, Dive & Recover', category: 'Agility', difficulty: 'Easy', description: 'Aggressive field movement with safe diving and accurate recovery.', students: 11, videoUrl: '', instructions: 'Sprint to position. Dive if needed. Roll and recover quickly in one motion.' },
  { id: 8, name: 'Core Strength Circuit', category: 'Fitness', difficulty: 'Easy', description: 'Core stabilization exercises essential for batting power and bowling pace.', students: 18, videoUrl: 'https://youtube.com/watch?v=mno', instructions: 'Plank 60s, side plank 30s each, dead bugs 15 reps. 3 rounds.' },
];

const CAT_COLOR = { Batting: '#3b82f6', Bowling: '#f97316', Fielding: LIME, Fitness: '#a855f7' };
const DIFF_COLOR = { Easy: LIME, Medium: '#eab308', Hard: '#ef4444' };

export default function CoachDrills() {
  const [drills, setDrills] = useState(MOCK_DRILLS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editDrill, setEditDrill] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Batting', difficulty: 'Easy', description: '', videoUrl: '', instructions: '' });

  const filtered = drills.filter(d => {
    const mc = category === 'All' || d.category === category;
    const ms = d.name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  const openCreate = () => {
    setEditDrill(null);
    setForm({ name: '', category: 'Batting', difficulty: 'Easy', description: '', videoUrl: '', instructions: '' });
    setShowModal(true);
  };
  const openEdit = (drill) => {
    setEditDrill(drill);
    setForm({ name: drill.name, category: drill.category, difficulty: drill.difficulty, description: drill.description, videoUrl: drill.videoUrl, instructions: drill.instructions });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await coachAPI.createDrill(form); } catch {}
    if (editDrill) {
      setDrills(drills.map(d => d.id === editDrill.id ? { ...d, ...form } : d));
      toast.success('Drill updated!');
    } else {
      setDrills([...drills, { id: Date.now(), ...form, students: 0 }]);
      toast.success('Drill created!');
    }
    setShowModal(false);
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: BG, color: '#fff' };
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' };

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>DRILL LIBRARY</h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>{drills.length} drills in your library</p>
        </div>
        <button onClick={openCreate} style={{ background: LIME, color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ Create Drill</button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drills..." style={{ ...inputStyle, flex: 1, minWidth: 200 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['All', 'Batting', 'Bowling', 'Fielding', 'Fitness'].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${category === cat ? LIME : BORDER}`, background: category === cat ? LIME + '22' : 'transparent', color: category === cat ? LIME : 'rgba(255,255,255,0.5)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {filtered.map(drill => {
          const catColor = CAT_COLOR[drill.category] || '#fff';
          const diffColor = DIFF_COLOR[drill.difficulty] || '#fff';
          const diffTextColor = drill.difficulty === 'Easy' ? '#000' : '#fff';
          const catTextColor = '#fff';
          return (
            <div key={drill.id} style={{ background: CARD, borderRadius: 12, padding: 20, border: `1px solid ${BORDER}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#fff', flex: 1 }}>{drill.name}</h3>
                {drill.videoUrl && <span style={{ marginLeft: 8, color: LIME, fontSize: 16 }}>▶</span>}
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, color: catTextColor, background: catColor + '33', border: `1px solid ${catColor}55` }}>{drill.category}</span>
                <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, color: diffColor === LIME ? '#000' : '#fff', background: diffColor + '33', border: `1px solid ${diffColor}55` }}>{drill.difficulty}</span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{drill.description}</p>
              <p style={{ margin: '0 0 14px', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{drill.students} students assigned</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(drill)} style={{ flex: 1, padding: '7px 0', border: `1px solid ${BORDER}`, borderRadius: 6, background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Edit</button>
                <button onClick={() => toast.success('Assign feature coming soon')} style={{ flex: 1, padding: '7px 0', border: 'none', borderRadius: 6, background: LIME, color: '#000', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Assign</button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: CARD, borderRadius: 16, padding: 32, width: 520, maxHeight: '85vh', overflowY: 'auto', border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' }}>{editDrill ? 'Edit Drill' : 'Create Drill'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Drill Name *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="e.g. Cover Drive Basics" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                    {['Batting', 'Bowling', 'Fielding', 'Fitness'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Difficulty</label>
                  <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} style={inputStyle}>
                    {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Video URL</label>
                <input value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} style={inputStyle} placeholder="https://youtube.com/..." />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Instructions</label>
                <textarea value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '9px 20px', border: `1px solid ${BORDER}`, borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" style={{ padding: '9px 24px', border: 'none', borderRadius: 8, background: LIME, color: '#000', cursor: 'pointer', fontWeight: 700 }}>{editDrill ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
