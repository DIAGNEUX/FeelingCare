"use client";

import { useCallback, useEffect, useState } from "react";
import { HeartPulse } from "lucide-react";

import { getConversation } from "@/lib/api/conversation.api";
import RequireAuth from "@/app/component/auth/RequireAuth";
import Sidebar from "../component/Sidebar";
import ChatClient from "../ChatClient";
import type { Conversation } from "@/lib/types";

function SavedChatContent({ params }: { params: Promise<{ id: string }> }) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

  const loadConversation = useCallback(async (conversationId: string) => {
    const data = await getConversation(conversationId);
    setConversation(data);
    return data;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const resolvedParams = await params;
      if (cancelled) return;

      setId(resolvedParams.id);

      await loadConversation(resolvedParams.id);
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [loadConversation, params]);

  const refreshConversation = useCallback(async () => {
    if (!id) return;

    await loadConversation(id);
    setSidebarRefreshKey((current) => current + 1);
  }, [id, loadConversation]);

  if (!conversation || !id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-feelingcare-light-bg text-feelingcare-light-text dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
        <div className="flex items-center gap-3 rounded-full border border-feelingcare-light-border bg-white px-5 py-3 text-sm font-bold shadow-sm dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
          <HeartPulse className="h-4 w-4 animate-pulse text-feelingcare-primary" />
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-feelingcare-light-bg text-feelingcare-light-text transition-colors duration-300 dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
      <Sidebar activeId={id} refreshKey={sidebarRefreshKey} />
      <ChatClient
        key={conversation.id}
        conversation={conversation}
        onConversationRefresh={refreshConversation}
      />
    </div>
  );
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <RequireAuth>
      <SavedChatContent params={params} />
    </RequireAuth>
  );
}
