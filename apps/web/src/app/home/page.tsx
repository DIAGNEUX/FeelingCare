"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, HeartPulse, LayoutDashboard, Sparkles } from "lucide-react";

import { getEmotions } from "@/lib/api/emotion.api";
import AccountMenu from "@/app/component/auth/AccountMenu";
import { useAuth } from "@/app/component/auth/AuthProvider";
import { ThemeToggle } from "@/app/component/ui/theme-toggle";
import type { Emotion } from "@/lib/types";

const emotionStyles: Record<
  string,
  { label: string; image: string; color: string; soft: string }
> = {
  Triste: {
    label: "Triste",
    image: "/sad.png",
    color: "#9DD9EA",
    soft: "#E9F8FC",
  },
  "Stressé": {
    label: "Stresse",
    image: "/stressed.png",
    color: "#FFD8A8",
    soft: "#FFF3E4",
  },
  "StressÃ©": {
    label: "Stresse",
    image: "/stressed.png",
    color: "#FFD8A8",
    soft: "#FFF3E4",
  },
  Confus: {
    label: "Confus",
    image: "/confused.png",
    color: "#BDECC8",
    soft: "#ECF9EF",
  },
  "Fatigué": {
    label: "Fatigue",
    image: "/tired1.png",
    color: "#F3B6EF",
    soft: "#FCEBFA",
  },
  "FatiguÃ©": {
    label: "Fatigue",
    image: "/tired1.png",
    color: "#F3B6EF",
    soft: "#FCEBFA",
  },
  "En colère": {
    label: "En colere",
    image: "/angry.png",
    color: "#FF755F",
    soft: "#FFE7E2",
  },
  "En colÃ¨re": {
    label: "En colere",
    image: "/angry.png",
    color: "#FF755F",
    soft: "#FFE7E2",
  },
};

const fallbackStyle = {
  label: "Autre",
  image: "/confused.png",
  color: "#DDF241",
  soft: "#F5FCCF",
};

const Accueil = () => {
  const router = useRouter();
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    getEmotions().then(setEmotions).catch(console.error);
  }, []);

  async function start(emotion?: Emotion) {
    if (!isAuthenticated) {
      const style = emotion ? emotionStyles[emotion.name] ?? fallbackStyle : null;
      const query = style?.label
        ? `?emotion=${encodeURIComponent(style.label)}`
        : "";

      router.push(`/guest-chat${query}`);
      return;
    }

    const style = emotion ? emotionStyles[emotion.name] ?? fallbackStyle : null;
    const params = new URLSearchParams();

    if (emotion?.id) {
      params.set("emotionId", emotion.id);
    }

    if (style?.label) {
      params.set("emotion", style.label);
    }

    const query = params.toString();
    router.push(`/chat/new${query ? `?${query}` : ""}`);
  }

  return (
    <main className="min-h-screen bg-feelingcare-light-bg text-feelingcare-light-text transition-colors duration-300 dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-feelingcare-primary text-feelingcare-light-text shadow-[0_14px_35px_rgba(221,242,65,0.35)]">
              <HeartPulse className="h-6 w-6" />
            </span>
            <span className="text-xl font-bold">FeelingCare</span>
          </Link>

          <nav className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-feelingcare-light-border bg-white text-sm font-semibold text-feelingcare-light-text shadow-sm transition hover:border-feelingcare-primary hover:bg-feelingcare-primary/10 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary dark:text-feelingcare-dark-text sm:w-auto sm:gap-2 sm:px-4"
                aria-label="Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            <AccountMenu />
          </nav>
        </header>

        <section className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-4xl space-y-8">
            <div >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-feelingcare-light-border bg-white px-4 py-2 text-sm font-semibold text-feelingcare-light-text-secondary shadow-sm dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary dark:text-feelingcare-dark-text-secondary">
                <Sparkles className="h-4 w-4 text-feelingcare-primary" />
                Check-in emotionnel
              </div>
              <h1 className="text-center text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Comment tu te sens maintenant ?
              </h1>
              <p className="text-center mt-5 text-base leading-7 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary sm:text-lg">
                Choisis une humeur ou commence directement une conversation. <br />
                {isAuthenticated
                  ? "FeelingCare garde l'interface simple pour te laisser respirer."
                  : "Sans compte, la conversation reste temporaire et ton historique n'est pas enregistré."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {emotions.map((emotion, idx) => {
                const style = emotionStyles[emotion.name] ?? fallbackStyle;

                return (
                  <button
                    key={emotion.id}
                    onClick={() => start(emotion)}
                    disabled={authLoading}
                    className="group rounded-[1.6rem] border p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(23,23,23,0.10)] disabled:cursor-not-allowed disabled:opacity-50 dark:border-feelingcare-dark-border"
                    style={{
                      animationDelay: `${idx * 45}ms`,
                      backgroundColor: style.soft,
                      borderColor: style.color,
                    }}
                    type="button"
                  >
                    <span className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/75">
                      <Image
                        src={style.image}
                        alt={style.label}
                        width={42}
                        height={42}
                        className="transition-transform duration-200 group-hover:scale-110"
                      />
                    </span>
                    <span className="block text-sm font-bold text-feelingcare-light-text">
                      {style.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={() => start(undefined)}
                disabled={authLoading}
                className="inline-flex items-center justify-center gap-3 rounded-full px-6 py-4 text-sm font-bold text-feelingcare-light-text shadow-[0_16px_38px_rgba(221,242,65,0.01)] transition-all duration-200 hover:bg-feelingcare-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-feelingcare-primary-dark dark:text-feelingcare-dark-bg"
                type="button"
              >
                Commencer sans choisir
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Accueil;
