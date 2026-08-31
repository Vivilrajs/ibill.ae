import { NextResponse } from "next/server";
import { RESOURCES } from "@/lib/resources";
import { listHandler, createHandler } from "@/lib/crud";

function resolve(resource: string) {
  return RESOURCES[resource as keyof typeof RESOURCES] ?? null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  const res = resolve(resource);
  if (!res) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  return listHandler(res);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  const res = resolve(resource);
  if (!res) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  return createHandler(req, res);
}
