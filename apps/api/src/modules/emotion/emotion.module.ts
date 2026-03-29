import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { EmotionController } from './emotion.controller';
import { EmotionService } from './emotion.service';

@Module({
  imports: [PrismaModule],
  controllers: [EmotionController],
  providers: [EmotionService],
})
export class EmotionModule {}