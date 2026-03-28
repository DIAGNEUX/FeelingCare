import { Controller, Get } from '@nestjs/common';
import { EmotionService } from './emotion.service';

@Controller('emotions')
export class EmotionController {
  constructor(private readonly service: EmotionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}