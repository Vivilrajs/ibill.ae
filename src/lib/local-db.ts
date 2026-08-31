import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

/**
 * File-backed fallback store. Used when MONGODB_URI is not set so the site and
 * admin panel are fully functional before an Atlas cluster is wired up.
 * Data lives in `.data/<collection>.json` at the project root.
 */

const DIR = path.join(process.cwd(), ".data");

function file(collection: string) {
  return path.join(DIR, `${collection}.json`);
}

function ensureDir() {
  if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
}

export type LocalRecord = Record<string, unknown> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export function readCollection<T = LocalRecord>(collection: string): T[] {
  try {
    const f = file(collection);
    if (!existsSync(f)) return [];
    return JSON.parse(readFileSync(f, "utf8") || "[]") as T[];
  } catch (err) {
    console.error(`local-db read ${collection}:`, err);
    return [];
  }
}

function writeCollection(collection: string, rows: unknown[]) {
  ensureDir();
  writeFileSync(file(collection), JSON.stringify(rows, null, 2), "utf8");
}

function id() {
  return "loc_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function createLocal(collection: string, data: Record<string, unknown>) {
  const rows = readCollection(collection);
  const now = new Date().toISOString();
  const rec: LocalRecord = {
    ...data,
    _id: (data._id as string) || id(),
    createdAt: now,
    updatedAt: now,
  };
  rows.push(rec);
  writeCollection(collection, rows);
  return rec;
}

export function updateLocal(
  collection: string,
  recordId: string,
  patch: Record<string, unknown>,
) {
  const rows = readCollection(collection);
  const i = rows.findIndex((r) => r._id === recordId);
  if (i === -1) return null;
  rows[i] = { ...rows[i], ...patch, updatedAt: new Date().toISOString() };
  writeCollection(collection, rows);
  return rows[i];
}

export function deleteLocal(collection: string, recordId: string) {
  const rows = readCollection(collection);
  const next = rows.filter((r) => r._id !== recordId);
  if (next.length === rows.length) return false;
  writeCollection(collection, next);
  return true;
}

export function seedLocalIfEmpty(
  collection: string,
  seed: Record<string, unknown>[],
) {
  const rows = readCollection(collection);
  if (rows.length > 0) return rows;
  const now = new Date().toISOString();
  const seeded = seed.map((s) => ({
    ...s,
    _id: (s._id as string) || id(),
    createdAt: now,
    updatedAt: now,
  }));
  writeCollection(collection, seeded);
  return seeded;
}

export function getLocalSingleton<T extends Record<string, unknown>>(
  collection: string,
  seed: T,
): T {
  const rows = readCollection<T>(collection);
  if (rows.length) return rows[0];
  writeCollection(collection, [seed]);
  return seed;
}

export function setLocalSingleton<T extends Record<string, unknown>>(
  collection: string,
  value: T,
): T {
  writeCollection(collection, [value]);
  return value;
}
