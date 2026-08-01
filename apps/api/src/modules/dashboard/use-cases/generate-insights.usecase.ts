import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '../infrastructure/dashboard.repository';
import { MemoryRepository } from 'src/modules/ai/infrastructure/memory.repository';
import { OpenAiService } from 'src/modules/ai/infrastructure/openai.service';
import { buildInsightsPrompt } from '../../ai/prompts/insights.prompt';

@Injectable()
export class GenerateInsightsUseCase {
  constructor(
    private readonly repo: DashboardRepository,
    private readonly memoryRepo: MemoryRepository,
    private readonly openai: OpenAiService,
  ) {}

  async execute(userId: string) {
    // 🟣 1. Récupération des données utilisateur
    // → 3 dernières conversations + mémoire persistante
    const [conversations, memory] = await Promise.all([
      this.repo.findRecentConversationsByUserId(userId, 3),
      this.memoryRepo.findByUserId(userId),
    ]);

    // Aucun historique → pas d'insights
    if (conversations.length === 0) return [];

    //  2. Analyse des émotions globales
    // → liste des émotions + émotion dominante
    const emotionAnalysis = this.analyzeEmotions(conversations);

    //  3. Extraction des thèmes récurrents
    // → mots-clés présents dans les messages
    const themes = this.extractThemes(conversations);

    //  4. Extraction des signaux récents
    // → extraits des derniers messages utilisateur
    const recentSignals = this.extractRecentSignals(conversations);

    //  5. Construction du prompt pour l'IA
    // → input structuré (pas de texte brut)
    const prompt = buildInsightsPrompt({
      emotions: emotionAnalysis.emotions,
      dominantEmotion: emotionAnalysis.dominant,
      themes,
      recentSignals,
      memory: memory?.content ?? null,
    });

    //  6. Appel à l'IA
    // → génération des insights au format JSON
    const completion = await this.openai.chat(
      [
        { role: 'system', content: 'Tu réponds uniquement en JSON valide.' },
        { role: 'user', content: prompt },
      ],
      {
        temperature: 0.4,
        max_tokens: 200,
      },
    );

    const raw = completion?.choices?.[0]?.message?.content;

    //  7. Parsing sécurisé du JSON
    // → fallback si erreur IA
    try {
      const allowedCategories = [
        'stress',
        'fatigue',
        'calm',
        'lifestyle',
        'emotion',
      ];
      const parsed = JSON.parse(raw || '[]');

      //  Limite à 3 insights max
      return parsed
        .filter((i: any) => allowedCategories.includes(i.category))
        .slice(0, 3);
    } catch {
      console.error('Insights JSON parse error');
      return [];
    }
  }

  // -------------------------
  // 🧠 Analyse des émotions
  // -------------------------
  private analyzeEmotions(conversations: any[]) {
    const counts: Record<string, number> = {};

    conversations.forEach((conv) => {
      const name = conv.emotion?.name;
      if (name) counts[name] = (counts[name] || 0) + 1;
    });

    const emotions = Object.keys(counts);

    const dominant =
      emotions.length > 0
        ? emotions.reduce((a, b) => (counts[a] > counts[b] ? a : b))
        : 'neutre';

    return { emotions, dominant };
  }

  // -------------------------
  // 🧠 Extraction des thèmes
  // -------------------------
  private extractThemes(conversations: any[]) {
    const keywords = [
      'travail',
      'fatigue',
      'stress',
      'solitude',
      'pression',
      'repos',
    ];

    const counts: Record<string, number> = {};

    conversations.forEach((conv) => {
      conv.messages.forEach((msg: any) => {
        const content = msg.content.toLowerCase();

        keywords.forEach((k) => {
          if (content.includes(k)) {
            counts[k] = (counts[k] || 0) + 1;
          }
        });
      });
    });

    return Object.keys(counts);
  }

  // -------------------------
  //  Extraction des signaux récents
  // -------------------------
  private extractRecentSignals(conversations: any[]) {
    const signals: string[] = [];

    conversations.slice(0, 2).forEach((conv) => {
      conv.messages
        .filter((m: any) => m.role === 'USER')
        .slice(-3)
        .forEach((msg: any) => {
          if (msg.content.length > 20) {
            signals.push(msg.content.slice(0, 120));
          }
        });
    });

    return signals.slice(0, 5);
  }
}
