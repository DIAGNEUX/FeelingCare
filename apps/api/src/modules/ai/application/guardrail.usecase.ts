import { Injectable } from '@nestjs/common';
import {
  ClassifyMessageUseCase,
  type ClassificationResult,
} from './classify-message.usecase';

export type Strategy =
  | 'NORMAL'
  | 'EMPATHY_DEEP'
  | 'SAFE_SUPPORT'
  | 'CRISIS_SUPPORT';

function debugAi(message: string, meta?: Record<string, unknown>) {
  if (process.env.AI_DEBUG === 'true') {
    console.log(message, meta ?? {});
  }
}

@Injectable()
export class GuardrailUseCase {
  constructor(private readonly classifyMessage: ClassifyMessageUseCase) {}

  async execute(message: string): Promise<{
    strategy: Strategy;
    classification: ClassificationResult;
  }> {
    let classification: ClassificationResult;

    try {
      classification = await this.classifyMessage.execute(message);
    } catch {
      classification = this.fallbackClassification(message);
    }

    const strategy = this.getStrategy(
      classification.riskLevel,
      classification.intent,
    );

    debugAi('[guardrail] strategy selected', {
      strategy,
      riskLevel: classification.riskLevel,
      intent: classification.intent,
    });

    return {
      strategy,
      classification,
    };
  }

  private fallbackClassification(message: string): ClassificationResult {
    const normalized = message
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (
      [
        'suicide',
        'me suicider',
        'me tuer',
        'me faire du mal',
        'envie de mourir',
        'je veux mourir',
        'je veux en finir',
        'mettre fin a mes jours',
        'plus envie de vivre',
      ].some((signal) => normalized.includes(signal))
    ) {
      return { riskLevel: 'high', intent: 'crisis', emotions: ['detresse'] };
    }

    if (
      [
        'triste',
        'fatigue',
        'epuise',
        'marre',
        'angoisse',
        'panique',
        'je craque',
        'je n en peux plus',
      ].some((signal) => normalized.includes(signal))
    ) {
      return { riskLevel: 'medium', intent: 'venting', emotions: [] };
    }

    return { riskLevel: 'low', intent: 'venting', emotions: [] };
  }

  private getStrategy(risk: string, intent: string): Strategy {
    if (risk === 'low') {
      if (intent === 'crisis') return 'SAFE_SUPPORT';
      return 'NORMAL';
    }

    if (risk === 'medium') {
      if (intent === 'crisis') return 'SAFE_SUPPORT';
      return 'EMPATHY_DEEP';
    }

    if (risk === 'high') {
      if (intent === 'crisis') return 'CRISIS_SUPPORT';
      return 'SAFE_SUPPORT';
    }

    return 'NORMAL';
  }
}
