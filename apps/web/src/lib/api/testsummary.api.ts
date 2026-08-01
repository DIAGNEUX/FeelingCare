import { API_URL } from "./config";
import { fetchWithAuth } from "./http";

export async function getTestSummary(): Promise<string> {
  const res = await fetchWithAuth(`${API_URL}/dashboard/test-summary`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Erreur: ${res.status}`);
  }

  return res.text();
}