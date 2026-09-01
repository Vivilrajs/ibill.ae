import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Link, Navigate } from "@/lib/nav";
import { PageHero } from "@/components/site/page-hero";
import { Section, IconTile } from "@/components/site/primitives";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { CtaBand } from "@/components/site/cta-band";
import { Icon } from "@/lib/icons";
import { Seo } from "@/lib/seo";
import { useServices } from "@/lib/queries";

type ServiceCategory = "accounting" | "it";

export default function ServiceCategoryPage() {
  const { t } = useTranslation("services");
  const { category } = useParams<{ category: string }>();
  const isValid = category === "accounting" || category === "it";
  const services = (useServices().data ?? []).filter(
    (s) => s.category === category,
  );

  if (!isValid) return <Navigate to="/404" replace />;
  const cat = category as ServiceCategory;
  const other: ServiceCategory = cat === "accounting" ? "it" : "accounting";
  const title = t(`categories.${cat}.title`);
  const intro = t(`categories.${cat}.intro`);

  return (
    <>
      <Seo
        pageKey={cat === "it" ? "servicesIt" : "servicesAccounting"}
        path={`/services/${cat}`}
      />
      <PageHero
        kicker={t("categoryHeroKicker")}
        title={title}
        body={intro}
        image={cat === "it" ? "/images/it.jpg" : "/images/accounting.jpg"}
        crumbs={[
          { label: t("heroKicker"), href: "/services" },
          { label: title },
        ]}
      />

      <Section>
        <div className="container-x">
          <Stagger className="grid gap-6 sm:grid-cols-2">
            {services.map((s) => (
              <StaggerItem key={s.id} id={s.slug}>
                <div className="flex h-full scroll-mt-28 gap-5 rounded-2xl border border-border bg-card p-6">
                  <IconTile size="lg">
                    <Icon name={s.icon} />
                  </IconTile>
                  <div>
                    <h2 className="font-heading text-lg font-semibold text-brand-ink">
                      {s.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {s.shortDescription}
                    </p>
                    {s.longDescription ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {s.longDescription}
                      </p>
                    ) : null}
                    <Link
                      to="/contact"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
                    >
                      {t("common:buttons.enquireService")}{" "}
                      <ArrowRight className="size-3.5 rtl:-scale-x-100" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-12 rounded-2xl border border-border bg-secondary/60 p-6 text-sm text-muted-foreground">
            {t("coverBothPrefix")}
            <Link
              to={`/services/${other}`}
              className="font-semibold text-brand-600"
            >
              {t(`categories.${other}.title`)}
            </Link>
            {t("coverBothSuffix")}
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
