import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const VALUE = 'public, max-age=0, s-maxage=60, stale-while-revalidate=300';

/** Adds a CDN-friendly Cache-Control header to every response in the controller. */
@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap(() => {
        if (!res.headersSent) res.setHeader('Cache-Control', VALUE);
      }),
    );
  }
}
