import { useState, useEffect, useRef } from 'react'
import Peer from 'peerjs'

export default function useVideoCall() {
  const [peerId, setPeerId] = useState(null)
  const [connected, setConnected] = useState(false)
  const [remoteStream, setRemoteStream] = useState(null)
  const [localStream, setLocalStream] = useState(null)
  const [error, setError] = useState(null)
  const [inCall, setInCall] = useState(false)

  const peerRef = useRef(null)
  const callRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  // Initialize PeerJS
  useEffect(() => {
    const peer = new Peer({
      config: {
        iceServers: [
          // Google STUN servers
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },

          // TURN servers (for NAT traversal)
          {
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject'
          },
          {
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject'
          },
          {
            urls: 'turn:openrelay.metered.ca:3478',
            username: 'openrelayproject',
            credential: 'openrelayproject'
          },
          {
            urls: 'turn:openrelay.metered.ca:3479',
            username: 'openrelayproject',
            credential: 'openrelayproject'
          }
        ]
      }
    })

    peer.on('open', (id) => {
      setPeerId(id)
      setConnected(true)
    })

    peer.on('call', async (call) => {
      try {
        // Use existing stream from localVideoRef if available, otherwise get new stream
        let stream = localStream

        if (!stream && localVideoRef.current?.srcObject) {
          // Stream is already playing in video element, reuse it
          stream = localVideoRef.current.srcObject
          setLocalStream(stream)
        } else if (!stream) {
          // No existing stream, get a new one
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          setLocalStream(stream)
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }
        }

        call.answer(stream)

        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream)
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream
          }
          setInCall(true)
        })

        call.on('close', () => {
          endCall()
        })

        callRef.current = call
      } catch (err) {
        setError(err.message)
      }
    })

    peer.on('error', (err) => {
      let errorMsg = err.message

      // Provide more helpful error messages
      if (err.type === 'peer-unavailable') {
        errorMsg = 'Could not connect: Peer is not available. Make sure peer ID is correct.'
      } else if (err.type === 'network') {
        errorMsg = 'Network error: Check your internet connection'
      } else if (err.message?.includes('Could not connect')) {
        errorMsg = 'WebRTC connection failed. This may be a firewall/NAT issue. Try on a different network.'
      }

      console.error('PeerJS Error:', err.type, err.message)
      setError(errorMsg)
    })

    peerRef.current = peer

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy()
      }
    }
  }, [])

  const startCall = async (remotePeerId) => {
    if (!remotePeerId || !peerRef.current) return

    try {
      // Use existing stream from localVideoRef if available, otherwise get new stream
      let stream = localStream

      if (!stream && localVideoRef.current?.srcObject) {
        // Stream is already playing in video element, reuse it
        stream = localVideoRef.current.srcObject
        setLocalStream(stream)
      } else if (!stream) {
        // No existing stream, get a new one
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setLocalStream(stream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      }

      const call = peerRef.current.call(remotePeerId, stream)

      call.on('stream', (remoteStream) => {
        setRemoteStream(remoteStream)
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream
        }
        setInCall(true)
      })

      call.on('close', () => {
        endCall()
      })

      call.on('error', (err) => {
        setError(err.message)
      })

      callRef.current = call
    } catch (err) {
      setError(err.message)
    }
  }

  const endCall = () => {
    if (callRef.current) {
      callRef.current.close()
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }

    setRemoteStream(null)
    setInCall(false)

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
  }

  return {
    peerId,
    connected,
    remoteStream,
    localStream,
    error,
    inCall,
    startCall,
    endCall,
    localVideoRef,
    remoteVideoRef
  }
}
