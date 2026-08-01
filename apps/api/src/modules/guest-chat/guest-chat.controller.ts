import { Body, Controller, Post } from '@nestjs/common';
import { GuestChatService } from './guest-chat.service';
import type { GuestChatRequestDto } from './dto/guest-message.dto';

@Controller('guest-chat')
export class GuestChatController {
  constructor(private readonly guestChatService: GuestChatService) {}

  @Post('messages')
  reply(@Body() dto: GuestChatRequestDto) {
    return this.guestChatService.reply(dto);
  }
}
