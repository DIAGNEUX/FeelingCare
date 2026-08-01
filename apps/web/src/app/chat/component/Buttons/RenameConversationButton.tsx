"use client";

import { useEffect, useState } from "react";
import { renameConversation } from "@/lib/api/conversation.api";

export default function RenameConversationButton({
  conversationId,
  currentTitle,
  forceEditing,
  onDone,
  onRenameSuccess,
}: {
  conversationId: string;
  currentTitle: string;
  forceEditing?: boolean;
  onDone?: () => void;
  onRenameSuccess?: (title: string) => void;
}) {
  const [editing, setEditing] = useState(forceEditing || false);
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (forceEditing) {
      setEditing(true);
      setTitle(currentTitle);
    }
  }, [forceEditing, currentTitle]);

  async function onSave() {
    const text = title.trim();

    if (!text || text === currentTitle) {
      setEditing(false);
      onDone?.();
      return;
    }

    try {
      setLoading(true);
      setError("");
      await renameConversation(conversationId, text);
      onRenameSuccess?.(text);
      setEditing(false);
      onDone?.();
    } catch (err) {
      console.error(err);
      setError("Renommage impossible.");
    } finally {
      setLoading(false);
    }
  }

  if (editing) {
    return (
      <div className="space-y-1">
        <input
          className="min-w-0 flex-1 rounded-xl border border-feelingcare-light-border bg-white px-2 py-1 text-sm text-feelingcare-light-text focus:border-feelingcare-primary focus:outline-none dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          autoFocus
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave();
            if (e.key === "Escape") {
              setTitle(currentTitle);
              setEditing(false);
              setError("");
              onDone?.();
            }
          }}
          onBlur={onSave}
        />
        {error && <p className="px-1 text-xs font-semibold text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="truncate px-1 text-sm font-semibold text-feelingcare-light-text dark:text-feelingcare-dark-text">
      {currentTitle}
    </div>
  );
}
