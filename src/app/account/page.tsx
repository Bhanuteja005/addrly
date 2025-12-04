"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoaderIcon, Heart, Users, Settings, LogOut, FileText, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [editedProfile, setEditedProfile] = useState<any>(null);

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
      const { data } = await apiClient.get('/api/users/profile');
      setProfile(data.profile);
      setEditedProfile(data.profile);
      
    } catch (error) {
      console.error('Profile load error:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await apiClient.put('/api/users/profile', editedProfile);
      setProfile(data.profile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
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
              <Heart className="w-6 h-6 text-pink-500" />
              <h1 className="text-2xl font-bold text-white">Addrly</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/home">
                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                  <FileText className="w-4 h-4 mr-2" />
                  Forms
                </Button>
              </Link>
              <Link href="/applications">
                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                  <Users className="w-4 h-4 mr-2" />
                  Applications
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
          <p className="text-neutral-400">Manage your account settings and profile</p>
        </div>

        {/* Profile Card */}
        <Card className="bg-neutral-900 border-neutral-800 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Profile</CardTitle>
                <CardDescription className="text-neutral-400">
                  Your personal information and dating preferences
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="rounded-full border-neutral-700 text-white hover:bg-neutral-800"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    className="rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-full bg-white text-black hover:bg-neutral-100"
                  >
                    {isSaving ? (
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8">
              <Avatar className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-500">
                <AvatarFallback className="text-2xl font-bold text-white bg-transparent">
                  {profile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {profile?.full_name}
                </h3>
                <p className="text-sm text-neutral-400 mb-3">
                  {profile?.email}
                </p>
                {isEditing && (
                  <Button variant="outline" size="sm" className="rounded-full border-neutral-700 text-neutral-400">
                    Change Photo
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="text-neutral-200">Full Name</Label>
                  <Input
                    id="fullName"
                    value={editedProfile?.full_name || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                    disabled={!isEditing}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <Label htmlFor="age" className="text-neutral-200">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={editedProfile?.age || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) })}
                    disabled={!isEditing}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="gender" className="text-neutral-200">Gender</Label>
                  <Input
                    id="gender"
                    value={editedProfile?.gender || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value })}
                    disabled={!isEditing}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-neutral-200">Location</Label>
                  <Input
                    id="location"
                    value={editedProfile?.location || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                    disabled={!isEditing}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-neutral-200">Bio</Label>
                <Textarea
                  id="bio"
                  value={editedProfile?.bio || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  disabled={!isEditing}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 disabled:opacity-50 min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Interests */}
              <div>
                <Label className="text-neutral-200 mb-3 block">Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {profile?.interests?.map((interest: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-neutral-800 text-neutral-200 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  )) || (
                    <span className="text-neutral-500 text-sm">No interests added</span>
                  )}
                </div>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-neutral-400 hover:text-white"
                    onClick={() => router.push('/onboarding')}
                  >
                    <Edit2 className="w-3 h-3 mr-2" />
                    Edit via Onboarding
                  </Button>
                )}
              </div>

              {/* Social Media */}
              <div className="border-t border-neutral-800 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Social Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="instagram" className="text-neutral-200">Instagram</Label>
                    <Input
                      id="instagram"
                      value={editedProfile?.social_media_urls?.instagram || ''}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        social_media_urls: {
                          ...editedProfile?.social_media_urls,
                          instagram: e.target.value
                        }
                      })}
                      disabled={!isEditing}
                      placeholder="@username"
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className="text-neutral-200">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={editedProfile?.social_media_urls?.linkedin || ''}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        social_media_urls: {
                          ...editedProfile?.social_media_urls,
                          linkedin: e.target.value
                        }
                      })}
                      disabled={!isEditing}
                      placeholder="linkedin.com/in/username"
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workspace Info Card */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Workspace</CardTitle>
            <CardDescription className="text-neutral-400">
              Your workspace information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white mb-1">mlr</p>
                <p className="text-xs text-neutral-400">Free plan</p>
              </div>
              <Button
                variant="outline"
                className="rounded-lg border-neutral-700 text-white hover:bg-neutral-800"
              >
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
