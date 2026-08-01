import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/application/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/application/decorators/current-user.decorator';
import { GetDashboardUseCase } from '../use-cases/get-dashboard.usecase';
import { GenerateSummaryUseCase } from '../use-cases/generate-summary.usecase';
import { GenerateActivityUseCase } from '../use-cases/generate-activity.usecase';
import { GenerateMoodTrendUseCase } from '../use-cases/generate-mood-trend.usecase';
import { GenerateInsightsUseCase } from '../use-cases/generate-insights.usecase';
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly usecase: GetDashboardUseCase,
    private readonly summaryUseCase: GenerateSummaryUseCase,
    private readonly activityUseCase: GenerateActivityUseCase,
    private readonly insightsUseCase: GenerateInsightsUseCase,
    private readonly moodTrendUseCase: GenerateMoodTrendUseCase,
  ) {}

  @Get()
  async getDashboard(@CurrentUser() user: any) {
    return this.usecase.execute(user.id);
  }

  @Get('test-summary')
  async testSummary(@CurrentUser() user: any) {
    return this.summaryUseCase.execute(user.id);
  }

  @Get('activity')
  getActivity(@CurrentUser() user: any) {
    return this.activityUseCase.execute(user.id);
  }

  @Get('mood-trend')
  getMoodTrend(@CurrentUser() user: any) {
    return this.moodTrendUseCase.execute(user.id);
  }

  @Get('insights')
  getInsights(@CurrentUser() user: any) {
    return this.insightsUseCase.execute(user.id);
  }
}
