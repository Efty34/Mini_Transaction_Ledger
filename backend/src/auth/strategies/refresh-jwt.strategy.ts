import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshTokenUser } from '../interfaces/authenticated-request.interface';
import { RefreshTokenPayload } from '../interfaces/refresh-token-payload.interface';

const extractRefreshTokenFromCookie = (req: Request): string | null => {
  const token: unknown = req?.cookies?.['refresh_token'];
  return typeof token === 'string' ? token : null;
};

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractRefreshTokenFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshTokenPayload): RefreshTokenUser {
    const refreshToken = extractRefreshTokenFromCookie(req);

    if (!payload?.sub || !refreshToken) {
      throw new UnauthorizedException();
    }

    return { id: payload.sub, refreshToken };
  }
}
