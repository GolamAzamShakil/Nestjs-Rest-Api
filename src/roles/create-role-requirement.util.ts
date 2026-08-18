import {
  Role,
  RoleRequirement,
  RoleSecond,
  RolesOptions,
} from 'src/common/interfaces';
import { RoleUtil } from './role.util';
import { BadRequestException } from '@nestjs/common';

export function createRoleRequirement(
  first: Role,
  second?: RoleSecond,
  third?: RolesOptions,
): RoleRequirement {
  const isOptionsObject = second !== undefined && typeof second === 'object';

  const max = isOptionsObject ? undefined : second;

  const options = isOptionsObject ? second : third;

  const mode = options?.roleMode ?? 'atMost';

  RoleUtil.validateRange(first, max);

  if (mode === 'exact' && max) {
    throw new BadRequestException('Exact mode does not support a role range.');
  }

  return {
    role: first,
    max,
    mode,
  };
}
