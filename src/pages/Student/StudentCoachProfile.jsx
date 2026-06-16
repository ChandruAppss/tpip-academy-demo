import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const mockCoaches = {
  1: {
    id: 1, name: 'Ravi Kumar', specialization: ['Batting', 'Power Hitting'], rating: 4.9, price: 2999, location: 'Mumbai, Maharashtra', initials: 'RK', color: LIME,
    bio: 'Ravi Kumar is a former professional athlete with over 15 years of professional playing and coaching experience. Having competed at state and national level for 8 seasons, Ravi brings a unique blend of technical expertise and real-match experience to his students. He specializes in performance technique, helping athletes build a solid foundation while developing their competitive game.',
    philosophy: 'I believe every student has a natural game that must be nurtured, not forced. My coaching philosophy centers on building confidence through repetition, analyzing weaknesses scientifically, and making training enjoyable. I focus on both the technical and mental aspects of performance.',
    achievements: ['Former State & National Level Athlete (2006-2014)', 'Multiple championship titles in competitive sport', 'Certified Nationally Certified Coach', 'Trained 5 athletes who went on to compete at State level', 'Best Coach Award — TPIP Sports Academy (2021, 2023)'],
    stats: { students: 124, sessions: 1420, rating: 4.9, experience: 15 },
    availability: { Mon: ['Morning', 'Evening'], Tue: ['Morning', 'Afternoon'], Wed: [], Thu: ['Evening'], Fri: ['Morning', 'Evening'], Sat: ['Morning', 'Afternoon', 'Evening'], Sun: ['Afternoon'] },
    programs: [
      { id: 1, name: '30-Day Batting Bootcamp', duration: '30 days', price: 5999, enrolled: 48, spots: 20 },
      { id: 2, name: 'Power Hitting Workshop', duration: '2 weeks', price: 3499, enrolled: 27, spots: 8 },
      { id: 3, name: 'One-on-One Mentorship', duration: '1 month', price: 8999, enrolled: 12, spots: 3 },
    ],
    reviews: [
      { id: 1, student: 'Akash M.', initials: 'AM', rating: 5, text: 'Coach Ravi completely transformed my performance technique. My footwork has improved dramatically and I scored my first century in our club tournament!', date: 'Apr 2025', color: LIME },
      { id: 2, student: 'Siddharth R.', initials: 'SR', rating: 5, text: 'Best investment I have made in my sports career. The structured approach and regular feedback sessions are invaluable. Highly recommend!', date: 'Mar 2025', color: '#a855f7' },
      { id: 3, student: 'Tanvi K.', initials: 'TK', rating: 4, text: 'Really knowledgeable coach. The video analysis sessions helped me identify issues I never knew I had. Great communication throughout.', date: 'Feb 2025', color: '#f97316' },
      { id: 4, student: 'Rohan P.', initials: 'RP', rating: 5, text: 'Ravi sir is incredibly patient and detail-oriented. He customized the entire program around my specific weaknesses. Outstanding results in 2 months.', date: 'Jan 2025', color: '#06b6d4' },
    ],
  },
}

const defaultCoach = {
  id: 0, name: 'Coach Profile', specialization: ['Multi-Sport'], rating: 4.5, price: 2499, location: 'India', initials: 'CP', color: LIME,
  bio: 'An experienced sports coach dedicated to developing the next generation of athletes.',
  philosophy: 'Building excellence through discipline, practice, and passion for the game.',
  achievements: ['Nationally Certified Coach', 'Multiple state-level achievements'],
  stats: { students: 48, sessions: 320, rating: 4.5, experience: 10 },
  availability: { Mon: ['Morning'], Tue: ['Evening'], Wed: ['Morning', 'Evening'], Thu: [], Fri: ['Afternoon'], Sat: ['Morning', 'Afternoon'], Sun: [] },
  programs: [{ id: 1, name: 'Sports Fundamentals', duration: '4 weeks', price: 3999, enrolled: 30, spots: 10 }],
  reviews: [{ id: 1, student: 'Student A', initials: 'SA', rating: 5, text: 'Great coaching experience!', date: 'May 2025', color: LIME }],
}

function StarRating({ rating, size = 16 }) {
  return (
    <span style={{ color: '#eab308', fontSize: size + 'px' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: (size - 2) + 'px', marginLeft: 4 }}>{rating}</span>
    </span>
  )
}

