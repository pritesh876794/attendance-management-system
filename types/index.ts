export interface Employee {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'employee'
  department: string
  created_at: string
}

export interface Attendance {
  id: string
  employee_id: string
  check_in: string
  check_out: string | null
  date: string
  status: 'present' | 'absent' | 'late' | 'half_day'
  notes: string | null
  created_at: string
}

export interface LeaveRequest {
  id: string
  employee_id: string
  start_date: string
  end_date: string
  leave_type: 'sick' | 'casual' | 'vacation' | 'other'
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface AttendanceStats {
  totalEmployees: number
  presentToday: number
  absentToday: number
  pendingLeaves: number
}

export interface DashboardData {
  employee: Employee
  todayAttendance: Attendance | null
  stats: AttendanceStats
  recentAttendance: Attendance[]
  pendingLeaves: LeaveRequest[]
}
