export class GetDashboardResponseDto {
  summary!: string;

  activity!: ActivityDto;

  moodTrend!: MoodTrendDto;

  insights!: InsightDto[];
}

export class ActivityDto {
  sessionsThisWeek!: number;
  totalMinutes!: number;
  deepConversations!: number;
  lastActiveDaysAgo!: number | null;
}

export class InsightDto {
  category!: string;
  label!: string;
  detail!: string;
}

export class MoodTrendDto {
  trend!: {
    date: string;
    day: string;
    emotion: string | null;
    score: number | null;
    hasData: boolean;
    conversationCount: number;
  }[];

  dominantEmotion!: string | null;

  progression!: number | null;
}
