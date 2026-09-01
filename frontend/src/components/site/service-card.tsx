import { Link } from "@/lib/nav";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { IconTile } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

export interface ServiceCardItem {
  slug: string;
  title: string;
  shortDescription: string;
  category: "accounting" | "it";
  icon: string;
}

export function ServiceCard({
  service,
  href,
  className,
}: {
  service: ServiceCardItem;
  href: string;
  className?: string;
}) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <IconTile size="lg">
          <Icon name={service.icon} />
        </IconTile>
        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity rtl:-scale-x-100 group-hover:opacity-100" />
      </div>
      <div>
        <h3 className="font-heading text-lg font-semibold text-brand-ink">
          {service.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {service.shortDescription}
        </p>
      </div>
    </Link>
  );
}
