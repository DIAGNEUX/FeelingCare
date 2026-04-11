"use client";

import { useRouter } from "next/navigation";
import { deleteConversation } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { useState } from "react";

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

  async function onDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return; 

    try {
      setLoading(true);

      await deleteConversation(conversationId);

      onDeleteSuccess?.(); 

      if (isActive) {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer la conversation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full  gap-2 px-1 py-2 text-sm text-white/60 hover:text-red-400">
    <button
      onClick={onDelete}
      disabled={loading}
      className="flex items-start justify-start gap-2"
      title="Supprimer la conversation"
    >
      <Trash2 size={16} />
      <span >Supprimer</span>
    </button>
    </div>
  );
}