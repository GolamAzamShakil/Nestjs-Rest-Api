/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class AuthCheckPipe implements PipeTransform {
  constructor(private authService: AuthService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const request = metadata.data; // Access request context

    // Check if user has permission
    /* const hasPermission = await this.authService.checkPermission(
      request.user,
      'CREATE_USER',
    );

    if (!hasPermission) {
      throw new ForbiddenException('No permission to create users');
    } */

    return value;
  }
}
