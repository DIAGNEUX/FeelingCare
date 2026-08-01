import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import {
  CreateConversationDto,
  CreateMessageDto,
} from './dto/create-conversation.dto';
import { CreateConversationUseCase } from './use-cases/create-conversation.usecase';
import { AddUserMessageUseCase } from './use-cases/add-user-message.usecase';
import { StreamMessageUseCase } from './use-cases/stream-message.usecase';
import { EditMessageUseCase } from './use-cases/edit-message.usecase';
import { ToggleListenModeUseCase } from './use-cases/toggle-listen-mode.usecase';
import { ConversationRepository } from './infrastructure/conversation.repository';

@Injectable()
export class ConversationService {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase,
    private readonly addUserMessageUseCase: AddUserMessageUseCase,
    private readonly streamMessageUseCase: StreamMessageUseCase,
    private readonly editMessageUseCase: EditMessageUseCase,
    private readonly toggleListenModeUseCase: ToggleListenModeUseCase,
    private readonly repo: ConversationRepository,
  ) {}

  create(userId: string, dto: CreateConversationDto) {
    return this.createConversationUseCase.execute(userId, dto.emotionId);
  }

  addUserMessage(
    userId: string,
    conversationId: string,
    dto: CreateMessageDto,
  ) {
    return this.addUserMessageUseCase.execute(
      userId,
      conversationId,
      dto.content,
    );
  }

  streamMessage(
    userId: string,
    conversationId: string,
    dto: CreateMessageDto,
    onChunk: (chunk: string) => void,
  ) {
    return this.streamMessageUseCase.execute(
      userId,
      conversationId,
      dto.content,
      onChunk,
    );
  }

  editMessage(
    userId: string,
    conversationId: string,
    messageId: string,
    dto: CreateMessageDto,
  ) {
    return this.editMessageUseCase.execute(
      userId,
      conversationId,
      messageId,
      dto.content,
    );
  }

  async findOne(userId: string, id: string) {
    const conversation = await this.repo.findOne(id);

    if (!conversation || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async findAll(userId: string) {
    return this.repo.findAll(userId);
  }

  async remove(userId: string, id: string) {
    const conversation = await this.repo.findOne(id);

    if (!conversation || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    await this.repo.deleteConversation(id, userId);

    return { success: true };
  }

  async renameConversation(userId: string, id: string, title: string) {
    const conversation = await this.repo.findOne(id);

    if (!conversation || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    return this.repo.renameConversation(id, userId, title);
  }
  async toggleListenMode(userId: string, id: string) {
    return this.toggleListenModeUseCase.execute(userId, id);
  }
}
