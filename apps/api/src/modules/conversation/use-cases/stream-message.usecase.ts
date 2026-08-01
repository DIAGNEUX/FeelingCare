import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../infrastructure/conversation.repository';
import { Conversation } from '../domain/conversation.entity';
import { GenerateReplyStreamUseCase } from '../../ai/application/generate-reply-stream.usecase';
import { GenerateTitleUseCase } from '../../ai/application/generate-title.usecase';
import { MemoryRepository } from 'src/modules/ai/infrastructure/memory.repository';
import { GenerateMemoryUseCase } from 'src/modules/ai/application/generate-memory.usecase';
import { GuardrailUseCase } from 'src/modules/ai/application/guardrail.usecase';

function debugAi(message: string, meta?: Record<string, unknown>) {
  if (process.env.AI_DEBUG === 'true') {
    console.log(message, meta ?? {});
  }
}

@Injectable()
export class StreamMessageUseCase {
  constructor(
    private readonly repo: ConversationRepository,
    private readonly generateStream: GenerateReplyStreamUseCase,
    private readonly generateTitle: GenerateTitleUseCase,
    private readonly memoryRepo: MemoryRepository,
    private readonly generateMemory: GenerateMemoryUseCase,
    private readonly guardrail: GuardrailUseCase,
  ) {}

  async execute(
    userId: string,
    conversationId: string,
    content: string,
    onChunk: (chunk: string) => void,
  ) {
    // 1. Vérifier conversation
    const conversationData = await this.repo.findById(conversationId);

    if (!conversationData || conversationData.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    // 🔥 2. Récupérer listenMode depuis la DB
    const listenMode = conversationData.listenMode;

    debugAi('[conversation:stream] listen mode', { listenMode });

    // 3. Récupérer mémoire utilisateur
    const memory = await this.memoryRepo.findByUserId(userId);

    // 4. Domain
    const conversation = new Conversation(
      conversationData.id,
      conversationData.emotion?.name ?? null,
    );

    // 5. Save message USER
    await this.repo.saveUserMessage(conversationId, content);

    // 6. Get history
    const history = await this.repo.getHistory(conversationId);

    // 7. Format
    const formattedHistory = this.formatHistory(history);

    // 8. Guardrail
    const guardrailResult = await this.guardrail.execute(content);
    const { strategy } = guardrailResult;

    debugAi('[conversation:stream] strategy', { strategy });

    // 🔥 9. Déterminer le mode EFFECTIF (logique métier)
    let effectiveMode: 'default' | 'listen_only';

    if (strategy === 'CRISIS_SUPPORT') {
      effectiveMode = 'default'; // override sécurité
    } else {
      effectiveMode = listenMode ? 'listen_only' : 'default';
    }

    debugAi('[conversation:stream] effective mode', { effectiveMode });

    // 10. Stream OpenAI
    const stream = await this.generateStream.execute(
      formattedHistory,
      conversation.emotionName,
      memory?.content ?? undefined,
      strategy,
      effectiveMode,
    );

    // 11. Accumulation + streaming
    let fullReply = '';

    for await (const chunk of stream) {
      fullReply += chunk;
      onChunk(chunk);
    }

    // 12. Save final response
    await this.repo.saveAssistantMessage(conversationId, fullReply);

    // 13. Update mémoire
    const userCount = history.filter((m) => m.role === 'USER').length;

    if (userCount % 5 === 0) {
      await this.updateMemory(
        userId,
        formattedHistory,
        memory?.content ?? null,
      );
    }

    // 14. Génération du titre
    if (conversation.shouldGenerateTitle(userCount)) {
      const title = await this.generateTitle.execute(formattedHistory);
      await this.repo.updateTitle(conversationId, title);
    }
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
