import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from './roles.constants';
import { Role, RolesOptions } from 'src/common/interfaces';
import { createRoleRequirement } from './create-role-requirement.util';

export function Roles(
  role: Role,
  options?: RolesOptions,
): ReturnType<typeof SetMetadata>;

export function Roles(
  min: Role,
  max: Role,
  options?: RolesOptions,
): ReturnType<typeof SetMetadata>;

export function Roles(
  first: Role,
  second?: Role | RolesOptions,
  third?: RolesOptions,
) {
  const requirement = createRoleRequirement(first, second, third);

  return SetMetadata(ROLES_KEY, requirement);
}

/* export function Roles(role: Role, options: RolesOptions = {}) {
  const mode = options.mode ?? 'atMost'; 
  const requirement: RoleRequirement = {
    min: role,
    mode,
  };
  RoleUtil.validateRole(role);
  return SetMetadata(ROLES_KEY, requirement);
} */
