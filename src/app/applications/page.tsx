"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icons from "@/components/global/icons";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoaderIcon, Heart, Users, Settings, LogOut, FileText, Sparkles, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Application {
  id: string;
  applicant_name: string;
  applicant_email: string;
  form_name: string;
  applied_on: string;
  status: 'new' | 'shortlisted' | 'archived';
  ai_score?: number;
  based_in?: string;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [topCandidates, setTopCandidates] = useState<Application[]>([]);
  const [showTopCandidates, setShowTopCandidates] = useState(false);

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

      // Load all applications
      const { data } = await apiClient.get('/api/applications');
      setApplications(data.applications || []);
      
    } catch (error) {
      console.error('Applications load error:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAISelection = async () => {
    setIsAILoading(true);
    try {
      const { data } = await apiClient.post('/api/applications/ai-select', {
        limit: 3
      });
      
      setTopCandidates(data.topCandidates || []);
      setShowTopCandidates(true);
      toast.success('AI has selected the top 3 candidates!');
    } catch (error) {
      console.error('AI selection error:', error);
      toast.error('Failed to run AI selection');
    } finally {
      setIsAILoading(false);
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400';
      case 'shortlisted':
        return 'bg-green-500/20 text-green-400';
      case 'archived':
        return 'bg-neutral-700 text-neutral-400';
      default:
        return 'bg-neutral-700 text-neutral-400';
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
                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
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
              <Link href="/account">
                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
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
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">All Applications</h2>
            <p className="text-neutral-400">
              Showing {applications.length} applications
            </p>
          </div>
          <Button
            onClick={handleAISelection}
            disabled={isAILoading || applications.length === 0}
            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-6"
          >
            {isAILoading ? (
              <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            AI Assistant
          </Button>
        </div>

        {/* Top Candidates Card */}
        {showTopCandidates && topCandidates.length > 0 && (
          <Card className="mb-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-purple-400" />
                AI Selected Top 3 Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topCandidates.map((candidate, index) => (
                  <Card key={candidate.id} className="bg-neutral-900 border-neutral-800">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{candidate.applicant_name}</h3>
                          <p className="text-sm text-neutral-400">{candidate.applicant_email}</p>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-400">
                          #{index + 1}
                        </Badge>
                      </div>
                      {candidate.ai_score && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-neutral-400">Match Score</span>
                            <span className="text-purple-400 font-semibold">{candidate.ai_score}%</span>
                          </div>
                          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{ width: `${candidate.ai_score}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-neutral-700 text-white hover:bg-neutral-800"
                        onClick={() => router.push(`/applications/${candidate.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Applications Table */}
        {applications.length === 0 ? (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No applications yet
              </h3>
              <p className="text-neutral-400">
                Applications will appear here once people start filling your forms
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-neutral-900 border-neutral-800">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                  <TableHead className="text-neutral-400">Applicant</TableHead>
                  <TableHead className="text-neutral-400">Email</TableHead>
                  <TableHead className="text-neutral-400">Form name</TableHead>
                  <TableHead className="text-neutral-400">Applied on</TableHead>
                  <TableHead className="text-neutral-400">Based in</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                  <TableHead className="text-neutral-400"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id} className="border-neutral-800 hover:bg-neutral-800/50">
                    <TableCell className="font-medium text-white">{app.applicant_name}</TableCell>
                    <TableCell className="text-neutral-300">{app.applicant_email}</TableCell>
                    <TableCell className="text-neutral-300">{app.form_name}</TableCell>
                    <TableCell className="text-neutral-400">
                      {new Date(app.applied_on).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-neutral-400">{app.based_in || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-neutral-400 hover:text-white"
                        onClick={() => router.push(`/applications/${app.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </main>
    </div>
  );
}
