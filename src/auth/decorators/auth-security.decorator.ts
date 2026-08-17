/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { RolesGuard } from 'src/roles/roles.guard';
import {
  applyDecorators,
  BadRequestException,
  CanActivate,
  SetMetadata,
  Type,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { createRoleRequirement } from 'src/roles/create-role-requirement.util';
import { ROLES_KEY } from 'src/roles/roles.constants';
import { AuthOptions } from 'src/common/interfaces';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { UpstashRateLimiterGuard } from 'src/common/guards/rate-limiter.guard';
import { AuthCookieInterceptor } from 'src/common/interceptors/auth-cookie.interceptor';

export function AuthSecurity(options: AuthOptions = {}) {
  if (options.isPublic && options.roles) {
    throw new BadRequestException(
      'Public routes cannot define role requirements.',
    );
  }

  const decorators: Array<
    ClassDecorator | MethodDecorator | PropertyDecorator
  > = [];
  const guards: Type<CanActivate>[] = [];

  if (!options.isPublic) {
    guards.push(JwtAuthGuard, RolesGuard);
  } else {
    decorators.push(Public());

    return applyDecorators(...decorators);
  }

  if (!options.skipLimit) {
    guards.push(UpstashRateLimiterGuard);
  }

  /* const decorators = [   // : Array<ClassDecorator | MethodDecorator>
    UseGuards(...guards),
    UseInterceptors(AuthCookieInterceptor),
  ]; */

  /* if (options.roles) {
    const requirement = createRoleRequirement(
      options.roles.first,
      options.roles.second,
      options.roles.third,
    );

    decorators.push(SetMetadata(ROLES_KEY, requirement));
  } */

  /* return applyDecorators(...decorators); */
  const roleDecorator = options.roles
    ? SetMetadata(
        ROLES_KEY,
        createRoleRequirement(
          options.roles.first,
          options.roles.second,
          options.roles.third,
        ),
      )
    : undefined;

  return applyDecorators(
    UseGuards(...guards),
    UseInterceptors(AuthCookieInterceptor),
    ...(roleDecorator ? [roleDecorator] : []),
  );
}
