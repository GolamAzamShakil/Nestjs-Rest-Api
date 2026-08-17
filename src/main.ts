/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const isLocal = configService.get('NODE_ENV') === 'local';
  app.enableCors({
    origin: isLocal ? configService.get('ALLOWED_ORIGINS') : '*',
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(cookieParser());

  const cookieTokenName =
    configService.getOrThrow<string>('COOKIE_ACCESS_NAME') ||
    'nestjs_api_access_token_cookie';
  const refreshCookieTokenName =
    configService.getOrThrow<string>('COOKIE_REFRESH_NAME') ||
    'nestjs_api_refresh_token_cookie';

  const config = new DocumentBuilder()
    .setTitle('NestJS REST API')
    .setDescription('A NestJS based project for REST API Endpoints')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: cookieTokenName,
        description: 'Enter your raw JWT token here to authenticate.',
        in: 'header',
      },
      'jwt-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: refreshCookieTokenName,
        description: 'Enter your raw JWT token here to authenticate.',
        in: 'header',
      },
      'jwt-refresh-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    swaggerUiEnabled: true,
    customCssUrl: '/static/swagger/badge-style.css',
    customJs: '/static/swagger/badge-script.js',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
