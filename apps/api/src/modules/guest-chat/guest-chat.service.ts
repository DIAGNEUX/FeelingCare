import { BadRequestException, Injectable } from '@nestjs/common';
import { GenerateReplyUseCase } from '../ai/application/generate-reply.usecase';
import { GuardrailUseCase } from '../ai/application/guardrail.usecase';
import type { GuestChatRequestDto, GuestMessageDto } from './dto/guest-message.dto';

@Injectable()
export class GuestChatService {
  constructor(
    private readonly generateReply: GenerateReplyUseCase,
    private readonly guardrail: GuardrailUseCase,
  ) {}

  async reply(dto: GuestChatRequestDto) {
    const messages = this.normalizeMessages(dto.messages);
    const lastUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === 'user');

    if (!lastUserMessage) {
      throw new BadRequestException('A user message is required');
    }

    const { strategy } = await this.guardrail.execute(lastUserMessage.content);
    const reply = await this.generateReply.execute(
      messages,
      dto.emotionName ?? null,
      undefined,
      strategy,
      'default',
    );

    return { reply };
  }

  private normalizeMessages(messages: GuestMessageDto[] | undefined) {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new BadRequestException('Messages are required');
    }

    return messages
      .slice(-12)
      .map((message) => ({
        role: message.role,
        content: String(message.content ?? '').trim().slice(0, 2000),
      }))
      .filter(
        (message): message is { role: 'user' | 'assistant'; content: string } =>
          (message.role === 'user' || message.role === 'assistant') &&
          message.content.length > 0,
      );
  }
}
