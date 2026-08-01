import { Module } from '@nestjs/common';
import { OpenAiService } from './infrastructure/openai.service';
import { GenerateReplyUseCase } from './application/generate-reply.usecase';
import { GenerateReplyStreamUseCase } from './application/generate-reply-stream.usecase';
import { GenerateTitleUseCase } from './application/generate-title.usecase';
import { MemoryRepository } from './infrastructure/memory.repository';
import { PrismaModule } from 'prisma/prisma.module';
import { GenerateMemoryUseCase } from './application/generate-memory.usecase';
import { GuardrailUseCase } from './application/guardrail.usecase';
import { ClassifyMessageUseCase } from './application/classify-message.usecase';

@Module({
  imports: [PrismaModule],
  providers: [
    OpenAiService,
    GenerateReplyUseCase,
    GenerateReplyStreamUseCase,
    GenerateTitleUseCase,
    GenerateMemoryUseCase,
    GuardrailUseCase,
    ClassifyMessageUseCase,
    MemoryRepository,
  ],
  exports: [
    GenerateReplyUseCase,
    GenerateReplyStreamUseCase,
    GenerateTitleUseCase,
    GenerateMemoryUseCase,
    GuardrailUseCase,
    ClassifyMessageUseCase,
    MemoryRepository,
  ],
})
export class AiModule {}
