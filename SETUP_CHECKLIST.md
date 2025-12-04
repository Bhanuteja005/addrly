# ✅ Setup Checklist for Addrly Dating App

Use this checklist to ensure everything is configured correctly.

## 📋 Pre-Setup Requirements

- [ ] Node.js installed (v18 or higher)
- [ ] npm or pnpm installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Web browser (Chrome/Firefox recommended)

## 🗄️ Database Setup

### Supabase Account
- [ ] Created account at https://supabase.com
- [ ] Created new project
- [ ] Saved project URL
- [ ] Saved anon (public) key
- [ ] Saved service_role (secret) key

### Database Migration
- [ ] Opened SQL Editor in Supabase Dashboard
- [ ] Copied content from `backend-addrly/migrations/create_profiles_table.sql`
- [ ] Executed SQL successfully
- [ ] Verified `profiles` table exists
- [ ] Verified `personality_analyses` table exists
- [ ] Checked that indexes were created
- [ ] Confirmed RLS policies are active

## 🔐 Google OAuth Setup (Optional but Recommended)

### Google Cloud Console
- [ ] Logged into https://console.cloud.google.com
- [ ] Created new project or selected existing
- [ ] Enabled Google+ API
- [ ] Created OAuth 2.0 credentials
- [ ] Added authorized JavaScript origins:
  - [ ] `http://localhost:3000`
  - [ ] Your production domain
- [ ] Added authorized redirect URIs:
  - [ ] `https://[your-project].supabase.co/auth/v1/callback`
  - [ ] `http://localhost:3000/auth/callback`
- [ ] Copied Client ID
- [ ] Copied Client Secret

### Supabase OAuth Configuration
- [ ] Opened Supabase Dashboard → Authentication → Providers
- [ ] Enabled Google provider
- [ ] Pasted Google Client ID
- [ ] Pasted Google Client Secret
- [ ] Saved configuration
- [ ] Verified redirect URL is shown

## ⚙️ Environment Variables

### Frontend `.env.local`
- [ ] Created file in `vetra-main/.env.local`
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Added `NEXT_PUBLIC_API_URL=http://localhost:3001`
- [ ] Verified no quotes around values
- [ ] Saved file

### Backend `.env`
- [ ] Located file at `backend-addrly/.env`
- [ ] Updated `SUPABASE_URL`
- [ ] Updated `SUPABASE_SERVICE_KEY` (not anon key!)
- [ ] Set `PORT=3001`
- [ ] Set `FRONTEND_URL=http://localhost:3000`
- [ ] Set `BASE_URL=http://localhost:3001`
- [ ] Saved file

## 📦 Dependencies

### Frontend
- [ ] Navigated to `vetra-main` directory
- [ ] Ran `npm install` (if not already done)
- [ ] Verified Supabase packages installed
- [ ] No critical errors in installation

### Backend
- [ ] Navigated to `backend-addrly` directory
- [ ] Ran `npm install` (if not already done)
- [ ] All dependencies installed successfully

## 🚀 Starting Servers

### Backend Server
- [ ] Opened terminal in `backend-addrly`
- [ ] Ran `npm run dev`
- [ ] Server started on port 3001
- [ ] No connection errors
- [ ] Supabase connection successful
- [ ] Saw ASCII art banner in console

### Frontend Server
- [ ] Opened new terminal in `vetra-main`
- [ ] Ran `npm run dev`
- [ ] Server started on port 3000
- [ ] No compilation errors
- [ ] Browser opened automatically or visited http://localhost:3000

## 🧪 Testing Authentication

### Email Sign Up
- [ ] Clicked "Sign Up" or "Create Your DateMeDoc"
- [ ] Filled in name, email, password
- [ ] Clicked "Create Account"
- [ ] Received success message
- [ ] Redirected to onboarding page

### Email Sign In
- [ ] Clicked "Sign In"
- [ ] Entered credentials
- [ ] Clicked "Sign In"
- [ ] Successfully authenticated
- [ ] Redirected appropriately

### Google OAuth (if configured)
- [ ] Clicked "Sign in with Google"
- [ ] Google consent screen appeared
- [ ] Selected Google account
- [ ] Granted permissions
- [ ] Redirected back to app
- [ ] Successfully authenticated

## 📝 Testing Onboarding Form

