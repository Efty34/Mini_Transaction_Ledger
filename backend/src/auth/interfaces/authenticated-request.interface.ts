import { Request } from 'express';
import { Role } from '../../users/enums/role.enum';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export interface RefreshTokenUser {
  id: string;
  refreshToken: string;
}

export interface RefreshTokenRequest extends Request {
  user: RefreshTokenUser;
}
