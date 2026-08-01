import { Injectable } from '@nestjs/common';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { RefreshUseCase } from './application/use-cases/refresh-session.usecase';
import { LogoutUseCase } from './application/use-cases/logout.usecase';
import { AuthRepository } from './application/infrastructure/auth.repository';
import { RegisterDto } from './application/dto/register.dto';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.usecase';
import { ChangePasswordUseCase } from './application/use-cases/change-password.usecase';
import { UpdateProfileDto } from './application/dto/update-profile.dto';
import { ChangePasswordDto } from './application/dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly authRepository: AuthRepository,
  ) {}

  register(dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  login(email: string, password: string) {
    return this.loginUseCase.execute(email, password);
  }

  refresh(refreshToken: string) {
    return this.refreshUseCase.execute(refreshToken);
  }

  logout(refreshToken: string) {
    return this.logoutUseCase.execute(refreshToken);
  }

  getCurrentUser(userId: string) {
    return this.authRepository.findById(userId);
  }

  updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute(userId, dto);
  }

  changePassword(userId: string, dto: ChangePasswordDto) {
    return this.changePasswordUseCase.execute(userId, dto);
  }
}
