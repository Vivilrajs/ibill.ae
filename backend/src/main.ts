import 'reflect-metadata';
import dns from 'node:dns';
// Atlas SRV records resolve badly under Node's default (verbatim) order on some
// networks - prefer IPv4 to avoid slow / failing server selection.
dns.setDefaultResultOrder('ipv4first');

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });

  app.setGlobalPrefix('api');

  const origins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  });

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
  new Logger('Bootstrap').log(
    `API on http://localhost:${port}/api  (CORS: ${origins.join(', ')})`,
  );
}

void bootstrap();
