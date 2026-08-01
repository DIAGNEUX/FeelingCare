"use client";

import { useEffect, useState } from "react";

import DashboardHeader from "./component/DashboardHeader";
import SummarySection from "./component/SummarySection";
import ExpressedSignalsSection from "./component/ExpressedSignalsSection";
import MoodTrendSection from "./component/MoodTrendSection";
import BreathingExerciseSection from "./component/BreathingExerciseSection";
import ActivitySection from "./component/ActivitySection";
import DashboardSidebar from "./component/DashboardSidebar";
import RequireAuth from "@/app/component/auth/RequireAuth";
import { Activity } from "@/lib/api/activity.api";
import { MoodTrend } from "@/lib/api/mood.api";
import { Insight } from "@/lib/api/insights.api";
import { getDashboard } from "@/lib/api/dashboard.api";

function DashboardContent() {
  const [summary, setSummary] = useState<string>("");
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [moodTrend, setMoodTrend] = useState<MoodTrend | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboard = await getDashboard();

        setSummary(dashboard.summary);
        setActivity(dashboard.activity);
        setMoodTrend(dashboard.moodTrend);
        setInsights(dashboard.insights);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-feelingcare-light-bg text-feelingcare-light-text transition-colors duration-300 dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
      <DashboardSidebar />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:ml-[13.25rem] lg:px-8">
        <div className="mx-auto max-w-7xl">
          <DashboardHeader />

          <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-5">
              <SummarySection summary={summary} loading={loading} />
              <ExpressedSignalsSection loading={loading} data={insights} />
              <MoodTrendSection loading={loading} moodTrend={moodTrend} />
            </div>

            <aside className="space-y-5">
              <BreathingExerciseSection />
              <ActivitySection activity={activity} loading={loading} />
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
