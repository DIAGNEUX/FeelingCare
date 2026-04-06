import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../infrastructure/conversation.repository';
import { Conversation } from '../domain/conversation.entity';
import { GenerateReplyStreamUseCase } from '../../ai/application/generate-reply-stream.usecase';
import { GenerateTitleUseCase } from '../../ai/application/generate-title.usecase';
@Injectable()
export class StreamMessageUseCase {
  constructor(
  private readonly repo: ConversationRepository,
  private readonly generateStream: GenerateReplyStreamUseCase,
  private readonly generateTitle: GenerateTitleUseCase,
) {}

  async execute(
    conversationId: string,
    content: string,
    onChunk: (chunk: string) => void,
  ) {
    // 1. Vérifier conversation
    const conversationData = await this.repo.findById(conversationId);

    if (!conversationData) {
      throw new NotFoundException('Conversation not found');
    }

    // 2. Domain
    const conversation = new Conversation(
      conversationData.id,
      conversationData.emotion?.name ?? null,
    );

    // 3. Save message USER
    await this.repo.saveUserMessage(conversationId, content);

    // 4. Get history
    const history = await this.repo.getHistory(conversationId);

    // 5. Format
    const formattedHistory = this.formatHistory(history);

    // 6. Stream OpenAI
    const stream = await this.generateStream.execute(
      formattedHistory,
      conversation.emotionName,
    );

    // 7. Accumulation + streaming
    let fullReply = '';

    for await (const chunk of stream) {
      fullReply += chunk;
      onChunk(chunk);
    }

    // 8. Save final response
    await this.repo.saveAssistantMessage(conversationId, fullReply);

    // 9. Règle métier
    const userCount = history.filter((m) => m.role === 'USER').length;

    if (conversation.shouldGenerateTitle(userCount)) {
      const title = await this.generateTitle.execute(formattedHistory);
      await this.repo.updateTitle(conversationId, title);
    }
  }

  private formatHistory(history: any[]) {
    return history.map((m) => ({
      role: m.role === 'USER' ? 'user' as const : 'assistant' as const,
      content: m.content,
    }));
  }
}