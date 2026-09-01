import type { ImgHTMLAttributes } from "react";

/** Minimal drop-in replacement for next/image's common usage. */
export function Img({
  src,
  alt = "",
  fill = false,
  priority = false,
  className,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={
        fill
          ? `absolute inset-0 h-full w-full ${className ?? ""}`
          : className
      }
      {...rest}
    />
  );
}
