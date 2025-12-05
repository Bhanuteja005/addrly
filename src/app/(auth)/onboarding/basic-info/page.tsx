"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderIcon, ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function BasicInfoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/signin');
        return;
      }

      // Pre-fill from Google auth
      const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '';
      const avatar = session.user.user_metadata?.avatar_url || '';
      
      setFullName(name);
      setAvatarUrl(avatar);
      setPreviewUrl(avatar);

      // Check if already saved
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('auth_user_id', session.user.id)
          .single();

        if (profile?.full_name) {
          setFullName(profile.full_name);
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
      }
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session');
      }

      let finalAvatarUrl = avatarUrl;

      // Upload avatar if file selected
      if (avatarFile) {
        try {
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile);

          if (uploadError) {
            // If bucket doesn't exist, use the Google avatar URL or data URL
            console.warn('Storage upload failed, using provided URL:', uploadError);
            if (previewUrl && previewUrl.startsWith('data:')) {
              // For now, if storage fails, keep the existing avatar URL
              finalAvatarUrl = avatarUrl;
            } else {
              finalAvatarUrl = previewUrl;
            }
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);

            finalAvatarUrl = publicUrl;
          }
        } catch (storageError) {
          // Fallback to existing URL or preview URL
          console.warn('Storage error:', storageError);
          finalAvatarUrl = previewUrl || avatarUrl;
        }
      }

      // Generate slug from name
      const slug = fullName.trim().toLowerCase().replace(/\s+/g, '-');

      // Update profile - only include fields that exist
      const updateData: any = {
        auth_user_id: session.user.id,
        email: session.user.email,
        full_name: fullName.trim(),
        updated_at: new Date().toISOString(),
      };

      // Only add avatar_url if we have a value
      if (finalAvatarUrl) {
        updateData.avatar_url = finalAvatarUrl;
      }

      // Only add slug if we have a name
      if (slug) {
        updateData.slug = slug;
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert(updateData);

      if (error) throw error;

      toast.success("Basic information saved!");
      router.push('/onboarding');
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(err.message || "Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoaderIcon className="w-8 h-8 animate-spin text-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
      <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-[1200px] 2xl:max-w-[1400px] mx-auto">
        <Link href="/onboarding" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 md:mb-10 lg:mb-12">
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 mr-2" />
          <span className="text-base md:text-lg">Back to onboarding</span>
        </Link>

        <div className="mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-normal mb-4 md:mb-6">
            Basic Information
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground">
            Add your name and profile picture
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 lg:space-y-12">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
            <div className="relative">
              {previewUrl ? (
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 md:border-[6px] border-border">
                  <Image
                    src={previewUrl}
                    alt="Profile"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-4 md:border-[6px] border-border flex items-center justify-center text-white text-3xl md:text-4xl lg:text-5xl font-heading font-normal">
                  {fullName ? fullName.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="avatar" className="cursor-pointer">
                <Button type="button" variant="outline" className="rounded-full text-base md:text-lg px-6 md:px-8 py-6 md:py-7" asChild>
                  <span>
                    <Upload className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    {previewUrl ? 'Change Photo' : 'Upload Photo'}
                  </span>
                </Button>
              </Label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Name Input */}
          <div>
            <Label htmlFor="fullName" className="text-base md:text-lg lg:text-xl mb-2 md:mb-3 block">Full Name *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="rounded-xl text-base md:text-lg lg:text-xl h-12 md:h-14 lg:h-16 px-4 md:px-6"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/onboarding')}
              className="rounded-full w-full md:w-auto px-8 md:px-10 py-6 md:py-7 text-base md:text-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full flex-1 md:flex-initial px-8 md:px-10 lg:px-12 py-6 md:py-7 lg:py-8 text-base md:text-lg lg:text-xl"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="w-5 h-5 md:w-6 md:h-6 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save & Continue'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

