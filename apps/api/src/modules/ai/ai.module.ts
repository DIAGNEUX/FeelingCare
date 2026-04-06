import { Module } from '@nestjs/common';
import { OpenAiService } from './infrastructure/openai.service';
import { GenerateReplyUseCase } from './application/use-cases/generate-reply.usecase';
import { GenerateReplyStreamUseCase } from './application/use-cases/generate-reply-stream.usecase';
import { GenerateTitleUseCase } from './application/use-cases/generate-title.usecase';

@Module({
  providers: [
    OpenAiService,
    GenerateReplyUseCase,
    GenerateReplyStreamUseCase,
    GenerateTitleUseCase,
  ],
  exports: [
    GenerateReplyUseCase,
    GenerateReplyStreamUseCase,
    GenerateTitleUseCase,
  ],
})
export class AiModule {}