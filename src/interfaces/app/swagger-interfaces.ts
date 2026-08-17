/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { HttpStatus, Type } from '@nestjs/common';

export interface SwaggerResponseOptions {
  status: HttpStatus | number;
  description?: string;
  type?: Type<any> | Function | [Function];
  isArray?: boolean;
  schema?: any;
  content?: any;
  headers?: Record<string, any>;
}

export interface SwaggerParamOptions {
  name: string;
  description?: string;
  required?: boolean;
  type?: any;
  enum?: any;
  example?: any;
}

export interface SwaggerQueryOptions {
  name: string;
  description?: string;
  required?: boolean;
  type?: any;
  enum?: any;
  example?: any;
  isArray?: boolean;
}

export interface SwaggerHeaderOptions {
  name: string;
  description?: string;
  required?: boolean;
  schema?: any;
  example?: any;
}

export interface SwaggerBodyOptions {
  description?: string;
  required?: boolean;
  type?: Type<any> | Function;
  schema?: any;
  examples?: Record<string, any>;
}

export interface SwaggerDecoratorOptions {
  summary: string;
  description?: string;

  responses?: SwaggerResponseOptions[];

  params?: SwaggerParamOptions[];
  queries?: SwaggerQueryOptions[];
  headers?: SwaggerHeaderOptions[];

  body?: SwaggerBodyOptions;

  consumes?: string[];
  produces?: string[];

  security?: Record<string, string[]>[];

  exclude?: boolean;

  secured?: boolean;
  authName?: string;
}
