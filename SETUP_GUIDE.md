# Addrly - Complete Authentication & Onboarding Setup Guide

## 🎯 Overview

This guide covers the complete setup for Addrly's authentication system with Google OAuth and comprehensive onboarding form for the dating app.

## 📁 Files Created

### Frontend
- `src/lib/supabase/client.ts` - Supabase client configuration
- `src/lib/api/client.ts` - Axios client with auth interceptors
- `src/types/user.ts` - TypeScript interfaces
- `src/app/(auth)/layout.tsx` - Auth pages layout
- `src/app/(auth)/signin/page.tsx` - Sign in page
- `src/app/(auth)/signup/page.tsx` - Sign up page
- `src/app/(auth)/auth/callback/page.tsx` - OAuth callback handler
- `src/app/(auth)/onboarding/page.tsx` - 5-step onboarding form
- `src/app/dashboard/page.tsx` - Dashboard with matches

### Backend
- `src/routes/userRoutes.js` - Updated with onboarding routes
- `src/controllers/userController.js` - Added onboarding & matching logic
- `migrations/create_profiles_table.sql` - Database schema

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
# Frontend (already done)
cd vetra-main
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs zod --legacy-peer-deps

# Backend
cd backend-addrly
npm install
```

### 2. Supabase Setup

#### A. Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Save your project URL and anon key

#### B. Run Database Migration
1. Open Supabase Dashboard > SQL Editor
2. Copy content from `backend-addrly/migrations/create_profiles_table.sql`
3. Execute the SQL to create tables

#### C. Enable Google OAuth
1. In Supabase Dashboard > Authentication > Providers
2. Enable Google provider
3. You'll see a redirect URL like: `https://[your-project].supabase.co/auth/v1/callback`
4. Keep this for Google Cloud Console setup

### 3. Google Cloud Console Setup

1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable APIs:
   - Go to "APIs & Services" > "Enable APIs and Services"
   - Search and enable "Google+ API"
4. Create OAuth 2.0 Credentials:
   - Go to "Credentials" > "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "Addrly"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `https://[your-project].supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback`
5. Copy Client ID and Client Secret

6. Add to Supabase:
   - Go back to Supabase Dashboard > Authentication > Providers > Google
   - Paste Client ID and Client Secret
   - Save

### 4. Environment Variables

#### Frontend `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend `.env`
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:3001
```

### 5. Start Applications

```bash
# Terminal 1 - Backend
cd backend-addrly
npm run dev

# Terminal 2 - Frontend
cd vetra-main
npm run dev
```

## 🎨 User Flow

### 1. Landing Page
- User visits `http://localhost:3000`
- Sees hero section with "Create Your DateMeDoc" button

### 2. Authentication
- Click "Sign Up" or "Sign In"
- Options:
  - Email/Password
  - Google OAuth (one-click)

### 3. Onboarding (5 Steps)

#### Step 1: Basic Information
- Full Name
- Age (18-100)
- Gender
- Occupation
- Education

#### Step 2: Location & Bio
- Location (City, Country)
- Bio (minimum 50 characters)
- Lifestyle
- Personality Type

#### Step 3: Interests & Hobbies
- Select multiple interests (Music, Movies, Travel, etc.)
- Select hobbies (Hiking, Painting, etc.)
- Minimum 3 selections required

#### Step 4: Looking For
- Gender preference
- Relationship type
- Age range preference
- Important values
- Deal breakers

#### Step 5: Social Media (Optional)
- Instagram URL
- Twitter/X URL
- LinkedIn URL
- TikTok URL
- Used for AI personality analysis

### 4. Dashboard
- View profile summary
- See matched users with compatibility scores
- Edit profile
- Sign out

## 🔐 Authentication Flow

```
User Registration:
1. User signs up with email/password or Google
2. Supabase creates auth user
3. User redirected to onboarding

User Login:
1. User signs in
2. Check if profile_completed = true
3. If true: redirect to /dashboard
4. If false: redirect to /onboarding

Google OAuth:
1. User clicks "Sign in with Google"
2. Redirects to Google consent screen
3. Google redirects back to Supabase callback
4. Supabase creates/updates user
5. Frontend callback handler checks profile status
6. Redirects to /onboarding or /dashboard
```

## 🎯 Matching Algorithm

The algorithm calculates compatibility scores (0-100%) based on:

- **Interest Matching (40%)**
  - Compares shared interests
  - Higher score for more common interests

- **Values Matching (30%)**
  - Shared core values (honesty, loyalty, etc.)

- **Deal Breakers (-50%)**
  - Automatic score reduction if deal breakers detected
  - Checks bio for keywords

- **Location Bonus (15%)**
  - Same city/location gets bonus points

