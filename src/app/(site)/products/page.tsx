import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, IconTile } from "@/components/site/primitives";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { CtaBand } from "@/components/site/cta-band";
import { Icon } from "@/lib/icons";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Software products built by IBILL, including Salon Assist - productivity and revenue tracking for salon owners.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <PageHero
        kicker="Products"
        title="Software built to run your business"
        body="Purpose-built applications from the IBILL software team."
        image="/images/it.jpg"
        crumbs={[{ label: "Products" }]}
      />

      <Section>
        <div className="container-x">
          <Stagger className="grid gap-6 md:grid-cols-2">
            {products.map((p) => (
              <StaggerItem key={p.id}>
                <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8">
                  <IconTile size="lg">
                    <Icon name={p.icon} />
                  </IconTile>
                  <h2 className="mt-5 font-heading text-2xl font-semibold text-brand-ink">
                    {p.name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-brand-600">
                    {p.tagline}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/products/${p.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Learn more <ArrowRight className="size-4" />
                    </Link>
                    {p.externalUrl ? (
                      <a
                        href={p.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                      >
                        Visit site <ArrowUpRight className="size-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <CtaBand
        title="Need a custom application?"
        body="We build billing software, mobile apps and websites tailored to your operations."
        cta="Talk to our team"
      />
    </>
  );
}
