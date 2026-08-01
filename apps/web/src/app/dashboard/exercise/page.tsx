"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDashboard } from "@/lib/api/dashboard.api";
import { getRecommendedExercise, type RecommendedExercise } from "@/lib/exercise";
import type { Insight } from "@/lib/api/insights.api";

const defaultExercise: RecommendedExercise = getRecommendedExercise([]);

export default function ExercisePage() {
  const router = useRouter();
  const [recommended, setRecommended] = useState<RecommendedExercise>(defaultExercise);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboard = await getDashboard();
        setInsight(dashboard.insights?.[0] ?? null);
        setRecommended(getRecommendedExercise(dashboard.insights));
      } catch (error) {
        console.error("Erreur de recommandation d'exercice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isRunning || completed) return;

    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current + 1 >= recommended.duration) {
          setCompleted(true);
          setIsRunning(false);
          return recommended.duration;
        }

        return current + 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, recommended.duration, completed]);

  const progress = Math.min(100, Math.round((seconds / recommended.duration) * 100));
  const remaining = recommended.duration - seconds;
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-feelingcare-light-bg text-feelingcare-light-text transition-colors duration-300 dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-feelingcare-light-text-secondary transition hover:text-feelingcare-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au dashboard
            </button>

            <span className="inline-flex rounded-full bg-feelingcare-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-feelingcare-primary">
              Exercice recommandé
            </span>
          </div>

          <article className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-[0_24px_80px_rgba(14,27,63,0.08)] backdrop-blur dark:border-white/10 dark:bg-feelingcare-dark-bg-secondary">
            <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-feelingcare-primary/5 via-transparent to-transparent p-6">
              <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-feelingcare-primary/10 to-transparent" />
              <div className="relative z-10 space-y-6">
                <div className="space-y-3">
                  <span className="inline-flex rounded-full bg-feelingcare-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-feelingcare-primary">
                    {loading ? "Chargement..." : recommended.category}
                  </span>
                  <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-feelingcare-light-text dark:text-feelingcare-light-text">
                    {recommended.title}
                  </h1>
                  <p className="max-w-3xl text-sm leading-6 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                    {recommended.subtitle}
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
                  <div className="space-y-5 rounded-[2rem] border border-feelingcare-light-border bg-feelingcare-light-bg p-6 shadow-sm dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
                    <div className="space-y-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-feelingcare-primary">
                        {completed ? "Exercice terminé" : "Temps restant"}
                      </p>
                      <p className="text-5xl font-bold text-feelingcare-light-text dark:text-feelingcare-light-text">
                        {completed ? "00:00" : `${minutes}:${secs}`}
                      </p>
                      <p className="text-sm leading-6 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                        {completed
                          ? "Tu peux prendre un moment pour revenir à ton rythme."
                          : "Respire doucement et laisse ton mental se poser pendant l’exercice."}
                      </p>
                    </div>

                    <div className="relative flex items-center justify-center rounded-[1.75rem] border border-feelingcare-primary/10 bg-feelingcare-primary/5 p-8">
                      <div className="absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_center,rgba(166,235,255,0.35),transparent_55%)]" />
                      <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-lg dark:bg-feelingcare-dark-bg">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-feelingcare-primary/20 text-feelingcare-primary shadow-inner animate-pulse">
                          <span className="text-xl font-bold">{progress}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm leading-6 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                        Durée estimée : {Math.floor(recommended.duration / 60)} min
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          if (completed) {
                            setSeconds(0);
                            setCompleted(false);
                            setIsRunning(false);
                            return;
                          }
                          setIsRunning((current) => !current);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-feelingcare-primary px-5 py-3 text-sm font-bold text-feelingcare-light-text transition hover:bg-feelingcare-primary/90"
                      >
                        {completed ? "Recommencer" : isRunning ? "Pause" : "Démarrer l'exercice"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-5 rounded-[2rem] border border-feelingcare-light-border bg-feelingcare-light-bg p-6 shadow-sm dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                        Pourquoi cet exercice
                      </p>
                      <p className="text-base leading-7 text-feelingcare-light-text dark:text-feelingcare-dark-text">
                        {insight
                          ? insight.label
                          : "Cet exercice est choisi pour t’aider à te recentrer."}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                        Instructions
                      </p>
                      <ol className="space-y-3 text-sm leading-6 text-feelingcare-light-text dark:text-feelingcare-dark-text">
                        {recommended.steps.map((step, index) => (
                          <li key={step} className="flex gap-3">
                            <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-feelingcare-primary/10 text-feelingcare-primary text-xs font-semibold">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-[2rem] border border-white/70 bg-feelingcare-light-bg p-6 shadow-[0_20px_45px_rgba(14,27,63,0.08)] dark:border-white/10 dark:bg-feelingcare-dark-bg-secondary">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                Ton état actuel
              </p>
              <p className="mt-3 text-sm leading-6 text-feelingcare-light-text dark:text-feelingcare-dark-text">
                {insight?.detail ||
                  "Ta recommandation se base sur tes dernières conversations."}
              </p>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-feelingcare-primary/5 p-5 text-feelingcare-light-text dark:border-white/10 dark:bg-feelingcare-primary/10">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-feelingcare-primary">
                  Astuce zen
                </p>
                <p className="text-sm leading-6">
                  Garde une respiration fluide, même si l’esprit veut s’agiter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
