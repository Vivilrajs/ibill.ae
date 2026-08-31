"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  variant = "default",
  className,
}: {
  variant?: "default" | "inverted";
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard next-themes hydration guard
  useEffect(() => setMounted(true), []);

  const current = theme ?? "light";
  const inverted = variant === "inverted";

  const options = [
    { key: "light", label: "Light mode", Icon: Sun },
    { key: "dark", label: "Dark mode", Icon: Moon },
  ] as const;

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border p-0.5",
        inverted
          ? "border-white/25 bg-white/10"
          : "border-border bg-secondary/60",
        className,
      )}
    >
      {options.map(({ key, label, Icon }) => {
        const isActive = mounted && current === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            title={label}
            onClick={() => setTheme(key)}
            className={cn(
              "grid size-7 place-items-center rounded-full transition-colors",
              isActive
                ? inverted
                  ? "bg-white text-[#1a5493]"
                  : "bg-card text-brand-600 shadow-sm"
                : inverted
                  ? "text-white/70 hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
