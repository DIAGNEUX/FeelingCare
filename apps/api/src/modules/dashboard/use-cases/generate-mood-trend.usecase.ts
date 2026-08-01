import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '../infrastructure/dashboard.repository';

type MoodTrendDay = {
  date: string;
  day: string;
  emotion: string | null;
  score: number | null;
  hasData: boolean;
  conversationCount: number;
};

@Injectable()
export class GenerateMoodTrendUseCase {
  constructor(private readonly repo: DashboardRepository) {}

  async execute(userId: string) {
    const conversations =
      await this.repo.findRecentConversationsWithEmotion(userId);

    const daysMap: Record<
      string,
      { emotions: string[]; conversationCount: number }
    > = {};

    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      daysMap[this.getDateKey(date)] = {
        emotions: [],
        conversationCount: 0,
      };
    }

    conversations.forEach((conversation) => {
      const key = this.getDateKey(new Date(conversation.createdAt));
      const day = daysMap[key];

      if (!day) return;

      day.conversationCount += 1;

      if (conversation.emotion?.name) {
        day.emotions.push(conversation.emotion.name);
      }
    });

    const trend: MoodTrendDay[] = Object.entries(daysMap)
      .map(([date, data]) => {
        if (data.emotions.length === 0) {
          return {
            date,
            day: this.getDayLabel(date),
            emotion: null,
            score: null,
            hasData: false,
            conversationCount: data.conversationCount,
          };
        }

        const dominant = this.getDominantEmotion(data.emotions);

        return {
          date,
          day: this.getDayLabel(date),
          emotion: dominant,
          score: this.scoreForEmotion(dominant),
          hasData: true,
          conversationCount: data.conversationCount,
        };
      })
      .reverse();

    const allEmotions = Object.values(daysMap).flatMap((data) => data.emotions);
    const dominantEmotion =
      allEmotions.length > 0 ? this.getDominantEmotion(allEmotions) : null;

    return {
      trend,
      dominantEmotion,
      progression: this.calculateProgression(trend),
    };
  }

  private getDateKey(date: Date) {
    return date.toISOString().split('T')[0];
  }

  private getDayLabel(dateStr: string) {
    const date = new Date(dateStr);

    return ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][date.getUTCDay()];
  }

  private getDominantEmotion(emotions: string[]) {
    const counts: Record<string, number> = {};

    emotions.forEach((emotion) => {
      counts[emotion] = (counts[emotion] || 0) + 1;
    });

    return emotions.reduce((dominant, emotion) =>
      counts[emotion] > counts[dominant] ? emotion : dominant,
    );
  }

  private scoreForEmotion(emotion: string) {
    const normalized = this.normalizeEmotionName(emotion);

    if (normalized.includes('colere')) return 30;
    if (normalized.includes('triste')) return 35;
    if (normalized.includes('stress')) return 40;
    if (normalized.includes('confus')) return 45;
    if (normalized.includes('fatigue')) return 50;
    if (normalized.includes('neutre')) return 60;
    if (normalized.includes('calme')) return 80;
    if (normalized.includes('joyeux')) return 90;

    return 60;
  }

  private normalizeEmotionName(emotion: string) {
    return emotion
      .toLocaleLowerCase('fr-FR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  private calculateProgression(trend: MoodTrendDay[]) {
    const dataPoints = trend.filter(
      (item): item is MoodTrendDay & { score: number } =>
        item.hasData && typeof item.score === 'number',
    );

    if (dataPoints.length < 2) return null;

    const first = dataPoints[0];
    const last = dataPoints[dataPoints.length - 1];

    return Math.round(last.score - first.score);
  }
}
