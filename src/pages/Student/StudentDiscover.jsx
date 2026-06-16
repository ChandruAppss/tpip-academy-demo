import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const LIME = '#adff2f'
const BG = '#0d1117'
const CARD = '#161b22'
const CARD2 = '#1c2128'
const BORDER = '#21262d'

const mockCoaches = [
  { id: 1, name: 'Ravi Kumar', specialization: 'Batting', rating: 4.9, price: 2999, tagline: 'Former Ranji Trophy player with 15+ years of coaching', students: 124, color: LIME, initials: 'RK', location: 'Mumbai, MH', avatar: 'https://i.pravatar.cc/80?img=1' },
  { id: 2, name: 'Arjun Singh', specialization: 'Bowling', rating: 4.7, price: 2499, tagline: 'Specialist in speed training & agility', students: 98, color: '#a855f7', initials: 'AS', location: 'Delhi, DL', avatar: 'https://i.pravatar.cc/80?img=2' },
  { id: 3, name: 'Priya Nair', specialization: 'Fielding', rating: 4.8, price: 1999, tagline: 'Agility & fitness coach, ex-national player', students: 76, color: '#f97316', initials: 'PN', location: 'Bengaluru, KA', avatar: 'https://i.pravatar.cc/80?img=5' },
  { id: 4, name: 'Dhruv Patel', specialization: 'Batting', rating: 4.6, price: 3499, tagline: 'Power hitting & mental game specialist', students: 61, color: '#06b6d4', initials: 'DP', location: 'Ahmedabad, GJ', avatar: 'https://i.pravatar.cc/80?img=3' },
  { id: 5, name: 'Meena Sharma', specialization: 'All-round', rating: 4.5, price: 2199, tagline: 'Holistic sports development for all ages', students: 143, color: '#eab308', initials: 'MS', location: 'Chennai, TN', avatar: 'https://i.pravatar.cc/80?img=6' },
  { id: 6, name: 'Vikram Rao', specialization: 'Bowling', rating: 4.8, price: 2799, tagline: 'Tactical sports coach — off-break & leg-break', students: 85, color: '#ec4899', initials: 'VR', location: 'Hyderabad, TS', avatar: 'https://i.pravatar.cc/80?img=4' },
]

const mockPrograms = [
  { id: 1, title: '30-Day Batting Bootcamp', coach: 'Ravi Kumar', duration: '30 days', price: 5999, enrolled: 48, spots: 20, color: LIME },
  { id: 2, title: 'Fast Bowling Intensive', coach: 'Arjun Singh', duration: '6 weeks', price: 7499, enrolled: 32, spots: 15, color: '#a855f7' },
  { id: 3, title: 'Complete Fielding Course', coach: 'Priya Nair', duration: '4 weeks', price: 3999, enrolled: 61, spots: 25, color: '#f97316' },
  { id: 4, title: 'Power Hitting Workshop', coach: 'Dhruv Patel', duration: '2 weeks', price: 4499, enrolled: 27, spots: 12, color: '#06b6d4' },
  { id: 5, title: 'Spin Bowling Mastery', coach: 'Vikram Rao', duration: '8 weeks', price: 8999, enrolled: 19, spots: 10, color: '#ec4899' },
  { id: 6, title: 'Junior Sports Foundation', coach: 'Meena Sharma', duration: '3 months', price: 9999, enrolled: 74, spots: 30, color: '#eab308' },
]

function StarRating({ rating }) {
  return (
    <span style={{ color: '#eab308', fontSize: 14 }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginLeft: 4 }}>{rating}</span>
    </span>
  )
}

