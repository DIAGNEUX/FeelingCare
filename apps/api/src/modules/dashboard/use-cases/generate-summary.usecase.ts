import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '../infrastructure/dashboard.repository';
import { MemoryRepository } from 'src/modules/ai/infrastructure/memory.repository';
import { OpenAiService } from 'src/modules/ai/infrastructure/openai.service';
import { buildSummaryPrompt } from '../../ai/prompts/summary.prompt';

@Injectable()
export class GenerateSummaryUseCase {
  constructor(
    // Repository pour récupérer les conversations récentes
    private readonly repo: DashboardRepository,

    // Repository pour récupérer la mémoire utilisateur (long terme)
    private readonly memoryRepo: MemoryRepository,

    // Service OpenAI pour générer le résumé
    private readonly openai: OpenAiService,
  ) {}

  /**
   * 🎯 UseCase principal
   * Génère un résumé émotionnel global pour le dashboard
   */
  async execute(userId: string): Promise<string> {
    // 1. Récupération parallèle :
    // - des dernières conversations
    // - de la mémoire utilisateur
    const [recentConversations, memory] = await Promise.all([
      this.repo.findRecentConversationsByUserId(userId, 3),
      this.memoryRepo.findByUserId(userId),
    ]);

    // 2. Cas edge : aucun historique
    if (recentConversations.length === 0) {
      return 'Bienvenue sur FeelingCare. Tu peux commencer une conversation quand tu le souhaites.';
    }

    // 3. Analyse des émotions (fréquence + dominante)
    const emotionAnalysis = this.analyzeEmotions(recentConversations);

    // 4. Extraction de signaux récents (phrases clés utilisateur)
    const recentSignals = this.extractRecentSignals(recentConversations);

    // 5. Extraction des thèmes principaux (travail, stress, etc.)
    const themes = this.extractThemes(recentConversations);

    // 6. Construction d’un input structuré pour l’IA
    const prompt = buildSummaryPrompt({
      emotions: emotionAnalysis.emotions,
      dominantEmotion: emotionAnalysis.dominant,
      themes,
      recentSignals,
      memory: memory?.content ?? null,
    });

    // 7. Appel OpenAI
    const completion = await this.openai.chat(
      [
        {
          role: 'system',
          content:
            'Tu es une IA bienveillante qui résume les émotions d’un utilisateur sans jugement.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      {
        max_tokens: 120,
        temperature: 0.6,
      },
    );

    // 8. Extraction sécurisée de la réponse
    const result = completion?.choices?.[0]?.message?.content?.trim();

    // 9. Fallback si l’IA ne répond pas correctement
    if (!result) {
      return 'Ces derniers jours, tu as pris le temps de t’exprimer ici.';
    }

    return result;
  }

  /**
   * 🧠 Analyse des émotions
   * Compte les occurrences et détermine l’émotion dominante
   */
  private analyzeEmotions(conversations: any[]) {
    const counts: Record<string, number> = {};

    conversations.forEach((conv) => {
      const name = conv.emotion?.name;

      if (name) {
        counts[name] = (counts[name] || 0) + 1;
      }
    });

    const emotions = Object.keys(counts);

    const dominant =
      emotions.length > 0
        ? emotions.reduce((a, b) => (counts[a] > counts[b] ? a : b))
        : 'neutre';

    return { emotions, dominant };
  }

  /**
   * 💬 Extraction des signaux récents
   * Récupère des extraits de messages utilisateur significatifs
   */
  private extractRecentSignals(conversations: any[]): string[] {
    const signals: string[] = [];

    conversations.slice(0, 2).forEach((conv) => {
      const userMessages = conv.messages
        .filter((m: any) => m.role === 'USER')
        .slice(-3);

      userMessages.forEach((msg: any) => {
        const content = msg.content.trim();

        // Filtre messages trop courts ou inutiles
        if (content.length > 20 && !content.toLowerCase().includes('bonjour')) {
          signals.push(`L'utilisateur évoque : ${content.slice(0, 120)}`);
        }
      });
    });

    // Limite le nombre de signaux envoyés à l’IA
    return signals.slice(0, 5);
  }

  /**
   * 🧩 Extraction des thèmes
   * Détecte des mots-clés récurrents dans les conversations
   */
  private extractThemes(conversations: any[]): string[] {
    const keywords = [
      'travail',
      'fatigue',
      'stress',
      'solitude',
      'famille',
      'amis',
      'sommeil',
      'pression',
      'confiance',
      'joie',
    ];

    const counts: Record<string, number> = {};

    conversations.forEach((conv) => {
      conv.messages.forEach((msg: any) => {
        const content = msg.content.toLowerCase();

        keywords.forEach((keyword) => {
          if (content.includes(keyword)) {
            counts[keyword] = (counts[keyword] || 0) + 1;
          }
        });
      });
    });

    // Trie par fréquence + limite à 3 thèmes
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k);
  }
}
