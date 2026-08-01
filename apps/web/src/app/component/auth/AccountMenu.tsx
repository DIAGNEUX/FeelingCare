"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";

import { useAuth } from "./AuthProvider";

type AccountMenuProps = {
  className?: string;
};

export default function AccountMenu({ className = "" }: AccountMenuProps) {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  if (loading) {
    return (
      <div
        className={`h-12 w-32 animate-pulse rounded-full bg-feelingcare-light-border/70 dark:bg-feelingcare-dark-border ${className}`}
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className={`rounded-full bg-feelingcare-light-text px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-feelingcare-dark-text dark:text-feelingcare-dark-bg ${className}`}
      >
        Connexion
      </Link>
    );
  }

  const fullName = [user.firstName, user.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  const accountLabel = fullName || user.email?.trim() || "Compte";
  const initial = accountLabel.charAt(0).toUpperCase() || "U";

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    router.push("/login");
  }

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-12 items-center gap-3 rounded-full border border-feelingcare-light-border bg-white px-2.5 pr-4 text-sm font-semibold text-feelingcare-light-text shadow-sm transition hover:border-feelingcare-primary hover:bg-feelingcare-primary/10 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary dark:text-feelingcare-dark-text dark:hover:bg-feelingcare-primary-dark/10"
        aria-expanded={open}
        aria-label="Menu du compte"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-feelingcare-primary text-sm font-bold text-feelingcare-light-text">
          {initial}
        </span>
        <span className="hidden max-w-36 truncate sm:inline">{accountLabel}</span>
        <ChevronDown className="h-4 w-4 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary" />
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-feelingcare-light-border bg-white p-2 shadow-[0_20px_45px_rgba(23,23,23,0.12)] dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-feelingcare-light-text transition hover:bg-feelingcare-primary/10 dark:text-feelingcare-dark-text dark:hover:bg-feelingcare-primary-dark/10"
            >
              <UserRound className="h-4 w-4" />
              Profil
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-feelingcare-light-text-secondary transition hover:bg-feelingcare-primary/10 hover:text-feelingcare-light-text dark:text-feelingcare-dark-text-secondary dark:hover:bg-feelingcare-primary-dark/10 dark:hover:text-feelingcare-dark-text"
            >
              <LogOut className="h-4 w-4" />
              Deconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
