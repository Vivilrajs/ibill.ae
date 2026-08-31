"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, Check } from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
  handled?: boolean;
  createdAt?: string;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then((j) => setLeads(j.items ?? []))
      .catch(() => toast.error("Failed to load leads"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  async function toggle(lead: Lead) {
    const res = await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled: !lead.handled }),
    });
    if (res.ok) {
      setLeads((p) =>
        p.map((l) => (l.id === lead.id ? { ...l, handled: !l.handled } : l)),
      );
    } else toast.error("Update failed");
  }

  async function remove(lead: Lead) {
    if (!confirm("Delete this lead?")) return;
    const res = await fetch(`/api/admin/leads/${lead.id}`, { method: "DELETE" });
    if (res.ok) setLeads((p) => p.filter((l) => l.id !== lead.id));
    else toast.error("Delete failed");
  }

  return (
    <AdminPage title="Leads" description="Contact form submissions from the website.">
      {loading ? (
        <div className="grid place-items-center rounded-xl border border-border bg-card py-16">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
          No submissions yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {leads.map((l) => (
            <li
              key={l.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-ink">{l.name}</span>
                    {l.handled ? (
                      <Badge variant="secondary">Handled</Badge>
                    ) : (
                      <Badge>New</Badge>
                    )}
                    {l.source ? (
                      <span className="text-xs text-muted-foreground">
                        via {l.source}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <a href={`mailto:${l.email}`} className="hover:text-brand-600">
                      {l.email}
                    </a>
                    {l.phone ? ` · ${l.phone}` : ""}
                    {l.createdAt
                      ? ` · ${new Date(l.createdAt).toLocaleString("en-GB")}`
                      : ""}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggle(l)}
                  >
                    <Check className="size-4" />
                    {l.handled ? "Reopen" : "Mark handled"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(l)}
                    aria-label="Delete"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
                {l.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  );
}
