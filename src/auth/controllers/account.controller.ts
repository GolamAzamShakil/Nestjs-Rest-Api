import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { UpstashRateLimiterGuard } from 'src/common/guards/rate-limiter.guard';
import { AuthService } from '../services/auth.service';
import { SignupInputsDto } from '../dtos/signup-inputs.dto';
import { SignInDto } from '../dtos/signin.dto';
import { SwaggerOptions } from 'src/common/decorators/swagger-options.decorator';
import { SignupResponseDto } from '../dtos/signup-response.dto';
import { AuthSecurity } from '../decorators/auth-security.decorator';

@ApiTags('Account')
@UseGuards(UpstashRateLimiterGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly auth: AuthService) {}

  @AuthSecurity({ isPublic: true })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @SwaggerOptions({
    summary: 'Register a new user account',
    responses: [
      {
        status: HttpStatus.CREATED,
        type: SignupResponseDto,
      },
      {
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation failed',
      },
      {
        status: HttpStatus.TOO_MANY_REQUESTS,
        description: 'Rate limit exceeded',
      },
    ],
  })
  @AuthSecurity({ isPublic: true })
  async signup(@Body() signupDto: SignupInputsDto) {
    const newUser = await this.auth.signup(signupDto);

    return newUser;
  }

  @AuthSecurity({ isPublic: true })
  @Post('signin')
  @HttpCode(HttpStatus.FOUND)
  @SwaggerOptions({
    summary: 'Sign-in for existing user account',
    responses: [
      {
        status: HttpStatus.FOUND,
        description: 'User Found',
      },
      {
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation failed',
      },
      {
        status: HttpStatus.TOO_MANY_REQUESTS,
        description: 'Rate limit exceeded',
      },
    ],
  })
  @AuthSecurity({ isPublic: true })
  async signin(@Body() signInDto: SignInDto) {
    return await this.auth.signin(signInDto);
  }

  @AuthSecurity()
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signout(@Res({ passthrough: true }) response: Response) {
    return this.auth.signout(response);
  }
}
