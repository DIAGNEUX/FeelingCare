import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}