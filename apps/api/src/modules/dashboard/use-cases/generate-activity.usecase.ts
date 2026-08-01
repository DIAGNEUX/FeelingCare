import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '../infrastructure/dashboard.repository';

@Injectable()
export class GenerateActivityUseCase {
  constructor(private readonly repo: DashboardRepository) {}

  async execute(userId: string) {
    // 1. Récupérer toutes les conversations
    const conversations = await this.repo.findUserConversations(userId);

    if (conversations.length === 0) {
      return {
        sessionsThisWeek: 0,
        totalMinutes: 0,
        deepConversations: 0,
        lastActiveDaysAgo: null,
      };
    }

    const now = new Date();

    // 2. Sessions cette semaine
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const sessionsThisWeek = conversations.filter(
      (c) => new Date(c.createdAt) >= oneWeekAgo,
    ).length;

    // 3. Temps total (approximation)
    let totalMessages = 0;

    conversations.forEach((conv) => {
      totalMessages += conv.messages.length;
    });

    // 👉 1 message ≈ 30 secondes
    const totalMinutes = Math.round((totalMessages * 30) / 60);

    // 4. Conversations profondes (> 5 messages USER)
    const deepConversations = conversations.filter((conv) => {
      const userMessages = conv.messages.filter(
        (m) => m.role === 'USER',
      ).length;

      return userMessages >= 5;
    }).length;

    // 5. Dernière activité
    const lastConversation = conversations[0];

    const lastDate = new Date(lastConversation.createdAt);

    const diffTime = now.getTime() - lastDate.getTime();
    const lastActiveDaysAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return {
      sessionsThisWeek,
      totalMinutes,
      deepConversations,
      lastActiveDaysAgo,
    };
  }
}
