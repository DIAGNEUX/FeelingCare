import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MemoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.userMemory.findUnique({
      where: { userId },
    });
  }

  async create(userId: string, content: string) {
    return this.prisma.userMemory.create({
      data: {
        userId,
        content,
      },
    });
  }

  async update(userId: string, content: string) {
    return this.prisma.userMemory.update({
      where: { userId },
      data: {
        content,
      },
    });
  }
}
