# API Documentation

## Overview

The Attendance Management System uses Supabase as the backend, providing a PostgreSQL database with real-time capabilities and built-in authentication.

## Authentication

All API calls require authentication via Supabase Auth.

### Login
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Logout
```typescript
await supabase.auth.signOut()
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

---

## Employees API

### Get Employee by ID
```typescript
const { data, error } = await supabase
  .from('employees')
  .select('*')
  .eq('id', employeeId)
  .single()
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "employee",
  "department": "Engineering",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get All Employees (Admin Only)
```typescript
const { data, error } = await supabase
  .from('employees')
  .select('*')
  .order('full_name')
```

### Create Employee (Admin Only)
```typescript
const { data, error } = await supabase
  .from('employees')
  .insert({
    id: authUserId, // Must match Supabase Auth user ID
    email: 'newuser@example.com',
    full_name: 'Jane Smith',
    role: 'employee',
    department: 'Marketing'
  })
```

### Update Employee (Admin Only)
```typescript
const { data, error } = await supabase
  .from('employees')
  .update({
    full_name: 'Jane Doe',
    department: 'Sales'
  })
  .eq('id', employeeId)
```

---

## Attendance API

### Get Today's Attendance
```typescript
const today = format(new Date(), 'yyyy-MM-dd')
const { data, error } = await supabase
  .from('attendance')
  .select('*')
  .eq('employee_id', employeeId)
  .eq('date', today)
  .single()
```

**Response:**
```json
{
  "id": "uuid",
  "employee_id": "uuid",
  "check_in": "09:00:00",
  "check_out": "17:30:00",
  "date": "2024-01-15",
  "status": "present",
  "notes": null,
  "created_at": "2024-01-15T09:00:00Z"
}
```

### Check In
```typescript
const { data, error } = await supabase
  .from('attendance')
  .insert({
    employee_id: employeeId,
    check_in: '09:00:00',
    date: '2024-01-15',
    status: 'present'
  })
```

### Check Out
```typescript
const { data, error } = await supabase
  .from('attendance')
  .update({ check_out: '17:30:00' })
  .eq('id', attendanceId)
```

### Get Attendance History
```typescript
const { data, error } = await supabase
  .from('attendance')
  .select('*')
  .eq('employee_id', employeeId)
  .order('date', { ascending: false })
  .limit(30)
```

### Get Attendance by Date Range
```typescript
const { data, error } = await supabase
  .from('attendance')
  .select('*')
  .eq('employee_id', employeeId)
  .gte('date', '2024-01-01')
  .lte('date', '2024-01-31')
  .order('date', { ascending: false })
```

### Get All Attendance (Admin Only)
```typescript
const { data, error } = await supabase
  .from('attendance')
  .select(`
    *,
    employees (
      full_name,
      department
    )
  `)
  .eq('date', today)
  .order('check_in')
```

---

## Leave Requests API

### Get Leave Requests
```typescript
// User's own requests
const { data, error } = await supabase
  .from('leave_requests')
  .select('*')
  .eq('employee_id', employeeId)
  .order('created_at', { ascending: false })

// All requests (Admin only)
const { data, error } = await supabase
  .from('leave_requests')
  .select(`
    *,
    employees (
      full_name,
      department
    )
  `)
  .order('created_at', { ascending: false })
```

**Response:**
```json
{
  "id": "uuid",
  "employee_id": "uuid",
  "start_date": "2024-02-01",
  "end_date": "2024-02-03",
  "leave_type": "vacation",
  "reason": "Family trip",
  "status": "pending",
  "created_at": "2024-01-20T10:00:00Z"
}
```

### Create Leave Request
```typescript
const { data, error } = await supabase
  .from('leave_requests')
  .insert({
    employee_id: employeeId,
    start_date: '2024-02-01',
    end_date: '2024-02-03',
    leave_type: 'vacation',
    reason: 'Family trip',
    status: 'pending'
  })
```

### Update Leave Request Status (Admin Only)
```typescript
const { data, error } = await supabase
  .from('leave_requests')
  .update({ status: 'approved' })
  .eq('id', requestId)
```

### Get Pending Leave Requests (Admin Only)
```typescript
const { data, error } = await supabase
  .from('leave_requests')
  .select(`
    *,
    employees (
      full_name,
      email,
      department
    )
  `)
  .eq('status', 'pending')
  .order('created_at', { ascending: false })
```

---

## Statistics API

### Get Dashboard Stats
```typescript
const today = format(new Date(), 'yyyy-MM-dd')

// Total employees
const { count: totalEmployees } = await supabase
  .from('employees')
  .select('*', { count: 'exact', head: true })

// Present today
const { count: presentToday } = await supabase
  .from('attendance')
  .select('*', { count: 'exact', head: true })
  .eq('date', today)
  .eq('status', 'present')

// Pending leaves
const { count: pendingLeaves } = await supabase
  .from('leave_requests')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'pending')
```

### Get Monthly Attendance Summary
```typescript
const { data, error } = await supabase
  .from('attendance')
  .select('status')
  .eq('employee_id', employeeId)
  .gte('date', '2024-01-01')
  .lte('date', '2024-01-31')

// Calculate percentages
const present = data.filter(d => d.status === 'present').length
const absent = data.filter(d => d.status === 'absent').length
const late = data.filter(d => d.status === 'late').length
```

---

## Real-time Subscriptions

### Subscribe to Attendance Changes
```typescript
const subscription = supabase
  .channel('attendance-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'attendance',
      filter: `employee_id=eq.${employeeId}`
    },
    (payload) => {
      console.log('Attendance changed:', payload)
    }
  )
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

### Subscribe to Leave Request Updates
```typescript
const subscription = supabase
  .channel('leave-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'leave_requests',
      filter: `employee_id=eq.${employeeId}`
    },
    (payload) => {
      console.log('Leave request updated:', payload)
    }
  )
  .subscribe()
```

---

## Error Handling

All API calls return an error object if something goes wrong:

```typescript
const { data, error } = await supabase
  .from('employees')
  .select('*')

if (error) {
  console.error('Error:', error.message)
  // Handle error appropriately
}
```

Common error codes:
- `PGRST116`: No rows found
- `23505`: Unique constraint violation
- `42501`: Insufficient privileges (RLS policy)

---

## Rate Limiting

Supabase has built-in rate limiting:
- Free tier: 500 requests per second
- Pro tier: Higher limits

---

## Best Practices

1. **Always check for errors** after API calls
2. **Use transactions** for related operations
3. **Implement optimistic updates** for better UX
4. **Cache frequently accessed data**
5. **Use real-time subscriptions** sparingly
6. **Batch operations** when possible
7. **Handle offline scenarios** gracefully

---

## Helper Functions

The project includes helper functions in `lib/api.ts`:

```typescript
import {
  getEmployeeById,
  getTodayAttendance,
  checkIn,
  checkOut,
  getAttendanceHistory,
  getDashboardStats,
  createLeaveRequest,
  getLeaveRequests,
  updateLeaveRequestStatus
} from '@/lib/api'
```

These functions handle common operations and error handling.

---

## Testing API Calls

Use Supabase SQL Editor to test queries:

```sql
-- Get all attendance for today
SELECT a.*, e.full_name 
FROM attendance a
JOIN employees e ON a.employee_id = e.id
WHERE a.date = CURRENT_DATE;

-- Get pending leave requests
SELECT lr.*, e.full_name, e.department
FROM leave_requests lr
JOIN employees e ON lr.employee_id = e.id
WHERE lr.status = 'pending';
```

---

For more information, see the [Supabase Documentation](https://supabase.com/docs).
