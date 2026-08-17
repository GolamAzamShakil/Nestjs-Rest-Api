/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerDecoratorOptions } from '../interfaces';

export function SwaggerOptions(options: SwaggerDecoratorOptions) {
  const decorators = [
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
  ];

  if (options.responses?.length) {
    for (const response of options.responses) {
      decorators.push(
        ApiResponse({
          status: response.status ?? HttpStatus.OK,
          description: response.description,
          type: response.type,
          isArray: response.isArray,
          schema: response.schema,
          content: response.content,
          headers: response.headers,
        }),
      );
    }
  }

  if (options.secured) {
    decorators.push(ApiBearerAuth(options.authName ?? 'jwt-auth'));
  }

  return applyDecorators(...decorators);
}
