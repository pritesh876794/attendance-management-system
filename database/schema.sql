-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  check_in TIME NOT NULL,
  check_out TIME,
  date DATE NOT NULL,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half_day')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

-- Create leave_requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('sick', 'casual', 'vacation', 'other')),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own employee record" ON employees;
DROP POLICY IF EXISTS "Admins can view all employees" ON employees;
DROP POLICY IF EXISTS "Users can view their own attendance" ON attendance;
DROP POLICY IF EXISTS "Users can insert their own attendance" ON attendance;
DROP POLICY IF EXISTS "Users can update their own attendance" ON attendance;
DROP POLICY IF EXISTS "Admins can view all attendance" ON attendance;
DROP POLICY IF EXISTS "Users can view their own leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Users can create their own leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Admins can view all leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Admins can update leave requests" ON leave_requests;

-- Create policies for employees table
CREATE POLICY "Users can view their own employee record" ON employees
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all employees" ON employees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert employees" ON employees
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update employees" ON employees
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for attendance table
CREATE POLICY "Users can view their own attendance" ON attendance
  FOR SELECT USING (employee_id = auth.uid());

CREATE POLICY "Users can insert their own attendance" ON attendance
  FOR INSERT WITH CHECK (employee_id = auth.uid());

CREATE POLICY "Users can update their own attendance" ON attendance
  FOR UPDATE USING (employee_id = auth.uid());

CREATE POLICY "Admins can view all attendance" ON attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert any attendance" ON attendance
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update any attendance" ON attendance
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for leave_requests table
CREATE POLICY "Users can view their own leave requests" ON leave_requests
  FOR SELECT USING (employee_id = auth.uid());

CREATE POLICY "Users can create their own leave requests" ON leave_requests
  FOR INSERT WITH CHECK (employee_id = auth.uid());

CREATE POLICY "Admins can view all leave requests" ON leave_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update leave requests" ON leave_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample data (optional)
-- Note: You'll need to create users in Supabase Auth first and use their UUIDs here

-- Example admin user (replace with actual auth user ID)
-- INSERT INTO employees (id, email, full_name, role, department)
-- VALUES ('your-auth-user-id', 'admin@example.com', 'Admin User', 'admin', 'Management');

-- Example employee user (replace with actual auth user ID)
-- INSERT INTO employees (id, email, full_name, role, department)
-- VALUES ('your-auth-user-id', 'employee@example.com', 'John Doe', 'employee', 'Engineering');
