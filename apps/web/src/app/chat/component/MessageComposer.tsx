"use client";

import { useState } from "react";
import { Loader2, SendHorizontal } from "lucide-react";

import { streamMessage } from "@/lib/api/message.api";

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl bg-feelingcare-primary/15 px-4 py-3 dark:bg-feelingcare-primary-dark/10">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-feelingcare-primary animate-bounce [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-feelingcare-primary animate-bounce [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-feelingcare-primary animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

type Props = {
  conversationId: string;
  onMessageSent?: () => Promise<void> | void;
};

export default function MessageComposer({
  conversationId,
  onMessageSent,
}: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSend() {
    const text = content.trim();
    if (!text) return;

    setLoading(true);
    setError("");

    try {
      await streamMessage(
        conversationId,
        text,
        () => undefined,
        async () => {
          await onMessageSent?.();
        }
      );

      setContent("");
    } catch (e) {
      console.error(e);
      setError("Message non envoye. Verifie ta connexion puis reessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {loading && <TypingIndicator />}
      {error && (
        <p className="px-3 text-sm font-semibold text-red-600 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="relative flex items-center rounded-[1.75rem] border border-feelingcare-light-border bg-white/80 p-2 transition-colors focus-within:border-feelingcare-primary dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary/80 dark:focus-within:border-feelingcare-primary-dark">
        <input
          className="min-h-12 w-full rounded-[1.4rem] bg-transparent px-4 py-3 pr-14 text-sm text-feelingcare-light-text placeholder:text-feelingcare-light-text-secondary focus:outline-none disabled:opacity-50 dark:text-feelingcare-dark-text dark:placeholder:text-feelingcare-dark-text-secondary"
          placeholder="Ecris ce qui vient..."
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
          className="absolute right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-feelingcare-primary text-feelingcare-light-text transition-all hover:bg-feelingcare-primary/90 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-feelingcare-primary-dark dark:text-feelingcare-dark-bg"
          onClick={onSend}
          disabled={loading || !content.trim()}
          type="button"
          aria-label="Envoyer"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizontal className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
