import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @IsNotEmpty()
  @IsStrongPassword()
  newPassword!: string;

  @Match('newPassword', { message: 'Passwords do not match' })
  confirmPassword!: string;
}
