"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { renameConversation } from "@/lib/api";

export default function RenameConversationButton({
  conversationId,
  currentTitle,
}: {
  conversationId: string;
  currentTitle: string;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSave() {
    const text = title.trim();
    if (!text || text === currentTitle) {
      setEditing(false);
      return;
    }

    try {
      setLoading(true);
      await renameConversation(conversationId, text);
      setEditing(false);
      router.refresh();
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
        className="flex-1 bg-transparent  text-sm text-white focus:outline-none focus:border-white/50 px-1 py-0.5 min-w-0"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave();
          if (e.key === "Escape") {
            setTitle(currentTitle);
            setEditing(false);
          }
        }}
        onBlur={onSave}
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="truncate text-left flex-1 min-w-0 hover:text-white/80 transition-colors text-sm"
      title="Cliquer pour renommer"
    >
      {currentTitle}
    </button>
  );
}