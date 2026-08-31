"use client";

import { useMemo, useState } from "react";
import { ServiceCard, type ServiceCardItem } from "@/components/site/service-card";
import { cn } from "@/lib/utils";

type Filter = "all" | "accounting" | "it";

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All Services" },
  { key: "accounting", label: "Accounting" },
  { key: "it", label: "IT Services" },
];

export function ServicesExplorer({
  services,
  initialCount = 8,
}: {
  services: ServiceCardItem[];
  initialCount?: number;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? services
        : services.filter((s) => s.category === filter),
    [filter, services],
  );

  const visible = expanded ? filtered : filtered.slice(0, initialCount);
  const hasMore = filtered.length > initialCount;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => {
              setFilter(t.key);
              setExpanded(false);
            }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === t.key
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-border bg-card text-muted-foreground hover:border-brand-200 hover:text-brand-700",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((s) => (
          <ServiceCard
            key={s.slug}
            service={s}
            href={`/services/${s.category === "it" ? "it" : "accounting"}#${s.slug}`}
          />
        ))}
      </div>

      {hasMore && !expanded && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-full border border-brand-200 px-6 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            More Services
          </button>
        </div>
      )}
    </div>
  );
}
