# 🔗 Frontend-Backend API Integration

This document shows exactly how the frontend communicates with the backend.

## 🛠️ API Client Setup

### Location: `src/lib/api/client.ts`

```typescript
import axios from 'axios';
import { supabase } from '../supabase/client';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // from NEXT_PUBLIC_API_URL
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Automatically adds JWT token to all requests
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});
```

## 📡 API Calls by Page

### 1. Sign In Page (`/signin`)
**File:** `src/app/(auth)/signin/page.tsx`

**Supabase Auth (not backend API):**
```typescript
// Email/Password Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: emailAddress,
  password: password,
});

// Google OAuth Sign In
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
});
```

**After Sign In:**
```typescript
// Check if profile is completed
const { data: profile } = await supabase
  .from('profiles')
  .select('profile_completed')
  .eq('id', data.user.id)
  .single();

// Redirect based on profile status
if (profile?.profile_completed) {
  router.push('/dashboard');
} else {
  router.push('/onboarding');
}
```

### 2. Sign Up Page (`/signup`)
**File:** `src/app/(auth)/signup/page.tsx`

**Supabase Auth:**
```typescript
// Email/Password Sign Up
const { data, error } = await supabase.auth.signUp({
  email: emailAddress,
  password: password,
  options: {
    data: { full_name: fullName },
    emailRedirectTo: `${window.location.origin}/auth/callback`
  }
});

// Google OAuth Sign Up (same as sign in)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
});
```

### 3. Onboarding Page (`/onboarding`)
**File:** `src/app/(auth)/onboarding/page.tsx`

**Backend API Call:**
```typescript
// POST /api/users/onboarding
const response = await apiClient.post('/api/users/onboarding', {
  full_name: "John Doe",
  age: 28,
  gender: "male",
  location: "San Francisco, CA",
  bio: "Software engineer who loves hiking...",
  interests: ["Music", "Travel", "Technology"],
  looking_for: "women",
  relationship_type: "long-term",
  personality_type: "INTJ",
  hobbies: ["Hiking", "Photography"],
  lifestyle: "active",
  education: "bachelors",
  occupation: "Software Engineer",
  social_media_urls: {
    instagram: "https://instagram.com/johndoe",
    twitter: "",
    linkedin: "",
    tiktok: ""
  },
  preferred_age_range: {
    min: 24,
    max: 32
  },
  deal_breakers: ["Smoking", "Dishonesty"],
  values: ["Honesty", "Kindness", "Humor"]
});

// Response
{
  success: true,
  message: "Onboarding completed successfully",
  profile: { /* profile data */ }
}
```

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### 4. Dashboard Page (`/dashboard`)
**File:** `src/app/dashboard/page.tsx`

**API Calls:**

**Get User Profile:**
```typescript
// GET /api/users/profile
const { data } = await apiClient.get('/api/users/profile');

// Response
{
  success: true,
  profile: {
    id: "uuid",
    full_name: "John Doe",
    age: 28,
    location: "San Francisco, CA",
    bio: "...",
    interests: ["Music", "Travel"],
    // ... all profile fields
  }
}
```

**Get Matches:**
```typescript
// GET /api/users/matches?limit=10
const { data } = await apiClient.get('/api/users/matches?limit=10');

// Response
{
  success: true,
  matches: [
    {
      id: "uuid",
      full_name: "Jane Smith",
      age: 26,
      location: "San Francisco, CA",
      bio: "...",
      interests: ["Music", "Fitness", "Travel"],
      match_score: 85.5  // 0-100 compatibility score
    },
    // ... more matches
  ]
}
```

## 🔐 Authentication Flow

### How JWT Token is Used

1. **User Signs In/Up:**
   ```
   Supabase Auth → Returns JWT token
   Token stored in localStorage automatically
   ```

2. **Making API Calls:**
   ```
   Frontend → Get token from Supabase
   Frontend → Add to Authorization header
   Frontend → Send request to backend
   ```

3. **Backend Validates:**
   ```
   Backend → Extract Bearer token
   Backend → Verify with Supabase
   Backend → Get user ID
   Backend → Execute request
   ```

