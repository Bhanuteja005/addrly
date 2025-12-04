export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  age?: number;
  gender?: string;
  location?: string;
  bio?: string;
  interests?: string[];
  looking_for?: string;
  relationship_type?: string;
  profile_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OnboardingFormData {
  full_name: string;
  age: number;
  gender: string;
  location: string;
  bio: string;
  interests: string[];
  looking_for: string;
  relationship_type: string;
  personality_type?: string;
  hobbies?: string[];
  lifestyle?: string;
  education?: string;
  occupation?: string;
  social_media_urls?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    tiktok?: string;
  };
  preferred_age_range?: {
    min: number;
    max: number;
  };
  deal_breakers?: string[];
  values?: string[];
}
