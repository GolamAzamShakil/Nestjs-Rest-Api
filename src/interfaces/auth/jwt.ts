import { Role } from '../entities/user';

export interface JwtPayload {
  sub: string;

  email: string;

  roles: Role[];

  type: 'access' | 'refresh';
}

export interface DecodedToken extends JwtPayload {
  iat?: number;

  exp?: number;
}
