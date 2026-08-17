import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}

/* This is the ways of core logic to apply public guard where a route/controller skips any auth cookie jwt related guards 
1.
  const isPublic =
      this.reflector.getAllAndOverride<boolean>(
          IS_PUBLIC_KEY,
          [
              context.getHandler(),
              context.getClass(),
          ],
      );

  if (isPublic) {
      return true;
  }

2.
constructor(
  private reflector: Reflector,
) {
  super();
}

canActivate(
  context: ExecutionContext,
) {

  const isPublic =
      this.reflector.getAllAndOverride<boolean>(
          IS_PUBLIC_KEY,
          [
              context.getHandler(),
              context.getClass(),
          ],
      );

  if (isPublic) {
      return true;
  }

  return super.canActivate(context);
}
 */
