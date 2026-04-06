import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../infrastructure/openai.service';
import { buildTitlePrompt } from '../prompts/title.prompt';

@Injectable()
export class GenerateTitleUseCase {
  constructor(private readonly openai: OpenAiService) {}

  async execute(messages: any[]): Promise<string> {
    const prompt = buildTitlePrompt(messages);

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
  }
}