
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ServiceCard, type ServiceCardItem } from "@/components/site/service-card";
import { cn } from "@/lib/utils";

type Filter = "all" | "accounting" | "it";

const TAB_KEYS: { key: Filter; i18n: string }[] = [
  { key: "all", i18n: "servicesExplorer.all" },
  { key: "accounting", i18n: "servicesExplorer.accounting" },
  { key: "it", i18n: "servicesExplorer.it" },
];

export function ServicesExplorer({
  services,
  initialCount = 8,
}: {
  services: ServiceCardItem[];
  initialCount?: number;
}) {
  const { t } = useTranslation();
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
        {TAB_KEYS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setFilter(tab.key);
              setExpanded(false);
            }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === tab.key
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-border bg-card text-muted-foreground hover:border-brand-200 hover:text-brand-700",
            )}
          >
            {t(tab.i18n)}
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
            {t("buttons.moreServices")}
          </button>
        </div>
      )}
    </div>
  );
}
