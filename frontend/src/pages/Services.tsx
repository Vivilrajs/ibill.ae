import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/nav";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading, IconTile } from "@/components/site/primitives";
import { Reveal } from "@/components/site/motion";
import { ServicesExplorer } from "@/components/site/services-explorer";
import { CtaBand } from "@/components/site/cta-band";
import { Icon } from "@/lib/icons";
import { SERVICE_CATEGORIES } from "@/lib/site";
import { Seo } from "@/lib/seo";
import { useServices } from "@/lib/queries";

export default function ServicesPage() {
  const { t } = useTranslation("services");
  const services = useServices().data ?? [];

  return (
    <>
      <Seo pageKey="services" path="/services" />
      <PageHero
        kicker={t("heroKicker")}
        title={t("heroTitle")}
        body={t("heroBody")}
        image="/images/hero.jpg"
        crumbs={[{ label: t("heroKicker") }]}
      />

      <Section>
        <div className="container-x grid gap-6 md:grid-cols-2">
          {SERVICE_CATEGORIES.map(({ key, href }) => {
            const count = services.filter((s) => s.category === key).length;
            return (
              <Reveal key={key}>
                <Link
                  to={href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-brand p-8 text-white shadow-soft ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:shadow-float"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(120%_120%_at_100%_0%,#fff,transparent_55%)]"
                    aria-hidden
                  />
                  <IconTile
                    size="lg"
                    className="relative bg-white/15 text-white ring-white/25"
                  >
                    <Icon name={key === "it" ? "Code2" : "BarChart3"} />
                  </IconTile>
                  <h2 className="relative mt-5 font-heading text-2xl font-semibold text-white">
                    {t(`categories.${key}.title`)}
                  </h2>
                  <p className="relative mt-2 flex-1 text-sm leading-relaxed text-white/80">
                    {t(`categories.${key}.intro`)}
                  </p>
                  <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    {t("common:buttons.viewServices", { count })}{" "}
                    <ArrowRight className="size-4 transition-transform rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section tint>
        <div className="container-x">
          <SectionHeading
            kicker={t("allKicker")}
            title={t("allTitle")}
            body={t("allBody")}
          />
          <div className="mt-10">
            <ServicesExplorer
              initialCount={12}
              services={services.map((s) => ({
                slug: s.slug,
                title: s.title,
                shortDescription: s.shortDescription,
                category: s.category,
                icon: s.icon,
              }))}
            />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
