export type GuestMessageRole = 'user' | 'assistant';

export type GuestMessageDto = {
  role: GuestMessageRole;
  content: string;
};

export type GuestChatRequestDto = {
  emotionName?: string | null;
  messages: GuestMessageDto[];
};