- **Lifestyle Compatibility (15%)**
  - Matching lifestyle preferences

## 📡 API Endpoints

### Authentication
```
POST /api/auth/login - Reference only (use Supabase client)
POST /api/auth/logout - Sign out
GET /api/auth/me - Get current user
```

### User Profile
```
POST /api/users/onboarding - Complete onboarding ✅
GET /api/users/profile - Get user profile ✅
PUT /api/users/profile - Update profile ✅
GET /api/users/matches?limit=10 - Find matches ✅
POST /api/users/analyze - Trigger AI analysis
GET /api/users/analysis - Get personality analyses
```

## 🧪 Testing the Application

### 1. Test Sign Up
```bash
# Visit http://localhost:3000
# Click "Sign Up"
# Fill form:
#   - Name: John Doe
#   - Email: john@example.com
#   - Password: password123
#   - Confirm Password: password123
# Click "Create Account"
# Check email for verification link (if email configured)
```

### 2. Test Onboarding
```bash
# After sign up, you should be at /onboarding
# Complete all 5 steps:

Step 1:
- Full Name: John Doe
- Age: 28
- Gender: Male
- Occupation: Software Engineer
- Education: Bachelor's Degree

Step 2:
- Location: San Francisco, CA
- Bio: "I'm a software engineer who loves hiking..."
- Lifestyle: Active & Outdoorsy
- Personality: INTJ

Step 3:
- Select interests: Music, Travel, Technology
- Select hobbies: Hiking, Photography

Step 4:
- Looking for: Women
- Relationship: Long-term Relationship
- Age range: 24-32
- Values: Honesty, Kindness, Humor
- Deal breakers: Smoking, Dishonesty

Step 5:
- Add social media URLs (optional)

# Click "Complete Profile"
```

### 3. Test Dashboard
```bash
# You should be redirected to /dashboard
# See your profile summary
# View matched users
# Each match shows compatibility score
```

### 4. Test Google OAuth
```bash
# Go to /signin
# Click "Sign in with Google"
# Select Google account
# Grant permissions
# Should redirect to /onboarding (first time)
# Or /dashboard (if profile completed)
```

## 🔧 Troubleshooting

### CORS Issues
If you see CORS errors:
1. Check backend is running on port 3001
2. Verify `NEXT_PUBLIC_API_URL` in frontend .env
3. Check `FRONTEND_URL` in backend .env

### Authentication Errors
- Verify Supabase URLs and keys are correct
- Check Google OAuth credentials in Supabase
- Ensure redirect URIs match exactly

### Database Errors
- Run the SQL migration in Supabase
- Check service role key (not anon key) in backend
- Verify RLS policies are created

### No Matches Found
- Create multiple test accounts
- Ensure profile_completed = true
- Check age ranges and preferences

## 📊 Database Schema

### profiles table
```sql
- id (UUID, FK to auth.users)
- full_name (TEXT)
- age (INTEGER)
- gender (TEXT)
- location (TEXT)
- bio (TEXT)
- interests (TEXT[])
- looking_for (TEXT)
- relationship_type (TEXT)
- personality_type (TEXT)
- hobbies (TEXT[])
- lifestyle (TEXT)
- education (TEXT)
- occupation (TEXT)
- social_media_urls (JSONB)
- preferred_age_range (JSONB)
- deal_breakers (TEXT[])
- values (TEXT[])
- profile_completed (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### personality_analyses table
```sql
- id (UUID)
- user_id (UUID, FK to profiles)
- analysis_data (JSONB)
- created_at (TIMESTAMP)
```

## 🎨 UI Components Used

- Button (rounded-full, various variants)
- Input (white background, neutral borders)
- Label
- Select with SelectContent/SelectItem
- Textarea
- Checkbox
- Card with CardHeader/CardContent
- Progress indicator
- Loading spinner

## 🚀 Next Steps

1. ✅ Complete database setup
2. ✅ Configure environment variables
3. ✅ Test authentication flow
4. ✅ Test onboarding form
5. ✅ Test matching algorithm
6. 🔄 Add photo upload functionality
7. 🔄 Enhance AI personality analysis
8. 🔄 Add real-time chat
9. 🔄 Deploy to production

## 📞 Support

If you encounter issues:
1. Check all environment variables are set
2. Verify database migration was successful
3. Check browser console for errors
4. Check backend logs for API errors
5. Ensure ports 3000 and 3001 are available

## 🎉 Success!

If everything is set up correctly:
- ✅ Sign up/sign in works
- ✅ Google OAuth works
- ✅ Onboarding form saves data
- ✅ Dashboard shows profile
- ✅ Matches are calculated
- ✅ Frontend and backend communicate

You now have a fully functional dating app with authentication, onboarding, and matching! 🎊
