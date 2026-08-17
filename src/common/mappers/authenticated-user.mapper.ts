import { AuthenticatedUser, AuthTransport, Role, User } from '../interfaces';
import { RoleUtil } from 'src/roles/role.util';

export class AuthenticatedUserMapper {
  static fromUser(
    user: User,
    authType: AuthTransport,
    tokenType: 'access' | 'refresh',
  ): AuthenticatedUser {
    return {
      id: user.id,

      username: user.username,

      email: user.email,

      roles: user.roles,

      highestRole: RoleUtil.highest(user.roles) as Role,

      roleLevel: RoleUtil.level(RoleUtil.highest(user.roles)),

      isMfaEnabled: user.isMfaEnabled,

      authType,

      tokenType,
    };
  }
}
