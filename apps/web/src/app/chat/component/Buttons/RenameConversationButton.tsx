"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { renameConversation } from "@/lib/api";

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
  const router = useRouter();

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
    await renameConversation(conversationId, text);

    onRenameSuccess?.(text);

    setEditing(false);
    onDone?.();
  } catch (err) {
    console.error(err);
    alert("Impossible de renommer la conversation.");
  } finally {
    setLoading(false);
  }
}

  if (editing) {
    return (
      <input
        className="flex-1 bg-transparent text-sm text-white focus:outline-none border border-white/20 rounded px-1 py-0.5 min-w-0"
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
            onDone?.();
          }
        }}
        onBlur={onSave}
      />
    );
  }

  return (
    <div className="truncate text-sm text-white/80 px-1">
      {currentTitle}
    </div>
  );
}