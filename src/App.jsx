import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/common/ProtectedRoute'
import useAuthStore from './store/authStore'

// Public pages
import Landing from './pages/Landing/Landing'
import Login from './pages/Landing/Login'
import Register from './pages/Landing/Register'
import VerifyCertificate from './pages/Landing/VerifyCertificate'
import Enroll from './pages/Landing/Enroll'
import ProgramsPage from './pages/Programs/ProgramsPage'
import CoachesPage from './pages/Coaches/CoachesPage'
import AboutPage from './pages/About/AboutPage'

// Admin pages
import AdminLayout from './pages/Admin/AdminLayout'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminCoaches from './pages/Admin/AdminCoaches'
import AdminStudents from './pages/Admin/AdminStudents'
import AdminPrograms from './pages/Admin/AdminPrograms'
import AdminSessions from './pages/Admin/AdminSessions'
import AdminCertificates from './pages/Admin/AdminCertificates'
import AdminPayments from './pages/Admin/AdminPayments'
import AdminAcademies from './pages/Admin/AdminAcademies'
import AdminSettings from './pages/Admin/AdminSettings'
import AdminAISettings from './pages/Admin/AdminAISettings'

// Coach pages
import CoachLayout from './pages/Coach/CoachLayout'
import CoachDashboard from './pages/Coach/CoachDashboard'
import CoachStudents from './pages/Coach/CoachStudents'
import CoachStudentDetail from './pages/Coach/CoachStudentDetail'
import CoachCourses from './pages/Coach/CoachCourses'
import CoachCourseBuilder from './pages/Coach/CoachCourseBuilder'
import CoachDrills from './pages/Coach/CoachDrills'
import CoachSessions from './pages/Coach/CoachSessions'
import CoachSubmissions from './pages/Coach/CoachSubmissions'
import CoachAssessments from './pages/Coach/CoachAssessments'
import CoachEarnings from './pages/Coach/CoachEarnings'
import CoachProfile from './pages/Coach/CoachProfile'

// Student pages
import StudentLayout from './pages/Student/StudentLayout'
import StudentDashboard from './pages/Student/StudentDashboard'
import StudentDiscover from './pages/Student/StudentDiscover'
import StudentCoachProfile from './pages/Student/StudentCoachProfile'
import StudentCourses from './pages/Student/StudentCourses'
import StudentCoursePlayer from './pages/Student/StudentCoursePlayer'
import StudentSessions from './pages/Student/StudentSessions'
import StudentSubmissions from './pages/Student/StudentSubmissions'
import StudentPayments from './pages/Student/StudentPayments'
import StudentProgress from './pages/Student/StudentProgress'
import StudentCertificates from './pages/Student/StudentCertificates'
import StudentProfile from './pages/Student/StudentProfile'
import StudentChat from './pages/Student/StudentChat'
import StudentAIChat from './pages/Student/StudentAIChat'
import StudentAIAnalysis from './pages/Student/StudentAIAnalysis'
import StudentSessionsCalendar from "./pages/Student/StudentSessionsCalendar"
import CoachAvailability from "./pages/Coach/CoachAvailability"
import AdminPayouts from "./pages/Admin/AdminPayouts"
import AdminPayoutSettings from "./pages/Admin/AdminPayoutSettings"

function RoleRedirect() {
  const { isAuthenticated, profile } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const map = { admin: '/admin', coach: '/coach', student: '/student' }
  return <Navigate to={map[profile?.role] || '/login'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:certId" element={<VerifyCertificate />} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/coaches" element={<CoachesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="coaches" element={<AdminCoaches />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="sessions" element={<AdminSessions />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="academies" element={<AdminAcademies />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="ai-settings" element={<AdminAISettings />} />
          <Route path="payouts" element={<AdminPayouts />} />
          <Route path="payout-settings" element={<AdminPayoutSettings />} />
        </Route>

        {/* Coach */}
        <Route path="/coach" element={<ProtectedRoute role="coach"><CoachLayout /></ProtectedRoute>}>
          <Route index element={<CoachDashboard />} />
          <Route path="students" element={<CoachStudents />} />
          <Route path="students/:id" element={<CoachStudentDetail />} />
          <Route path="courses" element={<CoachCourses />} />
          <Route path="courses/:id/builder" element={<CoachCourseBuilder />} />
          <Route path="drills" element={<CoachDrills />} />
          <Route path="sessions" element={<CoachSessions />} />
          <Route path="submissions" element={<CoachSubmissions />} />
          <Route path="assessments" element={<CoachAssessments />} />
          <Route path="earnings" element={<CoachEarnings />} />
          <Route path="profile" element={<CoachProfile />} />
          <Route path="availability" element={<CoachAvailability />} />
        </Route>

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="discover" element={<StudentDiscover />} />
          <Route path="discover/:coachId" element={<StudentCoachProfile />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="courses/:enrollmentId" element={<StudentCoursePlayer />} />
          <Route path="sessions" element={<StudentSessions />} />
          <Route path="submissions" element={<StudentSubmissions />} />
          <Route path="payments" element={<StudentPayments />} />
          <Route path="progress" element={<StudentProgress />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="chat" element={<StudentChat />} />
          <Route path="ai-chat" element={<StudentAIChat />} />
          <Route path="ai-analysis" element={<StudentAIAnalysis />} />
          <Route path="sessions-calendar" element={<StudentSessionsCalendar />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
