import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../infrastructure/auth.repository';
import { HashService } from '../services/hash.service';
import { TokenService } from '../services/token.service';
import { JwtService } from '@nestjs/jwt';
import { Session } from '@prisma/client';

type JwtPayload = {
  sub: string;
};

function maskUserId(userId: string) {
  if (userId.length <= 8) return userId;

  return `${userId.slice(0, 4)}...${userId.slice(-4)}`;
}

function debugAuth(message: string, meta?: Record<string, unknown>) {
  if (process.env.AUTH_DEBUG === 'true') {
    console.log(message, meta ?? {});
  }
}

@Injectable()
export class RefreshUseCase {
  constructor(
    private readonly repo: AuthRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(refreshToken: string) {
    if (!refreshToken) {
      console.warn('[auth:refresh] rejected: no refresh token cookie');
      throw new UnauthorizedException('No refresh token');
    }

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      console.warn('[auth:refresh] rejected: invalid refresh JWT');
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!payload.sub) {
      console.warn('[auth:refresh] rejected: missing sub in refresh JWT');
      throw new UnauthorizedException('Invalid token payload');
    }

    const userId = payload.sub;

    debugAuth('[auth:refresh] refresh JWT verified', {
      userId: maskUserId(userId),
    });

    const sessions = await this.repo.findSessionsByUserId(userId);

    debugAuth('[auth:refresh] sessions loaded', {
      userId: maskUserId(userId),
      count: sessions.length,
    });

    if (!sessions.length) {
      console.warn('[auth:refresh] rejected: no sessions for user', {
        userId: maskUserId(userId),
      });
      throw new UnauthorizedException('Session not found');
    }

    let currentSession: Session | null = null;
    let revokedMatch: Session | null = null;
    let expiredMatch: Session | null = null;
    const now = new Date();

    for (const [index, session] of sessions.entries()) {
      const isMatch = await this.hashService.compare(
        refreshToken,
        session.refreshTokenHash,
      );

      debugAuth('[auth:refresh] session hash checked', {
        index,
        sessionId: maskUserId(session.id),
        isMatch,
        revoked: Boolean(session.revokedAt),
        expiresAt: session.expiresAt.toISOString(),
      });

      if (isMatch) {
        if (session.revokedAt) {
          revokedMatch = session;
          continue;
        }

        if (session.expiresAt <= now) {
          expiredMatch = session;
          continue;
        }

        currentSession = session;
        break;
      }
    }

    if (!currentSession) {
      if (revokedMatch) {
        console.warn('[auth:refresh] rejected: session revoked', {
          sessionId: maskUserId(revokedMatch.id),
          revokedAt: revokedMatch.revokedAt?.toISOString(),
        });
        throw new UnauthorizedException('Session revoked');
      }

      if (expiredMatch) {
        console.warn('[auth:refresh] rejected: session expired', {
          sessionId: maskUserId(expiredMatch.id),
          expiresAt: expiredMatch.expiresAt.toISOString(),
        });
        throw new UnauthorizedException('Session expired');
      }

      console.warn('[auth:refresh] rejected: no matching session hash', {
        userId: maskUserId(userId),
        checkedSessions: sessions.length,
      });
      throw new UnauthorizedException('Invalid session');
    }

    // Generate new refresh token and session
    const newRefreshToken = this.tokenService.generateRefreshToken(userId);
    const newRefreshTokenHash = await this.hashService.hash(newRefreshToken);
    const newExpiresAt = this.tokenService.getRefreshTokenExpiration();

    await this.repo.createSession({
      userId,
      refreshTokenHash: newRefreshTokenHash,
      expiresAt: newExpiresAt,
    });

    // Revoke old session
    await this.repo.revokeSession(currentSession.id);

    debugAuth('[auth:refresh] accepted: session renewed', {
      userId: maskUserId(userId),
      oldSessionId: maskUserId(currentSession.id),
      oldExpiresAt: currentSession.expiresAt.toISOString(),
      newExpiresAt: newExpiresAt.toISOString(),
    });

    // Generate new access token
    const newAccessToken = this.tokenService.generateAccessToken(userId);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
