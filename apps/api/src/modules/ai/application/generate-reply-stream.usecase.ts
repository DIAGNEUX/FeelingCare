import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../infrastructure/openai.service';
import { buildSystemPrompt } from '../prompts/system.prompt';
import { buildStrategyPrompt } from '../prompts/strategy.prompt';
import { buildListenPrompt } from '../prompts/listenmode.prompt';

function debugAi(message: string, meta?: Record<string, unknown>) {
  if (process.env.AI_DEBUG === 'true') {
    console.log(message, meta ?? {});
  }
}

@Injectable()
export class GenerateReplyStreamUseCase {
  constructor(private readonly openai: OpenAiService) {}

  async execute(
    messages: { role: 'user' | 'assistant'; content: string }[],
    emotionName?: string | null,
    memory?: string,
    strategy: string = 'NORMAL',
    effectiveMode: 'default' | 'listen_only' = 'default',
  ): Promise<AsyncIterable<string>> {
    let systemPrompt = '';

    if (effectiveMode === 'listen_only') {
      systemPrompt = buildListenPrompt();
    } else {
      const basePrompt = buildSystemPrompt(emotionName, memory);
      const strategyPrompt = buildStrategyPrompt(strategy);

      systemPrompt = `${basePrompt}\n\n${strategyPrompt}`;
    }

    debugAi('[ai] reply stream options', {
      strategy,
      mode: effectiveMode,
      messageCount: messages.length,
    });

    const stream = (await this.openai.chatStream(
      [{ role: 'system', content: systemPrompt }, ...messages],
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
