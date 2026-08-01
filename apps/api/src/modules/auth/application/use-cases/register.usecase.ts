import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { AuthRepository } from '../infrastructure/auth.repository';
import { HashService } from '../services/hash.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly repo: AuthRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    // 1. Normaliser email
    const normalizedEmail = input.email?.trim().toLowerCase();
    const firstName = input.firstName?.trim();
    const lastName = input.lastName?.trim();

    if (!normalizedEmail || !input.password || !firstName || !lastName) {
      throw new BadRequestException('Missing required registration fields');
    }

    // 2. Vérifier si user existe déjà
    const existingUser = await this.repo.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // 3. Hasher le mot de passe
    const hashedPassword = await this.hashService.hash(input.password);

    // 4. Créer user
    const user = await this.repo.createUser({
      email: normalizedEmail,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // 5. Générer tokens
    const accessToken = this.tokenService.generateAccessToken(user.id);
    const refreshToken = this.tokenService.generateRefreshToken(user.id);

    // 6. Hasher refresh token
    const refreshTokenHash = await this.hashService.hash(refreshToken);

    // 7. Créer session
    await this.repo.createSession({
      userId: user.id,
      refreshTokenHash,
      expiresAt: this.tokenService.getRefreshTokenExpiration(),
    });

    // 8. Retourner tokens
    return {
      accessToken,
      refreshToken,
    };
  }
}
