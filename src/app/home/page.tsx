"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderIcon, Plus, Heart, Users, Settings, LogOut, FileText, Trophy } from "lucide-react";
import Icons from "@/components/global/icons";
import { toast } from "sonner";
import Link from "next/link";

interface DatingForm {
  id: string;
  title: string;
  description: string;
  created_at: string;
  applications_count: number;
  status: string;
}

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [forms, setForms] = useState<DatingForm[]>([]);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/signin');
        return;
      }

      // Load profile
      const { data: profileData } = await apiClient.get('/api/users/profile');
      setProfile(profileData.profile);

      // Load user's dating forms
      const { data: formsData } = await apiClient.get('/api/forms');
      setForms(formsData.forms || []);
      
    } catch (error) {
      console.error('Home page load error:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateForm = () => {
    router.push('/forms/create');
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <LoaderIcon className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icons.icon className="w-6 h-6 text-white" />
              <h1 className="text-2xl font-bold text-white">Addrly</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/home">
                <Button variant="ghost" size="sm" className="text-white hover:bg-neutral-800">
                  <FileText className="w-4 h-4 mr-2" />
                  Forms
                </Button>
              </Link>
              <Link href="/applications">
                <Button variant="ghost" size="sm" className="text-white hover:bg-neutral-800">
                  <Users className="w-4 h-4 mr-2" />
                  Applications
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-neutral-800">
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="ghost" size="sm" className="text-white hover:bg-neutral-800">
                  <Settings className="w-4 h-4 mr-2" />
                  Account
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {profile?.full_name}!
          </h2>
          <p className="text-neutral-400">
            Create dating forms and manage your applications
          </p>
        </div>

        {/* Create Form Button */}
        <Card className="mb-8 bg-gradient-to-br from-purple-500/10 to-purple-500/10 border-purple-500/20">
          <CardContent className="py-12 text-center">
            <Icons.icon  className="w-16 h-16 text-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-4">
              Create Your Dating Form
            </h3>
            <p className="text-neutral-300 mb-6 max-w-md mx-auto">
              Design a custom form to find your perfect match. Add questions, preferences, and let potential dates apply!
            </p>
            <Button 
              onClick={handleCreateForm}
              className="rounded-full bg-gradient-to-r from-purple-500 to-purple-500 hover:from-purple-600 hover:to-purple-600 text-white font-medium px-8 py-6 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Dating Form
            </Button>
          </CardContent>
        </Card>

        {/* Forms List */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">Your Forms</h3>
        </div>

        {forms.length === 0 ? (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No forms yet
              </h3>
              <p className="text-neutral-400">
                Create your first dating form to start receiving applications!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-2xl transition-all bg-neutral-900 border-neutral-800 hover:border-pink-500/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white mb-2">{form.title || 'Untitled Form'}</CardTitle>
                      <CardDescription className="text-neutral-400 line-clamp-2">
                        {form.description || 'No description'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Users className="w-4 h-4" />
                      <span>{form.applications_count || 0} applications</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      form.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-neutral-700 text-neutral-400'
                    }`}>
                      {form.status || 'draft'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/forms/${form.id}/applications`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-full border-neutral-700 text-white hover:bg-neutral-800">
                        View Applications
                      </Button>
                    </Link>
                    <Link href={`/forms/${form.id}/edit`}>
                      <Button variant="ghost" className="rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
