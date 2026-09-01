import { Navigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, IconTile } from "@/components/site/primitives";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { CtaBand } from "@/components/site/cta-band";
import { Icon } from "@/lib/icons";
import { SERVICE_CATEGORY_META } from "@/lib/pages-content";
import { Seo } from "@/lib/seo";
import { useServices } from "@/lib/queries";

type ServiceCategory = "accounting" | "it";

export default function ServiceCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const meta = SERVICE_CATEGORY_META[category as ServiceCategory];
  const services = (useServices().data ?? []).filter(
    (s) => s.category === category,
  );

  if (!meta) return <Navigate to="/404" replace />;

  return (
    <>
      <Seo title={meta.title} description={meta.intro} path={meta.href} />
      <PageHero
        kicker="Services"
        title={meta.title}
        body={meta.intro}
        image={category === "it" ? "/images/it.jpg" : "/images/accounting.jpg"}
        crumbs={[
          { label: "Services", href: "/services" },
          { label: meta.title },
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
                      Enquire about this service{" "}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-12 rounded-2xl border border-border bg-secondary/60 p-6 text-sm text-muted-foreground">
            Looking for{" "}
            <Link
              to={
                category === "accounting" ? "/services/it" : "/services/accounting"
              }
              className="font-semibold text-brand-600"
            >
              {category === "accounting" ? "IT Services" : "Accounting Services"}
            </Link>
            ? We cover both.
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
