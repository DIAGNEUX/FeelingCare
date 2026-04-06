import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '../infrastructure/conversation.repository';
import { Conversation } from '../domain/conversation.entity';

@Injectable()
export class CreateConversationUseCase {
  constructor(private readonly repo: ConversationRepository) {}

  async execute(emotionId?: string) {
    // 1. Récupérer le nom de l'émotion (infra)
    let emotionName: string | null = null;

    if (emotionId) {
      const emotion = await this.repo.findEmotionById(emotionId);
      emotionName = emotion?.name ?? null;
    }

    // 2. Créer l'entité métier (domain)
    const conversation = new Conversation('', emotionName);

    // 3. Générer le message d'ouverture (domain)
    const openingMessage = conversation.getOpeningMessage();

    // 4. Sauvegarder en base (infra)
    return this.repo.createConversationWithFirstMessage(
      emotionId,
      openingMessage,
    );
  }
}