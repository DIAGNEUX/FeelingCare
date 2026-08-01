import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from '../conversation.service';
import {
  CreateConversationDto,
  CreateMessageDto,
} from '../dto/create-conversation.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/application/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/application/decorators/current-user.decorator';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateConversationDto) {
    return this.service.create(user.id, dto);
  }

  @Post(':id/messages/stream')
  async streamMessage(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    await this.service.streamMessage(user.id, id, dto, (chunk: string) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.service.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.findOne(user.id, id);
  }

  @Post(':id/messages')
  addMessage(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.service.addUserMessage(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }

  @Patch(':id/messages/:messageId')
  editMessage(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.service.editMessage(user.id, id, messageId, dto);
  }

  @Patch(':id/title')
  renameConversation(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('title') title: string,
  ) {
    return this.service.renameConversation(user.id, id, title);
  }

  @Patch(':id/listen-mode')
  toggleListenMode(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.toggleListenMode(user.id, id);
  }
}
