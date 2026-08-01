"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { deleteConversation } from "@/lib/api/conversation.api";

export default function DeleteConversationButton({
  conversationId,
  isActive,
  onDeleteSuccess,
}: {
  conversationId: string;
  isActive: boolean;
  onDeleteSuccess?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    try {
      setLoading(true);
      setError("");
      await deleteConversation(conversationId);
      onDeleteSuccess?.();

      if (isActive) {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Suppression impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={onDelete}
        disabled={loading}
        className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-[#D95F4D] transition hover:bg-[#FFE7E2] disabled:cursor-not-allowed disabled:opacity-50"
        title="Supprimer la conversation"
        type="button"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Supprimer
      </button>
      {error && <p className="px-3 pb-1 text-xs font-semibold text-red-500">{error}</p>}
    </>
  );
}
