import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { CreateConversationDto, CreateMessageDto } from './dto/create-conversation.dto';
import { CreateConversationUseCase } from './use-cases/create-conversation.usecase';
import { AddUserMessageUseCase } from './use-cases/add-user-message.usecase';
import { StreamMessageUseCase } from './use-cases/stream-message.usecase';
import { EditMessageUseCase } from './use-cases/edit-message.usecase';
import { ConversationRepository } from './infrastructure/conversation.repository';

@Injectable()
export class ConversationService {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase,
    private readonly addUserMessageUseCase: AddUserMessageUseCase,
    private readonly streamMessageUseCase: StreamMessageUseCase,
    private readonly editMessageUseCase: EditMessageUseCase,
    private readonly repo: ConversationRepository,
  ) {}

  create(dto: CreateConversationDto) {
    return this.createConversationUseCase.execute(dto.emotionId);
  }

  addUserMessage(conversationId: string, dto: CreateMessageDto) {
    return this.addUserMessageUseCase.execute(
      conversationId,
      dto.content,
    );
  }

  streamMessage(
    conversationId: string,
    dto: CreateMessageDto,
    onChunk: (chunk: string) => void,
  ) {
    return this.streamMessageUseCase.execute(
      conversationId,
      dto.content,
      onChunk,
    );
  }

  editMessage(
    conversationId: string,
    messageId: string,
    dto: CreateMessageDto,
  ) {
    return this.editMessageUseCase.execute(
      conversationId,
      messageId,
      dto.content,
    );
  }

  async findOne(id: string) {
    return this.repo.findOne(id);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async remove(id: string) {
    const conversation = await this.repo.findOne(id);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    await this.repo.deleteConversation(id);

    return { success: true };
  }

  async renameConversation(id: string, title: string) {
    const conversation = await this.repo.findOne(id);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.repo.renameConversation(id, title);
  }
}