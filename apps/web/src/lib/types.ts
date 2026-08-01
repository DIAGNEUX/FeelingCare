export type MessageRole = "USER" | "ASSISTANT";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  conversationId: string;
};

export type Emotion = {
  id: string;
  name: string;
};

export type Conversation = {
  id: string;
  title: string;
  emotion: Emotion | null;
  createdAt: string;
  listenMode: boolean;
  messages: Message[];
};

export type ConversationListItem = {
  id: string;
  title: string;
  emotion: Emotion | null;
  createdAt: string;
  lastMessageAt: string;
};
export type ListenMode = 'default' | 'listen_only';
export type ConversationStartResponse = Conversation;
