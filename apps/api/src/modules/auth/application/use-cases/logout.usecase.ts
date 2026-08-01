import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../infrastructure/auth.repository';
import { HashService } from '../services/hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LogoutUseCase {
  constructor(
    private readonly repo: AuthRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    let payload: any;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userId = payload.sub;
    // 1. Récupérer toutes les sessions
    const sessions = await this.repo.findSessionsByUserId(userId);

    // 2. Trouver la bonne session
    let currentSession: any = null;

    for (const session of sessions) {
      const isMatch = await this.hashService.compare(
        refreshToken,
        session.refreshTokenHash,
      );

      if (isMatch) {
        currentSession = session;
        break;
      }
    }

    if (!currentSession) {
      throw new UnauthorizedException('Session not found');
    }

    // 3. Supprimer session
    await this.repo.deleteSession(currentSession.id);

    return { success: true };
  }
}
