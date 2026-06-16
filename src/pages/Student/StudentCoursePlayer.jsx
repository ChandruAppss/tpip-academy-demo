import { useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const mockCourse = {
  title: 'Advanced Performance Techniques',
  progress: 65,
  chapters: [
    {
      id: 'c1',
      title: 'Foundations of Athletic Performance',
      lessons: [
        { id: 'l1', title: 'Stance & Technique Basics', duration: '12:30', completed: true, description: 'Learn the fundamental stance and technique principles that form the foundation of all great athletic performance. We cover foot positioning, weight distribution, and how to position your body correctly for maximum control.', content: 'Athletic stance is the foundation of all performance. Feet shoulder-width apart, knees slightly bent, weight evenly distributed and ready to move.\n\nKey points:\n• Feet grounded and balanced\n• Knees slightly bent, weight centred\n• Eyes forward, head still\n• Core engaged throughout' },
        { id: 'l2', title: 'Footwork Fundamentals', duration: '15:00', completed: true, description: 'Master the footwork patterns that separate average athletes from great ones.', content: 'Good footwork is the secret weapon of all great athletes. Moving correctly gets you into the ideal position every time.\n\nForward movement:\n• Transfer weight forward\n• Keep head over point of contact\n• Full extension on attacking moves\n\nBack foot movement:\n• Step back to create space\n• Create time to execute\n• Stay balanced as long as possible' },
        { id: 'l3', title: 'Movement Mastery', duration: '20:15', completed: false, description: 'Perfect your movement patterns — the most effective techniques in competitive sport.', content: 'Fluid movement mastery separates good athletes from great ones. Every sport demands precision, timing, and body mechanics.\n\nKey principles:\n1. Read the situation early\n2. Head steady at execution\n3. Drive through with full extension\n4. Follow through completely\n5. Reset quickly to base position' },
      ],
    },
    {
      id: 'c2',
      title: 'Advanced Explosive Techniques',
      lessons: [
        { id: 'l4', title: 'Power Movement Mastery', duration: '18:45', completed: false, description: 'Dominate high-pressure situations with explosive power movements.', content: 'Explosive power movements define high-level athletic performance. Timing and positioning are everything.\n\nSetup:\n• Read the situation early\n• Move into position quickly\n• Generate power from the ground up\n• Keep head still through execution' },
        { id: 'l5', title: 'Explosive Technique Mastery', duration: '14:20', completed: false, description: 'Execute high-intensity explosive techniques safely and effectively.', content: 'High-pressure explosive techniques require courage and precision. Reading the situation and committing fully is key.\n\nKey factors:\n• Assess the situation quickly\n• Commit fully to the movement\n• Risk vs reward awareness\n• Safety first — knowing when to hold back is also a skill' },
      ],
    },
    {
      id: 'c3',
      title: 'Defensive Fundamentals',
      lessons: [
        { id: 'l6', title: 'Defensive Fundamentals', duration: '10:00', completed: false, description: 'Build a rock-solid foundation under pressure.', content: 'Defence wins matches. Solid defensive fundamentals are your primary tool under pressure.\n\nExecution:\n• Move quickly into position\n• Stay low and balanced\n• Stay compact and controlled\n• Controlled response — no overcommitment' },
      ],
    },
  ],
}

const allLessons = mockCourse.chapters.flatMap(c => c.lessons)

export default function StudentCoursePlayer() {
  const { enrollmentId } = useParams()
  const [currentLessonId, setCurrentLessonId] = useState('l3')
  const [activeTab, setActiveTab] = useState('Content')
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([
    { id: 1, user: 'You', text: 'Great explanation of the footwork!', time: '2 days ago' },
    { id: 2, user: 'Coach Rahul', text: 'Good question! Remember to keep your head still.', time: '1 day ago' },
  ])
  const [completedLessons, setCompletedLessons] = useState(new Set(['l1', 'l2']))
  const [expandedChapters, setExpandedChapters] = useState(new Set(['c1', 'c2']))

  const currentLesson = allLessons.find(l => l.id === currentLessonId) || allLessons[0]
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const totalLessons = allLessons.length
  const completedCount = completedLessons.size
  const progressPct = Math.round((completedCount / totalLessons) * 100)

  const toggleChapter = (cid) => {
    setExpandedChapters(prev => {
      const next = new Set(prev)
      next.has(cid) ? next.delete(cid) : next.add(cid)
      return next
    })
  }

  const markComplete = () => {
    setCompletedLessons(prev => new Set([...prev, currentLessonId]))
    toast.success('Lesson marked as complete!')
    if (nextLesson) setCurrentLessonId(nextLesson.id)
  }

  const postComment = () => {
    if (!comment.trim()) return
    setComments(prev => [...prev, { id: Date.now(), user: 'You', text: comment, time: 'Just now' }])
    setComment('')
    toast.success('Comment posted!')
  }

  const resources = [
    { name: 'Batting Stance Guide.pdf', size: '2.4 MB' },
    { name: 'Footwork Drills Worksheet.pdf', size: '1.1 MB' },
    { name: 'Drive Shot Analysis.pdf', size: '3.2 MB' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      {/* Top bar */}
      <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 20 }}>🏏</span>
        <span style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>{mockCourse.title}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{completedCount}/{totalLessons} lessons</span>
          <div style={{ width: 120, background: BORDER, borderRadius: 4, height: 6 }}>
            <div style={{ height: '100%', borderRadius: 4, background: LIME, width: `${progressPct}%` }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: LIME }}>{progressPct}%</span>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Video player */}
          <div style={{
            background: CARD, borderRadius: 16, height: 360,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24, position: 'relative', overflow: 'hidden', border: `1px solid ${BORDER}`,
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1c2128 0%, #0d1117 100%)' }} />
            <div style={{
              position: 'relative', width: 72, height: 72, borderRadius: '50%',
              background: LIME + 'dd', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', marginBottom: 16,
              boxShadow: `0 0 0 12px ${LIME}33`,
            }}>
              <span style={{ fontSize: 28, marginLeft: 4, color: '#000' }}>▶</span>
            </div>
            <div style={{ position: 'relative', color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}>{currentLesson.title}</div>
              <div>{currentLesson.duration}</div>
            </div>
          </div>

          {/* Lesson title */}
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{currentLesson.title}</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 20, lineHeight: 1.6 }}>{currentLesson.description}</p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, borderBottom: `2px solid ${BORDER}`, marginBottom: 20 }}>
            {['Content', 'Resources', 'Discussion'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px', border: 'none', cursor: 'pointer',
                  background: 'transparent', fontSize: 14, fontWeight: 500,
                  color: activeTab === tab ? LIME : 'rgba(255,255,255,0.4)',
                  borderBottom: activeTab === tab ? `2px solid ${LIME}` : '2px solid transparent',
                  marginBottom: -2,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'Content' && (
            <div style={{ background: CARD, borderRadius: 12, padding: 24, border: `1px solid ${BORDER}` }}>
              {currentLesson.content.split('\n').map((line, i) => (
                <p key={i} style={{ margin: '0 0 8px', color: line.startsWith('•') ? 'rgba(255,255,255,0.6)' : '#fff', lineHeight: 1.7 }}>
                  {line || <br />}
                </p>
              ))}
            </div>
          )}

          {activeTab === 'Resources' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {resources.map((r, i) => (
                <div key={i} style={{
                  background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
                  padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{
                    width: 44, height: 44, background: CARD2, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{r.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{r.size}</div>
                  </div>
                  <button
                    onClick={() => toast.success(`Downloading ${r.name}...`)}
                    style={{
                      padding: '8px 16px', borderRadius: 8, border: `1px solid ${LIME}`,
                      color: LIME, background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    }}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Discussion' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                {comments.map(c => (
                  <div key={c.id} style={{
                    background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 18px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{c.user}</span>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{c.time}</span>
                    </div>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{c.text}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Ask a question or share a thought..."
                  rows={3}
                  style={{
                    width: '100%', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 12px',
                    fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'inherit', background: BG, color: '#fff',
                  }}
                />
                <button
                  onClick={postComment}
                  style={{
                    marginTop: 10, padding: '9px 20px', background: LIME,
                    color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer',
                    fontWeight: 700, fontSize: 14,
                  }}
                >
                  Post Comment
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 16 }}>
            <button
              onClick={() => prevLesson && setCurrentLessonId(prevLesson.id)}
              disabled={!prevLesson}
              style={{
                padding: '10px 24px', borderRadius: 10,
                border: `1px solid ${BORDER}`, background: 'transparent',
                color: prevLesson ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
                cursor: prevLesson ? 'pointer' : 'not-allowed',
                fontWeight: 500, fontSize: 14,
              }}
            >
              ← Previous Lesson
            </button>
            <button
              onClick={markComplete}
              style={{
                padding: '10px 24px', borderRadius: 10,
                background: completedLessons.has(currentLessonId) ? LIME + '22' : LIME,
                color: completedLessons.has(currentLessonId) ? LIME : '#000',
                border: completedLessons.has(currentLessonId) ? `1px solid ${LIME}` : 'none',
                cursor: 'pointer', fontWeight: 700, fontSize: 14,
              }}
            >
              {completedLessons.has(currentLessonId) ? '✓ Completed' : 'Mark Complete'}
            </button>
            <button
              onClick={() => nextLesson && setCurrentLessonId(nextLesson.id)}
              disabled={!nextLesson}
              style={{
                padding: '10px 24px', borderRadius: 10,
                border: 'none', background: nextLesson ? LIME : BORDER,
                color: nextLesson ? '#000' : 'rgba(255,255,255,0.3)',
                cursor: nextLesson ? 'pointer' : 'not-allowed',
                fontWeight: 700, fontSize: 14,
              }}
            >
              Next Lesson →
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{
          width: 300, background: CARD, borderLeft: `1px solid ${BORDER}`,
          overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '16px 18px', borderBottom: `1px solid ${BORDER}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>Course Outline</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{completedCount} of {totalLessons} done</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: LIME }}>{progressPct}%</span>
            </div>
            <div style={{ background: BORDER, borderRadius: 4, height: 5 }}>
              <div style={{ height: '100%', borderRadius: 4, background: LIME, width: `${progressPct}%` }} />
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {mockCourse.chapters.map(chapter => (
              <div key={chapter.id}>
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  style={{
                    width: '100%', padding: '12px 18px', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', border: 'none', cursor: 'pointer',
                    background: CARD2, borderBottom: `1px solid ${BORDER}`,
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{chapter.title}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{expandedChapters.has(chapter.id) ? '▲' : '▼'}</span>
                </button>
                {expandedChapters.has(chapter.id) && chapter.lessons.map(lesson => {
                  const isCompleted = completedLessons.has(lesson.id)
                  const isCurrent = lesson.id === currentLessonId
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonId(lesson.id)}
                      style={{
                        width: '100%', padding: '10px 18px 10px 28px',
                        display: 'flex', alignItems: 'center', gap: 10,
                        border: 'none', cursor: 'pointer', textAlign: 'left',
                        background: isCurrent ? LIME + '11' : CARD,
                        borderLeft: isCurrent ? `3px solid ${LIME}` : '3px solid transparent',
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        background: isCompleted ? LIME : isCurrent ? LIME + '33' : BORDER,
                        border: isCurrent && !isCompleted ? `2px solid ${LIME}` : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: '#000',
                      }}>
                        {isCompleted ? '✓' : ''}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 12, fontWeight: isCurrent ? 600 : 400,
                          color: isCurrent ? LIME : 'rgba(255,255,255,0.6)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {lesson.title}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{lesson.duration}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
