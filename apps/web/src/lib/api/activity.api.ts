import { API_URL } from "./config";
import { fetchWithAuth, parseJson } from "./http";

export type Activity = {
  sessionsThisWeek: number;
  totalMinutes: number;
  deepConversations: number;
  lastActiveDaysAgo: number | null;
};

export async function getActivity(): Promise<Activity> {
  const res = await fetchWithAuth(`${API_URL}/dashboard/activity`, {
    method: "GET",
  });

  return parseJson<Activity>(res);
}