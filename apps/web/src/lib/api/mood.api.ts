import { API_URL } from "./config";
import { fetchWithAuth, parseJson } from "./http";

export type MoodTrend = {
  trend: {
    date: string;
    day: string;
    emotion: string | null;
    score: number | null;
    hasData: boolean;
    conversationCount: number;
  }[];
  dominantEmotion: string | null;
  progression: number | null;
};

export async function getMoodTrend(): Promise<MoodTrend> {
  const res = await fetchWithAuth(`${API_URL}/dashboard/mood-trend`, {
    method: "GET",
  });

  return parseJson<MoodTrend>(res);
}
