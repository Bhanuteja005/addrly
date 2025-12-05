"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LoaderIcon, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface OnboardingStatus {
  basicInfo: boolean;
  dateMeDoc: boolean;
  form: boolean;
}

export default function OnboardingPage() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
  const [status, setStatus] = useState<OnboardingStatus>({
    basicInfo: false,
    dateMeDoc: false,
    form: false,
  });
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

    useEffect(() => {
    checkAuthAndStatus();
  }, []);

  const checkAuthAndStatus = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
      
            if (!session) {
                router.push('/signin');
                return;
            }

      // Get user info
      const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '';
      const avatar = session.user.user_metadata?.avatar_url || '';
      setUserName(name);
      setUserAvatar(avatar);

      // Check completion status
            const { data: profile } = await supabase
                .from('profiles')
        .select('*')
                .eq('id', session.user.id)
                .single();

      if (profile) {
        setStatus({
          basicInfo: !!(profile.full_name && (profile.avatar_url || profile.avatar_url === null)),
          dateMeDoc: !!profile.date_me_doc,
          form: !!profile.has_form,
        });

        // If all complete, generate slug and redirect to profile preview
        if (profile.full_name && profile.date_me_doc && profile.has_form) {
          const slug = profile.full_name.toLowerCase().replace(/\s+/g, '-');
          
          // Update profile with slug if not exists
          if (!profile.slug) {
            await supabase
              .from('profiles')
              .update({ slug })
              .eq('id', session.user.id);
          }
          
          router.push(`/profile/${slug}`);
            return;
        }
      }
    } catch (error) {
      console.error('Status check error:', error);
        } finally {
      setIsChecking(false);
    }
  };

    if (isChecking) {
        return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoaderIcon className="w-8 h-8 animate-spin text-foreground" />
            </div>
        );
    }

  const allComplete = status.basicInfo && status.dateMeDoc && status.form;

  return (
    <div className="min-h-screen bg-background py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
      <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-normal mb-4 md:mb-6">
            Complete Your Profile
                                    </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground">
            Set up your DateMeDoc in 3 simple steps
                                    </p>
                                </div>

        <div className="space-y-4 md:space-y-6 mb-12 md:mb-16">
          {/* Step 1: Basic Information */}
          <Link href="/onboarding/basic-info">
            <div className={`group relative flex items-center gap-4 md:gap-6 p-6 md:p-8 lg:p-10 rounded-2xl border-2 transition-all ${
              status.basicInfo 
                ? 'border-primary bg-card' 
                : 'border-border/50 bg-card/50 hover:border-border hover:bg-card'
            }`}>
              <div className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-xl md:text-2xl lg:text-3xl font-heading font-normal ${
                status.basicInfo 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                1
                                    </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-normal mb-1 md:mb-2">
                  Basic Information
                </h2>
                <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                  Add your name and profile picture
                                    </p>
                                </div>
              <ArrowRight className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                                    </div>
          </Link>

          {/* Step 2: DateMeDoc */}
          <Link href="/onboarding/datemedoc">
            <div className={`group relative flex items-center gap-4 md:gap-6 p-6 md:p-8 lg:p-10 rounded-2xl border-2 transition-all ${
              status.dateMeDoc 
                ? 'border-primary bg-card' 
                : 'border-border/50 bg-card/50 hover:border-border hover:bg-card'
            }`}>
              <div className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-xl md:text-2xl lg:text-3xl font-heading font-normal ${
                status.dateMeDoc 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                2
                                    </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-normal mb-1 md:mb-2">
                  Create Your DateMeDoc
                </h2>
                <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                  Write about yourself with rich text, images, and embeds
                                    </p>
                                </div>
              <ArrowRight className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                                                </div>
          </Link>

          {/* Step 3: Application Form */}
          <Link href="/onboarding/form">
            <div className={`group relative flex items-center gap-4 md:gap-6 p-6 md:p-8 lg:p-10 rounded-2xl border-2 transition-all ${
              status.form 
                ? 'border-primary bg-card' 
                : 'border-border/50 bg-card/50 hover:border-border hover:bg-card'
            }`}>
              <div className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-xl md:text-2xl lg:text-3xl font-heading font-normal ${
                status.form 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                3
                                                </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-normal mb-1 md:mb-2">
                  Create Application Form
                </h2>
                <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                  Build questions for potential dates to answer
                                    </p>
                                </div>
              <ArrowRight className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                                    </div>
          </Link>
                                    </div>

        {allComplete && (
          <div className="text-center">
            <Button
              onClick={() => router.push(`/profile/${userName.toLowerCase().replace(/\s+/g, '-')}`)}
              size="lg"
              className="rounded-full px-8 md:px-10 lg:px-12 py-6 md:py-7 lg:py-8 text-base md:text-lg lg:text-xl"
            >
              View Your Profile
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
            </Button>
                            </div>
                        )}
            </div>
        </div>
    );
}
