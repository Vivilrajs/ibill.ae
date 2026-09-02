import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Link } from "@/lib/nav";
import { Img as Image } from "@/components/img";
import { cn } from "@/lib/utils";

/**
 * Brand logo. Two client-supplied lockups: `light_theme_logo.png` (dark artwork,
 * for light surfaces) and `dark_theme_logo.png` (white artwork, for dark
 * surfaces). `variant="inverted"` (header sitting over the dark hero video)
 * always uses the white lockup.
 */
export function Logo({
  className,
  href = "/",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "inverted";
  href?: string | null;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- next-themes hydration guard
  useEffect(() => setMounted(true), []);

  const dark =
    variant === "inverted" || (mounted && resolvedTheme === "dark");
  const src = dark ? "/dark_theme_logo.png" : "/light_theme_logo.png";

  const content = (
    <Image
      key={src}
      src={src}
      alt="IBILL Software FZ-LLC"
      width={2075}
      height={669}
      className={cn(
        "h-10 w-auto lg:h-11",
        dark && "drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]",
        className,
      )}
    />
  );

  if (!href) return content;
  return (
    <Link to={href} aria-label="IBILL - home" className="shrink-0">
      {content}
    </Link>
  );
}
