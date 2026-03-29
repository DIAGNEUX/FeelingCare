import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../infrastructure/openai.service';
import { buildSystemPrompt } from '../prompts/system.prompt';

@Injectable()
export class GenerateReplyUseCase {
  constructor(private readonly openai: OpenAiService) {}

  async execute(
    messages: { role: 'user' | 'assistant'; content: string }[],
    emotionName?: string | null,
  ): Promise<string> {
    const systemPrompt = buildSystemPrompt(emotionName);

    const completion = await this.openai.chat(
      [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      {
        max_tokens: 300,
        temperature: 0.7,
      },
    );

    return completion.choices[0].message.content ?? 'Je suis là...';
  }
}