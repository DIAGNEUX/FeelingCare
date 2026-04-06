import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { EmotionModule } from './modules/emotion/emotion.module';

@Module({
  imports: [PrismaModule , ConversationModule , EmotionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
