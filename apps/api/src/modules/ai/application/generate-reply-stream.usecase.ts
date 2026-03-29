import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../infrastructure/openai.service';
import { buildSystemPrompt } from '../prompts/system.prompt';

@Injectable()
export class GenerateReplyStreamUseCase {
  constructor(private readonly openai: OpenAiService) {}

  async execute(
    messages: { role: 'user' | 'assistant'; content: string }[],
    emotionName?: string | null,
  ): Promise<AsyncIterable<string>> {
    const systemPrompt = buildSystemPrompt(emotionName);

   const stream = (await this.openai.chatStream(
    [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    {
      max_tokens: 300,
      temperature: 0.7,
    },
  )) as unknown as AsyncIterable<any>;

  return (async function* () {
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? '';
      if (text) yield text;
    }
  })();
  }
}