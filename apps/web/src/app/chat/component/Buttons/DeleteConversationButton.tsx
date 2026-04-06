"use client";

import { useRouter } from "next/navigation";
import { deleteConversation } from "@/lib/api";

export default function DeleteConversationButton({
  conversationId,
  isActive,
}: {
  conversationId: string;
  isActive: boolean;
}) {
  const router = useRouter();

  async function onDelete(e: React.MouseEvent) {
    e.preventDefault(); // évite la navigation sur le Link parent
    e.stopPropagation();

    try {
      await deleteConversation(conversationId);
      if (isActive) {
        router.push("/"); // redirige vers l'accueil si on supprime la conv active
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer la conversation.");
    }
  }

  return (
    <button
      onClick={onDelete}
      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
      title="Supprimer la conversation"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}