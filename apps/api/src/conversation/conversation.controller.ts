import { Body, Controller, Post , Get , Delete ,Patch , Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto , CreateMessageDto } from './dto/create-conversation.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Post()
  create(@Body() dto: CreateConversationDto) {
    return this.service.create(dto);
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



}
