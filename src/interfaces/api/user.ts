export interface ApiUserResponse {
  id: string;

  username: string;

  email: string | null;

  roles: string[];

  isMfaEnabled: boolean;

  createdAt: Date;

  updatedAt: Date;
}
