/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  IsString,
  IsEmail,
  Length,
  IsStrongPassword,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from 'prisma/generated/client';
import { Match } from 'src/common/decorators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupInputsDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Unique handle for the user profile',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  username!: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Primary email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'P@ssword123!',
    description:
      'Must contain uppercase, lowercase, number, and special character',
  })
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 5,
    },
    {
      message:
        'Provide a strong password of minimum 8 characters including number, lowercase, uppercase, and special character',
    },
  )
  password!: string;

  @ApiProperty({
    example: 'P@ssword123!',
  })
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword!: string;

  @ApiProperty({
    example: [Role.GUEST],
    enum: Role,
    isArray: true,
    default: ['GUEST'],
    description:
      'Must be an array of roles- GUEST, USER, VIEWER, EDITOR, MODERATOR',
  })
  @IsArray({ message: 'roles must be an array of strings' })
  @IsEnum(Role, {
    each: true,
    message: `roles must be one of the following values: ${Object.values(Role).join(', ')}`,
  })
  @Transform(({ value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return [Role.GUEST];
    }

    const rolesArray = Array.isArray(value) ? value : [value];

    return rolesArray.map((role) =>
      typeof role === 'string' ? role.toUpperCase() : role,
    );
  })
  @IsOptional()
  roles?: Role[] = [Role.GUEST];

  @ApiProperty({
    type: 'boolean',
    example: false,
    default: false,
    description: 'MFA enabled or not',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isMfaEnabled?: boolean;

  /* @ApiProperty({
    example: { referralCode: 'SUMMER2026', step: 2 },
    description: 'Dynamic key-value tracking store',
  })
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: {
    [key: number]: number;
    [key: string]: string | number | undefined;
  };
  // metadata?: Record<string, string | number>; */
}
