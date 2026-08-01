// lib/api/insights.api.ts
import { API_URL } from "./config";
import { fetchWithAuth, parseJson } from "./http";

export type Insight = {
  category: string;
  label: string;
  detail: string;
};

export async function getInsights(): Promise<Insight[]> {
  const res = await fetchWithAuth(`${API_URL}/dashboard/insights`, {
    method: "GET",
  });

  return parseJson<Insight[]>(res);
}