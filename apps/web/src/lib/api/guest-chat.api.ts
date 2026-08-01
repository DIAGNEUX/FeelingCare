import { API_URL } from "./config";
import { parseJson } from "./http";

export type GuestChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function sendGuestMessage(input: {
  emotionName?: string | null;
  messages: GuestChatMessage[];
}) {
  const res = await fetch(`${API_URL}/guest-chat/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseJson<{ reply: string }>(res);
}
