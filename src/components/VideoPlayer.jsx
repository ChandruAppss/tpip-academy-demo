import { useState } from 'react'

const BORDER = '#21262d'
const TEXT = '#e6edf3'
const MUTED = 'rgba(230,237,243,0.38)'

/**
 * VideoPlayer Component - HTML5 Video Player
 *
 * Props:
 * - videoUrl: URL to the video file (MP4, WebM, etc.)
 * - title: Video title
 * - description: Optional description
 */

export default function VideoPlayer({ videoUrl, title, description }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const formatTime = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgress = (percent) => {
    const video = document.querySelector('video')
    if (video) video.currentTime = (percent / 100) * duration
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Video Player */}
      <video
        style={{
          width: '100%',
          height: 'auto',
          background: '#000',
          borderRadius: 12,
          display: 'block',
          marginBottom: 16
        }}
        controls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Info */}
      {title && (
        <div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 700, color: TEXT }}>
            {title}
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
            {description || 'Coaching session video'}
          </p>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 8 }}>
            Duration: {formatTime(duration)}
          </div>
        </div>
      )}
    </div>
  )
}
