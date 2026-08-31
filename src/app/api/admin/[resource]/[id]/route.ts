import { NextResponse } from "next/server";
import { RESOURCES } from "@/lib/resources";
import { updateHandler, deleteHandler } from "@/lib/crud";

function resolve(resource: string) {
  return RESOURCES[resource as keyof typeof RESOURCES] ?? null;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const { resource, id } = await params;
  const res = resolve(resource);
  if (!res) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  return updateHandler(req, id, res);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const { resource, id } = await params;
  const res = resolve(resource);
  if (!res) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  return deleteHandler(id, res);
}