### Token in Request Headers

```http
GET /api/users/profile HTTP/1.1
Host: localhost:3001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzA...
Content-Type: application/json
```

## 🔄 Data Flow Diagram

### Onboarding Submission

```
User fills form
    ↓
[Frontend] Validates data
    ↓
[Frontend] Gets JWT token from Supabase
    ↓
[Frontend] POST /api/users/onboarding with token
    ↓
[Backend] Validates JWT token
    ↓
[Backend] Extracts user ID from token
    ↓
[Backend] Validates form data
    ↓
[Backend] Saves to Supabase database
    ↓
[Backend] Returns success + profile data
    ↓
[Frontend] Redirects to /dashboard
```

### Getting Matches

```
User lands on dashboard
    ↓
[Frontend] Gets JWT token
    ↓
[Frontend] GET /api/users/matches?limit=10
    ↓
[Backend] Validates token
    ↓
[Backend] Gets user profile from database
    ↓
[Backend] Queries other profiles
    ↓
[Backend] Filters by:
  - Gender preference
  - Age range
  - Profile completed
    ↓
[Backend] Calculates match scores:
  - Interest matching (40%)
  - Value matching (30%)
  - Location bonus (15%)
  - Lifestyle match (15%)
  - Deal breakers (-50%)
    ↓
[Backend] Sorts by score (high to low)
    ↓
[Backend] Returns top N matches
    ↓
[Frontend] Displays match cards
```

## 📝 Request/Response Examples

### Complete Onboarding Request

**Request:**
```http
POST /api/users/onboarding HTTP/1.1
Host: localhost:3001
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "full_name": "John Doe",
  "age": 28,
  "gender": "male",
  "location": "San Francisco, CA",
  "bio": "Software engineer who loves hiking, photography, and trying new restaurants. Looking for someone who shares my love for adventure and good conversations.",
  "interests": ["Music", "Travel", "Technology", "Fitness"],
  "looking_for": "women",
  "relationship_type": "long-term",
  "personality_type": "INTJ",
  "hobbies": ["Hiking", "Photography", "Coding"],
  "lifestyle": "active",
  "education": "bachelors",
  "occupation": "Software Engineer",
  "social_media_urls": {
    "instagram": "https://instagram.com/johndoe",
    "twitter": "https://twitter.com/johndoe",
    "linkedin": "",
    "tiktok": ""
  },
  "preferred_age_range": {
    "min": 24,
    "max": 32
  },
  "deal_breakers": ["Smoking", "Dishonesty"],
  "values": ["Honesty", "Kindness", "Humor", "Ambition"]
}
```

**Response (Success):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Onboarding completed successfully",
  "profile": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "auth_user_id": "123e4567-e89b-12d3-a456-426614174000",
    "full_name": "John Doe",
    "age": 28,
    "gender": "male",
    "location": "San Francisco, CA",
    "bio": "Software engineer who loves...",
    "interests": ["Music", "Travel", "Technology", "Fitness"],
    "looking_for": "women",
    "relationship_type": "long-term",
    "personality_type": "INTJ",
    "hobbies": ["Hiking", "Photography", "Coding"],
    "lifestyle": "active",
    "education": "bachelors",
    "occupation": "Software Engineer",
    "social_media_urls": {
      "instagram": "https://instagram.com/johndoe",
      "twitter": "https://twitter.com/johndoe",
      "linkedin": "",
      "tiktok": ""
    },
    "preferred_age_range": {
      "min": 24,
      "max": 32
    },
    "deal_breakers": ["Smoking", "Dishonesty"],
    "values": ["Honesty", "Kindness", "Humor", "Ambition"],
    "profile_completed": true,
    "created_at": "2024-12-04T17:30:00.000Z",
    "updated_at": "2024-12-04T17:30:00.000Z"
  }
}
```

**Response (Error - Missing Fields):**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": "Missing required fields"
}
```

