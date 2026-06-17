import { useState, useEffect, useRef } from 'react'
import useVideoCall from '../../hooks/useVideoCall'
import toast from 'react-hot-toast'

const BG     = '#0d1117'
const CARD   = '#161b22'
const CARD2  = '#1c2128'
const BORDER = '#21262d'
const PURPLE = '#8d59ff'
const LIME   = '#adff2f'
const RED    = '#ef4444'
const MUTED  = 'rgba(255,255,255,0.45)'

export default function VideoCallModal({ isOpen, onClose, remotePeerId, sessionId }) {
  const {
    peerId, inCall, error, isMuted, isCamOff, cameraReady,
    initCamera, startCall, endCall, toggleMic, toggleCamera,
    localVideoRef, remoteVideoRef,
  } = useVideoCall()

  const [roomInput,  setRoomInput]  = useState(remotePeerId || '')
  const [copied,     setCopied]     = useState(false)
  const [messages,   setMessages]   = useState([])
  const [msgInput,   setMsgInput]   = useState('')
  const messagesEndRef = useRef(null)

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Init camera when modal opens
  useEffect(() => {
    if (!isOpen) return
    initCamera().then(ok => {
      if (ok) toast.success('Camera and mic ready')
    })
    // Announce student waiting
    if (sessionId) {
      localStorage.setItem(`student_request_${sessionId}`, JSON.stringify({ timestamp: new Date().toISOString() }))
    }
  }, [isOpen])

  // Sync chat via localStorage polling
  useEffect(() => {
    if (!isOpen || !sessionId) return
    const load = () => {
      try { setMessages(JSON.parse(localStorage.getItem(`chat_${sessionId}`) || '[]')) } catch { setMessages([]) }
    }
    load()
    const id = setInterval(load, 200)
    const onStorage = e => { if (e.key === `chat_${sessionId}`) load() }
    window.addEventListener('storage', onStorage)
    return () => { clearInterval(id); window.removeEventListener('storage', onStorage) }
  }, [isOpen, sessionId])

  const handleSend = () => {
    if (!msgInput.trim()) return
    const msg = { id: Date.now(), sender: 'student', text: msgInput.trim(), timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
    const next = [...messages, msg]
    setMessages(next)
    setMsgInput('')
    if (sessionId) localStorage.setItem(`chat_${sessionId}`, JSON.stringify(next))
  }

  const copyId = () => {
    navigator.clipboard.writeText(peerId || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Peer ID copied!')
  }

  const handleClose = () => {
    endCall()
    if (sessionId) {
      localStorage.removeItem(`chat_${sessionId}`)
      localStorage.removeItem(`student_request_${sessionId}`)
    }
    setMessages([])
    onClose()
  }

  const handleStartCall = () => {
    if (!roomInput.trim()) { toast.error('Enter your coach peer ID first'); return }
    startCall(roomInput)
  }

  if (!isOpen) return null

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)' }}
      onClick={handleClose}>
      <div style={{ width:'95%', maxWidth:1200, background:BG, border:`1px solid ${BORDER}`, borderRadius:16, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.7)', display:'flex', flexDirection:'column', maxHeight:'92vh' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px', borderBottom:`1px solid ${BORDER}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background: inCall ? LIME : cameraReady ? '#f59e0b' : '#6b7280', boxShadow: inCall ? `0 0 8px ${LIME}` : 'none', animation: inCall ? 'pulse 2s infinite' : 'none' }}/>
            <div>
              <div style={{ fontSize:18, fontWeight:700, color:'#fff' }}>Live Video Session</div>
              <div style={{ fontSize:12, color: inCall ? LIME : MUTED }}>
                {inCall ? 'Connected to coach' : cameraReady ? 'Camera ready — enter coach ID to call' : 'Initialising camera…'}
              </div>
            </div>
          </div>
          <button onClick={handleClose} style={{ background:'transparent', border:'none', fontSize:22, cursor:'pointer', color:MUTED, padding:'0 4px' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ display:'flex', flex:1, overflow:'hidden', gap:16, padding:'16px 24px' }}>

          {/* Video area */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12, minWidth:0 }}>

            {/* Video grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, flex:1, minHeight:300 }}>

              {/* Remote (coach) */}
              <div style={{ background:'#000', borderRadius:12, overflow:'hidden', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${BORDER}` }}>
                <video ref={remoteVideoRef} autoPlay playsInline style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                {!inCall && (
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.7)', color:MUTED, textAlign:'center', gap:10 }}>
                    <div style={{ fontSize:38 }}>📹</div>
                    <div style={{ fontSize:14, fontWeight:600, color:'#fff' }}>Waiting for coach…</div>
                    <div style={{ fontSize:12 }}>Enter the coach peer ID below to connect</div>
                  </div>
                )}
                <div style={{ position:'absolute', bottom:10, left:12, fontSize:11, background:'rgba(0,0,0,0.65)', padding:'3px 8px', borderRadius:5, color:MUTED }}>Coach</div>
              </div>

              {/* Local (student) */}
              <div style={{ background:'#000', borderRadius:12, overflow:'hidden', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${BORDER}` }}>
                <video ref={localVideoRef} autoPlay muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover', transition:'opacity 0.3s' }}/>
                {!cameraReady && (
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.8)', color:MUTED, fontSize:13 }}>
                    Starting camera…
                  </div>
                )}
                <div style={{ position:'absolute', bottom:10, left:12, fontSize:11, background:'rgba(0,0,0,0.65)', padding:'3px 8px', borderRadius:5, color:LIME }}>You</div>
                {isCamOff && (
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.8)', fontSize:32 }}>🚫</div>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background:`${RED}22`, border:`1px solid ${RED}55`, borderRadius:8, padding:'10px 14px', fontSize:13, color:'#fca5a5', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span>⚠ {error}</span>
                <button onClick={() => initCamera()} style={{ background:`${RED}33`, border:'none', color:'#fff', padding:'4px 10px', borderRadius:5, cursor:'pointer', fontSize:12 }}>Retry</button>
              </div>
            )}

            {/* Controls */}
            <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              {/* Mic toggle */}
              <button onClick={toggleMic} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:10, border:`1px solid ${isMuted ? RED+'66' : BORDER}`, background: isMuted ? `${RED}18` : CARD2, color: isMuted ? '#fca5a5' : '#fff', fontWeight:600, fontSize:13, cursor:'pointer', transition:'all 0.15s' }}>
                {isMuted ? '🔇 Unmute' : '🎤 Mute'}
              </button>
              {/* Camera toggle */}
              <button onClick={toggleCamera} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:10, border:`1px solid ${isCamOff ? RED+'66' : BORDER}`, background: isCamOff ? `${RED}18` : CARD2, color: isCamOff ? '#fca5a5' : '#fff', fontWeight:600, fontSize:13, cursor:'pointer', transition:'all 0.15s' }}>
                {isCamOff ? '📵 Camera Off' : '📷 Camera On'}
              </button>
              {/* End call */}
              {inCall && (
                <button onClick={handleClose} style={{ padding:'9px 24px', background:RED, border:'none', borderRadius:10, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}>
                  📵 End Call
                </button>
              )}
            </div>

            {/* Connect panel (pre-call) */}
            {!inCall && (
              <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:12, padding:16, display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:MUTED, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.8px' }}>Your Peer ID</label>
                  <div style={{ display:'flex', gap:8 }}>
                    <input value={peerId || 'Loading…'} disabled style={{ flex:1, padding:'9px 12px', background:'rgba(0,0,0,0.4)', border:`1px solid ${BORDER}`, borderRadius:8, color:'#fff', fontSize:12, fontFamily:'monospace' }}/>
                    <button onClick={copyId} style={{ padding:'9px 16px', background:PURPLE, border:'none', borderRadius:8, color:'#fff', fontWeight:600, cursor:'pointer', fontSize:13, whiteSpace:'nowrap' }}>
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div style={{ fontSize:11, color:MUTED, marginTop:6 }}>Share this with your coach so they can accept your call</div>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:MUTED, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.8px' }}>Coach Peer ID</label>
                  <div style={{ display:'flex', gap:8 }}>
                    <input value={roomInput} onChange={e => setRoomInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleStartCall()} placeholder="Paste coach peer ID here…"
                      style={{ flex:1, padding:'9px 12px', background:'rgba(0,0,0,0.4)', border:`1px solid ${BORDER}`, borderRadius:8, color:'#fff', fontSize:12, fontFamily:'monospace', outline:'none' }}
                      onFocus={e => e.target.style.borderColor = PURPLE}
                      onBlur={e  => e.target.style.borderColor = BORDER}/>
                    <button onClick={handleStartCall} style={{ padding:'9px 24px', background:LIME, border:'none', borderRadius:8, color:'#000', fontWeight:700, cursor:'pointer', fontSize:13, whiteSpace:'nowrap' }}>
                      📞 Call Coach
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat sidebar */}
          <div style={{ width:280, background:CARD, border:`1px solid ${BORDER}`, borderRadius:12, display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0 }}>
            <div style={{ padding:'12px 16px', borderBottom:`1px solid ${BORDER}`, fontSize:13, fontWeight:600, color:'#fff' }}>💬 Session Chat</div>
            <div style={{ flex:1, overflowY:'auto', padding:12, display:'flex', flexDirection:'column', gap:8 }}>
              {messages.length === 0
                ? <div style={{ color:MUTED, fontSize:12, textAlign:'center', margin:'auto' }}>No messages yet</div>
                : messages.map(msg => (
                  <div key={msg.id} style={{ background: msg.sender === 'student' ? `${PURPLE}33` : `${LIME}18`, border:`1px solid ${msg.sender === 'student' ? PURPLE+'55' : LIME+'40'}`, borderRadius:8, padding:'8px 10px', fontSize:12, color:'#fff', wordBreak:'break-word' }}>
                    <div style={{ fontSize:10, color:MUTED, marginBottom:3 }}>{msg.sender === 'student' ? 'You' : 'Coach'} · {msg.timestamp}</div>
                    {msg.text}
                  </div>
                ))
              }
              <div ref={messagesEndRef}/>
            </div>
            <div style={{ padding:'10px 10px', borderTop:`1px solid ${BORDER}`, display:'flex', gap:8 }}>
              <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message…"
                style={{ flex:1, padding:'8px 10px', background:'rgba(0,0,0,0.4)', border:`1px solid ${BORDER}`, borderRadius:6, color:'#fff', fontSize:12, outline:'none' }}
                onFocus={e => e.target.style.borderColor = PURPLE}
                onBlur={e  => e.target.style.borderColor = BORDER}/>
              <button onClick={handleSend} style={{ padding:'8px 12px', background:LIME, border:'none', borderRadius:6, color:'#000', fontWeight:700, cursor:'pointer', fontSize:12 }}>Send</button>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  )
}
