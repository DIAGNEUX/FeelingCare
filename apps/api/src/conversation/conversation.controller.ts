import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ConversationService } from './conversation.service';
import {
  CreateConversationDto,
  CreateMessageDto,
} from './dto/create-conversation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';

type UserWithoutPassword = Omit<User, 'password'>;

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Post()
  create(@Body() dto: CreateConversationDto, @Req() req: Request) {
    const user = req.user as UserWithoutPassword;
    return this.service.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/messages')
  addMessage(@Param('id') id: string, @Body() dto: CreateMessageDto) {
    return this.service.addUserMessage(id, dto);
  }
}
