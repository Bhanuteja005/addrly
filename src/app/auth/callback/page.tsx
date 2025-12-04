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
          // Check if user has completed onboarding
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", data.session.user.id)
            .single();

          if (profile) {
            router.push("/home");
          } else {
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
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="text-center">
        <LoaderIcon className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
        <p className="text-neutral-400">Completing sign in...</p>
      </div>
    </div>
  );
}