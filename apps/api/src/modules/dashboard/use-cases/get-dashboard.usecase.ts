import { Injectable } from '@nestjs/common';
import { GenerateSummaryUseCase } from './generate-summary.usecase';
import { GenerateActivityUseCase } from './generate-activity.usecase';
import { GenerateMoodTrendUseCase } from './generate-mood-trend.usecase';
import { GenerateInsightsUseCase } from './generate-insights.usecase';

@Injectable()
export class GetDashboardUseCase {
  constructor(
    private readonly summaryUseCase: GenerateSummaryUseCase,
    private readonly activityUseCase: GenerateActivityUseCase,
    private readonly moodTrendUseCase: GenerateMoodTrendUseCase,
    private readonly insightsUseCase: GenerateInsightsUseCase,
  ) {}

  async execute(userId: string) {
    const [summary, activity, moodTrend, insights] = await Promise.all([
      this.summaryUseCase.execute(userId),
      this.activityUseCase.execute(userId),
      this.moodTrendUseCase.execute(userId),
      this.insightsUseCase.execute(userId),
    ]);

    return {
      summary,
      activity,
      moodTrend,
      insights,
    };
  }
}
