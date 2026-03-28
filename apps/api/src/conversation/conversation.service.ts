import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConversationDto, CreateMessageDto } from './dto/create-conversation.dto';
import { MessageRole } from '@prisma/client';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) { }

  private getOpeningMessage(emotionName?: string | null): string {
    const e = (emotionName ?? '').trim().toLowerCase();

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
      return "Je comprends. Cette fatigue, tu la ressens plutôt dans le corps, dans la tête, ou les deux ?";
    }
    if (e === 'en colère' || e === 'colère' || e === 'colere') {
      return "Je t'entends. Qu'est-ce qui a déclenché cette colère, là, maintenant ?";
    }

    return 'Bonjour. Comment tu te sens en ce moment ?';
  }

  async create(dto: CreateConversationDto) {
    let emotionName: string | null = null;

    if (dto.emotionId) {
      const emotion = await this.prisma.emotion.findUnique({
        where: { id: dto.emotionId },
        select: { name: true },
      });
      emotionName = emotion?.name ?? null;
    }

    const opening = this.getOpeningMessage(emotionName);

    return this.prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {
          title: 'Nouvelle conversation',
          emotionId: dto.emotionId ?? null,
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

  async addUserMessage(conversationId: string, dto: CreateMessageDto) {
    // 1. Vérifier que la conversation existe + récupérer l'émotion
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        emotion: { select: { name: true } },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // 2. Sauvegarder le message USER
    const userMessage = await this.prisma.message.create({
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

    // 3. Récupérer tout l'historique
    const history = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      select: { role: true, content: true },
    });

    // 4. Formater l'historique pour OpenAI
    const formattedHistory = history.map((m) => ({
      role: m.role === MessageRole.USER ? 'user' as const : 'assistant' as const,
      content: m.content,
    }));

    // 5. Appeler l'IA pour la réponse
    const aiReply = await this.aiService.generateReply(
      formattedHistory,
      conversation.emotion?.name ?? null,
    );

    // 6. Sauvegarder la réponse ASSISTANT
    const assistantMessage = await this.prisma.message.create({
      data: {
        role: MessageRole.ASSISTANT,
        content: aiReply,
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

    // 7. Compter les messages USER pour déclencher le titre au 3ème
    const userMessageCount = history.filter(
      (m) => m.role === MessageRole.USER,
    ).length;

    if (userMessageCount === 3) {
      const title = await this.aiService.generateTitle(formattedHistory);
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { title },
      });
    }

    // 8. Retourner les 2 messages
    return { userMessage, assistantMessage };
  }

    async remove(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    await this.prisma.conversation.delete({
      where: { id },
    });

    return { success: true };
  }
  async editMessage(conversationId: string, messageId: string, dto: CreateMessageDto) {
  // 1. Vérifier que le message existe et appartient à la conversation
  const message = await this.prisma.message.findFirst({
    where: { id: messageId, conversationId },
    select: { id: true, role: true, createdAt: true },
  });

  if (!message) {
    throw new NotFoundException('Message not found');
  }

  // 2. Mettre à jour le message
  await this.prisma.message.update({
    where: { id: messageId },
    data: { content: dto.content },
  });

  // 3. Supprimer tous les messages qui suivent ce message
  await this.prisma.message.deleteMany({
    where: {
      conversationId,
      createdAt: { gt: message.createdAt },
    },
  });

  // 4. Récupérer l'historique mis à jour
  const history = await this.prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    select: { role: true, content: true },
  });

  // 5. Récupérer l'émotion de la conversation
  const conversation = await this.prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { emotion: { select: { name: true } } },
  });

  // 6. Formater l'historique pour OpenAI
  const formattedHistory = history.map((m) => ({
    role: m.role === MessageRole.USER ? 'user' as const : 'assistant' as const,
    content: m.content,
  }));

  // 7. Régénérer une réponse IA
  const aiReply = await this.aiService.generateReply(
    formattedHistory,
    conversation?.emotion?.name ?? null,
  );

  // 8. Sauvegarder la nouvelle réponse IA
  const assistantMessage = await this.prisma.message.create({
    data: {
      role: MessageRole.ASSISTANT,
      content: aiReply,
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

  return { success: true, assistantMessage };
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
}