import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(userId: string): string {
    const expiresIn = this.getAccessTokenExpiresInSeconds();

    return this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn,
      },
    );
  }

  generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId, jti: randomUUID() },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );
  }

  getRefreshTokenExpiration(): Date {
    const now = new Date();
    now.setDate(now.getDate() + 7);
    return now;
  }

  private getAccessTokenExpiresInSeconds() {
    const value = Number(process.env.JWT_ACCESS_EXPIRES_SECONDS);

    if (Number.isFinite(value) && value > 0) {
      return value;
    }

    return 15 * 60;
  }
}
