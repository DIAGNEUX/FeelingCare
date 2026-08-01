import { API_URL } from "./config";
import { fetchWithAuth, parseJson } from "./http";

import type {
  Conversation,
  ConversationListItem,
  ConversationStartResponse,
} from "../types";

//
// 📜 LISTE DES CONVERSATIONS
//
export async function listConversations(): Promise<ConversationListItem[]> {
  const res = await fetchWithAuth(`${API_URL}/conversations`, {
    method: "GET",
  });

  return parseJson<ConversationListItem[]>(res);
}

//
// 🔍 GET ONE CONVERSATION
//
export async function getConversation(id: string): Promise<Conversation> {
  const res = await fetchWithAuth(`${API_URL}/conversations/${id}`, {
    method: "GET",
  });

  return parseJson<Conversation>(res);
}

//
// ➕ CREATE CONVERSATION
//
export async function createConversation(
  emotionId?: string
): Promise<ConversationStartResponse> {
  const res = await fetchWithAuth(`${API_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emotionId ? { emotionId } : {}),
  });

  return parseJson<ConversationStartResponse>(res);
}

//
// 🗑 DELETE CONVERSATION
//
export async function deleteConversation(id: string): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/conversations/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delete failed: ${text}`);
  }
}

//
// ✏️ RENAME CONVERSATION
//
export async function renameConversation(
  id: string,
  title: string
): Promise<Conversation> {
  const res = await fetchWithAuth(`${API_URL}/conversations/${id}/title`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  return parseJson<Conversation>(res);
}

//
// 🎧 TOGGLE LISTEN MODE
//
export async function toggleListenMode(
  id: string
): Promise<{ listenMode: boolean }> {
  const res = await fetchWithAuth(
    `${API_URL}/conversations/${id}/listen-mode`,
    {
      method: "PATCH",
    }
  );

  return parseJson<{ listenMode: boolean }>(res);
}