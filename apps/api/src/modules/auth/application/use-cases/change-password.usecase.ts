import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '../infrastructure/auth.repository';
import { HashService } from '../services/hash.service';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private readonly repo: AuthRepository,
    private readonly hashService: HashService,
  ) {}

  async execute(userId: string, dto: ChangePasswordDto) {
    const currentPassword = dto.currentPassword ?? '';
    const newPassword = dto.newPassword ?? '';

    if (newPassword.length < 6) {
      throw new BadRequestException('Password must contain at least 6 characters');
    }

    const user = await this.repo.findByIdWithPassword(userId);

    if (!user?.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.hashService.compare(
      currentPassword,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = await this.hashService.hash(newPassword);
    await this.repo.updatePassword(userId, hashedPassword);

    return { success: true };
  }
}
