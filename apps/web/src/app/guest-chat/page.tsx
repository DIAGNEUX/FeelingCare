"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  HeartPulse,
  Loader2,
  LogIn,
  MessageCircle,
  SendHorizontal,
} from "lucide-react";

import AccountMenu from "@/app/component/auth/AccountMenu";
import { ThemeToggle } from "@/app/component/ui/theme-toggle";
import { sendGuestMessage, type GuestChatMessage } from "@/lib/api/guest-chat.api";

type GuestUiMessage = GuestChatMessage & {
  id: string;
};

function buildOpeningMessage(emotionName: string | null) {
  const emotion = (emotionName ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (emotion.includes("triste")) {
    return "Je suis là avec toi. Qu'est-ce qui pèse le plus en ce moment ?";
  }

  if (emotion.includes("stress")) {
    return "Je t'écoute. Qu'est-ce qui te met sous pression en ce moment ?";
  }

  if (emotion.includes("fatigue")) {
    return "Je comprends. Cette fatigue, tu la ressens plutôt dans le corps, dans la tête, ou les deux ?";
  }

  if (emotion.includes("colere")) {
    return "Je t'entends. Qu'est-ce qui a déclenché cette colère, là, maintenant ?";
  }

  if (emotion.includes("confus")) {
    return "D'accord. Qu'est-ce qui te semble le plus flou ou difficile à comprendre en ce moment ?";
  }

  return "Bonjour. Comment tu te sens en ce moment ?";
}

function createMessage(role: GuestChatMessage["role"], content: string): GuestUiMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
  };
}

function GuestChatContent() {
  const searchParams = useSearchParams();
  const emotionName = searchParams.get("emotion");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<GuestUiMessage[]>(() => [
    createMessage("assistant", buildOpeningMessage(emotionName)),
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const apiMessages = useMemo<GuestChatMessage[]>(
    () =>
      messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    [messages]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function onSend() {
    const text = content.trim();
    if (!text || loading) return;

    const userMessage = createMessage("user", text);
    const nextMessages = [...apiMessages, { role: "user" as const, content: text }];

    setMessages((current) => [...current, userMessage]);
    setContent("");
    setLoading(true);

    try {
      const { reply } = await sendGuestMessage({
        emotionName,
        messages: nextMessages,
      });

      setMessages((current) => [...current, createMessage("assistant", reply)]);
    } catch (error) {
      console.error(error);
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          "Je n'arrive pas à répondre pour le moment. Tu peux réessayer dans quelques instants."
        ),
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-feelingcare-light-bg text-feelingcare-light-text transition-colors duration-300 dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-feelingcare-primary text-feelingcare-light-text shadow-[0_14px_35px_rgba(221,242,65,0.35)]">
            <HeartPulse className="h-6 w-6" />
          </span>
          <span className="text-xl font-bold">FeelingCare</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </header>

      <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 pb-6 sm:px-6">
        <div className="mb-4 rounded-[1.5rem] border border-feelingcare-primary/30 bg-feelingcare-primary/10 px-4 py-3 text-sm font-semibold text-feelingcare-light-text dark:border-feelingcare-primary-dark/30 dark:bg-feelingcare-primary-dark/10 dark:text-feelingcare-dark-text">
          Conversation temporaire. Connecte-toi pour garder ton historique et ton
          dashboard émotionnel.
          <Link href="/login" className="ml-2 inline-flex items-center gap-1 underline underline-offset-4">
            <LogIn className="h-3.5 w-3.5" />
            Se connecter
          </Link>
        </div>

        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-feelingcare-primary text-feelingcare-light-text">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold">Conversation invitée</h1>
            <p className="mt-1 text-sm text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
              Rien n&apos;est enregistré tant que tu n&apos;es pas connecté.
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-1 py-6 sm:px-5">
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] whitespace-pre-wrap rounded-[1.5rem] px-4 py-3 text-sm leading-7 sm:max-w-[72%] ${
                    isUser
                      ? "bg-feelingcare-primary text-feelingcare-light-text"
                      : "bg-feelingcare-light-bg text-feelingcare-light-text dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            );
          })}

          {loading && (
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
        </div>

        <div className="mt-4 rounded-[1.75rem] border border-feelingcare-light-border bg-white/80 p-2 transition-colors focus-within:border-feelingcare-primary dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary/80 dark:focus-within:border-feelingcare-primary-dark">
          <div className="relative flex items-center">
            <input
              className="min-h-12 w-full rounded-[1.4rem] bg-transparent px-4 py-3 pr-14 text-sm text-feelingcare-light-text placeholder:text-feelingcare-light-text-secondary focus:outline-none disabled:opacity-50 dark:text-feelingcare-dark-text dark:placeholder:text-feelingcare-dark-text-secondary"
              placeholder="Ecris ce qui vient..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              disabled={loading}
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
              disabled={loading || !content.trim()}
              type="button"
              aria-label="Envoyer"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendHorizontal className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function GuestChatPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-feelingcare-light-bg text-feelingcare-light-text dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
          <div className="flex items-center gap-3 rounded-full border border-feelingcare-light-border bg-white px-5 py-3 text-sm font-bold shadow-sm dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
            <HeartPulse className="h-4 w-4 animate-pulse text-feelingcare-primary" />
            Chargement...
          </div>
        </main>
      }
    >
      <GuestChatContent />
    </Suspense>
  );
}
