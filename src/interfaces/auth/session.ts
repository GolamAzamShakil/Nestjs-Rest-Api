import { Request } from 'express';
import { ApiUserResponse } from '../api/user';
import { Role } from '../entities/user';

export type AuthMode = 'jwt' | 'cookie' | 'better-auth' | 'guest';
export type AuthTransport = 'cookie' | 'bearer';

export interface SessionRequest extends Request {
  authType?: AuthTransport;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
}

export interface SessionResponse {
  success: boolean;
  message?: string;
  user?: ApiUserResponse;
  session?: Session;
  authMode?: AuthMode;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  roles: Role[];
  highestRole: Role;
  roleLevel: number;
  isMfaEnabled: boolean;
  authType: 'cookie' | 'bearer';
  tokenType: 'access' | 'refresh';
}
