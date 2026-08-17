import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      success: true,
      application: 'NestJS Backend',

      version: '1.0.0',

      timestamp: new Date(),

      message: 'Application is running.',
    };
  }
}
