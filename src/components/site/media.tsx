import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Image slot with a consistent blue duotone treatment. When `src` is empty it
 * renders a branded gradient placeholder with a faint grid motif, so layouts
 * look finished before real photography is dropped in.
 */
export function Media({
  src,
  alt = "",
  className,
  priority,
  rounded = "rounded-2xl",
}: {
  src?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  rounded?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden ring-1 ring-inset ring-black/5",
        rounded,
        className,
      )}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            priority={priority}
            className="object-cover"
          />
          <span className="pointer-events-none absolute inset-0 bg-brand-700/25 mix-blend-multiply" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-brand-deep">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "38px 38px",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.22),transparent_60%)]" />
        </div>
      )}
    </div>
  );
}
