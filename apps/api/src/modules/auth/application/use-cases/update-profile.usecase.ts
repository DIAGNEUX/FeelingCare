import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthRepository } from '../infrastructure/auth.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly repo: AuthRepository) {}

  async execute(userId: string, dto: UpdateProfileDto) {
    const firstName = dto.firstName?.trim();
    const lastName = dto.lastName?.trim();

    if (!firstName || !lastName) {
      throw new BadRequestException('First name and last name are required');
    }

    const user = await this.repo.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.updateProfile(userId, {
      firstName,
      lastName,
    });
  }
}
