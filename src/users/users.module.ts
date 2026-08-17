import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedUserMapper } from '../common/mappers/authenticated-user.mapper';
import { UserMapper } from '../common/mappers/user.mapper';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  providers: [UsersService, AuthenticatedUserMapper, UserMapper],

  exports: [UsersService, AuthenticatedUserMapper],
})
export class UsersModule {}
