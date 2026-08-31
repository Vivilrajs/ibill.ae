import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brand logo - the client-supplied lockup at /public/agents.png. The artwork is
 * navy/blue on transparent, so it always sits on a white chip to stay legible on
 * any header background (light, dark, or transparent over the hero).
 */
export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  /** Accepted for call-site compatibility; the white chip works on every surface. */
  variant?: "default" | "inverted";
  href?: string | null;
}) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center rounded-lg bg-white px-2.5 py-1.5 ring-1 ring-black/5",
        className,
      )}
    >
      <Image
        src="/agents.png"
        alt="IBILL Software FZ-LLC"
        width={365}
        height={358}
        className="h-11 w-auto lg:h-12"
      />
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} aria-label="IBILL - home" className="shrink-0">
      {content}
    </Link>
  );
}
