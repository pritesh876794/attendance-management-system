# Setup Guide - Attendance Management System

## Quick Start Guide

Follow these steps to get your attendance management system up and running.

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: `attendance-system`
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
5. Wait for project to be created (~2 minutes)

### 1.2 Get Your Credentials
1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 1.3 Set Up Database
1. Go to SQL Editor in Supabase dashboard
2. Copy the entire content from `database/schema.sql`
3. Paste and click "Run"
4. Wait for success message

### 1.4 Create Your First User
1. Go to Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter:
   - Email: `admin@example.com`
   - Password: `admin123` (or your choice)
   - Auto Confirm User: ✓ (check this)
4. Click "Create user"
5. **Copy the User ID** (UUID format)

### 1.5 Add User to Employees Table
1. Go to Table Editor → employees
2. Click "Insert" → "Insert row"
3. Fill in:
   - id: (paste the User ID you copied)
   - email: `admin@example.com`
   - full_name: `Admin User`
   - role: `admin`
   - department: `Management`
4. Click "Save"

## Step 2: Local Development Setup

### 2.1 Clone Repository
```bash
git clone https://github.com/pritesh876794/attendance-management-system.git
cd attendance-management-system
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.4 Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 3: Vercel Deployment

### 3.1 Connect GitHub Repository
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import `attendance-management-system` repository

### 3.2 Configure Project
1. Framework Preset: **Next.js** (auto-detected)
2. Root Directory: `./` (leave as is)
3. Build Command: `npm run build` (auto-filled)
4. Output Directory: `.next` (auto-filled)

### 3.3 Add Environment Variables
Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |

### 3.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app will be live at: `https://attendance-management-system.vercel.app`

## Step 4: First Login

1. Go to your deployed URL or localhost:3000
2. Click "Login"
3. Enter credentials:
   - Email: `admin@example.com`
   - Password: `admin123` (or what you set)
4. You're in! 🎉

## Step 5: Add More Employees

### Method 1: Via Supabase Dashboard
1. Create user in Authentication
2. Add record in employees table with same user ID

### Method 2: Via Application (Coming Soon)
Admin panel will have employee management interface

## Common Issues & Solutions

### Issue: "Invalid login credentials"
**Solution**: 
- Verify user exists in Authentication
- Check user is confirmed (not pending)
- Verify password is correct

### Issue: "Row Level Security policy violation"
**Solution**:
- Ensure user ID in employees table matches auth user ID
- Run the schema.sql again to recreate policies

### Issue: "Cannot read properties of null"
**Solution**:
- User exists in auth but not in employees table
- Add employee record with matching user ID

### Issue: Environment variables not working
**Solution**:
- Restart dev server after changing .env.local
- In Vercel, redeploy after adding env vars

## Database Schema Overview

### Tables

**employees**
- Stores user profile information
- Links to Supabase Auth users
- Defines roles (admin/employee)

**attendance**
- Records daily check-in/check-out
- One record per employee per day
- Tracks status (present/absent/late)

**leave_requests**
- Manages leave applications
- Tracks approval status
- Links to employees

## Security Features

✅ Row Level Security (RLS) enabled
✅ Users can only see their own data
✅ Admins have elevated permissions
✅ Secure authentication via Supabase
✅ Environment variables for sensitive data

## Next Steps

1. **Customize Branding**: Update colors in `tailwind.config.ts`
2. **Add Features**: Extend with reports, analytics, etc.
3. **Configure Domain**: Add custom domain in Vercel
4. **Set Up Monitoring**: Enable Vercel Analytics
5. **Backup Database**: Set up Supabase backups

## Support

- **Documentation**: See README.md
- **Issues**: Open GitHub issue
- **Email**: educationalpower8882@gmail.com

## Production Checklist

Before going live:

- [ ] Change default admin password
- [ ] Set up database backups
- [ ] Configure custom domain
- [ ] Enable Vercel Analytics
- [ ] Test all user flows
- [ ] Set up error monitoring
- [ ] Review RLS policies
- [ ] Add rate limiting (if needed)
- [ ] Configure email notifications
- [ ] Set up CI/CD pipeline

---

**Congratulations!** Your attendance management system is ready to use! 🚀
