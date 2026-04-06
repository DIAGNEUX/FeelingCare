import { Injectable, Logger } from '@nestjs/common';
import { OpenAiService } from '../../infrastructure/openai.service';
import { buildTitlePrompt } from '../../prompts/title.prompt';

@Injectable()
export class GenerateTitleUseCase {
  private readonly logger = new Logger(GenerateTitleUseCase.name);

  constructor(private readonly openai: OpenAiService) {}

  async execute(messages: any[]): Promise<string> {
    const prompt = buildTitlePrompt(messages);

    try {
      const completion = await this.openai.chat([
        {
          role: 'system',
          content: prompt,
        },
      ]);

      return (
        completion.choices[0].message.content?.trim() ??
        'Nouvelle conversation'
      );
    } catch (error) {
      this.logger.error('OpenAI title generation failed', {
        error: error instanceof Error ? error.message : error,
      });

      return 'Nouvelle conversation';
    }
  }
}