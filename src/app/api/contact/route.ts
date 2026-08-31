import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, hasMongo } from "@/lib/mongodb";
import { Lead } from "@/lib/models";
import { createLocal } from "@/lib/local-db";
import { sendLeadNotification } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1).max(140),
  email: z.string().email().max(200),
  phone: z.string().max(60).optional().default(""),
  message: z.string().min(1).max(4000),
  source: z.string().max(60).optional().default("contact"),
  // honeypot - bots fill hidden fields
  company: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { company: _hp, ...lead } = parsed.data;

  let saved = false;
  if (hasMongo) {
    try {
      const conn = await connectDB();
      if (conn) {
        await Lead.create(lead);
        saved = true;
      }
    } catch (err) {
      console.warn("contact: mongo save failed, using local:", err);
    }
  }
  if (!saved) {
    try {
      createLocal("leads", lead);
    } catch (err) {
      console.error("contact: local save failed:", err);
    }
  }

  await sendLeadNotification(lead).catch((err) =>
    console.warn("contact: email notification failed:", err),
  );

  return NextResponse.json({ ok: true });
}
