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
export class GenerateReplyUseCase {
  constructor(private readonly openai: OpenAiService) {}

  async execute(
    messages: { role: 'user' | 'assistant'; content: string }[],
    emotionName?: string | null,
    memory?: string,
    strategy: string = 'NORMAL',
    effectiveMode: 'default' | 'listen_only' = 'default',
  ): Promise<string> {
    let systemPrompt = '';

    if (effectiveMode === 'listen_only') {
      systemPrompt = buildListenPrompt();
    } else {
      const basePrompt = buildSystemPrompt(emotionName, memory);
      const strategyPrompt = buildStrategyPrompt(strategy);

      systemPrompt = `${basePrompt}\n\n${strategyPrompt}`;
    }

    debugAi('[ai] reply options', {
      strategy,
      mode: effectiveMode,
      messageCount: messages.length,
    });

    const completion = await this.openai.chat(
      [{ role: 'system', content: systemPrompt }, ...messages],
      {
        max_tokens: 300,
        temperature: 0.7,
      },
    );

    return completion.choices[0].message.content ?? 'Je suis la avec toi.';
  }
}
