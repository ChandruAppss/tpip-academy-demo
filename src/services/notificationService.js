const BASE_URL = 'https://tpip-academy.vercel.app'

export function generateMeetingUrl(bookingId) {
  return `${BASE_URL}/student/sessions/${bookingId}`
}

export function formatEmailDateTime(date, time) {
  try {
    const d = new Date(date)
    const formatted = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    return `${formatted} at ${time}`
  } catch {
    return `${date} at ${time}`
  }
}

export function storeBookingNotification(booking) {
  const key = `new_booking_${booking.coachId || 'coach'}`
  const existing = JSON.parse(localStorage.getItem('coach_booking_notifications') || '[]')
  existing.unshift({
    id: booking.bookingId,
    studentName: booking.studentName,
    date: booking.date,
    time: booking.time,
    topic: booking.topic,
    type: booking.type,
    meetingUrl: booking.meetingUrl,
    timestamp: new Date().toISOString(),
    read: false,
  })
  localStorage.setItem('coach_booking_notifications', JSON.stringify(existing.slice(0, 20)))
}

export function getBookingNotifications() {
  return JSON.parse(localStorage.getItem('coach_booking_notifications') || '[]')
}

export function markNotificationsRead() {
  const notifs = getBookingNotifications().map(n => ({ ...n, read: true }))
  localStorage.setItem('coach_booking_notifications', JSON.stringify(notifs))
}

export function clearNotification(id) {
  const notifs = getBookingNotifications().filter(n => n.id !== id)
  localStorage.setItem('coach_booking_notifications', JSON.stringify(notifs))
}

export async function sendBookingEmails({ studentEmail, coachEmail, studentName, coachName, date, time, topic, type, meetingUrl, bookingId }) {
  const dateTime = formatEmailDateTime(date, time)

  const studentSubject = encodeURIComponent(`Your session with ${coachName} is confirmed — ${dateTime}`)
  const studentBody = encodeURIComponent(
    `Hi ${studentName},\n\nYour coaching session has been confirmed!\n\n` +
    `Coach: ${coachName}\nDate & Time: ${dateTime}\nTopic: ${topic}\nType: ${type}\n\n` +
    `Join your session here:\n${meetingUrl}\n\n` +
    `Keep this link safe — you will need it to start your session.\n\nTPIP Academy`
  )

  const coachSubject = encodeURIComponent(`New booking from ${studentName} — ${dateTime}`)
  const coachBody = encodeURIComponent(
    `Hi ${coachName},\n\nYou have a new session booking!\n\n` +
    `Student: ${studentName}\nDate & Time: ${dateTime}\nTopic: ${topic}\nType: ${type}\n\n` +
    `Session link:\n${meetingUrl}\n\nTPIP Academy`
  )

  return {
    studentMailtoLink: `mailto:${studentEmail || ''}?subject=${studentSubject}&body=${studentBody}`,
    coachMailtoLink: `mailto:${coachEmail || ''}?subject=${coachSubject}&body=${coachBody}`,
  }
}
