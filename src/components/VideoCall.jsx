import { useState, useEffect, useRef } from 'react'
import Peer from 'peerjs'
import toast from 'react-hot-toast'

const BG = '#0d1117'
const CARD = '#161b22'
const BORDER = '#21262d'
const ACCENT = '#adff2f'
const TEXT = '#e6edf3'
const MUTED = 'rgba(230,237,243,0.38)'

/**
 * VideoCall Component - PeerJS Live Video Call
 *
 * Props:
 * - mode: 'coach' | 'student'
 * - sessionId: unique session identifier
 * - studentName: student's name
 * - coachName: coach's name
 * - onEndCall: callback when call ends
 */

export default function VideoCall({ mode = 'student', sessionId, studentName = 'Student', coachName = 'Coach', onEndCall }) {
  const [peer, setPeer] = useState(null)
  const [peerId, setPeerId] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [remoteStreamReady, setRemoteStreamReady] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerRef = useRef(null)
  const callRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)

  // Initialize PeerJS
  useEffect(() => {
    const initPeer = async () => {
      try {
        // Generate room ID based on session
        const room = `tpip-${mode}-${sessionId}`
        setRoomId(room)

        // Create peer instance with TURN server for better connectivity
        const newPeer = new Peer({
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              {
                urls: 'turn:openrelay.metered.ca:80',
                username: 'openrelayproject',
                credential: 'openrelayproject'
              }
            ]
          }
        })

        peerRef.current = newPeer

        newPeer.on('open', (id) => {
          setPeerId(id)
          console.log(`${mode} peer ID: ${id}`)
        })

        // Student: Initiate call
        if (mode === 'student') {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true
          })
          streamRef.current = stream

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }

          // Wait for peer to open, then call coach
          newPeer.on('open', () => {
            // Coach's room ID would be stored in session data
            // For now, we'll use a preset format
            const coachRoomId = `tpip-coach-${sessionId}`

            setTimeout(() => {
              const call = newPeer.call(coachRoomId, stream)
              callRef.current = call

              call.on('stream', (remoteStream) => {
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = remoteStream
                }
                setRemoteStreamReady(true)
                setConnected(true)
                toast.success('Connected to coach!')
                startTimer()
              })

              call.on('close', () => {
                handleEndCall()
              })

              call.on('error', (err) => {
                console.error('Call error:', err)
                toast.error('Call error: ' + err.message)
              })
            }, 500)
          })
        }

        // Coach: Answer incoming calls
        if (mode === 'coach') {
          newPeer.on('call', async (call) => {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { width: { ideal: 1280 }, height: { ideal: 720 } },
              audio: true
            })
            streamRef.current = stream

            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream
            }

            call.answer(stream)
            callRef.current = call

            call.on('stream', (remoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream
              }
              setRemoteStreamReady(true)
              setConnected(true)
              toast.success('Student connected!')
              startTimer()
            })

            call.on('close', () => {
              handleEndCall()
            })

            call.on('error', (err) => {
              console.error('Call error:', err)
              toast.error('Call error: ' + err.message)
            })
          })
        }

        setPeer(newPeer)
        setLoading(false)
      } catch (err) {
        console.error('Failed to initialize peer:', err)
        toast.error('Camera/microphone access denied: ' + err.message)
        setLoading(false)
      }
    }

    initPeer()

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy()
      }
    }
  }, [mode, sessionId])

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
  }

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    if (timerRef.current) clearInterval(timerRef.current)

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (callRef.current) {
      callRef.current.close()
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }

    setConnected(false)
    setRemoteStreamReady(false)

    if (onEndCall) {
      onEndCall({ duration: callDuration, sessionId })
    }

    toast.success('Call ended')
  }

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        background: BG,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${BORDER}`
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📹</div>
          <div style={{ color: TEXT, fontSize: 14, fontWeight: 600 }}>Initializing camera...</div>
          <div style={{ color: MUTED, fontSize: 12, marginTop: 6 }}>Please allow camera access</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#000',
      borderRadius: 12,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${BORDER}`
    }}>
      {/* Remote Video (main) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          background: '#000'
        }}
      />

      {/* Local Video (PiP) */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          width: 120,
          height: 120,
          borderRadius: 10,
          background: '#000',
          border: `2px solid ${BORDER}`,
          objectFit: 'cover'
        }}
      />

      {/* Top Status Bar */}
      {connected && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid rgba(173,255,47,0.2)`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: ACCENT,
              boxShadow: `0 0 8px ${ACCENT}`,
              animation: 'pulse 2s infinite'
            }} />
            <div style={{ color: TEXT, fontWeight: 600, fontSize: 13 }}>
              {mode === 'student' ? `Connected to ${coachName}` : `Connected to ${studentName}`}
            </div>
          </div>
          <div style={{ color: ACCENT, fontWeight: 700, fontSize: 12 }}>
            {formatDuration(callDuration)}
          </div>
        </div>
      )}

      {/* No Remote Stream State */}
      {!remoteStreamReady && connected === false && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          <div style={{ textAlign: 'center', color: TEXT }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              {mode === 'student' ? 'Calling coach...' : 'Waiting for student...'}
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 8 }}>
              {mode === 'coach' && peerId && (
                <>
                  <div>Your Room ID:</div>
                  <div style={{
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 6,
                    padding: '8px 12px',
                    marginTop: 8,
                    fontFamily: 'monospace',
                    fontSize: 11,
                    color: ACCENT,
                    fontWeight: 700
                  }}>
                    {peerId}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      {connected && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          borderTop: `1px solid rgba(173,255,47,0.2)`
        }}>
          <button
            onClick={handleEndCall}
            style={{
              background: '#f97316',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 20px',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#ea580c'}
            onMouseOut={(e) => e.target.style.background = '#f97316'}
          >
            End Call
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
