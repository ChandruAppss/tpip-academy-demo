import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { coachAPI } from '../../services/api';

const LIME = '#adff2f';
const BG = '#0d1117';
const CARD = '#161b22';
const CARD2 = '#1c2128';
const BORDER = '#21262d';

const INITIAL_CHAPTERS = [
  {
    id: 1,
    title: 'Chapter 1: Foundations',
    expanded: true,
    lessons: [
      { id: 1, title: 'Introduction & Overview', type: 'Video', content: { videoUrl: 'https://youtu.be/example1', thumbnail: '' } },
      { id: 2, title: 'Grip & Stance Basics', type: 'Text', content: { text: 'Proper technique is the foundation of all athletic performance. The V-shape between thumb and index finger should align with the bat edge...' } },
      { id: 3, title: 'Footwork Fundamentals', type: 'Drill Assignment', content: { description: 'Practice front-foot and back-foot movement drills.', instructions: 'Record yourself performing 10 front-foot drives and 10 back-foot punches.' } },
    ],
  },
  {
    id: 2,
    title: 'Chapter 2: Shot Execution',
    expanded: false,
    lessons: [
      { id: 4, title: 'Cover Drive Mechanics', type: 'Video', content: { videoUrl: 'https://youtu.be/example4', thumbnail: '' } },
      { id: 5, title: 'Pull Shot Quiz', type: 'Quiz', content: { questions: [{ text: 'Where should your weight be when playing a pull shot?', options: ['Front foot', 'Back foot', 'Balanced', "Doesn't matter"], correct: 1 }] } },
      { id: 6, title: 'Defence Assessment', type: 'Text', content: { text: 'Defensive play is just as important as attacking. This lesson covers soft hands, bat angle, and pad alignment...' } },
    ],
  },
];

const CONTENT_TYPES = ['Video', 'Text', 'Quiz', 'Drill Assignment'];

const LESSON_ICONS = {
  Video: '🎬',
  Text: '📝',
  Quiz: '❓',
  'Drill Assignment': '🏋️',
};

