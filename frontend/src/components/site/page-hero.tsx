import { Link } from "react-router-dom";
import { Img as Image } from "@/components/img";
import { ChevronRight } from "lucide-react";
import { Kicker } from "@/components/site/primitives";
import { HeroIn } from "@/components/site/motion";

export function PageHero({
  kicker,
  title,
  body,
  crumbs = [],
  image,
}: {
  kicker?: string;
  title: string;
  body?: string;
  crumbs?: { label: string; href?: string }[];
  image?: string;
}) {
  return (
    <section className="relative -mt-16 overflow-hidden bg-[#0b1f33] pb-16 pt-32 text-white lg:-mt-20 lg:pb-20 lg:pt-40">
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-brand-deep opacity-[0.93] mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#0b1f33]/45" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-brand-deep" />
      )}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="container-x relative">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-white/60">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <ChevronRight className="size-3" />
              {c.href ? (
                <Link to={c.href} className="hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white/80">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <HeroIn className="mt-6 max-w-3xl">
          {kicker ? <Kicker className="text-brand-200">{kicker}</Kicker> : null}
          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-balance sm:text-5xl">
            {title}
          </h1>
          {body ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {body}
            </p>
          ) : null}
        </HeroIn>
      </div>
    </section>
  );
}
