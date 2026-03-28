"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editMessage } from "@/lib/api";

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
  const router = useRouter();

  async function onSave() {
    const text = content.trim();
    if (!text || text === initialContent) {
      setEditing(false);
      return;
    }

    try {
      setLoading(true);
      await editMessage(conversationId, messageId, text);
      setEditing(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Impossible de modifier le message.");
    } finally {
      setLoading(false);
    }
  }

  function onCancel() {
    setContent(initialContent);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 max-w-[70%]">
        <textarea
          className="rounded-2xl bg-blue-500/20 border border-blue-400/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/60 resize-none"
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
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Envoi..." : "Sauvegarder"}
          </button>
        </div>
      </div>
    );
  }

    return (
    <div className="group/msg flex flex-col items-end gap-1 max-w-[70%]">
        <div className="w-fit rounded-2xl px-4 py-3 text-sm bg-blue-500 text-white">
        <div className="whitespace-pre-wrap break-words">{initialContent}</div>
        </div>
        <button
        onClick={() => setEditing(true)}
        className="opacity-0 group-hover/msg:opacity-100 transition-opacity text-xs text-white/30 hover:text-white/60 flex items-center gap-1"
        >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Modifier
        </button>
    </div>
    );
}