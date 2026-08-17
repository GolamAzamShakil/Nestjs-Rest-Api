import { AuthMode } from './session';

export interface SignUpRequest {
  username: string;

  email: string;

  password: string;

  confirmPassword: string;
}

export interface SignInRequest {
  email: string;

  password: string;

  authMode?: AuthMode;
}
