import { NextResponse } from "next/server";
import { connectDB, hasMongo } from "@/lib/mongodb";
import { Lead } from "@/lib/models";
import { isAuthed } from "@/lib/auth";
import { readCollection } from "@/lib/local-db";

export async function GET() {
  if (!(await isAuthed()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (hasMongo) {
    try {
      const conn = await connectDB();
      if (!conn) throw new Error("no connection");
      const rows = await Lead.find({}).sort({ createdAt: -1 }).lean();
      // Include any emergency local backups saved while Mongo was unreachable.
      const backups = readCollection("leads").map((r) => ({
        ...r,
        id: String(r._id),
      }));
      const items = [
        ...backups.reverse(),
        ...rows.map((r) => ({ ...r, id: String(r._id) })),
      ];
      return NextResponse.json({ items });
    } catch (err) {
      console.error("leads GET mongo failed:", err);
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 },
      );
    }
  }

  const rows = readCollection("leads")
    .map((r) => ({ ...r, id: String(r._id) }))
    .reverse();
  return NextResponse.json({ items: rows });
}
