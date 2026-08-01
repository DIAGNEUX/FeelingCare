import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardRepository } from './infrastructure/dashboard.repository';
import { GenerateSummaryUseCase } from './use-cases/generate-summary.usecase';
import { GenerateInsightsUseCase } from './use-cases/generate-insights.usecase';
import { GenerateActivityUseCase } from './use-cases/generate-activity.usecase';
import { GenerateMoodTrendUseCase } from './use-cases/generate-mood-trend.usecase';
import { GetDashboardUseCase } from './use-cases/get-dashboard.usecase';
import { PrismaModule } from 'prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { OpenAiService } from '../ai/infrastructure/openai.service';
import { JwtAuthGuard } from '../auth/application/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashboardRepository,
    GenerateSummaryUseCase,
    GenerateInsightsUseCase,
    GenerateActivityUseCase,
    GenerateMoodTrendUseCase,
    GetDashboardUseCase,
    JwtAuthGuard,
    JwtService,
    OpenAiService,
  ],
})
export class DashboardModule {}
