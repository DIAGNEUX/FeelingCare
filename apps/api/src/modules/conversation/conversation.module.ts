import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './controller/conversation.controller';
import { ConversationRepository } from './infrastructure/conversation.repository';
import { CreateConversationUseCase } from './application/use-cases/create-conversation.usecase';
import { AddUserMessageUseCase } from './application/use-cases/add-user-message.usecase';
import { StreamMessageUseCase } from './application/use-cases/stream-message.usecase';
import { EditMessageUseCase } from './application/use-cases/edit-message.usecase';
import { PrismaModule } from 'prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule,AiModule], 
  controllers: [ConversationController],
  providers: [
    ConversationService,
    ConversationRepository,
    CreateConversationUseCase,
    AddUserMessageUseCase,
    StreamMessageUseCase,
    EditMessageUseCase,
  ],
})
export class ConversationModule {}