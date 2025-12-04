"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { LoaderIcon } from 'lucide-react';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error during auth callback:', error);
                router.push('/signin');
                return;
            }

            if (session) {
                // Check if profile is completed
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('profile_completed')
                    .eq('id', session.user.id)
                    .single();

                if (profile?.profile_completed) {
                    router.push('/home');
                } else {
                    router.push('/onboarding');
                }
            } else {
                router.push('/signin');
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
            <div className="text-center">
                <LoaderIcon className="w-8 h-8 animate-spin mx-auto text-neutral-900" />
                <p className="mt-4 text-neutral-600">Completing sign in...</p>
            </div>
        </div>
    );
}
