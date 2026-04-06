import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../../infrastructure/conversation.repository';
import { Conversation } from '../../domain/conversation.entity';

import { GenerateReplyUseCase } from 'src/modules/ai/application/use-cases/generate-reply.usecase';
import { GenerateTitleUseCase } from 'src/modules/ai/application/use-cases/generate-title.usecase';


@Injectable()
export class AddUserMessageUseCase {
  constructor(
    private readonly repo: ConversationRepository,
    private readonly generateReply: GenerateReplyUseCase,
    private readonly generateTitle: GenerateTitleUseCase,
  ) {}

  async execute(conversationId: string, content: string) {
    // 1. Vérifier conversation
    const conversationData = await this.repo.findById(conversationId);

    if (!conversationData) {
      throw new NotFoundException('Conversation not found');
    }

    // 2. Créer entité métier
    const conversation = new Conversation(
      conversationData.id,
      conversationData.emotion?.name ?? null,
    );

    // 3. Sauvegarder message USER
    const userMessage = await this.repo.saveUserMessage(
      conversationId,
      content,
    );

    // 4. Récupérer historique
    const history = await this.repo.getHistory(conversationId);

    // 5. Formatter pour IA
    const formattedHistory = this.formatHistory(history);

    // 6. Appel IA
    const aiReply = await this.generateReply.execute(
      formattedHistory,
      conversation.emotionName,
    );

    // 7. Sauvegarder réponse
    const assistantMessage = await this.repo.saveAssistantMessage(
      conversationId,
      aiReply,
    );

    // 8. Règle métier (domain)
    const userCount = history.filter((m) => m.role === 'USER').length;

    if (conversation.shouldGenerateTitle(userCount)) {
      const title = await this.generateTitle.execute(formattedHistory);
      await this.repo.updateTitle(conversationId, title);
    }

    return { userMessage, assistantMessage };
  }

  private formatHistory(history: any[]) {
    return history.map((m) => ({
      role: m.role === 'USER' ? 'user' as const : 'assistant' as const,
      content: m.content,
    }));
  }
}