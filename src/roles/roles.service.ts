import { Injectable } from '@nestjs/common';
import { RoleUtil } from './role.util';
import { Role, RoleRequirement } from 'src/common/interfaces';

@Injectable()
export class RolesService {
  canAccess(userRoles: Role[], requirement: RoleRequirement): boolean {
    return RoleUtil.satisfies(userRoles, requirement);
  }

  resolveRequirement(requirement: RoleRequirement): Role[] {
    return RoleUtil.resolve(
      requirement.role,
      requirement.mode ?? 'atMost',
      requirement.max,
    );
  }

  highestRole(roles: Role[]): Role {
    return RoleUtil.highest(roles);
  }

  lowestRole(roles: Role[]): Role {
    return RoleUtil.lowest(roles);
  }

  roleLevel(role: Role): number {
    return RoleUtil.level(role);
  }

  compare(first: Role, second: Role): number {
    return RoleUtil.compare(first, second);
  }

  isHigher(first: Role, second: Role): boolean {
    return this.compare(first, second) > 0;
  }

  isLower(first: Role, second: Role): boolean {
    return this.compare(first, second) < 0;
  }

  isEqual(first: Role, second: Role): boolean {
    return RoleUtil.isEqual(first, second);
  }

  hasExactRole(userRoles: Role[], required: Role): boolean {
    return RoleUtil.hasExactRole(userRoles, required);
  }
}
