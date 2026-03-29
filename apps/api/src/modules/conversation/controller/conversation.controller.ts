import { Body, Controller, Post , Get , Delete ,Patch , Param , Res } from '@nestjs/common';
import { ConversationService } from '../conversation.service';
import { CreateConversationDto , CreateMessageDto } from '../dto/create-conversation.dto';
import type { Response } from 'express';
@Controller('conversations')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Post()
  create(@Body() dto: CreateConversationDto) {
    return this.service.create(dto);
  }

  @Post(':id/messages/stream')
  async streamMessage(
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
    @Res() res: Response,
  ) {
    // 1. Headers SSE — on dit au frontend que c'est un flux
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // 2. Appeler le service qui gère le streaming
    await this.service.streamMessage(id, dto, (chunk: string) => {
      // Chaque mot reçu d'OpenAI est envoyé au frontend
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    // 3. Signaler la fin du flux
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Patch(':id/messages/:messageId')
  editMessage(
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.service.editMessage(id, messageId, dto);
  }

  @Patch(':id/title')
  renameConversation(
    @Param('id') id: string,
    @Body('title') title: string,
  ) {
    return this.service.renameConversation(id, title);
  }


}
