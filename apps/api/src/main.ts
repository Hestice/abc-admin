/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EventEmitter } from 'events';
import cookieParser from 'cookie-parser';

EventEmitter.defaultMaxListeners = 15;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('ABC Admin API')
    .setDescription('API for Animal Bite Clinic Admin App')
    .setVersion('1.0')
    .addTag('abc-admin')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV === 'development') {
    Logger.log('Setting up Swagger');
    SwaggerModule.setup('api-docs', app, documentFactory);
  }

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 8080;

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_DEV,
    process.env.FRONTEND_URL_LOCAL,
  ].filter(Boolean);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const signals = ['SIGTERM', 'SIGINT'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      Logger.log(`Received ${signal}, closing application...`);
      await app.close();
      process.exit(0);
    });
  });

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap().catch((err) => {
  Logger.error('Failed to start application', err);
  process.exit(1);
});
