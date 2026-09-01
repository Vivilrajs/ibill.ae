import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/motion";

export function Section({
  children,
  className,
  id,
  tint,
  ledger,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tint?: boolean;
  ledger?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 sm:py-24 lg:py-28",
        tint && "bg-secondary/60",
        ledger && "ledger-lines",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Kicker({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600",
        className,
      )}
    >
      <span className="h-px w-6 bg-brand-400" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  kicker,
  title,
  body,
  align = "left",
  className,
}: {
  kicker?: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <h2 className="mt-4 text-3xl font-semibold text-brand-ink sm:text-4xl text-balance">
        {title}
      </h2>
      {body ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
          {body}
        </p>
      ) : null}
    </Reveal>
  );
}

export function IconTile({
  children,
  className,
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100",
        size === "sm" && "size-9 [&_svg]:size-4",
        size === "md" && "size-12 [&_svg]:size-5",
        size === "lg" && "size-14 [&_svg]:size-6",
        className,
      )}
    >
      {children}
    </span>
  );
}
