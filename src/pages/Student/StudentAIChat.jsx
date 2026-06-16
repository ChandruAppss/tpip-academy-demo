import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentAPI } from '../../services/api'
import useAuthStore from '../../store/authStore'

const QUICK_QUESTIONS = [
  'Fix my pull shot technique',
  'Give me today\'s training plan',
  'What are my top 3 improvements?',
  'How close am I to district selection?',
  'Drill for back-foot play',
  'Analyse my coach feedback',
]

export default function StudentAIChat() {
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const messagesEndRef = useRef(null)

  const [chatHistory, setChatHistory] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [questionsUsed, setQuestionsUsed] = useState(0)
  const [questionsLeft, setQuestionsLeft] = useState(48)
  const [dailyLimit, setDailyLimit] = useState(50)
  const [packageName, setPackageName] = useState('Pro')
  const [limitReached, setLimitReached] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)

  useEffect(() => {
    studentAPI.getAIAnalysis()
      .then(res => setAnalysisData(res.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, chatLoading])

  async function sendChat(msgOverride) {
    const userMsg = msgOverride || chatInput.trim()
    if (!userMsg || chatLoading || limitReached) return
    setChatInput('')
    setChatHistory(h => [...h, { role: 'user', content: userMsg }])
    setChatLoading(true)
    try {
      const res = await studentAPI.sendAIChat({
        message: userMsg,
        history: chatHistory,
        student_id: 's1',
        student_name: profile?.full_name || 'Student',
        analysis_context: analysisData?.analysis ? {
          overall_rating: analysisData.analysis.overall_rating,
          performance_level: analysisData.analysis.performance_level,
          monthly_focus: analysisData.analysis.monthly_focus,
          strengths: analysisData.analysis.strengths,
          weaknesses: analysisData.analysis.weaknesses,
        } : null,
      })
      const d = res.data
      setQuestionsUsed(d.questions_used || questionsUsed + 1)
      setQuestionsLeft(d.questions_remaining ?? Math.max(0, questionsLeft - 1))
      if (d.limit !== undefined) setDailyLimit(d.limit)
      if (d.package) setPackageName(d.package)
      setChatHistory(h => [...h, {
        role: 'assistant',
        content: d.reply,
        resources: d.suggested_resources || [],
      }])
    } catch (e) {
      if (e.response?.status === 429) {
        setLimitReached(true)
      }
      setChatHistory(h => h.slice(0, -1))
    } finally {
      setChatLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChat()
    }
  }

  const usagePercent = Math.round((questionsUsed / dailyLimit) * 100)
  const initials = (profile?.full_name || 'Student')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const mockStrengths = [
    { name: 'Cover Drive', score: 8.5 },
    { name: 'Running Between Wickets', score: 8.0 },
    { name: 'Sweep Shot', score: 7.5 },
  ]

  const mockWeaknesses = [
    { name: 'Pull Shot', severity: 'Critical' },
    { name: 'Bowling Line', severity: 'High' },
  ]

  const aiScore = analysisData?.analysis?.overall_rating || 7.2
  const circumference = 2 * Math.PI * 36
  const dashOffset = circumference - (aiScore / 10) * circumference

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#0d1117',
      color: '#e6edf3',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflow: 'hidden',
    }}>
      {/* LEFT PANEL */}
      <div style={{
        width: 320,
        minWidth: 320,
        background: 'linear-gradient(180deg, #130a2a 0%, #0d1117 100%)',
        borderRight: '1px solid rgba(141,89,255,0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Left Panel Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(141,89,255,0.2)',
          background: 'linear-gradient(135deg, rgba(141,89,255,0.15), rgba(99,52,200,0.08))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #8d59ff, #6334c8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>
              🤖
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#e6edf3' }}>TPIP AI Coach</div>
              <div style={{ fontSize: 11, color: '#8d59ff', fontWeight: 500 }}>Personal Sports Intelligence</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
          {/* Student Card */}
          <div style={{
            background: '#161b22',
            border: '1px solid rgba(141,89,255,0.2)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, #8d59ff, #6334c8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: '#fff',
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600, fontSize: 14, color: '#e6edf3',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {profile?.full_name || 'Student'}
                </div>
                <div style={{
                  display: 'inline-block',
                  marginTop: 4,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: 'rgba(141,89,255,0.15)',
                  border: '1px solid rgba(141,89,255,0.3)',
                  fontSize: 11, color: '#8d59ff', fontWeight: 600,
                }}>
                  Advanced
                </div>
              </div>
            </div>
          </div>

          {/* AI Score Ring */}
          <div style={{
            background: '#161b22',
            border: '1px solid rgba(141,89,255,0.2)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(141,89,255,0.15)" strokeWidth="7" />
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 40 40)"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8d59ff" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#8d59ff', lineHeight: 1 }}>
                  {aiScore}
                </div>
                <div style={{ fontSize: 9, color: '#8b949e', marginTop: 2 }}>/10</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 8 }}>AI Performance Score</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Sessions Done', value: 3 },
                  { label: 'Active Programs', value: 2 },
                  { label: 'Submissions', value: 3 },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#8b949e' }}>{s.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e6edf3' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div style={{
            background: '#161b22',
            border: '1px solid rgba(141,89,255,0.2)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Strengths
            </div>
            {mockStrengths.map(s => (
              <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <span style={{ fontSize: 12, color: '#e6edf3' }}>{s.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 50, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <div style={{ width: `${(s.score / 10) * 100}%`, height: '100%', background: '#22c55e', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, width: 24, textAlign: 'right' }}>{s.score}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Priority Fixes */}
          <div style={{
            background: '#161b22',
            border: '1px solid rgba(141,89,255,0.2)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Priority Fixes
            </div>
            {mockWeaknesses.map(w => (
              <div key={w.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <span style={{ fontSize: 12, color: '#e6edf3' }}>{w.name}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  padding: '2px 7px', borderRadius: 10,
                  background: w.severity === 'Critical' ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)',
                  color: w.severity === 'Critical' ? '#ef4444' : '#f97316',
                  border: `1px solid ${w.severity === 'Critical' ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.3)'}`,
                }}>
                  {w.severity}
                </span>
              </div>
            ))}
          </div>

          {/* Monthly Focus */}
          <div style={{
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
            background: 'linear-gradient(135deg, rgba(141,89,255,0.25), rgba(99,52,200,0.15))',
            border: '1px solid rgba(141,89,255,0.3)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Monthly Focus
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3', lineHeight: 1.4 }}>
              Back-Foot Play & Short-Pitch Defence
            </div>
          </div>

          {/* 3-Month Prediction */}
          <div style={{
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.25)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              3-Month Prediction
            </div>
            <div style={{ fontSize: 12, color: '#93c5fd', lineHeight: 1.5 }}>
              District-level selection realistic in 3 months
            </div>
          </div>

          {/* YouTube Resources */}
          <div style={{
            background: '#161b22',
            border: '1px solid rgba(141,89,255,0.2)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              YouTube Resources
            </div>
            {[
              { title: 'Back Foot Defence Masterclass', url: '#' },
              { title: 'Pull Shot Technique Fix', url: '#' },
              { title: 'Short Pitch Batting Drills', url: '#' },
            ].map((v, i) => (
              <a key={i} href={v.url} target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 0',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                textDecoration: 'none',
                color: '#e6edf3',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: 10,
                }}>
                  ▶
                </div>
                <span style={{ fontSize: 11, color: '#c9d1d9', lineHeight: 1.3 }}>{v.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Package Badge */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(141,89,255,0.2)',
          background: 'rgba(141,89,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              fontSize: 12, fontWeight: 600,
              color: '#8d59ff',
            }}>
              {packageName} Plan
            </div>
            <div style={{
              fontSize: 11, color: '#8b949e',
            }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>{questionsLeft}</span> questions left today
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#0d1117',
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(141,89,255,0.2)',
          background: '#161b22',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'rgba(141,89,255,0.1)',
                border: '1px solid rgba(141,89,255,0.2)',
                borderRadius: 8,
                color: '#8d59ff',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              ← Back
            </button>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#e6edf3' }}>
                Chat with TPIP AI Coach
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 6px rgba(34,197,94,0.6)',
                }} />
                <span style={{ fontSize: 12, color: '#8b949e' }}>Online · Powered by GPT-4</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
                Daily Usage: {questionsUsed}/{dailyLimit}
              </div>
              <div style={{ width: 140, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                <div style={{
                  width: `${usagePercent}%`,
                  height: '100%',
                  borderRadius: 3,
                  background: usagePercent > 80
                    ? 'linear-gradient(90deg, #ef4444, #f97316)'
                    : 'linear-gradient(90deg, #8d59ff, #c084fc)',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
        }}>
          {chatHistory.length === 0 && !chatLoading && (
            <div>
              {/* Welcome Message */}
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: 'linear-gradient(135deg, #8d59ff, #6334c8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, margin: '0 auto 16px',
                }}>
                  🏏
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#e6edf3', margin: '0 0 8px' }}>
                  Your AI Sports Coach
                </h2>
                <p style={{ fontSize: 14, color: '#8b949e', margin: 0, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
                  Ask me anything about your sports performance, training plans, technique corrections, or pathway to selection.
                </p>
              </div>

              {/* Quick Questions */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, textAlign: 'center' }}>
                  Quick Questions
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  justifyContent: 'center',
                }}>
                  {QUICK_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => sendChat(q)}
                      disabled={limitReached || chatLoading}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 24,
                        border: '1px solid rgba(141,89,255,0.3)',
                        background: 'rgba(141,89,255,0.08)',
                        color: '#c084fc',
                        fontSize: 13,
                        cursor: limitReached || chatLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                        opacity: limitReached ? 0.5 : 1,
                      }}
                      onMouseEnter={e => {
                        if (!limitReached && !chatLoading) {
                          e.currentTarget.style.background = 'rgba(141,89,255,0.18)'
                          e.currentTarget.style.borderColor = 'rgba(141,89,255,0.6)'
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(141,89,255,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(141,89,255,0.3)'
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                gap: 12,
                alignItems: 'flex-start',
              }}>
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #8d59ff, #6334c8)'
                    : 'linear-gradient(135deg, #1f6feb, #0d419d)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: msg.role === 'user' ? 13 : 16, fontWeight: 700, color: '#fff',
                }}>
                  {msg.role === 'user' ? initials : '🤖'}
                </div>

                <div style={{ maxWidth: '70%', minWidth: 0 }}>
                  {/* Message Bubble */}
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #8d59ff, #6334c8)'
                      : '#161b22',
                    border: msg.role === 'user'
                      ? 'none'
                      : '1px solid rgba(141,89,255,0.2)',
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: '#e6edf3',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {msg.content}
                  </div>

                  {/* YouTube Resource Chips */}
                  {msg.role === 'assistant' && msg.resources && msg.resources.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {msg.resources.map((r, ri) => (
                        <a
                          key={ri}
                          href={r.url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '6px 12px',
                            borderRadius: 20,
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            color: '#fca5a5',
                            fontSize: 12,
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          <span style={{ fontSize: 10 }}>▶</span>
                          {r.title || r}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {chatLoading && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #1f6feb, #0d419d)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>
                  🤖
                </div>
                <div style={{
                  padding: '14px 18px',
                  borderRadius: '4px 16px 16px 16px',
                  background: '#161b22',
                  border: '1px solid rgba(141,89,255,0.2)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#8d59ff',
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Limit Reached Banner */}
          {limitReached && (
            <div style={{
              margin: '24px auto',
              maxWidth: 480,
              padding: '16px 20px',
              borderRadius: 12,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>
                Daily Limit Reached
              </div>
              <div style={{ fontSize: 12, color: '#fca5a5' }}>
                You have used all {dailyLimit} questions for today. Limit resets at midnight.
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(141,89,255,0.2)',
          background: '#161b22',
          flexShrink: 0,
        }}>
          {chatHistory.length > 0 && !limitReached && (
            <div style={{
              display: 'flex',
              gap: 8,
              marginBottom: 12,
              overflowX: 'auto',
              paddingBottom: 4,
            }}>
              {QUICK_QUESTIONS.slice(0, 3).map(q => (
                <button
                  key={q}
                  onClick={() => sendChat(q)}
                  disabled={chatLoading}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 16,
                    border: '1px solid rgba(141,89,255,0.25)',
                    background: 'rgba(141,89,255,0.06)',
                    color: '#8b949e',
                    fontSize: 11,
                    cursor: chatLoading ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <textarea
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={limitReached || chatLoading}
              placeholder={
                limitReached
                  ? 'Daily limit reached. Come back tomorrow!'
                  : 'Ask your AI coach anything about your sport...'
              }
              rows={1}
              style={{
                flex: 1,
                padding: '14px 18px',
                borderRadius: 12,
                border: '1px solid rgba(141,89,255,0.3)',
                background: '#0d1117',
                color: '#e6edf3',
                fontSize: 14,
                outline: 'none',
                resize: 'none',
                lineHeight: 1.5,
                maxHeight: 120,
                overflow: 'auto',
                opacity: limitReached ? 0.5 : 1,
                cursor: limitReached ? 'not-allowed' : 'text',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(141,89,255,0.6)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(141,89,255,0.3)' }}
            />
            <button
              onClick={() => sendChat()}
              disabled={!chatInput.trim() || chatLoading || limitReached}
              style={{
                width: 48, height: 48,
                borderRadius: 12,
                border: 'none',
                background: !chatInput.trim() || chatLoading || limitReached
                  ? 'rgba(141,89,255,0.2)'
                  : 'linear-gradient(135deg, #8d59ff, #6334c8)',
                color: '#fff',
                fontSize: 18,
                cursor: !chatInput.trim() || chatLoading || limitReached ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
                boxShadow: !chatInput.trim() || chatLoading || limitReached
                  ? 'none'
                  : '0 4px 12px rgba(141,89,255,0.4)',
              }}
            >
              {chatLoading ? '⏳' : '↑'}
            </button>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: '#8b949e', textAlign: 'center' }}>
            Press Enter to send · Shift+Enter for new line · {questionsLeft} questions remaining
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(141,89,255,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(141,89,255,0.5); }
      `}</style>
    </div>
  )
}
