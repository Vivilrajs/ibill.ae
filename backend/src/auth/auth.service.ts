import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';

@Injectable()
export class AuthService {
  private secret() {
    return process.env.AUTH_SECRET || '';
  }

  private adminEmail() {
    return (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  }

  private adminPassword() {
    return process.env.ADMIN_PASSWORD || '';
  }

  isConfigured(): boolean {
    return (
      this.adminEmail().length > 0 &&
      this.adminPassword().length > 0 &&
      this.secret().length > 0
    );
  }

  /**
   * HMAC of admin email + password over AUTH_SECRET. Changing ADMIN_PASSWORD or
   * AUTH_SECRET invalidates every issued token.
   */
  issuedToken(): string {
    const material = `${this.adminEmail()}:${this.adminPassword()}`;
    return createHmac('sha256', this.secret()).update(material).digest('hex');
  }

  checkCredentials(email: string, password: string): boolean {
    return (
      this.isConfigured() &&
      email.trim().toLowerCase() === this.adminEmail() &&
      password === this.adminPassword()
    );
  }

  verifyToken(token: string): boolean {
    if (!this.isConfigured() || !token) return false;
    const a = Buffer.from(token);
    const b = Buffer.from(this.issuedToken());
    return a.length === b.length && timingSafeEqual(a, b);
  }
}
