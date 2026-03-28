"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import TypingMessage from "./TypingMessage";
import EditMessageButton from "./EditMessageButton";

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
    <section className="flex-1 overflow-y-auto space-y-4 py-4">
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
              <div className="max-w-[70%] rounded-2xl px-4 py-3 text-sm bg-white/10 text-white">
                {isLastAssistant ? (
                  <TypingMessage content={m.content} />
                ) : (
                  <div className="whitespace-pre-wrap">{m.content}</div>
                )}
              </div>
            )}
            {/* Timestamp visible au hover uniquement */}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white/25 mt-1 px-1">
              {formatTime(m.createdAt)}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </section>
  );
}