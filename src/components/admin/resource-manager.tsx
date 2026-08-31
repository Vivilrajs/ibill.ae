"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ICON_NAMES } from "@/lib/icons";

export type Field =
  | { name: string; label: string; type: "text" | "textarea" | "number" | "url"; required?: boolean; help?: string }
  | { name: string; label: string; type: "boolean" }
  | { name: string; label: string; type: "select"; options: string[] }
  | { name: string; label: string; type: "icon" }
  | { name: string; label: string; type: "stringList"; help?: string };

export interface ResourceConfig {
  resource: string;
  singular: string;
  fields: Field[];
  columns: string[];
  defaults: Record<string, unknown>;
}

type Item = Record<string, unknown> & { id: string };

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${config.resource}`);
      const json = await res.json();
      setItems(json.items ?? []);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.resource]);

  const open = creating || editing !== null;
  const current = editing ?? (config.defaults as Item);

  async function submit(values: Record<string, unknown>) {
    setSaving(true);
    try {
      const isEdit = editing !== null;
      const res = await fetch(
        `/api/admin/${config.resource}${isEdit ? `/${editing!.id}` : ""}`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Save failed");
      toast.success(isEdit ? "Updated" : "Created");
      setEditing(null);
      setCreating(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Item) {
    if (!confirm(`Delete this ${config.singular}?`)) return;
    try {
      const res = await fetch(`/api/admin/${config.resource}/${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? config.singular : `${config.singular}s`}
        </p>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="size-4" /> Add {config.singular}
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((c) => (
                <TableHead key={c} className="capitalize">
                  {c === "published" ? "Status" : c}
                </TableHead>
              ))}
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={config.columns.length + 1} className="py-10 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={config.columns.length + 1}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Nothing yet. Click &ldquo;Add {config.singular}&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  {config.columns.map((c) => (
                    <TableCell key={c} className="max-w-xs">
                      {c === "published" ? (
                        <Badge variant={item.published === false ? "secondary" : "default"}>
                          {item.published === false ? "Draft" : "Published"}
                        </Badge>
                      ) : (
                        <span className="line-clamp-2 text-sm">
                          {String(
                            Array.isArray(item[c])
                              ? (item[c] as string[]).join(", ")
                              : (item[c] ?? "-"),
                          )}
                        </span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(item)}
                        aria-label="Edit"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(item)}
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) {
            setEditing(null);
            setCreating(false);
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${config.singular}` : `New ${config.singular}`}
            </DialogTitle>
          </DialogHeader>
          <ResourceForm
            key={editing?.id ?? "new"}
            fields={config.fields}
            initial={current}
            saving={saving}
            onSubmit={submit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ResourceForm({
  fields,
  initial,
  saving,
  onSubmit,
}: {
  fields: Field[];
  initial: Record<string, unknown>;
  saving: boolean;
  onSubmit: (values: Record<string, unknown>) => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const v: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = initial[f.name];
      if (f.type === "stringList")
        v[f.name] = Array.isArray(raw) ? (raw as string[]).join("\n") : raw ?? "";
      else v[f.name] = raw ?? (f.type === "boolean" ? true : f.type === "number" ? 0 : "");
    }
    return v;
  });

  function set(name: string, value: unknown) {
    setValues((p) => ({ ...p, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      const v = values[f.name];
      if (f.type === "number") out[f.name] = Number(v) || 0;
      else if (f.type === "boolean") out[f.name] = Boolean(v);
      else if (f.type === "stringList")
        out[f.name] = String(v || "")
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean);
      else out[f.name] = String(v ?? "");
    }
    onSubmit(out);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((f) => (
        <div key={f.name} className="space-y-1.5">
          {f.type !== "boolean" && <Label htmlFor={f.name}>{f.label}</Label>}
          {f.type === "text" || f.type === "url" || f.type === "number" ? (
            <Input
              id={f.name}
              type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
              value={String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)}
            />
          ) : f.type === "textarea" ? (
            <Textarea
              id={f.name}
              rows={4}
              value={String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)}
            />
          ) : f.type === "stringList" ? (
            <Textarea
              id={f.name}
              rows={3}
              placeholder="One per line"
              value={String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)}
            />
          ) : f.type === "select" ? (
            <select
              id={f.name}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
              value={String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)}
            >
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : f.type === "icon" ? (
            <select
              id={f.name}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
              value={String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)}
            >
              {ICON_NAMES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : f.type === "boolean" ? (
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-brand-600"
                checked={Boolean(values[f.name])}
                onChange={(e) => set(f.name, e.target.checked)}
              />
              {f.label}
            </label>
          ) : null}
          {"help" in f && f.help ? (
            <p className="text-xs text-muted-foreground">{f.help}</p>
          ) : null}
        </div>
      ))}
      <DialogFooter>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}

