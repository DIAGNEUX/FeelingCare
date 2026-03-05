"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/lib/api";

export default function MessageComposer({ conversationId }: { conversationId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSend() {
    const text = content.trim();
    if (!text) return;

    try {
      setLoading(true);
      await sendMessage(conversationId, text);
      setContent("");
      router.refresh(); 
    } catch (e) {
      console.error(e);
      alert("Impossible d’envoyer le message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 flex gap-2">
      <input
        className="flex-1 rounded-xl border px-4 py-3"
        placeholder="Tu peux répondre ici…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <button
        className="rounded-xl border px-4 py-3"
        onClick={onSend}
        disabled={loading}
      >
        Envoyer
      </button>
    </div>
  );
}
