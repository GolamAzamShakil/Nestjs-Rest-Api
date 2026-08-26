/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import * as interfaces from 'src/common/interfaces/index';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { UpstashRateLimiterGuard } from '../../common/guards/rate-limiter.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { AuthService } from '../services/auth.service';
import { UsersService } from 'src/users/users.service';
import { SwaggerOptions } from 'src/common/decorators/swagger-options.decorator';
import { AuthSecurity } from '../decorators/auth-security.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('Authentication')
@UseGuards(UpstashRateLimiterGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({
    summary: 'Public endpoint for auth status',
  })
  @ApiResponse({ status: 200, description: 'All systems operational' })
  @ApiResponse({ status: 500, description: 'Service health check failed' })
  @Public()
  @Get('status')
  async status() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'Services are active',
        database: 'Connected',
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('Keep-alive check failed:', error);

      throw new InternalServerErrorException({
        status: 'Service degradation detected',
        error: error.message || 'Unknown database error',
        timestamp: new Date(),
      });
    }
  }

  @SwaggerOptions({
    summary: 'Get current user',
    responses: [
      {
        status: HttpStatus.FOUND,
      },
      {
        status: HttpStatus.TOO_MANY_REQUESTS,
        description: 'Rate limit exceeded',
      },
    ],
    authName: 'jwt-auth',
  })
  @AuthSecurity()
  @Roles('user', 'editor', { roleMode: 'atMost' })
  @Get('profile')
  profile(
    @CurrentUser()
    user: interfaces.AuthenticatedUser,
  ) {
    return user;
  }

  @ApiBearerAuth('jwt-auth')
  @UseGuards(UpstashRateLimiterGuard, JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('me')
  me(
    @CurrentUser()
    user: interfaces.AuthenticatedUser,
  ) {
    return user;
  }
}

/* import { SignInDto } from "./dtos/signin-dto";

@Post('signin')
async signin(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
)

//GET /contents
@UseGuards(
    JwtAuthGuard,
    RolesGuard,
    UpstashRateLimiterGuard,
)
@Roles('user')
@Get('/contents')
findAll(
    @CurrentUser() user: AuthenticatedUser,
) {
    return this.contentsService.findAll();
}

GET /content/:id
@Public()
@Get('/content/:id')
findOne(
    @Param('id') id: string,
) {
    return this.contentsService.findOne(id);
}

//GET /content/:id?V=new
@UseGuards(
    JwtAuthGuard,
    RolesGuard,
    UpstashRateLimiterGuard,
)
@Roles('user')
@Get('/content/:id')
findVersion(
    @Param('id') id: string,

    @Query('V') version: string,

    @CurrentUser()
    user: AuthenticatedUser,
) {
    return this.contentsService.findVersion(
        id,
        version,
    );
}

//POST /content?id=s3e1&V=new
@UseGuards(
    CookieAndBearerGuard,
    RolesGuard,
    UpstashRateLimiterGuard,
)
@Roles('admin')
@Post('/content')
create(
    @Query('id') id: string,

    @Query('V') version: string,

    @Body() dto: CreateContentDto,

    @CurrentUser()
    user: AuthenticatedUser,
) {
    return this.contentsService.create(
        id,
        version,
        dto,
    );
}

 */
