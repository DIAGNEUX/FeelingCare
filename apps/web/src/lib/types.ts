export type MessageRole = "USER" | "ASSISTANT";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  conversationId: string;
};

export type Conversation = {
  id: string;
  title: string;
  emotion: string | null;
  createdAt: string;
  messages: Message[];
};
export type ConversationListItem = {
  id: string;
  title: string;
  emotion: string | null;
  createdAt: string;
  lastMessageAt: string;
};

export type ConversationStartResponse = Conversation;
