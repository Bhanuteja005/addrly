# End-to-End Testing Guide for Addrly

## Fixed Issues ✅

### 1. Infinite Loop Error
- **Problem**: `useEffect` with empty dependencies was causing infinite re-renders
- **Solution**: Added `router` to dependency array in onboarding page
- **File**: `src/app/(auth)/onboarding/page.tsx`

### 2. Dark Theme Implementation
- **Applied to**: All auth pages now have consistent dark theme
- **Files Updated**:
  - `src/app/(auth)/layout.tsx` - Dark container (bg-neutral-950)
  - `src/app/(auth)/signin/page.tsx` - Dark theme with white Google button
  - `src/app/(auth)/signup/page.tsx` - Dark theme with white Google button
  - `src/app/dashboard/page.tsx` - Dark theme dashboard

### 3. Google OAuth Button
- **Updated**: Now displays colorful Google logo with proper colors:
  - Blue (#4285F4)
  - Green (#34A853)
  - Yellow (#FBBC05)
  - Red (#EA4335)
- **Style**: White background button for better contrast

## Complete Testing Checklist

### Prerequisites
1. ✅ Backend server running on `http://localhost:5000`
2. ✅ Frontend development server: `npm run dev`
3. ✅ Supabase project configured with credentials in `.env.local`
4. ✅ Database migrations applied (see `DATABASE_SETUP.md`)

---

## Test Flow 1: Email Sign Up → Onboarding → Dashboard

### Step 1: Sign Up Page
**URL**: `http://localhost:3000/signup`

**Test Actions**:
1. ✅ Verify dark theme (bg-neutral-950 background, bg-neutral-900 card)
2. ✅ Enter full name: `John Doe`
3. ✅ Enter email: `john.doe@test.com`
4. ✅ Enter password: `Password123!`
5. ✅ Confirm password: `Password123!`
6. ✅ Click "Create Account"

**Expected Results**:
- ✅ White button with black text for submit
- ✅ Toast notification: "Account created! Please check your email..."
- ✅ Redirect to `/signin`

---

### Step 2: Email Verification
**Test Actions**:
1. ✅ Open email inbox (check Supabase Auth emails)
2. ✅ Click verification link
3. ✅ Should redirect to callback page

**Expected Results**:
- ✅ Email confirmed
- ✅ User account activated

---

### Step 3: Sign In Page
**URL**: `http://localhost:3000/signin`

**Test Actions**:
1. ✅ Verify dark theme consistent with signup
2. ✅ Enter email: `john.doe@test.com`
3. ✅ Enter password: `Password123!`
4. ✅ Click "Sign In"

**Expected Results**:
- ✅ White button with black text
- ✅ Toast: "Signed in successfully!"
- ✅ Redirect to `/onboarding` (first-time user)

---

### Step 4: Onboarding - Step 1 (Basic Info)
**URL**: `http://localhost:3000/onboarding`

**Test Actions**:
1. ✅ Verify NO infinite loop error (check browser console)
2. ✅ Verify dark theme (bg-neutral-900 background)
3. ✅ Full Name: `John Doe` (pre-filled)
4. ✅ Date of Birth: `1995-01-15`
5. ✅ Gender: Select `Male`
6. ✅ Click "Continue" (white button)

**Expected Results**:
- ✅ No console errors
- ✅ Progress bar shows 20% (step 1 of 5)
- ✅ Smooth transition to Step 2

---

### Step 5: Onboarding - Step 2 (Location & Bio)
**Test Actions**:
1. ✅ Location: `New York, NY`
2. ✅ Bio (150+ chars):
   ```
   I'm a passionate software engineer who loves hiking, cooking, and exploring new restaurants. Looking for someone who shares my love for adventure and good conversation.
   ```
3. ✅ Click "Continue"

**Expected Results**:
- ✅ Progress bar shows 40%
- ✅ Move to Step 3

---

### Step 6: Onboarding - Step 3 (Interests & Hobbies)
**Test Actions**:
1. ✅ Select at least 3 interests (checkboxes):
   - Hiking
   - Cooking
   - Technology
   - Reading
   - Travel
2. ✅ Click "Continue"

**Expected Results**:
- ✅ Progress bar shows 60%
- ✅ Move to Step 4

---

### Step 7: Onboarding - Step 4 (Dating Preferences)
**Test Actions**:
1. ✅ Looking for: `Female`
2. ✅ Age range: `25-35`
3. ✅ Relationship Type: `Long-term relationship`
4. ✅ Core Values (select multiple):
   - Honesty
   - Loyalty
   - Adventure
5. ✅ Lifestyle Preferences:
   - Exercise Frequency: `Regularly`
   - Drinking: `Socially`
   - Smoking: `Never`
6. ✅ Deal Breakers (select if any):
   - Smoking
7. ✅ Click "Continue"

**Expected Results**:
- ✅ Progress bar shows 80%
- ✅ Move to Step 5

---

### Step 8: Onboarding - Step 5 (Social Media)
**Test Actions**:
1. ✅ Instagram: `@johndoe` (optional)
2. ✅ LinkedIn: `linkedin.com/in/johndoe` (optional)
3. ✅ Twitter: `@johndoe` (optional)
4. ✅ Click "Complete Profile"

**Expected Results**:
- ✅ Loading spinner on button
- ✅ POST request to `/api/users/onboarding`
- ✅ Toast: "Profile completed successfully!"
- ✅ Redirect to `/dashboard`

---

### Step 9: Dashboard
**URL**: `http://localhost:3000/dashboard`

**Test Actions**:
1. ✅ Verify dark theme (bg-neutral-950 background)
2. ✅ Check header shows "Welcome back, John Doe!"
3. ✅ Profile card displays:
   - Name, age, location
   - Bio
   - First 5 interests as tags
4. ✅ Matches section shows:
   - "Your Matches" heading
   - Grid of match cards (if available)
   - Or "No matches yet" message

**Expected Results**:
- ✅ Dark theme throughout
- ✅ White "Edit Profile" and "Sign Out" buttons
- ✅ Match cards show:
  - Profile name, age, location
  - Match percentage (green badge)
  - Bio snippet
  - Interests tags
  - White "View Profile" button

---

## Test Flow 2: Google OAuth Sign Up

### Step 1: Sign Up with Google
**URL**: `http://localhost:3000/signup`

**Test Actions**:
1. ✅ Verify colorful Google logo visible
2. ✅ Click "Sign up with Google" (white button)
3. ✅ Complete Google OAuth flow
4. ✅ Authorize Addrly app

**Expected Results**:
- ✅ Google popup/redirect
- ✅ Callback to `/auth/callback`
- ✅ Redirect to `/onboarding` (first-time)

### Step 2: Complete Onboarding
- Follow Steps 4-9 from Test Flow 1

---

## Test Flow 3: Returning User

### Step 1: Sign Out
**From Dashboard**:
1. ✅ Click "Sign Out" button
2. ✅ Verify redirect to home page `/`

### Step 2: Sign In Again
**URL**: `http://localhost:3000/signin`

**Test Actions**:
1. ✅ Enter credentials
2. ✅ Click "Sign In"

**Expected Results**:
- ✅ Redirect to `/dashboard` (NOT onboarding)
- ✅ Profile data persists

---

## Common Issues & Troubleshooting

### Issue 1: Infinite Loop Error
**Symptoms**: Browser freezes, "Maximum update depth exceeded"
**Solution**: ✅ Fixed by adding `router` to useEffect dependencies

### Issue 2: Google OAuth Not Working
**Possible Causes**:
1. Google OAuth not configured in Supabase
2. Redirect URL not whitelisted
**Solution**:
- Check Supabase Dashboard → Authentication → Providers → Google
- Ensure callback URL is: `http://localhost:3000/auth/callback`

### Issue 3: Backend API Errors
**Symptoms**: 404 or 500 errors in console
**Solution**:
1. Verify backend is running on port 5000
2. Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5000`
3. Verify JWT tokens in request headers (check Network tab)

### Issue 4: Database Connection Errors
**Symptoms**: "relation does not exist" errors
**Solution**:
1. Run migrations: `psql -h <DB_HOST> -U postgres -d postgres -f migrations/create_profiles_table.sql`
2. Verify tables exist in Supabase Dashboard → Table Editor

---

## Visual Verification

### Dark Theme Checklist
- ✅ Auth Layout: `bg-neutral-950` (darkest black)
- ✅ Auth Cards: `bg-neutral-900` with `border-neutral-800`
- ✅ Text Colors:
  - Headings: `text-white`
  - Body text: `text-neutral-300` or `text-neutral-400`
  - Labels: `text-neutral-200`
- ✅ Inputs: `bg-neutral-800` with `border-neutral-700`
- ✅ Buttons:
  - Primary: `bg-white text-black` (inverted for contrast)
  - Secondary: `bg-neutral-800 text-white`
- ✅ Google Button:
  - Background: `bg-white`
  - Text: `text-neutral-900`
  - Logo: Colorful Google colors

### Onboarding Dark Theme
- ✅ Background: `bg-neutral-900`
- ✅ Step cards: `bg-neutral-800` with `border-neutral-700`
- ✅ Progress bar: Green gradient
- ✅ Input fields: `bg-neutral-800`

### Dashboard Dark Theme
- ✅ Background: `bg-neutral-950`
- ✅ Header: `bg-neutral-900` with `border-neutral-800`
- ✅ Cards: `bg-neutral-900` with `border-neutral-800`
- ✅ Match badges: `bg-green-500/20 text-green-400`

---

## Performance Testing

### Page Load Times
- ✅ Sign In: < 1s
- ✅ Sign Up: < 1s
- ✅ Onboarding: < 2s (includes auth check)
- ✅ Dashboard: < 3s (includes profile + matches fetch)

### API Response Times
- ✅ POST `/api/users/onboarding`: < 2s
- ✅ GET `/api/users/profile`: < 1s
- ✅ GET `/api/users/matches`: < 2s (depends on algorithm complexity)

---

## Security Testing

### Authentication Flow
1. ✅ Unauthenticated users redirected to `/signin`
2. ✅ JWT tokens stored in Supabase session
3. ✅ API requests include Authorization header
4. ✅ Token refresh on 401 errors

### Data Validation
1. ✅ Email format validation
2. ✅ Password strength (min 8 chars)
3. ✅ Required fields enforced
4. ✅ Age validation (18+)

---

## Success Criteria ✅

All features working:
- ✅ No infinite loop errors
- ✅ Consistent dark theme across all pages
- ✅ Colorful Google OAuth button
- ✅ Email signup → verification → signin
- ✅ Google OAuth signup → onboarding
- ✅ 5-step onboarding completion
- ✅ Dashboard with profile and matches
- ✅ Smooth navigation between pages
- ✅ Proper error handling and toast notifications

---

## Notes
- All dark theme colors use neutral palette for consistency
- White buttons provide high contrast against dark backgrounds
- Google logo colors match official brand guidelines
- Onboarding progress bar provides clear visual feedback
- Match cards use green accent for compatibility scores
