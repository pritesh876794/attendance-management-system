'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Clock, 
  Users, 
  Calendar, 
  LogOut, 
  Home,
  FileText,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [employee, setEmployee] = useState<any>(null)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    pendingLeaves: 0
  })
  const [todayAttendance, setTodayAttendance] = useState<any>(null)
  const [checkInTime, setCheckInTime] = useState<string>('')

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/login')
      return
    }

    setUser(session.user)
    await loadEmployeeData(session.user.id)
    await loadStats()
    await checkTodayAttendance(session.user.id)
    setLoading(false)
  }

  async function loadEmployeeData(userId: string) {
    const { data } = await supabase
      .from('employees')
      .select('*')
      .eq('id', userId)
      .single()
    
    setEmployee(data)
  }

  async function loadStats() {
    const today = format(new Date(), 'yyyy-MM-dd')

    const { count: totalEmployees } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })

    const { count: presentToday } = await supabase
      .from('attendance')
      .select('*', { count: 'exact', head: true })
      .eq('date', today)
      .eq('status', 'present')

    const { count: absentToday } = await supabase
      .from('attendance')
      .select('*', { count: 'exact', head: true })
      .eq('date', today)
      .eq('status', 'absent')

    const { count: pendingLeaves } = await supabase
      .from('leave_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    setStats({
      totalEmployees: totalEmployees || 0,
      presentToday: presentToday || 0,
      absentToday: absentToday || 0,
      pendingLeaves: pendingLeaves || 0
    })
  }

  async function checkTodayAttendance(userId: string) {
    const today = format(new Date(), 'yyyy-MM-dd')
    
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', userId)
      .eq('date', today)
      .single()

    setTodayAttendance(data)
  }

  async function handleCheckIn() {
    const now = new Date()
    const today = format(now, 'yyyy-MM-dd')
    const time = format(now, 'HH:mm:ss')

    const { error } = await supabase
      .from('attendance')
      .insert({
        employee_id: user.id,
        check_in: time,
        date: today,
        status: 'present'
      })

    if (!error) {
      await checkTodayAttendance(user.id)
      await loadStats()
    }
  }

  async function handleCheckOut() {
    const time = format(new Date(), 'HH:mm:ss')

    const { error } = await supabase
      .from('attendance')
      .update({ check_out: time })
      .eq('id', todayAttendance.id)

    if (!error) {
      await checkTodayAttendance(user.id)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">AttendEase</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {employee?.full_name} ({employee?.role})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back, {employee?.full_name}!</p>
        </div>

        {employee?.role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
                </div>
                <Users className="h-12 w-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present Today</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.presentToday}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent Today</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.absentToday}</p>
                </div>
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Leaves</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingLeaves}</p>
                </div>
                <AlertCircle className="h-12 w-12 text-yellow-500" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Today's Attendance</h3>
            
            {!todayAttendance ? (
              <div className="text-center py-8">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't checked in today</p>
                <button
                  onClick={handleCheckIn}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Check In Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Check In</p>
                    <p className="text-2xl font-bold text-green-600">
                      {todayAttendance.check_in}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                {todayAttendance.check_out ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Check Out</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {todayAttendance.check_out}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                ) : (
                  <button
                    onClick={handleCheckOut}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Check Out
                  </button>
                )}

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold capitalize">{todayAttendance.status}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition">
                <Calendar className="h-6 w-6 text-primary-600" />
                <span className="font-medium">View Attendance History</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition">
                <FileText className="h-6 w-6 text-primary-600" />
                <span className="font-medium">Request Leave</span>
              </button>

              {employee?.role === 'admin' && (
                <>
                  <button className="w-full flex items-center space-x-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition">
                    <Users className="h-6 w-6 text-primary-600" />
                    <span className="font-medium">Manage Employees</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition">
                    <Settings className="h-6 w-6 text-primary-600" />
                    <span className="font-medium">System Settings</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
