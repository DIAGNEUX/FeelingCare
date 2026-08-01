"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

import MessageComposer from "./component/MessageComposer";
import ListenModeToggleButton from "./component/Buttons/ListenModeToggleButton";
import MessageList from "./component/MessageList";
import type { Conversation, ListenMode } from "@/lib/types";

function normalizeEmotionName(name: string) {
  return name
    .replace("Ã©", "e")
    .replace("Ã¨", "e")
    .replace("é", "e")
    .replace("è", "e");
}

type Props = {
  conversation: Conversation;
  onConversationRefresh: () => Promise<void> | void;
};

export default function ChatClient({
  conversation,
  onConversationRefresh,
}: Props) {
  const [mode, setMode] = useState<ListenMode>(
    conversation.listenMode ? "listen_only" : "default"
  );

  return (
    <main className="mx-auto flex h-screen w-full max-w-4xl flex-1 flex-col px-4 py-7 sm:px-6">
      <header className="mb-4 shrink-0 px-1">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-feelingcare-primary text-feelingcare-light-text">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold text-feelingcare-light-text dark:text-feelingcare-dark-text">
                {conversation.title}
              </h1>
              <p className="mt-1 text-sm text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                {conversation.emotion
                  ? `Emotion: ${normalizeEmotionName(conversation.emotion.name)}`
                  : "Conversation libre"}
              </p>
            </div>
          </div>

          <ListenModeToggleButton
            mode={mode}
            setMode={setMode}
            conversationId={conversation.id}
          />
        </div>
      </header>

      <MessageList
        messages={conversation.messages}
        conversationId={conversation.id}
      />

      <div className="shrink-0 pt-4">
        <MessageComposer
          key={mode}
          conversationId={conversation.id}
          onMessageSent={onConversationRefresh}
        />
      </div>
    </main>
  );
}
