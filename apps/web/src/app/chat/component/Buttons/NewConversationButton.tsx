"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createConversation } from "@/lib/api";

export default function NewConversationButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onClick() {
    try {
      setLoading(true);
      const convo = await createConversation(); // sans émotion
      router.push(`/chat/${convo.id}`);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Impossible de créer une nouvelle conversation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className="w-full rounded-md border border-white/10 px-3 py-2 text-sm hover:bg-white/5 text-left"
      onClick={onClick}
      disabled={loading}
      type="button"
    >
      + Nouvelle conversation (rapide)
    </button>
  );
}
