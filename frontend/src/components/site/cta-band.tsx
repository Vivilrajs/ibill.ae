import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/nav";
import { Reveal } from "@/components/site/motion";

export function CtaBand({
  title,
  body,
  href = "/contact",
  cta,
}: {
  title?: ReactNode;
  body?: ReactNode;
  href?: string;
  cta?: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <section className="container-x py-16">
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-brand-deep px-6 py-14 text-center sm:px-12 sm:py-16">
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold text-white sm:text-3xl text-balance">
            {title ?? t("cta.title")}
          </h2>
          <p className="mt-3 text-white/75">{body ?? t("cta.body")}</p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-12 rounded-2xl px-6 text-[15px] ring-1 ring-white/25"
          >
            <Link to={href}>
              {cta ?? t("cta.button")}{" "}
              <ArrowRight className="size-4 rtl:-scale-x-100" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
