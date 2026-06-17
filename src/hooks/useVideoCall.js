import { useState, useEffect, useRef, useCallback } from 'react'
import Peer from 'peerjs'

export default function useVideoCall() {
  const [peerId,      setPeerId]      = useState(null)
  const [inCall,      setInCall]      = useState(false)
  const [error,       setError]       = useState(null)
  const [isMuted,     setIsMuted]     = useState(false)
  const [isCamOff,    setIsCamOff]    = useState(false)
  const [cameraReady, setCameraReady] = useState(false)

  const peerRef        = useRef(null)
  const callRef        = useRef(null)
  const localStreamRef = useRef(null)
  const localVideoRef  = useRef(null)
  const remoteVideoRef = useRef(null)

  const stopLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop())
      localStreamRef.current = null
    }
    if (localVideoRef.current)  localVideoRef.current.srcObject  = null
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
    setCameraReady(false)
  }

  // Call once when modal opens to pre-warm camera + mic
  const initCamera = useCallback(async () => {
    try {
      if (localStreamRef.current) return // already open
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 }
      })
      localStreamRef.current = stream
      if (localVideoRef.current) localVideoRef.current.srcObject = stream
      setCameraReady(true)
      setError(null)
      return stream
    } catch (err) {
      const msg = err.name === 'NotAllowedError'
        ? 'Camera/mic access denied. Please allow permissions and reload.'
        : err.name === 'NotFoundError'
          ? 'No camera/mic found. Please connect a device.'
          : err.message
      setError(msg)
      setCameraReady(false)
      return null
    }
  }, [])

  // PeerJS init
  useEffect(() => {
    const peer = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'turn:openrelay.metered.ca:80',   username: 'openrelayproject', credential: 'openrelayproject' },
          { urls: 'turn:openrelay.metered.ca:443',  username: 'openrelayproject', credential: 'openrelayproject' },
          { urls: 'turn:openrelay.metered.ca:3478', username: 'openrelayproject', credential: 'openrelayproject' },
        ]
      }
    })

    peer.on('open', id => setPeerId(id))

    // Coach receives incoming call from student
    peer.on('call', async call => {
      try {
        const stream = localStreamRef.current || await initCamera()
        if (!stream) { setError('Could not access camera to answer call'); return }
        call.answer(stream)
        call.on('stream', remote => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote
          setInCall(true)
        })
        call.on('close', () => endCall())
        callRef.current = call
      } catch (err) {
        setError(err.message)
      }
    })

    peer.on('error', err => {
      const map = {
        'peer-unavailable': 'Peer not found. Check the ID and try again.',
        'network': 'Network error — check your internet connection.',
        'disconnected': 'Disconnected from signalling server.'
      }
      setError(map[err.type] || err.message)
    })

    peerRef.current = peer
    return () => peer.destroy()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Student calls coach
  const startCall = async (remotePeerId) => {
    if (!remotePeerId?.trim() || !peerRef.current) return
    try {
      const stream = localStreamRef.current || await initCamera()
      if (!stream) return
      const call = peerRef.current.call(remotePeerId.trim(), stream)
      call.on('stream', remote => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote
        setInCall(true)
      })
      call.on('close', () => endCall())
      call.on('error', err => setError(err.message))
      callRef.current = call
    } catch (err) {
      setError(err.message)
    }
  }

  const endCall = () => {
    if (callRef.current) { callRef.current.close(); callRef.current = null }
    stopLocalStream()
    setInCall(false)
    setIsMuted(false)
    setIsCamOff(false)
  }

  const toggleMic = () => {
    if (!localStreamRef.current) return
    const audioTracks = localStreamRef.current.getAudioTracks()
    if (!audioTracks.length) return
    const next = !isMuted
    audioTracks.forEach(t => { t.enabled = !next })
    setIsMuted(next)
  }

  const toggleCamera = () => {
    if (!localStreamRef.current) return
    const videoTracks = localStreamRef.current.getVideoTracks()
    if (!videoTracks.length) return
    const next = !isCamOff
    videoTracks.forEach(t => { t.enabled = !next })
    setIsCamOff(next)
    if (localVideoRef.current) localVideoRef.current.style.opacity = next ? '0.15' : '1'
  }

  return {
    peerId, inCall, error, isMuted, isCamOff, cameraReady,
    initCamera, startCall, endCall, toggleMic, toggleCamera,
    localVideoRef, remoteVideoRef,
  }
}
