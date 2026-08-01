"use client";

import Link from "next/link";
import { HeartPulse, MessageCirclePlus } from "lucide-react";

import AccountMenu from "@/app/component/auth/AccountMenu";
import { useAuth } from "@/app/component/auth/AuthProvider";
import { ThemeToggle } from "@/app/component/ui/theme-toggle";

export default function DashboardHeader() {
  const { user } = useAuth();
  const firstName = user?.firstName?.trim();

  return (
    <header className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-3 lg:hidden">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-feelingcare-primary text-feelingcare-light-text">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-feelingcare-light-text dark:text-feelingcare-dark-text">
            FeelingCare
          </span>
        </Link>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
          <Link
            href="/"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-feelingcare-light-text text-sm font-bold text-white transition hover:opacity-90 dark:bg-feelingcare-dark-text dark:text-feelingcare-dark-bg sm:w-auto sm:gap-2 sm:px-5"
            aria-label="Nouvelle conversation"
          >
            <MessageCirclePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouvelle conversation</span>
          </Link>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold leading-tight text-feelingcare-light-text dark:text-feelingcare-dark-text sm:text-4xl">
          Bonjour{firstName ? ` ${firstName}` : ""}
        </h1>
        <p className="mt-2 max-w-2xl text-lg leading-7 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
          Voici comment tu t&apos;es senti ces derniers jours.
        </p>
      </div>
    </header>
  );
}
