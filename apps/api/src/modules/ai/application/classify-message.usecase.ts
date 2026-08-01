import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../infrastructure/openai.service';
import { buildClassificationPrompt } from '../prompts/classify.prompt';

export type RiskLevel = 'low' | 'medium' | 'high';
export type Intent = 'venting' | 'seeking_help' | 'crisis';

export interface ClassificationResult {
  riskLevel: RiskLevel;
  intent: Intent;
  emotions: string[];
}

const VALID_RISK_LEVELS: RiskLevel[] = ['low', 'medium', 'high'];
const VALID_INTENTS: Intent[] = ['venting', 'seeking_help', 'crisis'];

@Injectable()
export class ClassifyMessageUseCase {
  constructor(private readonly openai: OpenAiService) {}

  async execute(message: string): Promise<ClassificationResult> {
    const prompt = buildClassificationPrompt(message);

    try {
      const completion = await this.openai.chat(
        [{ role: 'user', content: prompt }],
        { temperature: 0 },
      );

      const content = completion.choices[0].message.content ?? '{}';

      return this.safeParse(content, message);
    } catch {
      return this.fallback(message);
    }
  }

  private safeParse(
    content: string,
    originalMessage: string,
  ): ClassificationResult {
    try {
      const parsed = JSON.parse(content);
      const riskLevel = VALID_RISK_LEVELS.includes(parsed.riskLevel)
        ? parsed.riskLevel
        : this.fallback(originalMessage).riskLevel;
      const intent = VALID_INTENTS.includes(parsed.intent)
        ? parsed.intent
        : this.fallback(originalMessage).intent;

      return {
        riskLevel,
        intent,
        emotions: Array.isArray(parsed.emotions) ? parsed.emotions : [],
      };
    } catch {
      return this.fallback(originalMessage);
    }
  }

  private fallback(message: string): ClassificationResult {
    const normalized = message
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const crisisSignals = [
      'suicide',
      'me suicider',
      'me tuer',
      'me faire du mal',
      'envie de mourir',
      'je veux mourir',
      'je vais mourir',
      'je veux en finir',
      'mettre fin a mes jours',
      'plus envie de vivre',
      'je ne veux plus vivre',
      'passer a l acte',
    ];

    if (crisisSignals.some((signal) => normalized.includes(signal))) {
      return {
        riskLevel: 'high',
        intent: 'crisis',
        emotions: ['detresse'],
      };
    }

    const mediumSignals = [
      'angoisse',
      'panique',
      'deprime',
      'triste',
      'fatigue',
      'epuise',
      'marre',
      'je craque',
      'je n en peux plus',
    ];

    if (mediumSignals.some((signal) => normalized.includes(signal))) {
      return {
        riskLevel: 'medium',
        intent: 'venting',
        emotions: [],
      };
    }

    return {
      riskLevel: 'low',
      intent: 'venting',
      emotions: [],
    };
  }
}
