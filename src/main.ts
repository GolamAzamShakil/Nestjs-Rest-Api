/* eslint-disable @typescript-eslint/no-unused-vars */
import 'dotenv/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV');
  //const isLocal = configService.get('NODE_ENV') === 'local';
  app.enableCors({
    /* origin: isLocal ? configService.get('ALLOWED_ORIGINS') : '*', */
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (nodeEnv === 'local' || nodeEnv === 'development') {
        // Allows all origins in local dev.
        callback(null, true);
        return;
      }

      const allowedOriginsRaw =
        configService.get<string>('ALLOWED_ORIGINS') || '';
      const allowedOrigins = allowedOriginsRaw
        .split(',')
        .map((origin) => origin.trim());

      // Allow requests with no origin (like mobile apps, curl, or same-origin Swagger pages)
      if (!requestOrigin) {
        callback(null, true);
        return;
      }

      // Check if the browser's requesting origin is in the whitelist
      if (allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
      'x-ratelimit-limit',
      'x-ratelimit-remaining',
      'x-ratelimit-reset',
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
