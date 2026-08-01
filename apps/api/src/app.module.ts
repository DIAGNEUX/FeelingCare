import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { EmotionModule } from './modules/emotion/emotion.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { GuestChatModule } from './modules/guest-chat/guest-chat.module';
@Module({
  imports: [
    PrismaModule,
    ConversationModule,
    EmotionModule,
    AuthModule,
    DashboardModule,
    GuestChatModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
