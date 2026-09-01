
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAdminSettings, useSaveSettings } from "@/lib/queries";
import type { SiteSettings as Settings } from "@/lib/types";

export function SettingsForm() {
  const { data: loaded } = useAdminSettings();
  const saveMutation = useSaveSettings();
  const [data, setData] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loaded) setData(loaded);
  }, [loaded]);

  if (!data) {
    return (
      <div className="grid place-items-center rounded-xl border border-border bg-card py-16">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  function set<K extends keyof Settings>(k: K, v: Settings[K]) {
    setData((d) => (d ? { ...d, [k]: v } : d));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      await saveMutation.mutateAsync({
        ...data,
        workHours: data.workHours.filter(Boolean),
        statExperienceYears: Number(data.statExperienceYears) || 0,
        statProjectsDone: Number(data.statProjectsDone) || 0,
        statHappyClients: Number(data.statHappyClients) || 0,
      });
      toast.success("Settings saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-8">
      <fieldset className="space-y-4 rounded-xl border border-border bg-card p-6">
        <legend className="px-1 text-sm font-semibold text-brand-ink">
          Contact details
        </legend>
        <Row label="Phone">
          <Input value={data.phone} onChange={(e) => set("phone", e.target.value)} />
        </Row>
        <Row label="Email">
          <Input value={data.email} onChange={(e) => set("email", e.target.value)} />
        </Row>
        <Row label="Address">
          <Input value={data.address} onChange={(e) => set("address", e.target.value)} />
        </Row>
        <Row label="Map search query">
          <Input value={data.mapQuery} onChange={(e) => set("mapQuery", e.target.value)} />
        </Row>
        <Row label="Work hours (one per line)">
          <Textarea
            rows={3}
            value={data.workHours.join("\n")}
            onChange={(e) => set("workHours", e.target.value.split("\n"))}
          />
        </Row>
        <Row label="Company blurb">
          <Textarea
            rows={3}
            value={data.companyBlurb}
            onChange={(e) => set("companyBlurb", e.target.value)}
          />
        </Row>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-card p-6">
        <legend className="px-1 text-sm font-semibold text-brand-ink">
          Social links
        </legend>
        {(["facebook", "instagram", "twitter", "youtube"] as const).map((k) => (
          <Row key={k} label={k[0].toUpperCase() + k.slice(1)}>
            <Input value={data[k]} onChange={(e) => set(k, e.target.value)} />
          </Row>
        ))}
      </fieldset>

      <fieldset className="grid gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-3">
        <legend className="px-1 text-sm font-semibold text-brand-ink">
          Homepage counters
        </legend>
        <Row label="Years of experience">
          <Input
            type="number"
            value={data.statExperienceYears}
            onChange={(e) => set("statExperienceYears", Number(e.target.value))}
          />
        </Row>
        <Row label="Projects done">
          <Input
            type="number"
            value={data.statProjectsDone}
            onChange={(e) => set("statProjectsDone", Number(e.target.value))}
          />
        </Row>
        <Row label="Happy clients">
          <Input
            type="number"
            value={data.statHappyClients}
            onChange={(e) => set("statHappyClients", Number(e.target.value))}
          />
        </Row>
      </fieldset>

      <Button type="submit" disabled={saving}>
        {saving ? <Loader2 className="size-4 animate-spin" /> : "Save settings"}
      </Button>
    </form>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
