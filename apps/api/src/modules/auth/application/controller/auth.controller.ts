import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Res,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from '../../auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CurrentUser } from '../decorators/current-user.decorator';

type RequestWithCookies = Request & {
  cookies: Record<string, string | undefined>;
};

const refreshCookieBaseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const refreshCookieOptions = {
  ...refreshCookieBaseOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function getRefreshToken(req: RequestWithCookies): string {
  const refreshToken = (req.cookies as Record<string, unknown>).refresh_token;

  return typeof refreshToken === 'string' ? refreshToken : '';
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(dto);

    res.cookie('refresh_token', refreshToken, refreshCookieOptions);

    return res.json({ accessToken });
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      dto.email,
      dto.password,
    );

    res.cookie('refresh_token', refreshToken, refreshCookieOptions);

    return res.json({ accessToken });
  }

  @Post('refresh')
  async refresh(@Req() req: RequestWithCookies, @Res() res: Response) {
    const refreshToken = getRefreshToken(req);

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    res.cookie('refresh_token', newRefreshToken, refreshCookieOptions);

    return res.json({ accessToken });
  }

  @Post('logout')
  async logout(@Req() req: RequestWithCookies, @Res() res: Response) {
    const refreshToken = getRefreshToken(req);

    await this.authService.logout(refreshToken);

    res.clearCookie('refresh_token', refreshCookieBaseOptions);

    return res.json({ success: true });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: { id: string }) {
    const currentUser = await this.authService.getCurrentUser(user.id);

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    return currentUser;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  changePassword(
    @CurrentUser() user: { id: string },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, dto);
  }
}
