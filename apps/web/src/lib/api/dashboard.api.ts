import { API_URL } from "./config";
import { fetchWithAuth, parseJson } from "./http";
import type { Activity } from "./activity.api";
import type { Insight } from "./insights.api";
import type { MoodTrend } from "./mood.api";

export type Dashboard = {
  summary: string;
  activity: Activity;
  moodTrend: MoodTrend;
  insights: Insight[];
};

export async function getDashboard(): Promise<Dashboard> {
  const res = await fetchWithAuth(`${API_URL}/dashboard`, {
    method: "GET",
  });

  return parseJson<Dashboard>(res);
}
