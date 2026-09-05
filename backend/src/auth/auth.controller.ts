import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService, TokenPair } from './auth.service';
import { CurrentRefreshUser } from './decorators/current-refresh-user.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import {
  AuthenticatedUser,
  RefreshTokenUser,
} from './interfaces/authenticated-request.interface';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, ...tokens } = await this.authService.signup(signupDto);
    this.setAuthCookies(res, tokens);
    return { message: 'Signup successful', data: user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, ...tokens } = await this.authService.login(loginDto);
    this.setAuthCookies(res, tokens);
    return { message: 'Login successful', data: user };
  }

  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentRefreshUser() currentUser: RefreshTokenUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, ...tokens } = await this.authService.refresh(
      currentUser.id,
      currentUser.refreshToken,
    );
    this.setAuthCookies(res, tokens);
    return { message: 'Token refreshed successfully', data: user };
  }

  @Post('logout')
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentRefreshUser() currentUser: RefreshTokenUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(currentUser.id);
    res.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' });
    return { message: 'Logout successful' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(@CurrentUser() currentUser: AuthenticatedUser) {
    const user = await this.usersService.findOne(currentUser.id);
    return { message: 'Current user retrieved successfully', data: user };
  }

  private setAuthCookies(res: Response, tokens: TokenPair): void {
    const secure = this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: FIFTEEN_MINUTES_MS,
      path: '/',
    });

    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: SEVEN_DAYS_MS,
      path: '/',
    });
  }
}
