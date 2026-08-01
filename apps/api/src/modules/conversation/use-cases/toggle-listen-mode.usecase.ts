import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../infrastructure/conversation.repository';

@Injectable()
export class ToggleListenModeUseCase {
  constructor(private readonly repo: ConversationRepository) {}

  async execute(userId: string, conversationId: string) {
    const conversation = await this.repo.findById(conversationId);

    if (!conversation || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    const updated = await this.repo.toggleListenMode(conversationId);

    return updated;
  }
}
