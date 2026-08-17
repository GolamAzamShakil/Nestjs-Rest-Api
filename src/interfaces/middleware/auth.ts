/* import { NextRequest, NextResponse } from 'next/server';
import { DecodedToken } from '../auth/jwt';
import { Role } from '../entities/user';

export interface AuthenticatedRequest extends NextRequest {
  user?: DecodedToken;

  authMode?: 'cookie' | 'bearer';
}

export interface AuthMiddlewareResult {
  authorized: boolean;

  user?: DecodedToken;

  authMode?: 'cookie' | 'bearer';

  response?: NextResponse;
}

export interface AuthMiddlewareOptions {
  allowBoth?: boolean;

  cookieOnly?: boolean;

  bearerOnly?: boolean;

  requiredRoles?: Role[];

  customHeaders?: Record<string, string>;

  onUnauthorized?: (reason: string, origin: string | null) => NextResponse;
}
 */
