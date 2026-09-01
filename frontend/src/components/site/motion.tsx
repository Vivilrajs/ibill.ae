
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

/**
 * Lightweight scroll-reveal. Content is visible by default; the entrance
 * animation is a progressive enhancement, so a stalled observer or disabled
 * JS never leaves a section blank.
 */
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (
      !el ||
      reduce ||
      typeof IntersectionObserver === "undefined" ||
      document.visibilityState === "hidden"
    ) {
      setShown(true);
      return;
    }

    // Already on screen at mount - show immediately, no entrance animation.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setShown(true);
      return;
    }

    setArmed(true);

    // Safety: reveal no matter what after a short delay.
    const safety = window.setTimeout(() => setShown(true), 900 + delay);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          window.setTimeout(() => setShown(true), delay);
          io.disconnect();
          window.clearTimeout(safety);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, [delay]);

  return { ref, shown, armed };
}

const base: CSSProperties = {
  transition:
    "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
};

export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, shown, armed } = useReveal(delay * 1000);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...base,
        opacity: !armed || shown ? 1 : 0,
        transform: !armed || shown ? "none" : `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
}

export function HeroIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || document.visibilityState === "hidden") {
      setShown(true);
      return;
    }
    setArmed(true);
    const t = window.setTimeout(() => setShown(true), 60 + delay * 1000);
    const safety = window.setTimeout(() => setShown(true), 900);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(safety);
    };
  }, [delay]);

  const visible = !armed || shown;
  return (
    <div
      className={className}
      style={{
        ...base,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(14px)",
      }}
    >
      {children}
    </div>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  delay?: number;
}) {
  // Each StaggerItem reveals via its own observer; this is a layout passthrough.
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
  id,
  y = 14,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  y?: number;
}) {
  // Items reveal via their own observer for simplicity and robustness.
  const { ref, shown, armed } = useReveal(0);
  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={{
        ...base,
        opacity: !armed || shown ? 1 : 0,
        transform: !armed || shown ? "none" : `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
}
