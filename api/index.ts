/**
 * Vercel serverless entry for the NestJS API.
 * Handles every /api/* request (see the rewrite in vercel.json).
 *
 * Imports the *compiled* backend from backend/dist so we don't depend on
 * decorator-metadata emission by Vercel's function bundler. `npm run vercel-build`
 * builds backend/dist before functions are packaged.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - built at deploy time by `cd backend && npm run build`
import { createApp } from '../backend/dist/create-app.js';

let cached: Promise<(req: IncomingMessage, res: ServerResponse) => void> | null =
  null;

function boot() {
  if (!cached) {
    cached = (async () => {
      const app = await createApp();
      await app.init();
      return app.getHttpAdapter().getInstance();
    })();
  }
  return cached;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const express = await boot();
  express(req, res);
}
