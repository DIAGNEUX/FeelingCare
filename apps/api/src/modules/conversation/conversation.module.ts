import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './controller/conversation.controller';
import { ConversationRepository } from './infrastructure/conversation.repository';
import { CreateConversationUseCase } from './use-cases/create-conversation.usecase';
import { AddUserMessageUseCase } from './use-cases/add-user-message.usecase';
import { StreamMessageUseCase } from './use-cases/stream-message.usecase';
import { EditMessageUseCase } from './use-cases/edit-message.usecase';
import { PrismaModule } from 'prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { GenerateMemoryUseCase } from '../ai/application/generate-memory.usecase';
import { GuardrailUseCase } from '../ai/application/guardrail.usecase';
import { ClassifyMessageUseCase } from '../ai/application/classify-message.usecase';
import { OpenAiService } from '../ai/infrastructure/openai.service';
import { ToggleListenModeUseCase } from './use-cases/toggle-listen-mode.usecase';
import { JwtAuthGuard } from '../auth/application/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    ConversationRepository,
    CreateConversationUseCase,
    AddUserMessageUseCase,
    StreamMessageUseCase,
    EditMessageUseCase,
    GuardrailUseCase,
    ClassifyMessageUseCase,
    OpenAiService,
    ToggleListenModeUseCase,
    GenerateMemoryUseCase,
    JwtAuthGuard,
    JwtService,
  ],
})
export class ConversationModule {}
