import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthController } from './application/controller/auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './application/infrastructure/auth.repository';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { RefreshUseCase } from './application/use-cases/refresh-session.usecase';
import { LogoutUseCase } from './application/use-cases/logout.usecase';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.usecase';
import { ChangePasswordUseCase } from './application/use-cases/change-password.usecase';
import { HashService } from './application/services/hash.service';
import { TokenService } from './application/services/token.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    RegisterUseCase,
    LoginUseCase,
    RefreshUseCase,
    LogoutUseCase,
    UpdateProfileUseCase,
    ChangePasswordUseCase,
    HashService,
    TokenService,
    JwtService,
  ],
})
export class AuthModule {}
