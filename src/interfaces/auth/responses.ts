import { ApiUserResponse } from '../api/user';

export interface AuthSuccess {
  success: true;

  message: string;

  user: ApiUserResponse;

  accessToken?: string;

  refreshToken?: string;
}

export interface AuthFailure {
  success: false;

  message: string;
}

export type AuthResponse = AuthSuccess | AuthFailure;
