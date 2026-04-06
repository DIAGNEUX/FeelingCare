import { Injectable, Logger } from '@nestjs/common';
import { OpenAiService } from '../../infrastructure/openai.service';
import { buildSystemPrompt } from '../../prompts/system.prompt';
import { withTimeout } from '../../utils/timeout.util';

const TIMEOUT_MS = 10000;

@Injectable()
export class GenerateReplyStreamUseCase {
  private readonly logger = new Logger(GenerateReplyStreamUseCase.name);

  constructor(private readonly openai: OpenAiService) {}

  async execute(
    messages: { role: 'user' | 'assistant'; content: string }[],
    emotionName?: string | null,
  ): Promise<AsyncIterable<string>> {
    const systemPrompt = buildSystemPrompt(emotionName);

    const start = Date.now();

    //  LOG START
    this.logger.log('AI_STREAM_STARTED', {
      emotionName,
      messageCount: messages.length,
    });

    try {
      //  timeout sur création stream
      const stream = (await withTimeout(
        this.openai.chatStream(
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
      )) as unknown as AsyncIterable<any>;

      const logger = this.logger;

      return (async function* () {
        let totalLength = 0;

        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? '';

            if (text) {
              totalLength += text.length;
              yield text;
            }
          }

          // FIN OK
          const duration = Date.now() - start;

          logger.log('AI_STREAM_SUCCESS', {
            duration,
            totalLength,

          });

        } catch (streamError) {
          const duration = Date.now() - start;

          logger.error('AI_STREAM_RUNTIME_ERROR', {
            duration,
            error:
              streamError instanceof Error
                ? streamError.message
                : streamError,
          });

          yield "Je rencontre une difficulté technique en ce moment...";
        }
      })();

    } catch (error) {
      const duration = Date.now() - start;

      const isTimeout =
        error instanceof Error && error.message === 'TIMEOUT';

      this.logger.error(
        isTimeout ? 'AI_STREAM_TIMEOUT' : 'AI_STREAM_FAILED',
        {
          emotionName,
          duration,
          error: error instanceof Error ? error.message : error,
        },
      );

      // fallback stream
      return (async function* () {
        yield isTimeout
          ? "Je mets un peu de temps à répondre... mais je suis là."
          : "Je rencontre une difficulté technique en ce moment...";
      })();
    }
  }
}