import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../infrastructure/openai.service';
import { buildMemoryPrompt } from '../prompts/memory.prompt';

@Injectable()
export class GenerateMemoryUseCase {
  constructor(private readonly openai: OpenAiService) {}

  async execute(params: {
    currentMemory: string | null;
    messages: { role: 'user' | 'assistant'; content: string }[];
  }): Promise<string> {
    const { currentMemory, messages } = params;

    const recentMessages = messages.slice(-5);
    const prompt = buildMemoryPrompt(currentMemory, recentMessages);

    const completion = await this.openai.chat(
      [
        {
          role: 'system',
          content: prompt,
        },
      ],
      {
        max_tokens: 100,
        temperature: 0.3, // plus stable = mieux pour mémoire
      },
    );
    const content = completion.choices[0].message.content?.trim();
    if (!content) {
      return currentMemory ?? '';
    }

    return content;
  }
}
