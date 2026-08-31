import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, hasMongo } from "@/lib/mongodb";
import { Lead } from "@/lib/models";
import { isAuthed } from "@/lib/auth";
import { updateLocal, deleteLocal } from "@/lib/local-db";

const schema = z.object({ handled: z.boolean() });

// `loc_*` ids belong to emergency local backups written when Mongo was down.
const isLocal = (id: string) => id.startsWith("loc_");

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  if (hasMongo && !isLocal(id)) {
    try {
      const conn = await connectDB();
      if (!conn) throw new Error("no connection");
      const updated = await Lead.findByIdAndUpdate(id, parsed.data, {
        new: true,
      }).lean();
      return NextResponse.json({ item: updated });
    } catch (err) {
      console.error("lead PATCH mongo failed:", err);
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
  }

  const rec = updateLocal("leads", id, parsed.data);
  return NextResponse.json({ item: rec });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (hasMongo && !isLocal(id)) {
    try {
      const conn = await connectDB();
      if (!conn) throw new Error("no connection");
      await Lead.findByIdAndDelete(id);
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("lead DELETE mongo failed:", err);
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
  }

  deleteLocal("leads", id);
  return NextResponse.json({ ok: true });
}
