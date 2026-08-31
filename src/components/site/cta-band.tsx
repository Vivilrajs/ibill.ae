import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/motion";

export function CtaBand({
  title = "Ready to streamline your finances?",
  body = "Talk to our team about accounting and software solutions built around your business.",
  href = "/contact",
  cta = "Get a Consultation",
}: {
  title?: string;
  body?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <section className="container-x py-16">
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-brand-deep px-6 py-14 text-center sm:px-12 sm:py-16">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold text-white sm:text-3xl text-balance">
            {title}
          </h2>
          <p className="mt-3 text-white/75">{body}</p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-white text-[#1a5493] hover:bg-white/90"
          >
            <Link href={href}>
              {cta} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
