import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { createClient } from '@supabase/supabase-js';

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { limit = 3 } = await request.json();
    
    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get applications for the user's form
    // Join with user_profiles table (not profiles) to get applicant information
    // The applications table should have applicant_id field that references user_profiles.id
    const { data: applications, error: appsError } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        user_profiles (
          id,
          full_name,
          age,
          location,
          date_me_doc,
          application_form
        )
      `)
      .eq('form_owner_id', user.id)
      .order('created_at', { ascending: false });

    if (appsError) {
      console.error('Error fetching applications:', appsError);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    if (!applications || applications.length === 0) {
      return NextResponse.json({ topCandidates: [] });
    }

    // Get user profile for matching
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    // Score applications based on compatibility
    const scoredApplications = applications.map((app: any) => {
      let score = 0;
      // Handle both array and object cases for joined data
      const candidateProfile = Array.isArray(app.user_profiles) 
        ? app.user_profiles[0] 
        : app.user_profiles;

      // Add scoring logic here based on your matching criteria
      // This is a placeholder - adjust based on your actual matching algorithm
      if (candidateProfile && userProfile) {
        // Example scoring logic (customize based on your needs)
        if (userProfile.location && candidateProfile.location && 
            candidateProfile.location === userProfile.location) {
          score += 10;
        }
        if (userProfile.age && candidateProfile.age) {
          const ageDiff = Math.abs(userProfile.age - candidateProfile.age);
          score += Math.max(0, 10 - ageDiff);
        }
        // Add more scoring criteria as needed
      }

      return {
        ...app,
        ai_score: score,
      };
    });

    // Sort by score and return top candidates
    const topCandidates = scoredApplications
      .sort((a: any, b: any) => b.ai_score - a.ai_score)
      .slice(0, limit);

    return NextResponse.json({ topCandidates });
  } catch (error: any) {
    console.error('AI selection error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