**Response (Error - Invalid Token):**
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "error": "Invalid or expired token"
}
```

### Get Matches Response

**Request:**
```http
GET /api/users/matches?limit=10 HTTP/1.1
Host: localhost:3001
Authorization: Bearer eyJhbGc...
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "matches": [
    {
      "id": "uuid-1",
      "full_name": "Jane Smith",
      "age": 26,
      "gender": "female",
      "location": "San Francisco, CA",
      "bio": "Marketing professional who loves yoga and weekend hikes...",
      "interests": ["Music", "Fitness", "Travel", "Art"],
      "hobbies": ["Yoga", "Hiking", "Painting"],
      "values": ["Honesty", "Kindness", "Ambition"],
      "match_score": 85.5
    },
    {
      "id": "uuid-2",
      "full_name": "Sarah Johnson",
      "age": 27,
      "gender": "female",
      "location": "Oakland, CA",
      "bio": "Teacher and book lover looking for meaningful connections...",
      "interests": ["Reading", "Travel", "Music"],
      "hobbies": ["Reading", "Hiking", "Cooking"],
      "values": ["Kindness", "Humor", "Family-Oriented"],
      "match_score": 72.3
    }
  ]
}
```

## 🔍 How Matching Works

### Match Score Calculation

For each potential match:

```javascript
let score = 0;

// 1. Interest Matching (40%)
const commonInterests = userInterests.filter(i => 
  matchInterests.includes(i)
).length;
score += (commonInterests / userInterests.length) * 40;

// 2. Value Matching (30%)
const commonValues = userValues.filter(v => 
  matchValues.includes(v)
).length;
score += (commonValues / userValues.length) * 30;

// 3. Location Bonus (15%)
if (userLocation === matchLocation) {
  score += 15;
}

// 4. Lifestyle Match (15%)
if (userLifestyle === matchLifestyle) {
  score += 15;
}

// 5. Deal Breaker Penalty (-50%)
const hasDealBreaker = userDealBreakers.some(db =>
  matchBio.toLowerCase().includes(db.toLowerCase())
);
if (hasDealBreaker) {
  score -= 50;
}

// Ensure score is between 0-100
return Math.max(0, Math.min(100, score));
```

## 🚨 Error Handling

### Frontend Error Handling

```typescript
try {
  const response = await apiClient.post('/api/users/onboarding', formData);
  
  if (response.data.success) {
    toast.success("Profile completed successfully!");
    router.push('/dashboard');
  }
} catch (err: any) {
  console.error('Onboarding error:', err);
  
  // Handle specific error codes
  if (err.response?.status === 401) {
    toast.error("Please sign in again");
    router.push('/signin');
  } else if (err.response?.status === 400) {
    toast.error(err.response.data.error || "Invalid data");
  } else {
    toast.error("Failed to complete onboarding. Please try again.");
  }
}
```

### Backend Error Responses

```javascript
// 400 - Bad Request
{
  "success": false,
  "error": "Missing required fields"
}

// 401 - Unauthorized
{
  "success": false,
  "error": "Invalid or expired token"
}

// 404 - Not Found
{
  "success": false,
  "error": "Profile not found"
}

// 500 - Internal Server Error
{
  "success": false,
  "error": "Failed to complete onboarding"
}
```

## ✅ Testing API Integration

### Using Browser DevTools

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Submit onboarding form
4. Look for POST request to `/api/users/onboarding`
5. Check request headers for Authorization
6. Check response status and data

### Using curl

```bash
# Get JWT token from browser localStorage first
# Then test API:

curl -X POST http://localhost:3001/api/users/onboarding \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "age": 25,
    "gender": "male",
    "location": "New York, NY",
    "bio": "This is a test bio that is more than 50 characters long.",
    "interests": ["Music"],
    "looking_for": "women",
    "relationship_type": "dating"
  }'
```

## 🔄 Token Refresh

The API client automatically refreshes expired tokens:

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, refresh it
      const { data: { session } } = await supabase.auth.refreshSession();
      
      if (session) {
        // Retry the request with new token
        error.config.headers.Authorization = `Bearer ${session.access_token}`;
        return apiClient(error.config);
      }
    }
    return Promise.reject(error);
  }
);
```

---

**Everything is connected and working!** The frontend securely communicates with the backend using JWT tokens, and all data flows correctly from sign up to matching. 🎉
