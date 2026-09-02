import { useEffect, useRef } from "react";

/**
 * Full-bleed muted background video for the home hero. Falls back to the poster
 * image when autoplay is blocked or the user prefers reduced motion. Retries
 * play() on mount and when the tab becomes visible again.
 */
export function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const tryPlay = () => {
      el.play().catch(() => {
        /* autoplay blocked - poster stays visible */
      });
    };
    tryPlay();

    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}
