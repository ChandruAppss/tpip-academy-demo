import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, profile, _hasHydrated } = useAuthStore()

  // Wait for Zustand to rehydrate from localStorage before making auth decisions
  if (!_hasHydrated) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#16a34a',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (role && profile?.role !== role) {
    const redirectMap = { admin: '/admin', coach: '/coach', student: '/student' }
    return <Navigate to={redirectMap[profile?.role] || '/login'} replace />
  }

  return children
}
