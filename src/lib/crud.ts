import { NextResponse } from "next/server";
import type { Model } from "mongoose";
import { z } from "zod";
import { connectDB, hasMongo } from "@/lib/mongodb";
import { isAuthed } from "@/lib/auth";
import {
  readCollection,
  createLocal,
  updateLocal,
  deleteLocal,
  seedLocalIfEmpty,
} from "@/lib/local-db";

type AnyModel = Model<Record<string, unknown>>;

interface Resource {
  collection: string;
  model: AnyModel;
  seed: Record<string, unknown>[];
  createSchema: z.ZodType;
  updateSchema: z.ZodType;
  sort?: Record<string, 1 | -1>;
}

function normalize(row: Record<string, unknown>) {
  const id = String(row._id ?? row.id ?? "");
  return { ...row, id, _id: id };
}

async function guard() {
  return (await isAuthed())
    ? null
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function zodError(err: z.ZodError) {
  return err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
}

const dbError = () =>
  NextResponse.json(
    { error: "Database unavailable. Check MONGODB_URI and Atlas network access." },
    { status: 503 },
  );

/**
 * When MONGODB_URI is set, every admin write goes to MongoDB and a connection
 * failure returns 503 (never silently writes to the local file store). The
 * local file store is used only when MONGODB_URI is unset (local dev).
 */

export async function listHandler(res: Resource) {
  const denied = await guard();
  if (denied) return denied;

  if (hasMongo) {
    try {
      const conn = await connectDB();
      if (!conn) return dbError();
      if ((await res.model.estimatedDocumentCount()) === 0 && res.seed.length) {
        await res.model.insertMany(res.seed);
      }
      const rows = await res.model
        .find({})
        .sort(res.sort ?? { order: 1, createdAt: -1 })
        .lean();
      return NextResponse.json({
        items: rows.map((r) => normalize(r as Record<string, unknown>)),
      });
    } catch (err) {
      console.error(`crud.list(${res.collection}) mongo failed:`, err);
      return dbError();
    }
  }

  const rows = seedLocalIfEmpty(res.collection, res.seed);
  return NextResponse.json({
    items: rows.map((r) => normalize(r as Record<string, unknown>)),
  });
}

export async function createHandler(req: Request, res: Resource) {
  const denied = await guard();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const parsed = res.createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: `Invalid input - ${zodError(parsed.error)}` },
      { status: 400 },
    );
  }

  if (hasMongo) {
    try {
      const conn = await connectDB();
      if (!conn) return dbError();
      const created = await res.model.create(
        parsed.data as Record<string, unknown>,
      );
      return NextResponse.json(
        { item: normalize(created.toObject()) },
        { status: 201 },
      );
    } catch (err) {
      console.error(`crud.create(${res.collection}) mongo failed:`, err);
      return NextResponse.json({ error: "Save failed" }, { status: 500 });
    }
  }

  const rec = createLocal(res.collection, parsed.data as Record<string, unknown>);
  return NextResponse.json({ item: normalize(rec) }, { status: 201 });
}

export async function updateHandler(req: Request, id: string, res: Resource) {
  const denied = await guard();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const parsed = res.updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: `Invalid input - ${zodError(parsed.error)}` },
      { status: 400 },
    );
  }

  if (hasMongo) {
    try {
      const conn = await connectDB();
      if (!conn) return dbError();
      const updated = await res.model
        .findByIdAndUpdate(id, parsed.data as Record<string, unknown>, {
          new: true,
        })
        .lean();
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({
        item: normalize(updated as Record<string, unknown>),
      });
    } catch (err) {
      console.error(`crud.update(${res.collection}) mongo failed:`, err);
      return NextResponse.json({ error: "Save failed" }, { status: 500 });
    }
  }

  const rec = updateLocal(
    res.collection,
    id,
    parsed.data as Record<string, unknown>,
  );
  if (!rec) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item: normalize(rec) });
}

export async function deleteHandler(id: string, res: Resource) {
  const denied = await guard();
  if (denied) return denied;

  if (hasMongo) {
    try {
      const conn = await connectDB();
      if (!conn) return dbError();
      await res.model.findByIdAndDelete(id);
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error(`crud.delete(${res.collection}) mongo failed:`, err);
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
  }

  const ok = deleteLocal(res.collection, id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export type { Resource };
export { readCollection };
