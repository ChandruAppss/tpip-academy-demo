import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const mockCourses = [
  { id: 'e1', title: 'Advanced Performance Techniques', coach: 'Rahul Sharma', coachInitials: 'RS', progress: 65, status: 'in_progress', nextLesson: 'Power Movement Mastery', chapters: 12, lastAccessed: '2 hours ago', gradient: 'linear-gradient(135deg, #16a34a 0%, #065f46 100%)' },
  { id: 'e2', title: 'Fast Bowling Masterclass', coach: 'Vikram Singh', coachInitials: 'VS', progress: 30, status: 'in_progress', nextLesson: 'Yorker Delivery', chapters: 10, lastAccessed: '1 day ago', gradient: 'linear-gradient(135deg, #2563eb 0%, #1e1b4b 100%)' },
  { id: 'e3', title: 'Sports Fitness & Conditioning', coach: 'Priya Menon', coachInitials: 'PM', progress: 100, status: 'completed', nextLesson: null, chapters: 8, lastAccessed: '1 week ago', gradient: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)' },
  { id: 'e4', title: 'Mental Toughness for Athletes', coach: 'Arjun Nair', coachInitials: 'AN', progress: 0, status: 'not_started', nextLesson: 'Introduction to Mental Game', chapters: 6, lastAccessed: 'Not started', gradient: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)' },
]

const tabs = ['All', 'In Progress', 'Completed']

export default function StudentCourses() {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = mockCourses.filter(c => {
    if (activeTab === 'In Progress') return c.status === 'in_progress'
    if (activeTab === 'Completed') return c.status === 'completed'
    return true
  })

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '1px' }}>MY COURSES</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 4, marginBottom: 0, fontSize: 14 }}>Continue learning and track your progress</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '6px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: activeTab === tab ? LIME : 'transparent', color: activeTab === tab ? '#000' : 'rgba(255,255,255,0.5)' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {filtered.map(course => (
          <div key={course.id} style={{ background: CARD, borderRadius: 16, overflow: 'hidden', border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column' }}>
            {/* Thumbnail */}
            <div style={{ background: course.gradient, height: 120, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 40 }}>🏏</div>
              {course.status === 'completed' && (
                <div style={{ position: 'absolute', top: 10, right: 10, background: LIME, color: '#000', fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 700 }}>Completed</div>
              )}
              {course.status === 'not_started' && (
                <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>Not Started</div>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{course.title}</h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: LIME, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{course.coachInitials}</div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{course.coach}</span>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Progress</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: LIME }}>{course.progress}%</span>
                </div>
                <div style={{ background: BORDER, borderRadius: 4, height: 6 }}>
                  <div style={{ height: '100%', borderRadius: 4, background: LIME, width: `${course.progress}%` }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>📚 {course.chapters} chapters</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>🕒 {course.lastAccessed}</span>
              </div>

              {course.nextLesson && (
                <div style={{ background: LIME + '15', borderRadius: 8, padding: '8px 10px', marginBottom: 14, fontSize: 12, color: LIME, border: `1px solid ${LIME}30` }}>
                  <span style={{ fontWeight: 600 }}>Next: </span>{course.nextLesson}
                </div>
              )}

              <div style={{ marginTop: 'auto' }}>
                {course.status === 'completed' ? (
                  <button onClick={() => toast.success('Certificate download started!')} style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#eab308', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                    🏆 Get Certificate
                  </button>
                ) : (
                  <Link to={`/student/courses/${course.id}`} style={{ display: 'block', width: '100%', padding: '10px', borderRadius: 10, background: LIME, color: '#000', textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: 14, boxSizing: 'border-box' }}>
                    {course.status === 'not_started' ? 'Start Course' : 'Continue →'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.35)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <p style={{ fontSize: 16 }}>No courses in this category yet.</p>
        </div>
      )}
    </div>
  )
}
