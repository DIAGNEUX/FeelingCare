import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../infrastructure/conversation.repository';
import { Conversation } from '../domain/conversation.entity';

import { GenerateReplyUseCase } from '../../ai/application/generate-reply.usecase';
import { GenerateTitleUseCase } from '../../ai/application/generate-title.usecase';
import { GenerateMemoryUseCase } from 'src/modules/ai/application/generate-memory.usecase';
import { MemoryRepository } from 'src/modules/ai/infrastructure/memory.repository';
import { GuardrailUseCase } from 'src/modules/ai/application/guardrail.usecase';

function debugAi(message: string, meta?: Record<string, unknown>) {
  if (process.env.AI_DEBUG === 'true') {
    console.log(message, meta ?? {});
  }
}

@Injectable()
export class AddUserMessageUseCase {
  constructor(
    private readonly repo: ConversationRepository,
    private readonly generateReply: GenerateReplyUseCase,
    private readonly generateTitle: GenerateTitleUseCase,
    private readonly generateMemory: GenerateMemoryUseCase,
    private readonly memoryRepo: MemoryRepository,
    private readonly guardrail: GuardrailUseCase,
  ) {}

  async execute(userId: string, conversationId: string, content: string) {
    // 1. Vérifier conversation
    const conversationData = await this.repo.findById(conversationId);

    if (!conversationData || conversationData.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    // 🔥 2. Récupérer listenMode depuis DB
    const listenMode = conversationData.listenMode;
    debugAi('[conversation:add-message] listen mode', { listenMode });

    // 3. Entité métier
    const conversation = new Conversation(
      conversationData.id,
      conversationData.emotion?.name ?? null,
    );

    // 4. Sauvegarder message USER
    const userMessage = await this.repo.saveUserMessage(
      conversationId,
      content,
    );

    // 5. Récupérer historique
    const history = await this.repo.getHistory(conversationId);

    // 6. Formatter pour IA
    const formattedHistory = this.formatHistory(history);

    // 7. Récupérer mémoire
    const memory = await this.memoryRepo.findByUserId(userId);

    // 8. Guardrail
    const guardrailResult = await this.guardrail.execute(content);
    const { strategy } = guardrailResult;

    debugAi('[conversation:add-message] strategy', { strategy });

    // 🔥 9. Déterminer le mode EFFECTIF
    let effectiveMode: 'default' | 'listen_only';

    if (strategy === 'CRISIS_SUPPORT') {
      effectiveMode = 'default'; // override sécurité
    } else {
      effectiveMode = listenMode ? 'listen_only' : 'default';
    }

    debugAi('[conversation:add-message] effective mode', { effectiveMode });

    // 10. Appel IA
    const aiReply = await this.generateReply.execute(
      formattedHistory,
      conversation.emotionName,
      memory?.content ?? undefined,
      strategy,
      effectiveMode,
    );

    // 11. Sauvegarder réponse
    const assistantMessage = await this.repo.saveAssistantMessage(
      conversationId,
      aiReply,
    );

    // 12. Règle mémoire
    const userCount = history.filter((m) => m.role === 'USER').length;

    if (userCount >= 3) {
      await this.updateMemory(
        userId,
        formattedHistory,
        memory?.content ?? null,
      );
    }

    // 13. Génération titre
    if (conversation.shouldGenerateTitle(userCount)) {
      const title = await this.generateTitle.execute(formattedHistory);
      await this.repo.updateTitle(conversationId, title);
    }

    return { userMessage, assistantMessage };
  }

  private formatHistory(history: any[]) {
    return history.map((m) => ({
      role: m.role === 'USER' ? ('user' as const) : ('assistant' as const),
      content: m.content,
    }));
  }

  private async updateMemory(
    userId: string,
    history: { role: 'user' | 'assistant'; content: string }[],
    currentMemory: string | null,
  ) {
    const newMemory = await this.generateMemory.execute({
      currentMemory,
      messages: history,
    });

    const existingMemory = await this.memoryRepo.findByUserId(userId);

    if (existingMemory) {
      await this.memoryRepo.update(userId, newMemory);
    } else {
      await this.memoryRepo.create(userId, newMemory);
    }
  }
}
