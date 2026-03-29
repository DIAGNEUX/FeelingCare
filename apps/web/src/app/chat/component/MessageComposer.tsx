"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/lib/api";
import { streamMessage } from "@/lib/api";

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[70%] rounded-2xl px-3 py-2 bg-white/10">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export default function MessageComposer({ conversationId }: { conversationId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSend() {
    const text = content.trim();
    if (!text) return;

    setLoading(true);

    let full = "";

    try {
      await streamMessage(
        conversationId,
        text,
        (chunk) => {
          full += chunk;

          // 👉 ici tu dois mettre à jour l'UI en live
          console.log("chunk:", chunk);
        },
        () => {
          console.log("done");
          router.refresh(); // fallback (on améliore après)
        }
      );

      setContent("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Bulle de typing pendant que l'IA répond */}
      {loading && <TypingIndicator />}

      <div className="relative flex items-center">
        <input
          className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 pr-14 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors disabled:opacity-50"
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
          className="absolute right-3 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={onSend}
          disabled={loading || !content.trim()}
        >
          {loading ? (
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}