### Step 1: Basic Information
- [ ] Entered full name
- [ ] Entered age (18-100)
- [ ] Selected gender
- [ ] Entered occupation
- [ ] Selected education
- [ ] Clicked "Next"
- [ ] Validation worked correctly

### Step 2: Location & Bio
- [ ] Entered location
- [ ] Wrote bio (50+ characters)
- [ ] Character counter updated
- [ ] Selected lifestyle
- [ ] Entered personality type
- [ ] Clicked "Next"
- [ ] Validation enforced minimum length

### Step 3: Interests & Hobbies
- [ ] Selected multiple interests
- [ ] Visual feedback on selections
- [ ] Selected hobbies
- [ ] Clicked "Next"
- [ ] Required at least one interest

### Step 4: Dating Preferences
- [ ] Selected "looking for"
- [ ] Selected relationship type
- [ ] Set age range (min/max)
- [ ] Selected values
- [ ] Selected deal breakers
- [ ] Clicked "Next"

### Step 5: Social Media
- [ ] Entered social media URLs (optional)
- [ ] Privacy notice displayed
- [ ] Clicked "Complete Profile"
- [ ] Success message appeared
- [ ] Redirected to dashboard

## 📊 Testing Dashboard

### Profile Display
- [ ] Dashboard loaded successfully
- [ ] Profile summary card shown
- [ ] Name displayed correctly
- [ ] Location and age shown
- [ ] Bio displayed
- [ ] Interests shown (first 5)

### Matches Display
- [ ] Matches section visible
- [ ] Match cards displayed (if any)
- [ ] Each match shows:
  - [ ] Name
  - [ ] Age and location
  - [ ] Bio snippet
  - [ ] Interests
  - [ ] Match score percentage
  - [ ] "View Profile" button

### Navigation
- [ ] "Edit Profile" button works
- [ ] "Sign Out" button works
- [ ] Redirected after sign out

## 🔧 Troubleshooting Checks

### If Sign Up Fails
- [ ] Check browser console for errors
- [ ] Verify Supabase URL and anon key
- [ ] Check network tab for failed requests
- [ ] Verify backend is running

### If Onboarding Fails
- [ ] Check backend logs
- [ ] Verify service_role_key in backend .env
- [ ] Check database connection
- [ ] Verify profiles table exists

### If No Matches
- [ ] Create multiple test accounts
- [ ] Complete full onboarding for all
- [ ] Check that profile_completed = true in database
- [ ] Verify age ranges overlap

### If CORS Errors
- [ ] Verify backend URL in frontend .env
- [ ] Check FRONTEND_URL in backend .env
- [ ] Ensure both servers are running
- [ ] Check CORS configuration in backend

## ✅ Final Verification

### Complete Flow Test
- [ ] Sign up new user
- [ ] Complete all 5 onboarding steps
- [ ] Data saves to database
- [ ] Dashboard loads with profile
- [ ] Matches are calculated
- [ ] Compatibility scores shown
- [ ] Can sign out and sign back in
- [ ] Profile data persists

### Database Verification
- [ ] Open Supabase Table Editor
- [ ] See profiles table
- [ ] New profile entry exists
- [ ] All fields populated correctly
- [ ] profile_completed = true
- [ ] Timestamps are correct

### API Verification
- [ ] Backend logs show requests
- [ ] No 500 errors
- [ ] Authentication middleware working
- [ ] Endpoints responding correctly

## 🎉 Success Criteria

You're ready when:
- ✅ Both servers start without errors
- ✅ Can sign up with email
- ✅ Can sign in with email
- ✅ Google OAuth works (if configured)
- ✅ Onboarding form saves data
- ✅ Dashboard displays profile
- ✅ Matches are calculated
- ✅ No console errors
- ✅ Data persists in database
- ✅ Can sign out and sign back in

## 📚 If Something's Not Working

1. **Check this checklist** - Did you miss a step?
2. **Read error messages** - Browser console and terminal
3. **Verify environment variables** - Most common issue
4. **Check server logs** - Both frontend and backend
5. **Review SETUP_GUIDE.md** - Detailed troubleshooting
6. **Database migration** - Ensure it ran successfully
7. **Port conflicts** - Ensure 3000 and 3001 are available

## 🎊 You're Done!

If all items are checked, your dating app is fully functional!

Visit http://localhost:3000 and start matching! 💕
