import { API_URL } from "./config";
import { parseJson } from "./http";
import type { Emotion } from "../types";

export async function getEmotions(): Promise<Emotion[]> {
  const res = await fetch(`${API_URL}/emotions`);
  return parseJson<Emotion[]>(res); // 🔥 ICI
}