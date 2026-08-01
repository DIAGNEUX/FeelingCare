import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MessageRole } from '@prisma/client';

@Injectable()
export class ConversationRepository {
  constructor(private prisma: PrismaService) {}

  async findEmotionById(emotionId: string) {
    return this.prisma.emotion.findUnique({
      where: { id: emotionId },
      select: { name: true },
    });
  }

  async createConversationWithFirstMessage(
    userId: string,
    emotionId: string | undefined,
    openingMessage: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {
          title: 'Nouvelle conversation',
          emotionId: emotionId ?? null,
          userId,
        },
        select: {
          id: true,
          title: true,
          emotion: { select: { id: true, name: true } },
          createdAt: true,
        },
      });

      const firstMessage = await tx.message.create({
        data: {
          role: MessageRole.ASSISTANT,
          content: openingMessage,
          conversationId: conversation.id,
        },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
          conversationId: true,
        },
      });

      return {
        ...conversation,
        messages: [firstMessage],
      };
    });
  }

  async findById(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        emotion: { select: { name: true } },
        userId: true,
        listenMode: true,
      },
    });
  }

  async saveUserMessage(conversationId: string, content: string) {
    return this.prisma.message.create({
      data: {
        role: 'USER',
        content,
        conversationId,
      },
    });
  }

  async saveAssistantMessage(conversationId: string, content: string) {
    return this.prisma.message.create({
      data: {
        role: 'ASSISTANT',
        content,
        conversationId,
      },
    });
  }

  async getHistory(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      select: { role: true, content: true },
    });
  }

  async updateTitle(conversationId: string, title: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { title },
    });
  }

  async findMessage(messageId: string, conversationId: string) {
    return this.prisma.message.findFirst({
      where: { id: messageId, conversationId },
      select: { id: true, role: true, createdAt: true },
    });
  }

  async updateMessage(messageId: string, content: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { content },
    });
  }

  async deleteMessagesAfter(conversationId: string, createdAt: Date) {
    return this.prisma.message.deleteMany({
      where: {
        conversationId,
        createdAt: { gt: createdAt },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        title: true,
        emotion: { select: { id: true, name: true } },
        listenMode: true,
        createdAt: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
            conversationId: true,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: { userId }, // 🔥 FILTRE
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        emotion: { select: { id: true, name: true } },
        createdAt: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true },
        },
      },
    });

    return conversations.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      emotion: conversation.emotion,
      createdAt: conversation.createdAt,
      lastMessageAt:
        conversation.messages[0]?.createdAt ?? conversation.createdAt,
    }));
  }

  async deleteConversation(id: string, userId: string) {
    return this.prisma.conversation.delete({
      where: {
        id,
        userId,
      },
    });
  }

  async renameConversation(id: string, userId: string, title: string) {
    return this.prisma.conversation.update({
      where: { id, userId },
      data: { title },
      select: {
        id: true,
        title: true,
        emotion: { select: { id: true, name: true } },
        createdAt: true,
      },
    });
  }

  async toggleListenMode(conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { listenMode: true },
    });

    if (!conversation) return null;

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { listenMode: !conversation.listenMode },
      select: { listenMode: true },
    });
  }
}
