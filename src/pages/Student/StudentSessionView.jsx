import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../../components/VideoPlayer'
import { studentAPI } from '../../services/api'
import toast from 'react-hot-toast'

const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'
const ACCENT = '#adff2f'
const TEXT = '#e6edf3'
const MUTED = 'rgba(230,237,243,0.38)'

export default function StudentSessionView() {
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const loadSession = async () => {
      try {
        // Fetch session details from API
        const response = await studentAPI.getSession(sessionId)
        setSession(response.data)
        setLoading(false)
      } catch (err) {
        toast.error('Failed to load session')
        setLoading(false)
      }
    }

    loadSession()
  }, [sessionId])

  const handleSaveNotes = () => {
    toast.success('Notes saved!')
  }

  if (loading) {
    return (
      <div style={{
        padding: '26px 30px',
        minHeight: '100vh',
        background: BG,
        fontFamily: "'Inter',-apple-system,system-ui,sans-serif",
        color: TEXT
      }}>
        <div style={{ fontSize: 32 }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '26px 30px',
      minHeight: '100vh',
      background: BG,
      fontFamily: "'Inter',-apple-system,system-ui,sans-serif",
      color: TEXT
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
          {session?.title || 'Coaching Session'}
        </h1>
        <p style={{ margin: 0, color: MUTED, fontSize: 13 }}>
          📅 {session?.scheduled_at ? new Date(session.scheduled_at).toLocaleString('en-IN') : 'TBD'}
        </p>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Video Section */}
        <div style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          overflow: 'hidden',
          padding: 20
        }}>
          {session?.video_url ? (
            <VideoPlayer
              videoUrl={session.video_url}
              title={session.title}
              description={`Recorded on ${new Date(session.scheduled_at).toLocaleDateString('en-IN')}`}
            />
          ) : (
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              textAlign: 'center',
              minHeight: 320
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Video not yet available</div>
              <p style={{ color: MUTED, fontSize: 13, marginBottom: 20 }}>
                Your coach will upload the session recording here once it's ready.
              </p>
              <div style={{ fontSize: 12, color: MUTED }}>
                Check back soon! 👀
              </div>
            </div>
          )}
        </div>

        {/* Info & Notes Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          {/* Session Info */}
          <div style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 20
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Session Details
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: MUTED }}>Coach</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{session?.coach?.name || 'TBD'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: MUTED }}>Duration</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>60 minutes</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: MUTED }}>Session Type</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{session?.title?.split(' - ')[0] || 'Coaching'}</div>
              </div>
            </div>
          </div>

          {/* Session Notes */}
          <div style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 20,
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Your Notes
            </div>
            <textarea
              placeholder="Add your notes about this session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                flex: 1,
                minHeight: 150,
                background: CARD2,
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                color: TEXT,
                padding: 12,
                fontFamily: 'inherit',
                fontSize: 13,
                resize: 'none',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSaveNotes}
              style={{
                background: ACCENT,
                color: '#000',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: 12,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>📅 Scheduled</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>
              {session?.scheduled_at ? new Date(session.scheduled_at).toLocaleDateString('en-IN') : 'TBD'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>👨‍🏫 Coach</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{session?.coach?.name || 'TBD'}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>⏱️ Duration</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>60 minutes</div>
          </div>
        </div>
      </div>
    </div>
  )
}
