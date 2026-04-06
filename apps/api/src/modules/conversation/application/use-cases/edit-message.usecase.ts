import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../../infrastructure/conversation.repository';
import { Conversation } from '../../domain/conversation.entity';
import { GenerateReplyUseCase } from 'src/modules/ai/application/use-cases/generate-reply.usecase';

@Injectable()
export class EditMessageUseCase {
  constructor(
  private readonly repo: ConversationRepository,
  private readonly generateReply: GenerateReplyUseCase,
) {}

  async execute(
    conversationId: string,
    messageId: string,
    content: string,
  ) {
    // 1. Vérifier message
    const message = await this.repo.findMessage(messageId, conversationId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // 2. Update message
    await this.repo.updateMessage(messageId, content);

    // 3. Delete messages suivants
    await this.repo.deleteMessagesAfter(conversationId, message.createdAt);

    // 4. Get history
    const history = await this.repo.getHistory(conversationId);

    // 5. Get conversation (emotion)
    const conversationData = await this.repo.findById(conversationId);

    const conversation = new Conversation(
      conversationId,
      conversationData?.emotion?.name ?? null,
    );

    // 6. Format
    const formattedHistory = this.formatHistory(history);

    // 7. Appel IA
    const aiReply = await this.generateReply.execute(
      formattedHistory,
      conversation.emotionName,
    );

    // 8. Save response
    const assistantMessage = await this.repo.saveAssistantMessage(
      conversationId,
      aiReply,
    );

    return {
      success: true,
      assistantMessage,
    };
  }

  private formatHistory(history: any[]) {
    return history.map((m) => ({
      role: m.role === 'USER' ? 'user' as const : 'assistant' as const,
      content: m.content,
    }));
  }
}