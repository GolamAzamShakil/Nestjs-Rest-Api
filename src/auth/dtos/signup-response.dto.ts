// dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'prisma/generated/client';

export class SignupResponseDto {
  @ApiProperty({ example: 'cl01abcde0000gz78xyz12345' })
  id!: string;

  @ApiProperty({ example: 'johndoe' })
  username!: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  email!: string;

  @ApiProperty({ example: [Role.USER], enum: Role, isArray: true })
  roles!: Role[];

  @ApiProperty({ example: false })
  isMfaEnabled!: boolean;

  @ApiProperty({ example: '2026-08-08T02:28:00.000Z' })
  createdAt!: Date;

  /* @ApiProperty({
    example: { referralCode: 'SUMMER2026', step: 2 },
    description: 'Dynamic key-value tracking store',
  })
  @ApiPropertyOptional()
  metadata?: {
    [key: number]: number;
    [key: string]: string | number | undefined;
  }; */
}
