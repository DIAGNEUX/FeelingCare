import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { GuestChatController } from './guest-chat.controller';
import { GuestChatService } from './guest-chat.service';

@Module({
  imports: [AiModule],
  controllers: [GuestChatController],
  providers: [GuestChatService],
})
export class GuestChatModule {}
