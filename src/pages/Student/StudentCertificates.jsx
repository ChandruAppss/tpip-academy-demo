import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const earnedCerts = [
  {
    id: 'cert-001',
    program: 'Sports Fitness & Conditioning',
    coach: 'Priya Menon',
    issueDate: 'April 15, 2026',
    certId: 'TPIP-2026-CF-001',
    grade: 'Distinction',
  },
  {
    id: 'cert-002',
    program: 'Batting Fundamentals — Level 1',
    coach: 'Rahul Sharma',
    issueDate: 'March 2, 2026',
    certId: 'TPIP-2026-BF-002',
    grade: 'Merit',
  },
]

const pendingCerts = [
  {
    id: 'pe1',
    program: 'Advanced Performance Techniques',
    coach: 'Rahul Sharma',
    progress: 65,
    lessonsLeft: 6,
  },
  {
    id: 'pe2',
    program: 'Fast Bowling Masterclass',
    coach: 'Vikram Singh',
    progress: 30,
    lessonsLeft: 14,
  },
]

const gradeColors = {
  Distinction: { bg: '#eab30822', color: '#eab308', border: '#eab30844' },
  Merit: { bg: '#3b82f622', color: '#3b82f6', border: '#3b82f644' },
  Pass: { bg: LIME + '22', color: LIME, border: LIME + '44' },
}

export default function StudentCertificates() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '1px' }}>MY CERTIFICATES</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 4, marginBottom: 0, fontSize: 14 }}>Your earned credentials and upcoming completions</p>
      </div>

      {/* Earned Certificates */}
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          🏆 Earned Certificates
          <span style={{
            background: LIME, color: '#000',
            fontSize: 12, padding: '2px 8px', borderRadius: 20, fontWeight: 700,
          }}>
            {earnedCerts.length}
          </span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {earnedCerts.map(cert => {
            const gc = gradeColors[cert.grade] || gradeColors.Pass
            return (
              <div
                key={cert.id}
                style={{
                  background: CARD,
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: `1px solid ${BORDER}`,
                  position: 'relative',
                }}
              >
                {/* Golden top bar */}
                <div style={{
                  background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fde68a 100%)',
                  height: 4,
                }} />

                <div style={{ padding: '24px 24px 20px' }}>
                  {/* Icon + Grade */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 12,
                      background: '#eab30822',
                      border: '1px solid #eab30844',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28,
                    }}>
                      🏆
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: 20,
                      background: gc.bg, color: gc.color,
                      border: `1px solid ${gc.border}`,
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {cert.grade}
                    </span>
                  </div>

                  {/* Program name */}
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 8px', lineHeight: 1.3 }}>
                    {cert.program}
                  </h3>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                      <span style={{ fontWeight: 500 }}>Coach:</span> {cert.coach}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                      <span style={{ fontWeight: 500 }}>Issued:</span> {cert.issueDate}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                      ID: {cert.certId}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => toast.success(`Downloading certificate for "${cert.program}"...`)}
                      style={{
                        flex: 1, padding: '9px 14px', borderRadius: 10,
                        background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                        color: '#000', border: 'none', cursor: 'pointer',
                        fontWeight: 700, fontSize: 13,
                      }}
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => navigate(`/verify/${cert.id}`)}
                      style={{
                        flex: 1, padding: '9px 14px', borderRadius: 10,
                        border: '1px solid #d97706', background: 'transparent',
                        color: '#d97706', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                      }}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pending / In Progress */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
          ⏳ Almost There
          <span style={{
            background: '#eab308', color: '#000',
            fontSize: 12, padding: '2px 8px', borderRadius: 20, fontWeight: 700,
          }}>
            {pendingCerts.length}
          </span>
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 16px' }}>
          Complete these courses to earn your certificates
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {pendingCerts.map(pc => (
            <div
              key={pc.id}
              style={{
                background: CARD, borderRadius: 16, padding: '20px 22px',
                border: `1px dashed ${BORDER}`,
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  background: CARD2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0,
                }}>
                  🎓
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>
                    {pc.program}
                  </h3>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>with {pc.coach}</div>

                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{pc.progress}% complete</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{pc.lessonsLeft} lessons left</span>
                    </div>
                    <div style={{ background: BORDER, borderRadius: 4, height: 8 }}>
                      <div style={{
                        height: '100%', borderRadius: 4,
                        background: '#eab308',
                        width: `${pc.progress}%`,
                      }} />
                    </div>
                  </div>

                  <div style={{
                    display: 'inline-block', background: '#eab30822',
                    color: '#eab308', fontSize: 12, fontWeight: 600,
                    padding: '4px 10px', borderRadius: 20,
                    border: '1px solid #eab30844',
                  }}>
                    {pc.progress}% complete — almost there!
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
