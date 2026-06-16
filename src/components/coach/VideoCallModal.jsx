import { useState, useEffect, useRef } from 'react'
import useVideoCall from '../../hooks/useVideoCall'
import toast from 'react-hot-toast'

const BG = '#0d1117'
const CARD = '#161b22'
const BORDER = '#21262d'
const PURPLE = '#8d59ff'
const LIME = '#adff2f'

export default function VideoCallModal({ isOpen, onClose, sessionId }) {
  const { peerId, inCall, endCall, localVideoRef, remoteVideoRef } = useVideoCall()
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load messages from localStorage and listen for real-time changes
  useEffect(() => {
    if (!isOpen || !sessionId) return

    const loadMessages = () => {
      const storedMessages = localStorage.getItem(`chat_${sessionId}`)
      if (storedMessages) {
        try {
          setMessages(JSON.parse(storedMessages))
        } catch (e) {
          setMessages([])
        }
      } else {
        setMessages([])
      }
    }

    // Load initial messages
    loadMessages()

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === `chat_${sessionId}`) {
        loadMessages()
      }
    }

    // Poll for updates every 200ms (fallback for same-tab changes)
    const pollInterval = setInterval(loadMessages, 200)

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(pollInterval)
    }
  }, [isOpen, sessionId])

  const copyPeerId = () => {
    navigator.clipboard.writeText(peerId || '')
    setCopiedToClipboard(true)
    setTimeout(() => setCopiedToClipboard(false), 2000)
  }

  const handleClose = () => {
    endCall()
    // Clear chat messages from localStorage when closing
    if (sessionId) {
      localStorage.removeItem(`chat_${sessionId}`)
    }
    setMessages([])
    onClose()
  }

  // Broadcast coach presence when modal opens
  useEffect(() => {
    if (!isOpen) {
      // Clear presence when closing
      if (sessionId) {
        localStorage.removeItem(`tutor_request_${sessionId}`)
      }
      return
    }

    // Announce coach is waiting
    if (sessionId) {
      localStorage.setItem(`tutor_request_${sessionId}`, JSON.stringify({
        timestamp: new Date().toISOString(),
        coach: true
      }))
    }
  }, [isOpen, sessionId])

  // Auto-enable camera when modal opens
  useEffect(() => {
    if (!isOpen) {
      setCameraReady(false)
      return
    }

    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
          setCameraReady(true)
          toast.success('📹 Camera ready!')
        }
      } catch (err) {
        toast.error(`📸 Camera access denied: ${err.message}`)
        setCameraReady(false)
      }
    }

    enableCamera()

    return () => {
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)'
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: '95%',
          maxWidth: 1200,
          background: BG,
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' }}>Live Session</h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: inCall ? LIME : 'rgba(255,255,255,0.5)' }}>
              {inCall ? '✓ Student connected' : '⏳ Waiting for student...'}
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.6)',
              padding: '0 8px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', gap: 16, padding: '16px 24px' }}>

          {/* Left: Video Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
            {/* Video Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1, minHeight: 300 }}>
              {/* Remote Video (Student) */}
              <div
                style={{
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {inCall ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>📱</div>
                    <p style={{ margin: 0, fontSize: 14 }}>Waiting for student to join...</p>
                  </div>
                )}
              </div>

              {/* Local Video (Coach) */}
              <div
                style={{
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 12, background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: 6, color: LIME }}>
                  You (Coach)
                </div>
              </div>
            </div>

            {/* Peer ID Display */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                YOUR PEER ID (Share with student)
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={peerId || 'Loading...'}
                  disabled
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: `1px solid ${BORDER}`,
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 13,
                    fontFamily: 'monospace',
                    fontWeight: 500
                  }}
                />
                <button
                  onClick={copyPeerId}
                  style={{
                    padding: '10px 20px',
                    background: PURPLE,
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 13,
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={e => e.target.style.background = '#7d4be8'}
                  onMouseOut={e => e.target.style.background = PURPLE}
                >
                  {copiedToClipboard ? '✓ Copied' : 'Copy ID'}
                </button>
              </div>
              <p style={{ margin: '10px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                📋 Students will paste this ID in their video call interface to connect with you.
              </p>
            </div>
          </div>

          {/* Right: Chat Section */}
          <div
            style={{
              width: 280,
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Chat Header */}
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 13, fontWeight: 600, color: '#fff' }}>
              💬 Student Messages
            </div>

            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}
            >
              {messages.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
                  No messages yet
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      background: msg.sender === 'student' ? PURPLE + '33' : '#10b98133',
                      border: `1px solid ${msg.sender === 'student' ? PURPLE + '66' : '#10b98166'}`,
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontSize: 12,
                      color: '#fff',
                      wordWrap: 'break-word'
                    }}
                  >
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                      Student • {msg.timestamp}
                    </div>
                    {msg.text}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Info */}
            <div style={{ padding: '12px', borderTop: `1px solid ${BORDER}`, fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
              📖 Read-only<br />Students can send messages
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 12, padding: '16px 24px', borderTop: `1px solid ${BORDER}`, justifyContent: 'flex-end' }}>
          {inCall && (
            <button
              onClick={endCall}
              style={{
                padding: '10px 24px',
                background: '#ef4444',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14,
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.target.style.background = '#dc2626'}
              onMouseOut={e => e.target.style.background = '#ef4444'}
            >
              End Session
            </button>
          )}
          <button
            onClick={handleClose}
            style={{
              padding: '10px 24px',
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={e => e.target.style.background = CARD}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
