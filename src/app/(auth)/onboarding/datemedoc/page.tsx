"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LoaderIcon, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { BlockEditor } from "@/components/editor/block-editor";

export default function DateMeDocPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    loadDoc();
  }, []);

  const loadDoc = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/signin');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('date_me_doc')
        .eq('id', session.user.id)
        .single();

      if (profile?.date_me_doc) {
        setContent(profile.date_me_doc);
      }
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Please add some content to your DateMeDoc");
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session');
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          date_me_doc: content.trim(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("DateMeDoc saved!");
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
      <div className="w-full max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <Link href="/onboarding" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 md:mb-10 lg:mb-12">
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 mr-2" />
          <span className="text-base md:text-lg">Back to onboarding</span>
        </Link>

        <div className="mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-normal mb-4 md:mb-6">
            Create Your DateMeDoc
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground">
            Click the + icon to add headings, images, and more
          </p>
        </div>

        {/* Editor */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-10 lg:p-12 min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
          <BlockEditor value={content} onChange={setContent} />
        </div>

        {/* Help Text */}
        <div className="mt-6 md:mt-8 p-4 md:p-6 bg-muted/50 rounded-xl">
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
            <strong>Tip:</strong> Hover over any line and click the + icon to add blocks. Press Enter to create a new paragraph.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-8 md:mt-10 lg:mt-12">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/onboarding')}
            className="rounded-full w-full md:w-auto px-8 md:px-10 py-6 md:py-7 text-base md:text-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="rounded-full flex-1 md:flex-initial px-8 md:px-10 lg:px-12 py-6 md:py-7 lg:py-8 text-base md:text-lg lg:text-xl"
          >
            {isLoading ? (
              <>
                <LoaderIcon className="w-5 h-5 md:w-6 md:h-6 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                Save & Continue
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