export default function StudentDiscover() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('coaches')
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(true)
  const [filters, setFilters] = useState({ specialization: 'All', minRating: 0, availability: [] })

  const filteredCoaches = mockCoaches.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.specialization.toLowerCase().includes(search.toLowerCase()) || c.tagline.toLowerCase().includes(search.toLowerCase())
    const matchesSpec = filters.specialization === 'All' || c.specialization === filters.specialization
    const matchesRating = c.rating >= filters.minRating
    return matchesSearch && matchesSpec && matchesRating
  })

  const filteredPrograms = mockPrograms.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) || p.coach.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>

      {/* Hero search */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${LIME}`, borderRadius: 16, padding: '32px', marginBottom: 28, textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 8px', letterSpacing: '1px' }}>🏏 DISCOVER EXPERT CRICKET COACHES</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: '0 0 24px' }}>Find your perfect sports coach and unlock your true potential</p>
        <div style={{ display: 'flex', gap: 12, maxWidth: 600, margin: '0 auto' }}>
          <input type="text" placeholder="Find your perfect sports coach..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, padding: '12px 18px', borderRadius: 12, border: `1px solid ${BORDER}`, fontSize: 14, outline: 'none', background: BG, color: '#fff' }} />
          <button onClick={() => setFilterOpen(!filterOpen)} style={{ background: LIME, color: '#000', border: 'none', borderRadius: 12, padding: '12px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {filterOpen ? '✕ Filters' : '⚙ Filters'}
          </button>
        </div>
      </div>

      {/* Tab toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['coaches', 'programs'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: activeTab === tab ? LIME : 'transparent', color: activeTab === tab ? '#000' : 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            {tab === 'coaches' ? '👥 Coaches' : '📋 Programs'}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 14, color: 'rgba(255,255,255,0.4)', alignSelf: 'center' }}>
          {activeTab === 'coaches' ? filteredCoaches.length : filteredPrograms.length} results
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Filter sidebar */}
        {filterOpen && (
          <div style={{ width: 220, minWidth: 220, background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}` }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 16 }}>Filters</div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '1px' }}>Specialization</div>
              {['All', 'Batting', 'Bowling', 'Fielding', 'All-round'].map(spec => (
                <label key={spec} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                  <input type="radio" name="specialization" checked={filters.specialization === spec} onChange={() => setFilters(f => ({ ...f, specialization: spec }))} style={{ accentColor: LIME }} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{spec}</span>
                </label>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '1px' }}>Min Rating</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.minRating === 4} onChange={e => setFilters(f => ({ ...f, minRating: e.target.checked ? 4 : 0 }))} style={{ accentColor: LIME }} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>4+ Stars ⭐</span>
              </label>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '1px' }}>Availability</div>
              {['Morning', 'Afternoon', 'Evening', 'Weekends'].map(slot => (
                <label key={slot} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={filters.availability.includes(slot)} onChange={e => setFilters(f => ({ ...f, availability: e.target.checked ? [...f.availability, slot] : f.availability.filter(s => s !== slot) }))} style={{ accentColor: LIME }} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{slot}</span>
                </label>
              ))}
            </div>

            <button onClick={() => setFilters({ specialization: 'All', minRating: 0, availability: [] })} style={{ marginTop: 16, width: '100%', background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: 500 }}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Cards */}
        <div style={{ flex: 1 }}>
          {activeTab === 'coaches' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
              {filteredCoaches.map(coach => (
                <div key={coach.id} style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <img src={coach.avatar} alt={coach.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${coach.color}`, flexShrink: 0 }} onError={e => { e.target.style.display='none' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{coach.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>📍 {coach.location}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ background: coach.color + '20', color: coach.color, fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{coach.specialization}</span>
                    <StarRating rating={coach.rating} />
                  </div>

                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5 }}>{coach.tagline}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>₹{coach.price.toLocaleString()}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>/mo</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>👥 {coach.students} students</div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => { navigate('/student/chat'); toast.success('Chat started with coach!') }}
                      style={{ flex: 1, background: 'transparent', color: LIME, border: `1px solid ${LIME}`, borderRadius: 10, padding: '9px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Book Free Trial
                    </button>
                    <button onClick={() => navigate('/student/discover/' + coach.id)} style={{ flex: 1, background: coach.color, color: '#000', border: 'none', borderRadius: 10, padding: '9px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
              {filteredCoaches.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.35)' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                  <div style={{ fontSize: 16 }}>No coaches found. Try adjusting your filters.</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
              {filteredPrograms.map(program => (
                <div key={program.id} style={{ background: CARD, borderRadius: 16, padding: 24, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: program.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📋</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{program.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>by {program.coach}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ background: CARD2, color: 'rgba(255,255,255,0.5)', fontSize: 12, padding: '3px 8px', borderRadius: 6 }}>⏱ {program.duration}</span>
                    <span style={{ background: program.color + '20', color: program.color, fontSize: 12, padding: '3px 8px', borderRadius: 6 }}>{program.spots} spots left</span>
                  </div>
                  <div style={{ background: BORDER, borderRadius: 8, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: (program.enrolled / (program.enrolled + program.spots) * 100) + '%', height: '100%', background: program.color, borderRadius: 8 }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{program.enrolled} enrolled</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>₹{program.price.toLocaleString()}</span>
                    <button onClick={() => toast.success('Enrolling in ' + program.title)} style={{ background: program.color, color: '#000', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Enroll Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
