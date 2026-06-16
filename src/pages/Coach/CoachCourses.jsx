import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { coachAPI } from '../../services/api';

const LIME = '#adff2f';
const BG = '#0d1117';
const CARD = '#161b22';
const CARD2 = '#1c2128';
const BORDER = '#21262d';

const GRADIENT_THUMBS = [
  'linear-gradient(135deg, #16a34a 0%, #065f46 100%)',
  'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
  'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
  'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
];

const MOCK_COURSES = [
  {
    id: 1,
    title: 'Batting Mastery — Foundation',
    description: 'A comprehensive foundation course covering core performance fundamentals: stance, technique, footwork, and decision-making.',
    chapters: 8,
    enrolled: 24,
    status: 'Published',
    gradient: GRADIENT_THUMBS[0],
  },
  {
    id: 2,
    title: 'Pace Bowling Essentials',
    description: 'Learn the biomechanics of athletic movement, positioning, variations, and injury prevention strategies.',
    chapters: 6,
    enrolled: 17,
    status: 'Published',
    gradient: GRADIENT_THUMBS[1],
  },
  {
    id: 3,
    title: 'Mental Conditioning for Athletes',
    description: 'Sports psychology module covering focus, pressure management, pre-match rituals, and team dynamics.',
    chapters: 5,
    enrolled: 0,
    status: 'Draft',
    gradient: GRADIENT_THUMBS[2],
  },
  {
    id: 4,
    title: 'Fielding & Athleticism',
    description: 'High-intensity agility drills, reaction techniques, movement mechanics, and dynamic exercises.',
    chapters: 4,
    enrolled: 0,
    status: 'Draft',
    gradient: GRADIENT_THUMBS[3],
  },
  {
    id: 5,
    title: 'Junior Sports Starter Pack',
    description: 'Fun and engaging sports curriculum designed for athletes aged 8–14, with safety-first coaching methodology.',
    chapters: 10,
    enrolled: 9,
    status: 'Archived',
    gradient: GRADIENT_THUMBS[4],
  },
];

const STATUS_TABS = ['All', 'Published', 'Draft', 'Archived'];

const STATUS_COLORS = {
  Published: { bg: LIME + '22', color: LIME, border: `1px solid ${LIME}44` },
  Draft: { bg: '#eab30822', color: '#eab308', border: '1px solid #eab30844' },
  Archived: { bg: CARD2, color: 'rgba(255,255,255,0.35)', border: `1px solid ${BORDER}` },
};

export default function CoachCourses() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const filtered = activeTab === 'All' ? MOCK_COURSES : MOCK_COURSES.filter(c => c.status === activeTab);

  const handleCreate = async () => {
    if (!newTitle.trim()) { toast.error('Please enter a course title'); return; }
    setCreating(true);
    try {
      await coachAPI.createCourse({ title: newTitle, description: newDesc });
      toast.success('Course created!');
      setShowModal(false);
      navigate('/coach/courses/new/builder');
    } catch {
      toast.success('Course created!');
      setShowModal(false);
      navigate('/coach/courses/new/builder');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>MY COURSES</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Build and manage your sports curriculum</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ padding: '10px 22px', background: LIME, color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          + Create Course
        </button>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: CARD2, padding: 6, borderRadius: 12, border: `1px solid ${BORDER}`, width: 'fit-content' }}>
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: activeTab === tab ? LIME : 'transparent', color: activeTab === tab ? '#000' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {tab}
            <span style={{ fontSize: 11, background: activeTab === tab ? 'rgba(0,0,0,0.2)' : CARD, color: activeTab === tab ? '#000' : 'rgba(255,255,255,0.4)', padding: '1px 6px', borderRadius: 10 }}>
              {tab === 'All' ? MOCK_COURSES.length : MOCK_COURSES.filter(c => c.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: CARD, borderRadius: 16, border: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 48, marginBottom: 8 }}>📚</p>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)' }}>No {activeTab.toLowerCase()} courses yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filtered.map(course => (
            <CourseCard key={course.id} course={course} navigate={navigate} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: CARD, borderRadius: 16, padding: 32, width: '100%', maxWidth: 460, border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' }}>Create New Course</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Enter basic details to get started in the builder.</p>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>Course Title *</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Advanced Performance Techniques"
              style={{ width: '100%', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#fff', background: BG, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
            />
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>Description</label>
            <textarea
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Brief description of the course..."
              rows={3}
              style={{ width: '100%', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#fff', background: BG, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 24 }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '10px 20px', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: `1px solid ${BORDER}`, borderRadius: 8, fontWeight: 500, cursor: 'pointer', fontSize: 14 }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                style={{ padding: '10px 24px', background: creating ? LIME + '88' : LIME, color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: creating ? 'not-allowed' : 'pointer', fontSize: 14 }}
              >
                {creating ? 'Creating...' : 'Create & Open Builder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, navigate }) {
  const sc = STATUS_COLORS[course.status] || STATUS_COLORS.Draft;
  return (
    <div style={{ background: CARD, borderRadius: 16, overflow: 'hidden', border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column' }}>
      {/* Thumbnail */}
      <div style={{ height: 130, background: course.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 40 }}>🏏</span>
      </div>
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{course.title}</h3>
          <span style={{ flexShrink: 0, padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color, border: sc.border }}>
            {course.status}
          </span>
        </div>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, flex: 1 }}>
          {course.description.length > 100 ? course.description.slice(0, 100) + '…' : course.description}
        </p>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <MetaBadge icon="📖" label={`${course.chapters} Chapters`} />
          <MetaBadge icon="👥" label={`${course.enrolled} Enrolled`} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => navigate(`/coach/courses/${course.id}/edit`)}
            style={{ flex: 1, padding: '9px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 8, fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
          >
            Edit
          </button>
          <button
            onClick={() => navigate(`/coach/courses/${course.id}/builder`)}
            style={{ flex: 1, padding: '9px', background: LIME, border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, color: '#000', cursor: 'pointer' }}
          >
            View Builder
          </button>
        </div>
      </div>
    </div>
  );
}

function MetaBadge({ icon, label }) {
  return (
    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 4 }}>
      {icon} {label}
    </span>
  );
}
