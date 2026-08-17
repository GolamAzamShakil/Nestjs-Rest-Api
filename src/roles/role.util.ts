/* eslint-disable @typescript-eslint/no-unsafe-return */
import { BadRequestException } from '@nestjs/common';
import { ROLE_HIERARCHY } from './roles.constants';
import { Role, RoleMode, RoleRequirement } from 'src/common/interfaces';

export class RoleUtil {
  static level(role: Role): number {
    return ROLE_HIERARCHY.indexOf(role);
  }

  static exists(role: Role): boolean {
    return this.level(role) !== -1;
  }

  static highest(roles: Role[]): Role {
    if (!roles.length) {
      return 'guest';
    }

    /* sort function logic
    negative → a comes before b
    positive → b comes before a
    zero     → leave their relative order */
    return [...roles].sort((a, b) => this.level(b) - this.level(a))[0];
  }

  static lowest(roles: Role[]): Role {
    if (!roles.length) {
      return 'guest';
    }

    return [...roles].sort((a, b) => this.level(a) - this.level(b))[0];
  }

  /*
   * Role checks,
   * based on hierarchy
   */

  // ascending('editor') → gues, viewer, user, moderator, editor
  static ascending(role: Role): Role[] {
    this.validateRole(role);

    const level = this.level(role);

    return ROLE_HIERARCHY.slice(0, level + 1);
  }

  // descending('editor') → editor, admin
  static descending(role: Role): Role[] {
    this.validateRole(role);

    const level = this.level(role);

    return ROLE_HIERARCHY.slice(level);
  }

  /* *
  Example:
  userRoles = ['guest', 'viewer', 'user']
  hasMinimumRole(userRoles, 'viewer') → "You must be at least a viewer to access this."
  * */
  static hasMinimumRole(userRoles: Role[], required: Role): boolean {
    const highest = this.highest(userRoles);

    return this.level(highest) >= this.level(required);
  }

  /* *
  "Is this user's highest role no higher than the specified role?"
  Example:
  // userRoles = ['viewer', 'user', 'moderator']
  hasMaximumRole(user.roles, 'editor') → "You must Not be above editor." That means only admin is prohibited
  * */
  static hasMaximumRole(userRoles: Role[], maximum: Role): boolean {
    const highest = this.highest(userRoles);

    return this.level(highest) <= this.level(maximum);
  }

  static inRange(userRoles: Role[], min: Role, max?: Role): boolean {
    const highest = this.highest(userRoles);

    const level = this.level(highest);

    const minLevel = this.level(min);

    const maxLevel = max ? this.level(max) : ROLE_HIERARCHY.length - 1;

    return level >= minLevel && level <= maxLevel;
  }

  static range(min: Role, max: Role): Role[] {
    this.validateRange(min, max);

    const minLevel = this.level(min);
    const maxLevel = this.level(max);

    return ROLE_HIERARCHY.slice(minLevel, maxLevel + 1);
  }

  static resolve(role: Role, mode: RoleMode = 'ascending', max?: Role): Role[] {
    const roleMode: string = mode;
    switch (mode) {
      case 'ascending':
        return max ? this.range(role, max) : this.ascending(role);

      case 'descending':
        return max ? this.range(role, max) : this.descending(role);

      case 'exact':
        this.validateRole(role);
        return [role];

      default:
        throw new BadRequestException(`Invalid role mode: ${roleMode}`);
    }
  }

  static expandAscending(role: Role): Role[] {
    const level = this.level(role);

    if (level === -1) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }

    return ROLE_HIERARCHY.slice(0, level + 1);
  }

  static expandDescending(role: Role): Role[] {
    const level = this.level(role);

    if (level === -1) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }

    return ROLE_HIERARCHY.slice(level);
  }

  /*
   * Role checks independently,
   * not based on hierarchy
   */

  static hasExactRole(userRoles: Role[], required: Role): boolean {
    return userRoles.includes(required);
  }

  static hasAnyRole(userRoles: Role[], requiredRoles: Role[]): boolean {
    return requiredRoles.some((role) => userRoles.includes(role));
  }

  static hasAllRoles(userRoles: Role[], requiredRoles: Role[]): boolean {
    return requiredRoles.every((role) => userRoles.includes(role));
  }

  /*
   * Role setup and normalization
   */
  static unique(roles: Role[]): Role[] {
    return [...new Set(roles)];
  }

  static validateRoles(roles: Role[]): void {
    const invalidRoles = roles.filter((role) => !this.exists(role));

    if (invalidRoles.length) {
      throw new BadRequestException(
        `Invalid roles: ${invalidRoles.join(', ')}`,
      );
    }
  }

  static normalize(roles: Role[]): Role[] {
    this.validateRoles(roles);

    // Sort from lowest to highest
    return this.unique(roles).sort((a, b) => this.level(a) - this.level(b));
  }

  static satisfies(userRoles: Role[], requirement: RoleRequirement): boolean {
    if (!userRoles.length) {
      userRoles = ['guest'];
    }

    const mode = requirement.mode ?? 'ascending';

    const allowedRoles = this.resolve(requirement.role, mode, requirement.max);

    const highest = this.highest(userRoles);

    return allowedRoles.includes(highest);
  }

  static validateRole(role: Role): void {
    if (!this.exists(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }
  }

  static validateRange(min: Role, max?: Role): void {
    if (!this.exists(min)) {
      throw new BadRequestException(`Invalid minimum role: ${min}`);
    }

    this.validateRole(min);

    if (max && !this.exists(max)) {
      throw new BadRequestException(`Invalid maximum role: ${max}`);
    }

    if (!max) {
      return;
    }

    if (max) {
      this.validateRole(max);
    }

    if (this.level(min) > this.level(max)) {
      throw new BadRequestException(`Invalid role range: ${min} -> ${max}`);
    }
  }

  static compare(first: Role, second: Role): number {
    this.validateRole(first);
    this.validateRole(second);

    return this.level(first) - this.level(second);
  }

  static isHigher(first: Role, second: Role): boolean {
    return this.compare(first, second) > 0;
  }

  static isLower(first: Role, second: Role): boolean {
    return this.compare(first, second) < 0;
  }

  static isEqual(first: Role, second: Role): boolean {
    return first === second;
  }
}
