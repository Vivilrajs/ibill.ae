import 'reflect-metadata';
import dns from 'node:dns';
// Atlas SRV records resolve badly under Node's default (verbatim) order on some
// networks - prefer IPv4 to avoid slow / failing server selection.
dns.setDefaultResultOrder('ipv4first');

import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

/** Builds the Nest app (no `.listen()`). Shared by main.ts and the serverless handler. */
export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });

  app.setGlobalPrefix('api');

  const origins = (process.env.FRONTEND_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    // Same-origin deploy needs no CORS; a comma-separated FRONTEND_ORIGIN adds
    // cross-origin allowances (e.g. a separately-hosted frontend).
    origin: origins.length ? origins : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  });

  return app;
}
