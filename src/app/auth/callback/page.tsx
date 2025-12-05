"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          toast.error("Authentication failed");
          router.push("/signin");
          return;
        }

        if (data.session) {
          // Check if user has completed all 3 onboarding steps
          const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("name, slug")
            .eq("auth_user_id", data.session.user.id)
            .single();

          // Handle case where profile doesn't exist yet (new user)
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Profile fetch error:", profileError);
            // Still redirect to onboarding for new users
            router.push("/onboarding");
            return;
          }

          if (profile && profile.name) {
            // Profile exists - redirect to home
            router.push("/home");
          } else {
            // Incomplete onboarding - redirect to onboarding
            router.push("/onboarding");
          }
        } else {
          router.push("/signin");
        }
      } catch (error) {
        console.error("Callback handling error:", error);
        toast.error("Something went wrong");
        router.push("/signin");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <LoaderIcon className="w-8 h-8 animate-spin text-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}