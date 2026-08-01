import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const allowedOrigins =
    process.env.FRONTEND_URL
      ?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) ?? ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3001;

  await app.listen(port, '0.0.0.0');

  console.log(`API démarrée sur le port ${port}`);
}

bootstrap();