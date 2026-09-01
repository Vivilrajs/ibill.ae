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
                  className="group flex h-full flex-col rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft"
                >
                  <IconTile size="lg">
                    <Icon name={key === "it" ? "Code2" : "BarChart3"} />
                  </IconTile>
                  <h2 className="mt-5 font-heading text-2xl font-semibold text-brand-ink">
                    {t(`categories.${key}.title`)}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {t(`categories.${key}.intro`)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
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
