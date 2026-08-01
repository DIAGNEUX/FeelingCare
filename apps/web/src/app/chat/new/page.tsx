"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  Headphones,
  Loader2,
  MessageCircle,
  SendHorizontal,
} from "lucide-react";

import RequireAuth from "@/app/component/auth/RequireAuth";
import { createConversation } from "@/lib/api/conversation.api";
import { streamMessage } from "@/lib/api/message.api";
import type { ConversationListItem } from "@/lib/types";

import Sidebar from "../component/Sidebar";

type DraftMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

function normalizeEmotionName(name: string | null) {
  return (name ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buildOpeningMessage(emotionName: string | null) {
  const emotion = normalizeEmotionName(emotionName);

  if (emotion.includes("triste")) {
    return "Je suis la avec toi. Qu'est-ce qui pese le plus en ce moment ?";
  }

  if (emotion.includes("stress")) {
    return "Je t'ecoute. Qu'est-ce qui te met sous pression en ce moment ?";
  }

  if (emotion.includes("fatigue")) {
    return "Je comprends. Cette fatigue, tu la ressens plutot dans le corps, dans la tete, ou les deux ?";
  }

  if (emotion.includes("colere")) {
    return "Je t'entends. Qu'est-ce qui a declenche cette colere, la, maintenant ?";
  }

  if (emotion.includes("confus")) {
    return "D'accord. Qu'est-ce qui te semble le plus flou ou difficile a comprendre en ce moment ?";
  }

  return "Je suis la avec toi. Qu'est-ce qui pese le plus en ce moment ?";
}

function createDraftMessage(
  role: DraftMessage["role"],
  content: string
): DraftMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NewChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emotionId = searchParams.get("emotionId") || undefined;
  const emotionName = searchParams.get("emotion");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [draftCreatedAt] = useState(() => new Date().toISOString());
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState<DraftMessage[]>(() => [
    createDraftMessage("assistant", buildOpeningMessage(emotionName)),
  ]);

  const draftHref = `/chat/new${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;
  const draftConversation: ConversationListItem = {
    id: "new",
    title: "Nouvelle conversation",
    emotion: emotionName
      ? {
          id: emotionId ?? "draft-emotion",
          name: emotionName,
        }
      : null,
    createdAt: draftCreatedAt,
    lastMessageAt: draftCreatedAt,
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, saving]);

  async function onSend() {
    const text = content.trim();
    if (!text || saving) return;

    setMessages((current) => [
      ...current,
      createDraftMessage("user", text),
    ]);
    setContent("");
    setSaving(true);

    try {
      const conversation = await createConversation(emotionId);

      await streamMessage(
        conversation.id,
        text,
        () => undefined,
        () => undefined
      );

      router.replace(`/chat/${conversation.id}`);
    } catch (error) {
      console.error(error);
      setMessages((current) => [
        ...current,
        createDraftMessage(
          "assistant",
          "Je n'arrive pas a demarrer cette conversation pour le moment. Tu peux reessayer dans quelques instants."
        ),
      ]);
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-feelingcare-light-bg text-feelingcare-light-text transition-colors duration-300 dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
      <Sidebar
        activeId="new"
        draftConversation={draftConversation}
        draftHref={draftHref}
      />

      <main className="mx-auto flex h-screen w-full max-w-4xl flex-1 flex-col px-4 py-7 sm:px-6">
        <header className="mb-4 shrink-0 px-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-feelingcare-primary text-feelingcare-light-text">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold text-feelingcare-light-text dark:text-feelingcare-dark-text">
                  Nouvelle conversation
                </h1>
                <p className="mt-1 text-sm text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                  {emotionName ? `Emotion: ${emotionName}` : "Conversation libre"}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
              <Headphones className="h-4 w-4" />
              Mode ecoute
            </div>
          </div>
        </header>

        <section className="flex-1 space-y-8 overflow-y-auto px-1 py-6 sm:px-5">
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`group flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                {isUser ? (
                  <div className="max-w-[82%] whitespace-pre-wrap rounded-[1.4rem] bg-feelingcare-primary px-4 py-3 text-sm leading-7 text-feelingcare-light-text sm:max-w-[72%]">
                    {message.content}
                  </div>
                ) : (
                  <div className="max-w-[82%] px-1 py-1 text-[15px] leading-7 text-feelingcare-light-text dark:text-feelingcare-dark-text sm:max-w-[72%]">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                )}
                <span className="mt-1 px-2 text-xs text-feelingcare-light-text-secondary opacity-0 transition-opacity group-hover:opacity-100 dark:text-feelingcare-dark-text-secondary/60">
                  {formatTime(message.createdAt)}
                </span>
              </div>
            );
          })}

          {saving && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-feelingcare-primary/15 px-4 py-3 dark:bg-feelingcare-primary-dark/10">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-feelingcare-primary [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-feelingcare-primary [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-feelingcare-primary [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </section>

        <div className="shrink-0 pt-4">
          <div className="rounded-[1.75rem] border border-feelingcare-light-border bg-white/80 p-2 transition-colors focus-within:border-feelingcare-primary dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary/80 dark:focus-within:border-feelingcare-primary-dark">
            <div className="relative flex items-center">
              <input
                className="min-h-12 w-full rounded-[1.4rem] bg-transparent px-4 py-3 pr-14 text-sm text-feelingcare-light-text placeholder:text-feelingcare-light-text-secondary focus:outline-none disabled:opacity-50 dark:text-feelingcare-dark-text dark:placeholder:text-feelingcare-dark-text-secondary"
                placeholder="Ecris ce qui vient..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
                disabled={saving}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    onSend();
                  }
                }}
              />
              <button
                className="absolute right-1 inline-flex h-11 w-11 items-center justify-center rounded-full bg-feelingcare-primary text-feelingcare-light-text transition-all hover:bg-feelingcare-primary/90 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-feelingcare-primary-dark dark:text-feelingcare-dark-bg"
                onClick={onSend}
                disabled={saving || !content.trim()}
                type="button"
                aria-label="Envoyer"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <SendHorizontal className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NewChatPage() {
  return (
    <RequireAuth>
      <Suspense
        fallback={
          <main className="flex min-h-screen items-center justify-center bg-feelingcare-light-bg text-feelingcare-light-text dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
            <div className="flex items-center gap-3 rounded-full border border-feelingcare-light-border bg-white px-5 py-3 text-sm font-bold shadow-sm dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
              <Loader2 className="h-4 w-4 animate-spin text-feelingcare-primary" />
              Chargement...
            </div>
          </main>
        }
      >
        <NewChatContent />
      </Suspense>
    </RequireAuth>
  );
}
