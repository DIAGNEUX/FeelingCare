import { Injectable, Logger } from '@nestjs/common';
import { OpenAiService } from '../../infrastructure/openai.service';
import { buildSystemPrompt } from '../../prompts/system.prompt';
import { withTimeout } from '../../utils/timeout.util';

const TIMEOUT_MS = 10000;

@Injectable()
export class GenerateReplyUseCase {
  private readonly logger = new Logger(GenerateReplyUseCase.name);

  constructor(private readonly openai: OpenAiService) {}

  async execute(
    messages: { role: 'user' | 'assistant'; content: string }[],
    emotionName?: string | null,
  ): Promise<string> {
    const systemPrompt = buildSystemPrompt(emotionName);

    const start = Date.now();

    // 🔥 LOG START
    this.logger.log('AI_REQUEST_STARTED', {
      emotionName,
      messageCount: messages.length,
    });

    try {
      const completion = await withTimeout(
        this.openai.chat(
          [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          {
            max_tokens: 300,
            temperature: 0.7,
          },
        ),
        TIMEOUT_MS,
      );

      const duration = Date.now() - start;

      const aiReply =
        completion.choices[0].message.content ?? 'Je suis là...';

      // ✅ LOG SUCCESS
      this.logger.log('AI_REQUEST_SUCCESS', {
        duration,
        responseLength: aiReply.length,
      });

      return aiReply;

    } catch (error) {
      const duration = Date.now() - start;

      const isTimeout =
        error instanceof Error && error.message === 'TIMEOUT';

      // ❌ LOG ERROR
      this.logger.error(
        isTimeout ? 'AI_REQUEST_TIMEOUT' : 'AI_REQUEST_FAILED',
        {
          emotionName,
          duration,
          error: error instanceof Error ? error.message : error,
        },
      );

      return isTimeout
        ? "Je mets un peu de temps à répondre... mais je suis là."
        : "Je rencontre une difficulté technique en ce moment...";
    }
  }
}