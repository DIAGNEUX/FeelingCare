import { Module } from '@nestjs/common';
import { OpenAiService } from './infrastructure/openai.service';
import { GenerateReplyUseCase } from './application/generate-reply.usecase';
import { GenerateReplyStreamUseCase } from './application/generate-reply-stream.usecase';
import { GenerateTitleUseCase } from './application/generate-title.usecase';

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