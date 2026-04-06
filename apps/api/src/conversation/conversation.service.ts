import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateConversationDto,
  CreateMessageDto,
} from './dto/create-conversation.dto';

const MessageRole = {
  USER: 'USER',
  ASSISTANT: 'ASSISTANT',
} as const;

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  private getOpeningMessage(emotion?: string | null): string {
    const e = (emotion ?? '').trim().toLowerCase();

    if (e === 'triste') {
      return "Je suis là avec toi. Qu'est-ce qui te rend triste en ce moment ?";
    }
    if (e === 'stressé' || e === 'stresse' || e === 'stress') {
      return "Je t'écoute. Qu'est-ce qui te met sous pression en ce moment ?";
    }
    if (e === 'confus') {
      return "D'accord. Qu'est-ce qui te semble le plus flou ou difficile à comprendre en ce moment ?";
    }
    if (e === 'fatigué' || e === 'fatigue') {
      return 'Je comprends. Cette fatigue, tu la ressens plutôt dans le corps, dans la tête, ou les deux ?';
    }
    if (e === 'en colère' || e === 'colère' || e === 'colere') {
      return "Je t'entends. Qu'est-ce qui a déclenché cette colère, là, maintenant ?";
    }

    return 'Bonjour. Comment tu te sens en ce moment ?';
  }

  async create(dto: CreateConversationDto, userId: string) {
    const opening = this.getOpeningMessage(dto.emotion ?? null);

    return this.prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {
          title: 'Nouvelle conversation',
          emotion: dto.emotion ?? null,
          userId,
        },
        select: {
          id: true,
          title: true,
          emotion: true,
          createdAt: true,
        },
      });

      const firstMessage = await tx.message.create({
        data: {
          role: MessageRole.ASSISTANT,
          content: opening,
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

  async findOne(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        emotion: true,
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

  async addUserMessage(conversationId: string, dto: CreateMessageDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.message.create({
      data: {
        role: MessageRole.USER,
        content: dto.content,
        conversationId,
      },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
        conversationId: true,
      },
    });
  }

  async findAll() {
    const conversations = await this.prisma.conversation.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        emotion: true,
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
}
