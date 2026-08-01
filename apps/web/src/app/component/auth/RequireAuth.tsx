"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { HeartPulse } from "lucide-react";

import { useAuth } from "./AuthProvider";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-feelingcare-light-bg text-feelingcare-light-text dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
        <div className="flex items-center gap-3 rounded-full border border-feelingcare-light-border bg-white px-5 py-3 text-sm font-bold shadow-sm dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
          <HeartPulse className="h-4 w-4 animate-pulse text-feelingcare-primary" />
          Chargement...
        </div>
      </div>
    );
  }

  return children;
}
