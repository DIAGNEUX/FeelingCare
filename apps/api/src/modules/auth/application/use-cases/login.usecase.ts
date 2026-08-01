import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../infrastructure/auth.repository';
import { HashService } from '../services/hash.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly repo: AuthRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(email: string, password: string) {
    // 1. Normaliser email
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Trouver user
    const user = await this.repo.findByEmail(normalizedEmail);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Vérifier password
    const isValid = await this.hashService.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Générer tokens
    const accessToken = this.tokenService.generateAccessToken(user.id);
    const refreshToken = this.tokenService.generateRefreshToken(user.id);

    // 5. Hasher refresh token
    const refreshTokenHash = await this.hashService.hash(refreshToken);

    // 6. Créer session
    await this.repo.createSession({
      userId: user.id,
      refreshTokenHash,
      expiresAt: this.tokenService.getRefreshTokenExpiration(),
    });

    // 7. Retourner
    return {
      accessToken,
      refreshToken,
    };
  }
}
