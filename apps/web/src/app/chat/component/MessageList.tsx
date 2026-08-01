"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import TypingMessage from "./TypingMessage";
import EditMessageButton from "./Buttons/EditMessageButton";

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageList({
  messages,
  conversationId,
}: {
  messages: Message[];
  conversationId: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastAssistantIndex = messages
    .map((m, i) => (m.role === "ASSISTANT" ? i : -1))
    .filter((i) => i !== -1)
    .at(-1);

  return (
    <section className="flex-1 space-y-8 overflow-y-auto px-1 py-6 sm:px-5">
      {messages.length === 0 && (
        <div className="mx-auto mt-20 max-w-sm text-center text-feelingcare-light-text dark:text-feelingcare-dark-text">
          <p className="text-lg font-bold">Tu peux commencer ici.</p>
          <p className="mt-2 text-sm leading-6 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
            Pose ce qui est present, meme si ce n&apos;est pas encore clair.
          </p>
        </div>
      )}

      {messages.map((m, index) => {
        const isUser = m.role === "USER";
        const isLastAssistant = index === lastAssistantIndex;

        return (
          <div
            key={m.id}
            className={`group flex flex-col ${isUser ? "items-end" : "items-start"} ${
              isLastAssistant ? "animate-fadein" : ""
            }`}
          >
            {isUser ? (
              <EditMessageButton
                conversationId={conversationId}
                messageId={m.id}
                initialContent={m.content}
              />
            ) : (
              <div className="max-w-[82%] px-1 py-1 text-[15px] leading-7 text-feelingcare-light-text dark:text-feelingcare-dark-text sm:max-w-[72%]">
                {isLastAssistant ? (
                  <TypingMessage content={m.content} />
                ) : (
                  <div className="whitespace-pre-wrap ">{m.content}</div>
                )}
              </div>
            )}
            <span className="mt-1 px-2 text-xs text-feelingcare-light-text-secondary opacity-0 transition-opacity group-hover:opacity-100 dark:text-feelingcare-dark-text-secondary/60">
              {formatTime(m.createdAt)}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </section>
  );
}
