import { Role } from 'src/common/interfaces';

export const ROLE_HIERARCHY: readonly Role[] = [
  'guest',
  'viewer',
  'user',
  'moderator',
  'editor',
  'admin',
] as const;

export const ROLES_KEY = 'roles';
