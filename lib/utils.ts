import { format, parseISO, differenceInMinutes, startOfMonth, endOfMonth } from 'date-fns'

export function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return format(date, 'hh:mm a')
  } catch {
    return time
  }
}

export function formatDate(date: string): string {
  try {
    return format(parseISO(date), 'MMM dd, yyyy')
  } catch {
    return date
  }
}

export function calculateWorkHours(checkIn: string, checkOut: string | null): string {
  if (!checkOut) return 'In Progress'
  
  try {
    const today = format(new Date(), 'yyyy-MM-dd')
    const checkInTime = new Date(`${today}T${checkIn}`)
    const checkOutTime = new Date(`${today}T${checkOut}`)
    
    const minutes = differenceInMinutes(checkOutTime, checkInTime)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    return `${hours}h ${mins}m`
  } catch {
    return 'N/A'
  }
}

export function getAttendanceStatus(checkIn: string): 'present' | 'late' {
  try {
    const [hours] = checkIn.split(':').map(Number)
    return hours >= 10 ? 'late' : 'present'
  } catch {
    return 'present'
  }
}

export function getMonthDateRange() {
  const now = new Date()
  return {
    start: format(startOfMonth(now), 'yyyy-MM-dd'),
    end: format(endOfMonth(now), 'yyyy-MM-dd')
  }
}

export function calculateAttendancePercentage(present: number, total: number): number {
  if (total === 0) return 0
  return Math.round((present / total) * 100)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    present: 'text-green-600 bg-green-50',
    absent: 'text-red-600 bg-red-50',
    late: 'text-yellow-600 bg-yellow-50',
    half_day: 'text-blue-600 bg-blue-50',
    pending: 'text-yellow-600 bg-yellow-50',
    approved: 'text-green-600 bg-green-50',
    rejected: 'text-red-600 bg-red-50'
  }
  return colors[status] || 'text-gray-600 bg-gray-50'
}

export function getStatusBadge(status: string): string {
  const badges: Record<string, string> = {
    present: '✓ Present',
    absent: '✗ Absent',
    late: '⚠ Late',
    half_day: '◐ Half Day',
    pending: '⏳ Pending',
    approved: '✓ Approved',
    rejected: '✗ Rejected'
  }
  return badges[status] || status
}
