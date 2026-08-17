import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';
import { UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UpstashRateLimiterGuard } from './common/guards/rate-limiter.guard';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @UseGuards(UpstashRateLimiterGuard)
  @ApiOperation({
    summary: 'Health check',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns application health.',
  })
  @Get()
  health() {
    return this.appService.getHealth();
  }
}
