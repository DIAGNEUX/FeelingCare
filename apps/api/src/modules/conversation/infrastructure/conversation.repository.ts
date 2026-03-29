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
    emotionId: string | undefined,
    openingMessage: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {
          title: 'Nouvelle conversation',
          emotionId: emotionId ?? null,
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
      title: true,
      emotion: { select: { id: true, name: true } },
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

async findAll() {
  const conversations = await this.prisma.conversation.findMany({
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

async deleteConversation(id: string) {
  return this.prisma.conversation.delete({
    where: { id },
  });
}

async renameConversation(id: string, title: string) {
  return this.prisma.conversation.update({
    where: { id },
    data: { title },
    select: {
      id: true,
      title: true,
      emotion: { select: { id: true, name: true } },
      createdAt: true,
    },
  });
}
}