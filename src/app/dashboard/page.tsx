"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page
    router.replace('/home');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <LoaderIcon className="w-8 h-8 animate-spin text-white" />
    </div>
  );
}
