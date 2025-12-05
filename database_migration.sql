-- Migration script to add missing columns to profiles table
-- Run this in your Supabase SQL Editor

-- Add avatar_url column (text for storing image URLs)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add slug column for profile URLs
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add date_me_doc column (text for markdown content)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS date_me_doc TEXT;

-- Add application_form column (jsonb for form structure)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS application_form JSONB;

-- Add has_form boolean column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS has_form BOOLEAN DEFAULT FALSE;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON profiles(slug);

-- Add comment for documentation
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user profile picture';
COMMENT ON COLUMN profiles.slug IS 'URL-friendly version of user name';
COMMENT ON COLUMN profiles.date_me_doc IS 'Markdown content for DateMeDoc';
COMMENT ON COLUMN profiles.application_form IS 'JSON structure for application form fields';
COMMENT ON COLUMN profiles.has_form IS 'Whether user has created an application form';

