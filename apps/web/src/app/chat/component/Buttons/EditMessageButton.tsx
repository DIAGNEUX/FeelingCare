"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, X } from "lucide-react";

import { editMessage } from "@/lib/api/message.api";

export default function EditMessageButton({
  conversationId,
  messageId,
  initialContent,
}: {
  conversationId: string;
  messageId: string;
  initialContent: string;
}) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSave() {
    const text = content.trim();
    if (!text || text === initialContent) {
      setEditing(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      await editMessage(conversationId, messageId, text);
      setEditing(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Modification impossible.");
    } finally {
      setLoading(false);
    }
  }

  function onCancel() {
    setContent(initialContent);
    setError("");
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex max-w-[82%] flex-col gap-2 sm:max-w-[72%]">
        <textarea
          className="resize-none rounded-[1.5rem] border border-feelingcare-primary bg-feelingcare-primary/15 px-4 py-3 text-sm leading-6 text-feelingcare-light-text placeholder:text-feelingcare-light-text-secondary focus:outline-none focus:ring-4 focus:ring-feelingcare-primary/20 disabled:opacity-50 dark:border-feelingcare-primary-dark dark:bg-feelingcare-primary-dark/10 dark:text-feelingcare-dark-text dark:placeholder:text-feelingcare-dark-text-secondary"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          disabled={loading}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSave();
            }
            if (e.key === "Escape") onCancel();
          }}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-feelingcare-light-border bg-white text-feelingcare-light-text-secondary transition hover:bg-feelingcare-light-bg hover:text-feelingcare-light-text dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary dark:text-feelingcare-dark-text-secondary"
            disabled={loading}
            type="button"
            aria-label="Annuler"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={onSave}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-feelingcare-primary text-feelingcare-light-text transition hover:bg-feelingcare-primary/90 disabled:opacity-50 dark:bg-feelingcare-primary-dark dark:text-feelingcare-dark-bg"
            disabled={loading}
            type="button"
            aria-label="Sauvegarder"
          >
            <Check className="h-4 w-4" />
          </button>
        </div>
        {error && (
          <p className="px-1 text-right text-xs font-semibold text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="group/msg flex max-w-[82%] flex-col items-end gap-1 sm:max-w-[72%]">
      <div className="w-fit rounded-[1.5rem] rounded-br-md bg-feelingcare-primary px-4 py-3 text-sm leading-6 text-feelingcare-light-text">
        <div className="whitespace-pre-wrap break-words">{initialContent}</div>
      </div>
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1 px-2 text-xs text-feelingcare-light-text-secondary opacity-0 transition-opacity hover:text-feelingcare-light-text group-hover/msg:opacity-100 dark:text-feelingcare-dark-text-secondary dark:hover:text-feelingcare-dark-text"
        type="button"
      >
        <Pencil className="h-3 w-3" />
        Modifier
      </button>
    </div>
  );
}
