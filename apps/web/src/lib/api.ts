import type { Conversation, Message, ConversationListItem, ConversationStartResponse, Emotion } from "./types";

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

export async function getEmotions(): Promise<Emotion[]> {
  const res = await fetch(`${API_URL}/emotions`, {
    method: "GET",
    cache: "no-store",
  });

  return parseJson<Emotion[]>(res);
}

export async function createConversation(emotionId?: string): Promise<ConversationStartResponse> {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emotionId ? { emotionId } : {}),
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

export async function deleteConversation(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/conversations/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
}

export async function editMessage(
  conversationId: string,
  messageId: string,
  content: string
): Promise<void> {
  const res = await fetch(`${API_URL}/conversations/${conversationId}/messages/${messageId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
}

export async function renameConversation(id: string, title: string): Promise<void> {
  const res = await fetch(`${API_URL}/conversations/${id}/title`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
}

export async function streamMessage(
  conversationId: string,
  content: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
) {
  const res = await fetch(
    `${API_URL}/conversations/${conversationId}/messages/stream`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }
  );

  if (!res.body) throw new Error("No stream");

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");

    for (let i = 0; i < parts.length - 1; i++) {
      const line = parts[i];

      if (line.startsWith("data: ")) {
        const json = JSON.parse(line.replace("data: ", ""));

        if (json.chunk) onChunk(json.chunk);
        if (json.done) onDone();
      }
    }

    buffer = parts[parts.length - 1];
  }
}