import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading, IconTile } from "@/components/site/primitives";
import { Reveal } from "@/components/site/motion";
import { ServicesExplorer } from "@/components/site/services-explorer";
import { CtaBand } from "@/components/site/cta-band";
import { Icon } from "@/lib/icons";
import { SERVICE_CATEGORY_META } from "@/lib/pages-content";


import { Seo } from "@/lib/seo";
import { useServices } from "@/lib/queries";


export default function ServicesPage() {
  const services = useServices().data ?? [];

  return (
    <>
      <Seo title="Services" path="/services" />
      <PageHero
        kicker="Our Services"
        title="Expert services for every part of your business"
        body="We offer a range of expert services to meet the unique needs of your business."
        image="/images/hero.jpg"
        crumbs={[{ label: "Services" }]}
      />

      <Section>
        <div className="container-x grid gap-6 md:grid-cols-2">
          {Object.entries(SERVICE_CATEGORY_META).map(([key, meta]) => {
            const count = services.filter((s) => s.category === key).length;
            return (
              <Reveal key={key}>
                <Link
                  to={meta.href}
                  className="group flex h-full flex-col rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft"
                >
                  <IconTile size="lg">
                    <Icon name={key === "it" ? "Code2" : "BarChart3"} />
                  </IconTile>
                  <h2 className="mt-5 font-heading text-2xl font-semibold text-brand-ink">
                    {meta.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {meta.intro}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                    View {count} services{" "}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
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
            kicker="All Services"
            title="Browse the full range"
            body="Filter by category or explore everything we do in one place."
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
