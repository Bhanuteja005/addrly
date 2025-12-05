"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderIcon, Settings, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import Icons from "@/components/global/icons";

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  age: number;
  location: string;
  date_me_doc: string;
  application_form: any;
  applications_count?: number;
}

export default function ProfilePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [slug]);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/signin');
        return;
      }

      // Try to find profile by slug or user ID
      let { data: profileData, error: slugError } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!profileData || slugError) {
        // Fallback to user ID
        const { data: userProfileData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userProfileData) {
          profileData = userProfileData;
        }
      }

      if (!profileData) {
        toast.error("Profile not found");
        router.push('/onboarding');
        return;
      }

      setProfile(profileData as Profile);
      setIsOwner(profileData.id === session.user.id);

      // Get applications count
      if (profileData.id === session.user.id) {
        const { count } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('form_owner_id', session.user.id);
        
        if (profileData) {
          setProfile({ ...profileData as Profile, applications_count: count || 0 });
        }
      }
    } catch (error) {
      console.error('Load error:', error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMarkdown = (content: string) => {
    if (!content) return null;

    // Simple markdown rendering
    let html = content;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-heading font-normal mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-heading font-normal mt-8 mb-4">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-heading font-normal mt-10 mb-5">$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline" target="_blank">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-xl my-4 max-w-full" />');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p class="text-base font-base mb-4 leading-relaxed">');
    html = html.replace(/\n/g, '<br />');
    
    return `<div class="prose prose-lg max-w-none"><p class="text-base font-base mb-4 leading-relaxed">${html}</p></div>`;
  };

  const renderFormPreview = () => {
    if (!profile?.application_form) return null;

    const form = typeof profile.application_form === 'string' 
      ? JSON.parse(profile.application_form) 
      : profile.application_form;

    return (
      <div className="space-y-6">
        {form.fields?.map((field: any, idx: number) => (
          <div key={idx}>
            <Label className="text-base font-base mb-2 block">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.type === 'text' && (
              <Input
                placeholder={field.placeholder || 'Enter your answer'}
                className="rounded-xl"
                disabled
              />
            )}
            {field.type === 'textarea' && (
              <textarea
                placeholder={field.placeholder || 'Enter your answer'}
                className="w-full min-h-[100px] rounded-xl border border-input bg-background px-3 py-2 text-sm"
                disabled
              />
            )}
            {field.type === 'single-choice' && field.options && (
              <div className="space-y-2">
                {field.options.map((opt: string, optIdx: number) => (
                  <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name={`field-${idx}`} disabled className="rounded" />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {field.type === 'multi-choice' && field.options && (
              <div className="space-y-2">
                {field.options.map((opt: string, optIdx: number) => (
                  <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" disabled className="rounded" />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {field.type === 'slider' && (
              <div className="px-2">
                <input
                  type="range"
                  min={field.min || 0}
                  max={field.max || 100}
                  disabled
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{field.min || 0}</span>
                  <span>{field.max || 100}</span>
                </div>
              </div>
            )}
            {field.type === 'date' && (
              <Input
                type="date"
                disabled
                className="rounded-xl"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoaderIcon className="w-8 h-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const firstName = profile.full_name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 md:py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/home" className="flex items-center gap-2">
              <Icons.icon className="w-6 h-6 text-foreground" />
              <span className="text-xl font-base font-semibold">Addrly</span>
            </Link>
            <div className="flex items-center gap-3">
              {isOwner && (
                <>
                  <Button variant="outline" className="rounded-full" disabled>
                    {profile.applications_count || 0} applications
                  </Button>
                  <Link href="/account">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <h1 className="text-4xl font-heading font-normal">
            {firstName}'s DateMe Doc.
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl lg:max-w-5xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 md:py-16 lg:py-20">
        {/* Profile Picture */}
        <div className="mb-8">
          <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 border border-border overflow-hidden mb-4 flex items-center justify-center">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name || 'Profile'}
                width={800}
                height={256}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white text-6xl font-heading font-normal">
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-lg">
            {profile.age && <span className="font-base">{profile.age}</span>}
            {profile.location && (
              <>
                {profile.age && <span className="text-muted-foreground">•</span>}
                <span className="font-base">{profile.location}</span>
              </>
            )}
          </div>
        </div>

        {/* About Me Section */}
        {profile.date_me_doc && (
          <section className="mb-12">
            <h2 className="text-3xl font-heading font-normal mb-6">About Me</h2>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(profile.date_me_doc) || '' }}
            />
            
            {/* Embed placeholders - would be parsed from markdown in production */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="rounded-xl border border-border bg-green-50 p-6 min-h-[150px] flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Spotify Preview embed</span>
              </div>
              <div className="rounded-xl border border-border bg-muted p-6 min-h-[150px] flex items-center justify-center">
                <span className="text-sm text-muted-foreground">X Preview embed</span>
              </div>
            </div>
          </section>
        )}

        {/* What I'm Looking For Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-heading font-normal mb-6">What I'm Looking For</h2>
          <p className="text-base font-base leading-relaxed text-muted-foreground">
            {profile.date_me_doc 
              ? "This section would be extracted from your DateMeDoc or added separately."
              : "Add information about what you're looking for in your DateMeDoc."}
          </p>
        </section>

        {/* Application Form Section */}
        {profile.application_form && (
          <section className="mb-12">
            <h2 className="text-3xl font-heading font-normal mb-6">Application Form</h2>
            <div className="bg-card rounded-xl border border-border p-8">
              {renderFormPreview()}
              {isOwner ? (
                <div className="mt-8 pt-6 border-t border-border">
                  <Link href="/forms/create">
                    <Button className="w-full rounded-full" size="lg">
                      Edit Form
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="mt-8 pt-6 border-t border-border">
                  <Button className="w-full rounded-full" size="lg" disabled>
                    Submit Application
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {!profile.application_form && isOwner && (
          <section className="mb-12">
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <p className="text-muted-foreground mb-6">You haven't created an application form yet.</p>
              <Link href="/onboarding/form">
                <Button className="rounded-full" size="lg">
                  Create Form
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