export default function StudentCoachProfile() {
  const { coachId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('about')
  const coach = mockCoaches[coachId] || defaultCoach
  const slots = ['Morning', 'Afternoon', 'Evening']
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff', paddingBottom: 100 }}>

      <button onClick={() => navigate('/student/discover')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer', padding: '6px 0', marginBottom: 20, fontWeight: 500 }}>
        ← Back to Discover
      </button>

      {/* Profile hero */}
      <div style={{ background: CARD, borderRadius: 20, padding: 32, border: `1px solid ${BORDER}`, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: coach.color, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 28, flexShrink: 0, boxShadow: `0 4px 12px ${coach.color}40` }}>
            {coach.initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>{coach.name}</h1>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {coach.specialization.map(spec => (
                    <span key={spec} style={{ background: coach.color + '20', color: coach.color, fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{spec}</span>
                  ))}
                </div>
                <StarRating rating={coach.rating} size={18} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: LIME }}>₹{coach.price.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>per month</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>📍 {coach.location}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0', lineHeight: 1.6 }}>
              {coach.bio.slice(0, 160)}...
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Students Coached', value: coach.stats.students, icon: '👥', color: LIME },
          { label: 'Sessions Given', value: coach.stats.sessions, icon: '📅', color: '#a855f7' },
          { label: 'Avg Rating', value: coach.stats.rating + '★', icon: '⭐', color: '#eab308' },
          { label: 'Years Experience', value: coach.stats.experience, icon: '🏏', color: '#06b6d4' },
        ].map(stat => (
          <div key={stat.label} style={{ background: CARD, borderRadius: 14, padding: 20, border: `1px solid ${BORDER}`, textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ background: CARD, borderRadius: 20, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
          {['about', 'programs', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: 16, border: 'none', background: activeTab === tab ? CARD2 : CARD, color: activeTab === tab ? coach.color : 'rgba(255,255,255,0.5)', fontWeight: activeTab === tab ? 700 : 500, fontSize: 14, cursor: 'pointer', borderBottom: activeTab === tab ? `3px solid ${coach.color}` : '3px solid transparent', textTransform: 'capitalize' }}>
              {tab === 'about' ? '📋 About' : tab === 'programs' ? '🎓 Programs' : '⭐ Reviews'}
            </button>
          ))}
        </div>

        <div style={{ padding: 28 }}>
          {/* About tab */}
          {activeTab === 'about' && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: '0 0 12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Full Bio</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>{coach.bio}</p>
              </div>
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: '0 0 12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Teaching Philosophy</h3>
                <div style={{ background: coach.color + '10', border: `1px solid ${coach.color}30`, borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>"{coach.philosophy}"</p>
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: '0 0 12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Achievements</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {coach.achievements.map((ach, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ color: LIME, fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: '0 0 16px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Availability</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 4 }}>
                    <thead>
                      <tr>
                        <th style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, padding: 8, textAlign: 'left' }}>Slot</th>
                        {days.map(day => <th key={day} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, padding: 8, textAlign: 'center' }}>{day}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map(slot => (
                        <tr key={slot}>
                          <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', padding: 8, fontWeight: 500 }}>{slot}</td>
                          {days.map(day => {
                            const available = coach.availability[day]?.includes(slot)
                            return (
                              <td key={day} style={{ textAlign: 'center', padding: 4 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 6, background: available ? coach.color + '20' : CARD2, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 13 }}>
                                  {available ? <span style={{ color: coach.color, fontWeight: 700 }}>✓</span> : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Programs tab */}
          {activeTab === 'programs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {coach.programs.map(program => (
                <div key={program.id} style={{ borderRadius: 14, border: `1px solid ${BORDER}`, padding: 20, display: 'flex', alignItems: 'center', gap: 20, background: CARD2 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 6 }}>{program.name}</div>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>⏱ {program.duration}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>👥 {program.enrolled} enrolled</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: program.spots <= 5 ? '#ef4444' : LIME, background: program.spots <= 5 ? '#ef444418' : LIME + '18', padding: '2px 8px', borderRadius: 20 }}>{program.spots} spots left</span>
                    </div>
                    <div style={{ background: BORDER, borderRadius: 4, height: 6, overflow: 'hidden', maxWidth: 200 }}>
                      <div style={{ width: (program.enrolled / (program.enrolled + program.spots) * 100) + '%', height: '100%', background: LIME, borderRadius: 4 }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: LIME, marginBottom: 8 }}>₹{program.price.toLocaleString()}</div>
                    <button onClick={() => toast.success('Enrollment request sent!')} style={{ background: LIME, color: '#000', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Enroll Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: CARD2, borderRadius: 12, marginBottom: 8 }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: LIME }}>{coach.stats.rating}</div>
                <div>
                  <StarRating rating={coach.stats.rating} size={24} />
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Based on {coach.reviews.length} reviews</div>
                </div>
              </div>
              {coach.reviews.map(review => (
                <div key={review.id} style={{ borderRadius: 14, border: `1px solid ${BORDER}`, padding: 20, background: CARD2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: review.color, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{review.initials}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{review.student}</div>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{review.date}</div>
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>"{review.text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 180, right: 0, background: CARD, borderTop: `1px solid ${BORDER}`, padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, zIndex: 50 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{coach.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Starting from ₹{coach.price.toLocaleString()}/mo</div>
        </div>
        <button onClick={() => toast.success('Message sent to ' + coach.name + '!')} style={{ background: 'transparent', color: coach.color, border: `2px solid ${coach.color}`, borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          💬 Message Coach
        </button>
        <button onClick={() => toast.success('Free trial session requested!')} style={{ background: coach.color, color: '#000', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          🎯 Book a Free Trial Session
        </button>
      </div>
    </div>
  )
}
