import { useState } from 'react'
import toast from 'react-hot-toast'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const SUBMISSIONS = [
  { id:1, student:'Arjun Kapoor', initials:'AK', color:'#16a34a', program:'6-Month Batting · Week 18',
    filename:'Cover Drive Practice', duration:'2:38', size:'48MB', status:'new', date:'Today 9:14 AM',
    youtubeId: 'DU-TNOkXFZM',
    thumbnail: 'https://img.youtube.com/vi/DU-TNOkXFZM/mqdefault.jpg'
  },
  { id:2, student:'Rohan Mehta', initials:'RM', color:'#3b82f6', program:'6-Month Batting · Week 14',
    filename:'Straight Drive Drill', duration:'1:55', size:'32MB', status:'new', date:'Yesterday',
    youtubeId: 'uaeCJHhFB1Y',
    thumbnail: 'https://img.youtube.com/vi/uaeCJHhFB1Y/mqdefault.jpg'
  },
  { id:3, student:'Vikram Singh', initials:'VS', color:'#7c3aed', program:'Fast Bowling Elite · Week 9',
    filename:'Bowling Action Analysis', duration:'3:12', size:'64MB', status:'reviewed', date:'2 days ago',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg'
  },
  { id:4, student:'Priya Shah', initials:'PS', color:'#f97316', program:'Junior Allrounder · Week 6',
    filename:'Fielding Drill Video', duration:'1:20', size:'28MB', status:'new', date:'3 days ago',
    youtubeId: 'DU-TNOkXFZM',
    thumbnail: 'https://img.youtube.com/vi/DU-TNOkXFZM/mqdefault.jpg'
  },
]

export default function CoachSubmissions() {
  const [submissions, setSubmissions] = useState(SUBMISSIONS)
  const [tab, setTab] = useState('new')
  const [panel, setPanel] = useState(null)
  const [score, setScore] = useState(7)
  const [strengths, setStrengths] = useState('')
  const [improvements, setImprovements] = useState('')
  const [drill, setDrill] = useState('')

  const pending = submissions.filter(s => s.status === 'new')
  const filtered = tab === 'all' ? submissions : submissions.filter(s => s.status === tab)

  function openPanel(sub) {
    setPanel(sub)
    setScore(7)
    setStrengths('')
    setImprovements('')
    setDrill('')
  }

  function submitFeedback() {
    if (!strengths.trim() && !improvements.trim()) {
      toast.error('Please add feedback before submitting')
      return
    }
    setSubmissions(prev => prev.map(s => s.id === panel.id ? { ...s, status: 'reviewed' } : s))
    toast.success(`Feedback sent to ${panel.student}!`)
    setPanel(null)
  }

  const inputStyle = {
    width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 8,
    padding: '10px 12px', fontSize: 13, color: '#fff', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical',
  }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      <style>{`
        .sub-card { transition: all 0.2s; }
        .sub-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.3) !important; }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>SUBMISSIONS</h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>Student drill video submissions</p>
        </div>
        {pending.length > 0 && (
          <span style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', borderRadius: 20, padding: '3px 10px', fontSize: 13, fontWeight: 700 }}>{pending.length} pending</span>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: CARD2, borderRadius: 10, padding: 4, border: `1px solid ${BORDER}`, width: 'fit-content' }}>
        {[['new', `Pending (${pending.length})`], ['reviewed', `Reviewed (${submissions.filter(s=>s.status==='reviewed').length})`], ['all', `All (${submissions.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: tab === key ? LIME : 'transparent', color: tab === key ? '#000' : 'rgba(255,255,255,0.45)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {filtered.map(sub => {
          const avatarTextColor = sub.color === LIME || sub.color === '#eab308' ? '#000' : '#fff'
          return (
            <div key={sub.id} className="sub-card" style={{ background: CARD, borderRadius: 12, padding: 20, border: `1px solid ${BORDER}`, cursor: 'pointer' }} onClick={() => openPanel(sub)}>
              {/* YouTube Thumbnail */}
              <div style={{ borderRadius: 8, overflow: 'hidden', height: 120, marginBottom: 16, position: 'relative', border: `1px solid ${BORDER}` }}>
                <img src={sub.thumbnail} alt={sub.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#000' }}>▶</div>
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8, background: sub.status === 'new' ? LIME : '#374151', color: sub.status === 'new' ? '#000' : 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
                  {sub.status === 'new' ? 'New' : 'Reviewed'}
                </div>
              </div>

              {/* Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: sub.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: avatarTextColor, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{sub.initials}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{sub.student}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{sub.program}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>{sub.filename} · {sub.duration} · {sub.size}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 14 }}>{sub.date}</div>

              <button
                onClick={e => { e.stopPropagation(); openPanel(sub) }}
                style={{ width: '100%', padding: '8px 0', border: 'none', borderRadius: 8, background: sub.status === 'new' ? `linear-gradient(135deg,${LIME},#84cc16)` : CARD2, color: sub.status === 'new' ? '#000' : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
              >
                {sub.status === 'new' ? 'Review & Feedback' : 'View Review'}
              </button>
            </div>
          )
        })}
      </div>

      {/* SIDE PANEL */}
      {panel && (
        <>
          <div onClick={() => setPanel(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 999 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, width: 480, height: '100vh', background: CARD, borderLeft: `1px solid ${BORDER}`, zIndex: 1000, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: panel.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: panel.color === LIME ? '#000' : '#fff', fontWeight: 700, fontSize: 15 }}>{panel.initials}</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{panel.student}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{panel.program}</div>
                </div>
              </div>
              <button onClick={() => setPanel(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              {/* YouTube embed */}
              <div style={{ marginBottom: 20, borderRadius: 10, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                <iframe
                  src={`https://www.youtube.com/embed/${panel.youtubeId}`}
                  width="100%"
                  height="240"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={panel.filename}
                  style={{ display: 'block' }}
                />
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>{panel.filename} · {panel.duration} · {panel.size} · Submitted {panel.date}</div>

              {/* Score slider */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                  <span>Score</span>
                  <span style={{ color: LIME, fontSize: 18, fontWeight: 800 }}>{score}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>/10</span></span>
                </label>
                <input type="range" min={1} max={10} value={score} onChange={e => setScore(parseInt(e.target.value))} style={{ width: '100%', accentColor: LIME }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                  <span>1</span><span>5</span><span>10</span>
                </div>
              </div>

              {/* Strengths */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Strengths</label>
                <textarea rows={3} value={strengths} onChange={e => setStrengths(e.target.value)} placeholder="What did the student do well?" style={inputStyle} />
              </div>

              {/* Improvements */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Areas to Improve</label>
                <textarea rows={3} value={improvements} onChange={e => setImprovements(e.target.value)} placeholder="Areas to improve..." style={inputStyle} />
              </div>

              {/* Drill */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Drill Recommendation</label>
                <input type="text" value={drill} onChange={e => setDrill(e.target.value)} placeholder="Recommend a specific drill..." style={{ ...inputStyle, resize: undefined }} />
              </div>

              <button
                onClick={submitFeedback}
                style={{ width: '100%', padding: 14, background: `linear-gradient(135deg,${LIME},#84cc16)`, color: '#000', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: 'pointer', letterSpacing: '0.5px' }}
              >
                SUBMIT FEEDBACK
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
