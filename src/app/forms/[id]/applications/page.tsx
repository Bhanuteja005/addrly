"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoaderIcon, ArrowLeft, Eye, X, Check } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import Link from "next/link";

interface Application {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_data: Record<string, any>;
  status: string;
  ai_score: number;
  applied_on: string;
}

export default function FormApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data } = await apiClient.get(`/api/forms/${params.id}/applications`);
      setApplications(data.applications || []);
    } catch (error: any) {
      console.error('Load applications error:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400';
      case 'shortlisted':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'archived':
        return 'bg-neutral-600/20 text-neutral-400';
      default:
        return 'bg-neutral-600/20 text-neutral-400';
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
      <header className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/home">
              <Button variant="ghost" size="sm" className="text-white hover:bg-neutral-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forms
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Form Applications</h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Applications</h2>
          <p className="text-neutral-400">{applications.length} total applications</p>
        </div>

        {applications.length === 0 ? (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="py-12 text-center">
              <Eye className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No applications yet
              </h3>
              <p className="text-neutral-400">
                Share your form to start receiving applications!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="bg-neutral-900 border-neutral-800 hover:border-purple-500/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white mb-1">
                        {app.applicant_name}
                      </CardTitle>
                      <p className="text-sm text-neutral-400">{app.applicant_email}</p>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <span>AI Score: {app.ai_score}/100</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setSelectedApp(app)}
                    variant="outline"
                    className="w-full border-neutral-700 text-white hover:bg-neutral-800"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="bg-neutral-900 border-neutral-800 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Application Details</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedApp.applicant_name}</h3>
                  <p className="text-neutral-400">{selectedApp.applicant_email}</p>
                </div>
                <Badge className={getStatusColor(selectedApp.status)}>
                  {selectedApp.status}
                </Badge>
              </div>

              <div className="space-y-3">
                {Object.entries(selectedApp.applicant_data || {}).map(([key, value]) => (
                  <div key={key} className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-neutral-400 mb-1">{key}</p>
                    <p className="text-white">{String(value)}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Shortlist
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Archive
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}