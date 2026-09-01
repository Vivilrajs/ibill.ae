import {
  Body,
  Controller,
  HttpCode,
  Ip,
  Post,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { ZodBody } from '../common/zod.pipe';

const loginSchema = z.object({
  email: z.string().max(200),
  password: z.string().max(200),
});
type LoginDto = z.infer<typeof loginSchema>;

/** Tiny fixed-window in-memory limiter: 12 attempts / IP / 5 min. */
const WINDOW_MS = 5 * 60_000;
const MAX = 12;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cur = hits.get(ip);
  if (!cur || now > cur.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  cur.count += 1;
  return cur.count > MAX;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(
    @Body(new ZodBody(loginSchema)) body: LoginDto,
    @Ip() ip: string,
  ): { token: string } {
    if (!this.auth.isConfigured()) {
      throw new ServiceUnavailableException(
        'Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET.',
      );
    }
    if (rateLimited(ip || 'unknown')) {
      throw new UnauthorizedException('Too many attempts. Try again later.');
    }
    if (!this.auth.checkCredentials(body.email, body.password)) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return { token: this.auth.issuedToken() };
  }

  @Post('logout')
  @HttpCode(200)
  logout(): { ok: true } {
    // Stateless bearer tokens - client just drops it.
    return { ok: true };
  }
}