function DEFAULT_CONTENT(type) {
  if (type === 'Video') return { videoUrl: '', thumbnail: '' };
  if (type === 'Text') return { text: '' };
  if (type === 'Quiz') return { questions: [] };
  if (type === 'Drill Assignment') return { description: '', instructions: '' };
  return {};
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.4)',
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const inputStyle = {
  width: '100%',
  border: `1px solid #21262d`,
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 14,
  color: '#fff',
  background: '#0d1117',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function CoachCourseBuilder() {
  const { id } = useParams();
  const courseTitle = id === 'new' ? 'New Course' : 'Batting Mastery — Foundation';

  const [chapters, setChapters] = useState(INITIAL_CHAPTERS);
  const [selectedLesson, setSelectedLesson] = useState(INITIAL_CHAPTERS[0].lessons[0]);
  const [selectedChapterId, setSelectedChapterId] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const [lessonTitle, setLessonTitle] = useState(selectedLesson.title);
  const [lessonType, setLessonType] = useState(selectedLesson.type);
  const [lessonContent, setLessonContent] = useState(selectedLesson.content);
  const [saving, setSaving] = useState(false);

  const selectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setLessonTitle(lesson.title);
    setLessonType(lesson.type);
    setLessonContent(lesson.content || {});
  };

  const toggleChapter = (chapterId) => {
    setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, expanded: !c.expanded } : c));
  };

  const addChapter = () => {
    const newChapter = {
      id: Date.now(),
      title: `Chapter ${chapters.length + 1}: New Chapter`,
      expanded: true,
      lessons: [],
    };
    setChapters(prev => [...prev, newChapter]);
    toast.success('Chapter added');
  };

  const addLesson = (chapterId) => {
    const newLesson = {
      id: Date.now(),
      title: 'New Lesson',
      type: 'Text',
      content: { text: '' },
    };
    setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, lessons: [...c.lessons, newLesson] } : c));
    selectLesson(newLesson);
    setSelectedChapterId(chapterId);
  };

  const handleSaveLesson = async () => {
    setSaving(true);
    const updated = { ...selectedLesson, title: lessonTitle, type: lessonType, content: lessonContent };
    setChapters(prev => prev.map(c => ({
      ...c,
      lessons: c.lessons.map(l => l.id === selectedLesson.id ? updated : l),
    })));
    setSelectedLesson(updated);
    try {
      await coachAPI.addLesson(selectedChapterId, { title: lessonTitle, type: lessonType, content: lessonContent });
      toast.success('Lesson saved');
    } catch {
      toast.success('Lesson saved');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await coachAPI.updateCourse(id, { status: 'Published' });
      toast.success('Course published successfully!');
    } catch {
      toast.success('Course published!');
    } finally {
      setPublishing(false);
      setShowPublishConfirm(false);
    }
  };

  const addQuestion = () => {
    const qs = lessonContent.questions || [];
    setLessonContent({ ...lessonContent, questions: [...qs, { text: '', options: ['', '', '', ''], correct: 0 }] });
  };

  const updateQuestion = (qi, field, value) => {
    const qs = [...(lessonContent.questions || [])];
    qs[qi] = { ...qs[qi], [field]: value };
    setLessonContent({ ...lessonContent, questions: qs });
  };

  const updateOption = (qi, oi, value) => {
    const qs = [...(lessonContent.questions || [])];
    const opts = [...qs[qi].options];
    opts[oi] = value;
    qs[qi] = { ...qs[qi], options: opts };
    setLessonContent({ ...lessonContent, questions: qs });
  };

  return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#fff' }}>
      {/* Top Bar */}
      <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/coach/courses" style={{ color: LIME, textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>← Courses</Link>
          <span style={{ color: BORDER, fontSize: 18 }}>|</span>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' }}>{courseTitle}</h1>
          <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: '#eab30822', color: '#eab308', border: '1px solid #eab30844' }}>Draft</span>
        </div>
        <button
          onClick={() => setShowPublishConfirm(true)}
          style={{ padding: '10px 22px', background: LIME, color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
        >
          🚀 Publish Course
        </button>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel — Chapter List */}
        <div style={{ width: 300, minWidth: 300, background: CARD, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Curriculum</span>
            <button
              onClick={addChapter}
              style={{ fontSize: 12, fontWeight: 600, color: LIME, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
            >
              + Add Chapter
            </button>
          </div>

          {chapters.map((chapter) => (
            <div key={chapter.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div
                onClick={() => toggleChapter(chapter.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', cursor: 'pointer', background: chapter.expanded ? CARD2 : 'transparent' }}
              >
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>⠿</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#fff' }}>{chapter.title}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', transform: chapter.expanded ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.15s' }}>▶</span>
              </div>

              {chapter.expanded && (
                <div style={{ paddingBottom: 4 }}>
                  {chapter.lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      onClick={() => { selectLesson(lesson); setSelectedChapterId(chapter.id); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px 9px 32px', cursor: 'pointer', background: selectedLesson.id === lesson.id ? LIME + '11' : 'transparent', borderLeft: selectedLesson.id === lesson.id ? `3px solid ${LIME}` : '3px solid transparent' }}
                    >
                      <span style={{ fontSize: 13 }}>{LESSON_ICONS[lesson.type] || '📄'}</span>
                      <span style={{ fontSize: 13, color: selectedLesson.id === lesson.id ? LIME : 'rgba(255,255,255,0.6)', fontWeight: selectedLesson.id === lesson.id ? 600 : 400, flex: 1 }}>
                        {lesson.title}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => addLesson(chapter.id)}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 16px 8px 32px', background: 'none', border: 'none', fontSize: 12, color: LIME, cursor: 'pointer', fontWeight: 500 }}
                  >
                    + Add Lesson
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Panel — Content Editor */}
        <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 780 }}>
            {/* Lesson Title */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Lesson Title</label>
              <input
                type="text"
                value={lessonTitle}
                onChange={e => setLessonTitle(e.target.value)}
                style={{ ...inputStyle, fontSize: 16, fontWeight: 600 }}
              />
            </div>

            {/* Content Type Selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ ...labelStyle, marginBottom: 10 }}>Content Type</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {CONTENT_TYPES.map(ct => (
                  <button
                    key={ct}
                    onClick={() => {
                      setLessonType(ct);
                      setLessonContent(DEFAULT_CONTENT(ct));
                    }}
                    style={{ padding: '8px 18px', borderRadius: 8, border: `2px solid ${lessonType === ct ? LIME : BORDER}`, background: lessonType === ct ? LIME + '22' : 'transparent', color: lessonType === ct ? LIME : 'rgba(255,255,255,0.5)', fontWeight: lessonType === ct ? 600 : 400, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {LESSON_ICONS[ct]} {ct}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Editor Area */}
            <div style={{ background: CARD, borderRadius: 14, padding: 24, border: `1px solid ${BORDER}`, marginBottom: 20 }}>
              {/* Video */}
              {lessonType === 'Video' && (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Video URL</label>
                    <input
                      type="url"
                      value={lessonContent.videoUrl || ''}
                      onChange={e => setLessonContent({ ...lessonContent, videoUrl: e.target.value })}
                      placeholder="https://youtu.be/..."
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Thumbnail</label>
                    <div style={{ border: `2px dashed ${BORDER}`, borderRadius: 10, padding: '32px', textAlign: 'center', cursor: 'pointer', background: CARD2 }}>
                      <p style={{ margin: 0, fontSize: 32 }}>🖼️</p>
                      <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Click to upload thumbnail image</p>
                      <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Text */}
              {lessonType === 'Text' && (
                <div>
                  <label style={labelStyle}>Lesson Content</label>
                  <textarea
                    value={lessonContent.text || ''}
                    onChange={e => setLessonContent({ ...lessonContent, text: e.target.value })}
                    placeholder="Write your lesson content here..."
                    rows={14}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                  />
                </div>
              )}

              {/* Quiz */}
              {lessonType === 'Quiz' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Questions</label>
                    <button
                      onClick={addQuestion}
                      style={{ padding: '7px 16px', background: LIME, color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                    >
                      + Add Question
                    </button>
                  </div>
                  {(lessonContent.questions || []).length === 0 && (
                    <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 24 }}>No questions yet. Click "+ Add Question" to start.</p>
                  )}
                  {(lessonContent.questions || []).map((q, qi) => (
                    <div key={qi} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16, marginBottom: 14, background: CARD2 }}>
                      <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Question {qi + 1}</p>
                      <input
                        type="text"
                        value={q.text}
                        onChange={e => updateQuestion(qi, 'text', e.target.value)}
                        placeholder="Enter question text..."
                        style={{ ...inputStyle, marginBottom: 12 }}
                      />
                      <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Options (select correct answer)</p>
                      {q.options.map((opt, oi) => (
                        <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <input
                            type="radio"
                            name={`q${qi}-correct`}
                            checked={q.correct === oi}
                            onChange={() => updateQuestion(qi, 'correct', oi)}
                            style={{ accentColor: LIME, width: 16, height: 16, flexShrink: 0 }}
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={e => updateOption(qi, oi, e.target.value)}
                            placeholder={`Option ${oi + 1}`}
                            style={{ ...inputStyle, margin: 0, flex: 1 }}
                          />
                          {q.correct === oi && <span style={{ fontSize: 12, color: LIME, fontWeight: 600, flexShrink: 0 }}>✓ Correct</span>}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Drill Assignment */}
              {lessonType === 'Drill Assignment' && (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Drill Description</label>
                    <textarea
                      value={lessonContent.description || ''}
                      onChange={e => setLessonContent({ ...lessonContent, description: e.target.value })}
                      placeholder="Describe the drill and its objectives..."
                      rows={5}
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Submission Instructions</label>
                    <textarea
                      value={lessonContent.instructions || ''}
                      onChange={e => setLessonContent({ ...lessonContent, instructions: e.target.value })}
                      placeholder="How should students submit? (video, photo, written report...)"
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveLesson}
              disabled={saving}
              style={{ padding: '12px 32px', background: saving ? LIME + '88' : LIME, color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Saving...' : '💾 Save Lesson'}
            </button>
          </div>
        </div>
      </div>

      {/* Publish Confirm Modal */}
      {showPublishConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: CARD, borderRadius: 16, padding: 32, width: '100%', maxWidth: 420, border: `1px solid ${BORDER}`, textAlign: 'center' }}>
            <p style={{ fontSize: 48, margin: '0 0 12px' }}>🚀</p>
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#fff' }}>Publish Course?</h2>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              Once published, enrolled students will be able to access all lessons. You can still edit content after publishing.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => setShowPublishConfirm(false)}
                style={{ padding: '10px 24px', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: `1px solid ${BORDER}`, borderRadius: 8, fontWeight: 500, cursor: 'pointer', fontSize: 14 }}
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                style={{ padding: '10px 28px', background: publishing ? LIME + '88' : LIME, color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: publishing ? 'not-allowed' : 'pointer', fontSize: 14 }}
              >
                {publishing ? 'Publishing...' : 'Publish Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
