import { NextResponse } from "next/server";
import {
  checkCredentials,
  issuedToken,
  isConfigured,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET.",
      },
      { status: 503 },
    );
  }

  const { email, password } = await req
    .json()
    .catch(() => ({ email: "", password: "" }));

  if (!checkCredentials(email ?? "", password ?? "")) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, issuedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
