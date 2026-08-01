import { Injectable } from '@nestjs/common';
import { GenerateSummaryUseCase } from './use-cases/generate-summary.usecase';
import { GenerateInsightsUseCase } from './use-cases/generate-insights.usecase';
import { GenerateActivityUseCase } from './use-cases/generate-activity.usecase';
import { GenerateMoodTrendUseCase } from './use-cases/generate-mood-trend.usecase';

@Injectable()
export class DashboardService {
  constructor(
    private readonly generateSummary: GenerateSummaryUseCase,
    private readonly generateInsights: GenerateInsightsUseCase,
    private readonly generateActivity: GenerateActivityUseCase,
    private readonly generateMoodTrend: GenerateMoodTrendUseCase,
  ) {}

  async getDashboard(userId: string) {
    const [summary, insights, activity, moodTrend] = await Promise.all([
      this.generateSummary.execute(userId),
      this.generateInsights.execute(userId),
      this.generateActivity.execute(userId),
      this.generateMoodTrend.execute(userId),
    ]);

    return {
      summary,
      insights,
      activity,
      moodTrend,
    };
  }
}
