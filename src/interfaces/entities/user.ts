export interface User {
  id: string;
  username: string;
  email: string;
  password: string;

  isMfaEnabled: boolean;

  roles: Role[];

  createdAt: Date;
  updatedAt: Date;
}

export const Roles = [
  'guest',
  'viewer',
  'user',
  'moderator',
  'editor',
  'admin',
] as const;

export type Role = (typeof Roles)[number];
