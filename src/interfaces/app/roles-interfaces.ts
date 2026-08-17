import { Role } from '../entities/user';

export type RoleMode = 'ascending' | 'descending' | 'exact';

export interface RolesOptions {
  roleMode?: RoleMode;
}

export interface RoleRequirement {
  role: Role;
  range?: {
    min: Role;
    max: Role;
  };
  max?: Role;
  mode: RoleMode;
}

export type RoleSecond = Role | RolesOptions;
