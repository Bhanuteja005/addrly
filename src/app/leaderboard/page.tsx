"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderIcon, Trophy, Users, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry {
  id: string;
  title: string;
  applications_count: number;
  likes: number;
  owner_name: string;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    checkAuthAndLoadLeaderboard();
  }, []);

  const checkAuthAndLoadLeaderboard = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/signin');
        return;
      }

      // Mock leaderboard data - in real app, fetch from API
      const mockData: LeaderboardEntry[] = [
        { id: '1', title: 'Perfect Match Finder', applications_count: 1250, likes: 340, owner_name: 'Sarah Chen' },
        { id: '2', title: 'Adventure Seeker', applications_count: 980, likes: 280, owner_name: 'Mike Johnson' },
        { id: '3', title: 'Creative Soul', applications_count: 750, likes: 220, owner_name: 'Emma Davis' },
        { id: '4', title: 'Tech Enthusiast', applications_count: 620, likes: 180, owner_name: 'Alex Wong' },
        { id: '5', title: 'Foodie Paradise', applications_count: 540, likes: 150, owner_name: 'Lisa Park' },
      ];

      setLeaderboard(mockData);
    } catch (error) {
      console.error('Leaderboard load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <LoaderIcon className="w-8 h-8 animate-spin text-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/home">
                <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Leaderboard</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-foreground mb-2">Top Dating Forms</h2>
          <p className="text-muted-foreground">Discover the most popular forms on Addrly</p>
        </div>

        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <Card key={entry.id} className="bg-card border-border hover:border-accent transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-neutral-700 text-white'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{entry.title}</h3>
                    <p className="text-muted-foreground text-sm">by {entry.owner_name}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{entry.applications_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{entry.likes}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-foreground hover:bg-muted"
                    onClick={() => router.push(`/forms/${entry.id}`)}
                  >
                    View Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">Want to see your form here?</p>
          <Link href="/forms/create">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Create Your Form
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}