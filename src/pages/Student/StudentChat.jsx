import { useState } from 'react'
import toast from 'react-hot-toast'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const COACHES_INIT = [
  { id: 1, name: 'Ravi Kumar', initials: 'RK', color: '#16a34a', role: 'Batting Coach', online: true,
    messages: [
      { id: 1, from: 'coach', text: 'Great session yesterday! Your cover drive is improving a lot.', time: '9:14 AM' },
      { id: 2, from: 'student', text: 'Thank you coach! I practiced for 2 hours after the session.', time: '9:20 AM' },
      { id: 3, from: 'coach', text: 'That dedication will take you far. For tomorrow, focus on your backlift.', time: '9:22 AM' },
    ]
  },
  { id: 2, name: 'Vikram Singh', initials: 'VS', color: '#7c3aed', role: 'Bowling Coach', online: false,
    messages: [
      { id: 1, from: 'coach', text: 'Please submit your performance video before Friday.', time: 'Yesterday' },
      { id: 2, from: 'student', text: 'Sure coach, will upload today.', time: 'Yesterday' },
    ]
  },
  { id: 3, name: 'Priya Nair', initials: 'PN', color: '#f97316', role: 'Fitness Coach', online: true,
    messages: [
      { id: 1, from: 'coach', text: 'How is your fitness routine going?', time: 'Mon' },
    ]
  },
]

export default function StudentChat() {
  const [coaches, setCoaches] = useState(COACHES_INIT)
  const [selectedId, setSelectedId] = useState(1)
  const [inputText, setInputText] = useState('')

  const selectedCoach = coaches.find(c => c.id === selectedId)

  function getLastMessage(coach) {
    if (!coach.messages.length) return ''
    return coach.messages[coach.messages.length - 1].text
  }

  function getUnread(coach) {
    return coach.messages.filter(m => m.from === 'coach' && coach.id !== selectedId).length % 3
  }

  function sendMessage() {
    const text = inputText.trim()
    if (!text) return
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    const newMsg = { id: Date.now(), from: 'student', text, time: timeStr }
    setCoaches(prev => prev.map(c =>
      c.id === selectedId ? { ...c, messages: [...c.messages, newMsg] } : c
    ))
    setInputText('')
    // Auto-reply after 2 seconds
    setTimeout(() => {
      const replyMsg = { id: Date.now() + 1, from: 'coach', text: "Thanks for your message! I'll get back to you shortly. 🏏", time: timeStr }
      setCoaches(prev => prev.map(c =>
        c.id === selectedId ? { ...c, messages: [...c.messages, replyMsg] } : c
      ))
    }, 2000)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* LEFT SIDEBAR */}
      <div style={{ width: 280, background: CARD, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Sidebar header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: '0.5px', marginBottom: 12 }}>💬 MESSAGES</div>
          <button
            onClick={() => toast.success('Start a new conversation!')}
            style={{ width: '100%', padding: '9px', background: LIME, color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            + New Message
          </button>
        </div>

        {/* Coach list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {coaches.map(coach => {
            const isActive = coach.id === selectedId
            const unread = getUnread(coach)
            return (
              <div
                key={coach.id}
                onClick={() => setSelectedId(coach.id)}
                style={{
                  padding: '14px 16px',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${BORDER}`,
                  borderLeft: isActive ? `3px solid ${LIME}` : '3px solid transparent',
                  background: isActive ? CARD2 : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'background 0.15s',
                }}
              >
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: coach.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>
                    {coach.initials}
                  </div>
                  {coach.online && (
                    <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: `2px solid ${CARD}` }} />
                  )}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{coach.name}</span>
                    {unread > 0 && !isActive && (
                      <span style={{ background: LIME, color: '#000', fontWeight: 700, fontSize: 11, borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{unread}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getLastMessage(coach)}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: BG }}>
        {/* Top bar */}
        <div style={{ padding: '14px 24px', borderBottom: `1px solid ${BORDER}`, background: CARD, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: selectedCoach.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>
              {selectedCoach.initials}
            </div>
            {selectedCoach.online && (
              <div style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: '#22c55e', border: `2px solid ${CARD}` }} />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>{selectedCoach.name}</div>
            <div style={{ fontSize: 13, color: selectedCoach.online ? '#22c55e' : 'rgba(255,255,255,0.4)' }}>
              {selectedCoach.online ? '🟢 Online' : '⚫ Offline'} · {selectedCoach.role}
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div style={{ padding: '8px 24px', background: 'rgba(59,130,246,0.1)', borderBottom: '1px solid rgba(59,130,246,0.2)' }}>
          <span style={{ fontSize: 12, color: '#60a5fa' }}>ℹ️ Coach will reply within 24 hours. Messages are monitored by TPIP for quality assurance.</span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {selectedCoach.messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'student' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                background: msg.from === 'student' ? LIME : CARD2,
                color: msg.from === 'student' ? '#000' : '#fff',
                borderRadius: msg.from === 'student' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                fontSize: 14,
                lineHeight: 1.5,
                fontWeight: msg.from === 'student' ? 500 : 400,
              }}>
                {msg.text}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, paddingInline: 4 }}>{msg.time}</div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${BORDER}`, background: CARD, display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type your message..."
            style={{ flex: 1, background: BG, border: `1px solid ${BORDER}`, borderRadius: 24, padding: '11px 18px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'inherit' }}
          />
          <button
            onClick={sendMessage}
            style={{ width: 44, height: 44, borderRadius: '50%', background: LIME, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
