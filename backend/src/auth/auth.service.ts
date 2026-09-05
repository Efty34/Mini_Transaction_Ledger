import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, timingSafeEqual } from 'crypto';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/role.enum';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RefreshTokenPayload } from './interfaces/refresh-token-payload.interface';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ user: User } & TokenPair> {
    const user = await this.usersService.create({
      firstName: signupDto.firstName,
      lastName: signupDto.lastName,
      username: signupDto.username,
      email: signupDto.email,
      password: signupDto.password,
      role: Role.USER,
    });

    const tokens = await this.issueTokens(user);
    return { user, ...tokens };
  }

  async login(loginDto: LoginDto): Promise<{ user: User } & TokenPair> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.issueTokens(user);
    return { user, ...tokens };
  }

  async refresh(
    userId: string,
    refreshToken: string,
  ): Promise<{ user: User } & TokenPair> {
    const user = await this.usersService.findOne(userId);

    if (
      !user.hashedRefreshToken ||
      !this.refreshTokenMatches(refreshToken, user.hashedRefreshToken)
    ) {
      // Either no active session, or a stale/reused refresh token was
      // presented. Revoke the stored token so a compromised one can't
      // be tried again.
      await this.usersService.setRefreshTokenHash(user.id, null);
      throw new UnauthorizedException();
    }

    const tokens = await this.issueTokens(user);
    return { user, ...tokens };
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.setRefreshTokenHash(userId, null);
  }

  private async issueTokens(user: User): Promise<TokenPair> {
    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const refreshPayload: RefreshTokenPayload = { sub: user.id };

    const accessToken = this.jwtService.sign(accessPayload);
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
        '7d',
      ) as `${number}${'s' | 'm' | 'h' | 'd'}`,
    });

    await this.usersService.setRefreshTokenHash(
      user.id,
      this.hashRefreshToken(refreshToken),
    );

    return { accessToken, refreshToken };
  }

  // Refresh tokens are long, high-entropy JWTs. bcrypt silently truncates
  // its input to 72 bytes, which would make every token issued to the same
  // user (they share the same header + `sub` prefix) hash identically —
  // so plain SHA-256 + constant-time comparison is used instead.
  private hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private refreshTokenMatches(token: string, storedHash: string): boolean {
    const candidateHash = Buffer.from(this.hashRefreshToken(token));
    const expectedHash = Buffer.from(storedHash);

    return (
      candidateHash.length === expectedHash.length &&
      timingSafeEqual(candidateHash, expectedHash)
    );
  }
}
