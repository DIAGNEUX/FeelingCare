import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '../infrastructure/conversation.repository';
import { Conversation } from '../domain/conversation.entity';

@Injectable()
export class CreateConversationUseCase {
  constructor(private readonly repo: ConversationRepository) {}

  async execute(emotionId?: string) {
    // 1. récupérer émotion (infra)
    let emotionName: string | null = null;

    if (emotionId) {
      const emotion = await this.repo.findEmotionById(emotionId);
      emotionName = emotion?.name ?? null;
    }

    // 2. créer entité métier (domain)
    const conversation = new Conversation('', emotionName);

    // 3. logique métier (domain)
    const openingMessage = conversation.getOpeningMessage();

    // 4. sauvegarde (infra)
    return this.repo.createConversationWithFirstMessage(
      emotionId,
      openingMessage,
    );
  }
}