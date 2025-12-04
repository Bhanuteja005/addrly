# ⚡ Quick Start Guide - Addrly Dating App

## 🎯 What's Been Created

A complete authentication and onboarding system with:
- ✅ Sign up/Sign in pages with email/password
- ✅ Google OAuth integration
- ✅ 5-step onboarding form (like Tally.so design)
- ✅ User profile management
- ✅ Matching algorithm
- ✅ Dashboard with matches
- ✅ Full frontend-backend integration

## 🚀 Quick Setup (5 Minutes)

### Step 1: Database Setup
1. Go to https://supabase.com and create project
2. Open SQL Editor in Supabase Dashboard
3. Copy and run: `backend-addrly/migrations/create_profiles_table.sql`

### Step 2: Environment Variables

**Frontend** - Create `vetra-main/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend** - Update `backend-addrly/.env`:
```env
PORT=3001
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:3001
```

### Step 3: Google OAuth (Optional but Recommended)

1. Google Cloud Console → Create OAuth Client
2. Authorized redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
3. Copy Client ID and Secret
4. Supabase Dashboard → Authentication → Providers → Google
5. Paste credentials and save

### Step 4: Start Servers

Terminal 1 - Backend:
```bash
cd backend-addrly
npm run dev
```

Terminal 2 - Frontend:
```bash
cd vetra-main
npm run dev
```

## ✅ Test It Out

1. Visit http://localhost:3000
2. Click "Create Your DateMeDoc" button
3. Sign up with email or Google
4. Complete the 5-step onboarding:
   - Basic info (name, age, gender)
   - Location & bio
   - Interests & hobbies
   - Dating preferences
   - Social media (optional)
5. View your dashboard with matches!

## 📁 Key Files

### Frontend
- `src/app/(auth)/signin/page.tsx` - Sign in page
- `src/app/(auth)/signup/page.tsx` - Sign up page
- `src/app/(auth)/onboarding/page.tsx` - Onboarding form
- `src/app/dashboard/page.tsx` - Dashboard
- `src/lib/supabase/client.ts` - Supabase config
- `src/lib/api/client.ts` - API client

### Backend
- `src/routes/userRoutes.js` - User endpoints
- `src/controllers/userController.js` - Onboarding logic
- `migrations/create_profiles_table.sql` - Database schema

## 🎨 Features

### Authentication
- Email/password sign up & sign in
- Google OAuth one-click authentication
- Automatic session management
- Protected routes

### Onboarding Form
- 5 progressive steps
- Progress indicator
- Form validation
- Smooth animations
- Mobile responsive

### Matching Algorithm
- Interest matching (40%)
- Values matching (30%)
- Deal breaker detection (-50%)
- Location bonus (15%)
- Lifestyle compatibility (15%)

### Dashboard
- Profile summary
- Match cards with compatibility scores
- Edit profile link
- Sign out functionality

## 🔧 Troubleshooting

**"Can't connect to backend"**
- Check backend is running on port 3001
- Verify NEXT_PUBLIC_API_URL in .env.local

**"Authentication failed"**
- Check Supabase URL and keys
- Verify keys are in correct .env files

**"No matches found"**
- Create multiple test accounts
- Complete full onboarding for all accounts

**"Database error"**
- Run the SQL migration in Supabase
- Check you used service_role_key (not anon_key) in backend

## 📚 Full Documentation

See `SETUP_GUIDE.md` for complete setup instructions and troubleshooting.

## 🎊 You're Ready!

Everything is connected and ready to use:
- ✅ Frontend on http://localhost:3000
- ✅ Backend on http://localhost:3001
- ✅ Database on Supabase
- ✅ Authentication working
- ✅ Onboarding working
- ✅ Matching working

Start building your dating empire! 🚀💕
