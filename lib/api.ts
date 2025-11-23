import { supabase } from './supabase'
import { Employee, Attendance, LeaveRequest, AttendanceStats } from '@/types'
import { format } from 'date-fns'

export async function getEmployeeById(id: string): Promise<Employee | null> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching employee:', error)
    return null
  }

  return data
}

export async function getAllEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('full_name')

  if (error) {
    console.error('Error fetching employees:', error)
    return []
  }

  return data || []
}

export async function getTodayAttendance(employeeId: string): Promise<Attendance | null> {
  const today = format(new Date(), 'yyyy-MM-dd')
  
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('date', today)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching attendance:', error)
    return null
  }

  return data
}

export async function checkIn(employeeId: string): Promise<boolean> {
  const now = new Date()
  const today = format(now, 'yyyy-MM-dd')
  const time = format(now, 'HH:mm:ss')
  const hour = now.getHours()
  
  const status = hour >= 10 ? 'late' : 'present'

  const { error } = await supabase
    .from('attendance')
    .insert({
      employee_id: employeeId,
      check_in: time,
      date: today,
      status: status
    })

  if (error) {
    console.error('Error checking in:', error)
    return false
  }

  return true
}

export async function checkOut(attendanceId: string): Promise<boolean> {
  const time = format(new Date(), 'HH:mm:ss')

  const { error } = await supabase
    .from('attendance')
    .update({ check_out: time })
    .eq('id', attendanceId)

  if (error) {
    console.error('Error checking out:', error)
    return false
  }

  return true
}

export async function getAttendanceHistory(
  employeeId: string,
  limit: number = 10
): Promise<Attendance[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('employee_id', employeeId)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching attendance history:', error)
    return []
  }

  return data || []
}

export async function getDashboardStats(): Promise<AttendanceStats> {
  const today = format(new Date(), 'yyyy-MM-dd')

  const [
    { count: totalEmployees },
    { count: presentToday },
    { count: absentToday },
    { count: pendingLeaves }
  ] = await Promise.all([
    supabase.from('employees').select('*', { count: 'exact', head: true }),
    supabase.from('attendance').select('*', { count: 'exact', head: true })
      .eq('date', today).eq('status', 'present'),
    supabase.from('attendance').select('*', { count: 'exact', head: true })
      .eq('date', today).eq('status', 'absent'),
    supabase.from('leave_requests').select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
  ])

  return {
    totalEmployees: totalEmployees || 0,
    presentToday: presentToday || 0,
    absentToday: absentToday || 0,
    pendingLeaves: pendingLeaves || 0
  }
}

export async function createLeaveRequest(
  employeeId: string,
  startDate: string,
  endDate: string,
  leaveType: 'sick' | 'casual' | 'vacation' | 'other',
  reason: string
): Promise<boolean> {
  const { error } = await supabase
    .from('leave_requests')
    .insert({
      employee_id: employeeId,
      start_date: startDate,
      end_date: endDate,
      leave_type: leaveType,
      reason: reason,
      status: 'pending'
    })

  if (error) {
    console.error('Error creating leave request:', error)
    return false
  }

  return true
}

export async function getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
  let query = supabase
    .from('leave_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (employeeId) {
    query = query.eq('employee_id', employeeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching leave requests:', error)
    return []
  }

  return data || []
}

export async function updateLeaveRequestStatus(
  requestId: string,
  status: 'approved' | 'rejected'
): Promise<boolean> {
  const { error } = await supabase
    .from('leave_requests')
    .update({ status })
    .eq('id', requestId)

  if (error) {
    console.error('Error updating leave request:', error)
    return false
  }

  return true
}
