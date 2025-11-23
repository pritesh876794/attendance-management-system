# Attendance Management System

A modern, full-stack attendance management system built with Next.js 14, Supabase, and TypeScript.

## Features

- **User Authentication**: Secure login system with role-based access (Admin/Employee)
- **Real-time Attendance Tracking**: Check-in/Check-out functionality with timestamp recording
- **Employee Management**: Add, edit, and manage employee profiles
- **Leave Management**: Request and approve leave applications
- **Analytics Dashboard**: Visual insights into attendance patterns
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pritesh876794/attendance-management-system.git
cd attendance-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create employees table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE attendance (
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
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('sick', 'casual', 'vacation', 'other')),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own employee record" ON employees
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all employees" ON employees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
    )
  );

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
```

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

After setting up the database, create a test user in Supabase Authentication and add their record to the employees table:

```sql
INSERT INTO employees (id, email, full_name, role, department)
VALUES ('your-auth-user-id', 'admin@example.com', 'Admin User', 'admin', 'Management');
```

## Project Structure

```
├── app/
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Login page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── lib/
│   └── supabase.ts         # Supabase client configuration
├── public/                 # Static assets
└── README.md
```

## Features in Detail

### For Employees
- Check-in/Check-out with automatic timestamp
- View personal attendance history
- Submit leave requests
- View leave request status

### For Admins
- View all employee attendance
- Manage employee records
- Approve/reject leave requests
- Generate attendance reports
- View analytics dashboard

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For support, email educationalpower8882@gmail.com or open an issue in the repository.
