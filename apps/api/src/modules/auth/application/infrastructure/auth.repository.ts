import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });
  }

  async findByIdWithPassword(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        password: true,
      },
    });
  }

  async updateProfile(
    id: string,
    data: {
      firstName: string;
      lastName: string;
    },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });
  }

  async updatePassword(id: string, password: string) {
    return this.prisma.user.update({
      where: { id },
      data: { password },
      select: { id: true },
    });
  }

  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
  }

  async createSession(data: {
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
  }) {
    return this.prisma.session.create({
      data,
    });
  }

  async findSessionByRefreshTokenHash(refreshTokenHash: string) {
    return this.prisma.session.findFirst({
      where: {
        refreshTokenHash,
      },
    });
  }

  async deleteSession(sessionId: string) {
    return this.prisma.session.deleteMany({
      where: { id: sessionId },
    });
  }

  async deleteAllUserSessions(userId: string) {
    return this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  async findSessionsByUserId(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeSession(sessionId: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }
}
