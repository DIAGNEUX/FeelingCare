import { API_URL } from "./config";
import { fetchWithAuth, parseJson } from "./http";

export async function streamMessage(
  conversationId: string,
  content: string,
  onChunk: (chunk: string) => void,
  onDone: () => void | Promise<void>
) {
  const res = await fetchWithAuth(
    `${API_URL}/conversations/${conversationId}/messages/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
        if (json.done) await onDone();
      }
    }

    buffer = parts[parts.length - 1];
  }
}
export async function sendMessage(conversationId: string, content: string) {
  const res = await fetchWithAuth(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }
  );

  return parseJson(res);
}

export async function editMessage(
  conversationId: string,
  messageId: string,
  content: string
) {
  const res = await fetchWithAuth(
    `${API_URL}/conversations/${conversationId}/messages/${messageId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }
  );

  return parseJson(res);
}
