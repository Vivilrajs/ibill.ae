import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "ibill_session";

function secret() {
  return process.env.AUTH_SECRET || "";
}

export function adminEmail() {
  return (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
}

/**
 * Session token is an HMAC of the admin email + password over AUTH_SECRET.
 * Changing ADMIN_PASSWORD or AUTH_SECRET in the environment invalidates every
 * existing session automatically.
 */
export function issuedToken(): string {
  const material = `${adminEmail()}:${process.env.ADMIN_PASSWORD || ""}`;
  return createHmac("sha256", secret()).update(material).digest("hex");
}

export function checkCredentials(email: string, password: string): boolean {
  const expectedEmail = adminEmail();
  const expectedPass = process.env.ADMIN_PASSWORD || "";
  return (
    expectedEmail.length > 0 &&
    expectedPass.length > 0 &&
    secret().length > 0 &&
    email.trim().toLowerCase() === expectedEmail &&
    password === expectedPass
  );
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Server Component / Route Handler guard. */
export async function isAuthed(): Promise<boolean> {
  if (!secret()) return false;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value ?? "";
  return token.length > 0 && safeEqual(token, issuedToken());
}

/**
 * Edge proxy pre-check: cookie present and non-empty. The proxy runs on the edge
 * runtime where node:crypto is unavailable, so the authoritative HMAC check is
 * done by the admin layout (a Server Component) via `isAuthed()`.
 */
export function hasSessionCookie(req: NextRequest): boolean {
  return (req.cookies.get(SESSION_COOKIE)?.value ?? "").length > 0;
}

export function isConfigured(): boolean {
  return (
    adminEmail().length > 0 &&
    (process.env.ADMIN_PASSWORD || "").length > 0 &&
    secret().length > 0
  );
}
