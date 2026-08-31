import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, hasMongo } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models";
import { isAuthed } from "@/lib/auth";
import { getLocalSingleton, setLocalSingleton } from "@/lib/local-db";
import { SITE_SETTINGS } from "@/lib/content/settings";

const schema = z.object({
  phone: z.string().max(60).optional(),
  email: z.string().max(200).optional(),
  address: z.string().max(400).optional(),
  mapQuery: z.string().max(400).optional(),
  companyBlurb: z.string().max(1000).optional(),
  workHours: z.array(z.string().max(120)).max(10).optional(),
  facebook: z.string().max(300).optional(),
  instagram: z.string().max(300).optional(),
  twitter: z.string().max(300).optional(),
  youtube: z.string().max(300).optional(),
  statExperienceYears: z.number().int().min(0).max(200).optional(),
  statProjectsDone: z.number().int().min(0).max(100000).optional(),
  statHappyClients: z.number().int().min(0).max(100000).optional(),
});

export async function GET() {
  if (!(await isAuthed()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (hasMongo) {
    try {
      const conn = await connectDB();
      if (!conn) throw new Error("no connection");
      const existing =
        (await SiteSettings.findOne({ key: "default" }).lean()) ??
        (await SiteSettings.create(SITE_SETTINGS)).toObject();
      return NextResponse.json({ settings: existing });
    } catch (err) {
      console.error("settings GET mongo failed:", err);
      return NextResponse.json(
        { error: "Database unavailable. Check MONGODB_URI and Atlas access." },
        { status: 503 },
      );
    }
  }
  return NextResponse.json({
    settings: getLocalSingleton(
      "settings",
      SITE_SETTINGS as unknown as Record<string, unknown>,
    ),
  });
}

export async function PUT(req: Request) {
  if (!(await isAuthed()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (hasMongo) {
    try {
      const conn = await connectDB();
      if (!conn) throw new Error("no connection");
      const updated = await SiteSettings.findOneAndUpdate(
        { key: "default" },
        { $set: parsed.data },
        { new: true, upsert: true },
      ).lean();
      return NextResponse.json({ settings: updated });
    } catch (err) {
      console.error("settings PUT mongo failed:", err);
      return NextResponse.json(
        { error: "Save failed - database unavailable." },
        { status: 503 },
      );
    }
  }
  const current = getLocalSingleton(
    "settings",
    SITE_SETTINGS as unknown as Record<string, unknown>,
  );
  const next = setLocalSingleton("settings", { ...current, ...parsed.data });
  return NextResponse.json({ settings: next });
}
