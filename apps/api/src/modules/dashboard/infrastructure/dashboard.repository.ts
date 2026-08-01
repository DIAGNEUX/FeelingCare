import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private prisma: PrismaService) {}

  async findRecentConversationsByUserId(userId: string, limit = 3) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        createdAt: true,
        emotion: {
          select: { name: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 15,
          select: {
            role: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });
  }
  // dashboard.repository.ts
  async findUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        messages: {
          select: {
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // dashboard.repository.ts
  async findRecentConversationsWithEmotion(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: {
        createdAt: true,
        emotion: {
          select: {
            name: true,
          },
        },
      },
    });
  }
  async findUserConversationCount(userId: string) {
    return this.prisma.conversation.count({
      where: { userId },
    });
  }
}
