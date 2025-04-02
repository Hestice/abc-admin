/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EventEmitter } from 'events';

// Increase EventEmitter max listeners
EventEmitter.defaultMaxListeners = 15;

async function bootstrap() {
  // Create app with explicit memory options
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    cors: true,
  });

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('ABC Admin API')
    .setDescription('API for Animal Bite Clinic Admin App')
    .setVersion('1.0')
    .addTag('abc-admin')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  // Get port from environment or use default
  const port = process.env.PORT || 8080;

  // Configure CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  // Graceful shutdown
  const signals = ['SIGTERM', 'SIGINT'];
  signals.forEach(signal => {
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
