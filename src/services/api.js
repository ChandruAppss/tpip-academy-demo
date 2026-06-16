import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api/lms',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('tpip_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tpip_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email })
}

// Public
export const publicAPI = {
  getPrograms: () => api.get('/programs'),
  getCoaches: () => api.get('/coaches'),
  verifyCertificate: (certId) => api.get(`/verify/${certId}`)
}

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getCoaches: () => api.get('/admin/coaches'),
  updateCoach: (id, data) => api.put(`/admin/coaches/${id}`, data),
  getStudents: () => api.get('/admin/students'),
  getPrograms: () => api.get('/admin/programs'),
  updateProgram: (id, data) => api.put(`/admin/programs/${id}`, data),
  getSessions: () => api.get('/admin/sessions'),
  getCertificates: () => api.get('/admin/certificates'),
  getPayments: () => api.get('/admin/payments'),
  getAcademies: () => api.get('/admin/academies'),
  createAcademy: (data) => api.post('/admin/academies', data),
  sendNotification: (data) => api.post('/admin/notifications', data),
  createSession: (data) => api.post('/admin/sessions', data),
  issueCertificate: (data) => api.post('/admin/certificates', data),
  refundPayment: (id) => api.post(`/admin/payments/${id}/refund`),
  getAISettings: () => api.get('/admin/ai-settings'),
  updateAISettings: (data) => api.put('/admin/ai-settings', data),
  getAIUsage: () => api.get('/admin/ai-usage'),
  getEscrow: () => api.get("/admin/escrow"),
  getPayouts: () => api.get("/admin/payouts"),
  approvePayout: (data) => api.post("/admin/payouts/approve", data),
  rejectPayout: (data) => api.post("/admin/payouts/reject", data),
  releaseEscrow: (data) => api.post("/admin/escrow/release", data),
  getPayoutSettings: () => api.get("/admin/payout-settings"),
  updatePayoutSettings: (data) => api.put("/admin/payout-settings", data),
}

// Coach
export const coachAPI = {
  getDashboard: () => api.get('/coach/dashboard'),
  getStudents: () => api.get('/coach/students'),
  getStudent: (id) => api.get(`/coach/students/${id}`),
  getBatches: () => api.get('/coach/batches'),
  createBatch: (data) => api.post('/coach/batches', data),
  getCourses: () => api.get('/coach/courses'),
  createCourse: (data) => api.post('/coach/courses', data),
  updateCourse: (id, data) => api.put(`/coach/courses/${id}`, data),
  addModule: (courseId, data) => api.post(`/coach/courses/${courseId}/modules`, data),
  addLesson: (moduleId, data) => api.post(`/coach/modules/${moduleId}/lessons`, data),
  getDrills: () => api.get('/coach/drills'),
  createDrill: (data) => api.post('/coach/drills', data),
  getSessions: () => api.get('/coach/sessions'),
  createSession: (data) => api.post('/coach/sessions', data),
  getSubmissions: (status) => api.get('/coach/submissions', { params: { status } }),
  submitFeedback: (id, data) => api.put(`/coach/submissions/${id}/feedback`, data),
  createAssessment: (data) => api.post('/coach/assessments', data),
  issueCertificate: (enrollmentId) => api.post(`/coach/certificates/${enrollmentId}`),
  markAttendance: (sessionId, data) => api.post(`/coach/sessions/${sessionId}/attendance`, data),
  getEarnings: () => api.get('/coach/earnings'),
  updateProfile: (data) => api.put('/coach/profile', data),
  getAvailability: () => api.get("/coach/availability"),
  updateAvailability: (data) => api.put("/coach/availability", data),
  requestPayout: (data) => api.post("/coach/payout-request", data),
  updatePayoutSettings: (data) => api.put("/coach/payout-settings", data),
}

// Student
export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  discoverCoaches: (params) => api.get('/student/discover', { params }),
  getCoach: (id) => api.get(`/student/discover/${id}`),
  getCourses: () => api.get('/student/courses'),
  getCourseProgress: (enrollmentId) => api.get(`/student/courses/${enrollmentId}/progress`),
  completeLesson: (lessonId, data) => api.put(`/student/lessons/${lessonId}/complete`, data),
  getSessions: () => api.get('/student/sessions'),
  submitPractice: (data) => api.post('/student/submissions', data),
  getSubmissions: () => api.get('/student/submissions'),
  getAssessments: () => api.get('/student/assessments'),
  getCertificates: () => api.get('/student/certificates'),
  updateProfile: (data) => api.put('/student/profile', data),
  getNotifications: () => api.get('/student/notifications'),
  markNotificationRead: (id) => api.put(`/student/notifications/${id}/read`),
  getAIAnalysis: () => api.get('/student/ai-analysis'),
  sendAIChat: (data) => api.post('/student/ai-chat', data),
  getBookings: () => api.get("/student/bookings"),
  createBooking: (data) => api.post("/student/bookings", data),
  confirmBooking: (data) => api.post("/student/bookings/confirm", data),
  detectCurrency: () => api.get("/detect-currency"),
  getPackages: () => api.get("/packages"),
}

export default api
