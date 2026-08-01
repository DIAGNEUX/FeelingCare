"use client";

import { useState } from "react";
import { Headphones, Loader2 } from "lucide-react";

import type { ListenMode } from "@/lib/types";
import { toggleListenMode } from "@/lib/api/conversation.api";

type Props = {
  mode: ListenMode;
  setMode: (mode: ListenMode) => void;
  conversationId: string;
};

export default function ListenModeToggleButton({
  mode,
  setMode,
  conversationId,
}: Props) {
  const isActive = mode === "listen_only";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");
      const res = await toggleListenMode(conversationId);
      setMode(res.listenMode ? "listen_only" : "default");
    } catch (error) {
      console.error("Toggle error:", error);
      setError("Mode indisponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <button
        onClick={toggle}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
          isActive
            ? "bg-feelingcare-primary/20 text-feelingcare-light-text dark:bg-feelingcare-primary-dark/20 dark:text-feelingcare-dark-text"
            : "text-feelingcare-light-text-secondary hover:bg-feelingcare-primary/10 hover:text-feelingcare-light-text dark:text-feelingcare-dark-text-secondary dark:hover:bg-feelingcare-primary-dark/10 dark:hover:text-feelingcare-dark-text"
        }`}
        type="button"
        title={isActive ? "Desactiver le mode ecoute" : "Activer le mode ecoute"}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Headphones className="h-4 w-4" />
        )}
        {isActive ? "Mode ecoute actif" : "Mode ecoute"}
      </button>
      {error && <p className="px-2 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}
