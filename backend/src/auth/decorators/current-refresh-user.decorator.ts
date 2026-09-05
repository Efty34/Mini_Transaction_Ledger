import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshTokenRequest } from '../interfaces/authenticated-request.interface';

export const CurrentRefreshUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RefreshTokenRequest>();
    return request.user;
  },
);
