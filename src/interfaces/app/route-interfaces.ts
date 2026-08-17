import { HttpStatus } from '@nestjs/common';
import { RolesOptions } from './roles-interfaces';
import { Role } from '../entities/user';

export interface AuthOptions {
  role?: Role;
  maxRole?: Role;
  isPublic?: boolean;
  skipLimit?: boolean;
  roles?: {
    first: Role;
    second?: Role | RolesOptions;
    third?: RolesOptions;
  };
}

export interface RouteOptions {
  summary: string;
  roles?: string[];
  responseType?: any;
  httpCode?: HttpStatus;
}
