import type { Conversation, Message, ConversationListItem, ConversationStartResponse } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  const text = await res.text();

  if (!text) {
    throw new Error("API returned empty response");
  }

  return JSON.parse(text) as T;
}


export async function createConversation(emotion?: string): Promise<ConversationStartResponse> {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emotion ? { emotion } : {}),
  });

  return parseJson<ConversationStartResponse>(res);
}

export async function getConversation(id: string): Promise<Conversation> {
  const res = await fetch(`${API_URL}/conversations/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  return parseJson<Conversation>(res);
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  const res = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  return parseJson<Message>(res);
}

export async function listConversations(): Promise<ConversationListItem[]> {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "GET",
    cache: "no-store",
  });

  return parseJson<ConversationListItem[]>(res);
}


