"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { createConversation } from "@/lib/api/conversation.api";

export default function NewConversationButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onClick() {
    try {
      setLoading(true);
      setError("");
      const convo = await createConversation();
      router.push(`/chat/${convo.id}`);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError("Creation impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className="flex w-full cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-feelingcare-light-text hover:bg-feelingcare-primary/10 dark:text-feelingcare-dark-text dark:hover:bg-feelingcare-primary-dark/10"
        onClick={onClick}
        disabled={loading}
        type="button"
      >
        <Plus className="h-4 w-4" />
        {loading ? "Creation..." : "Nouvelle conversation"}
      </button>
      {error && <p className="px-3 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}
