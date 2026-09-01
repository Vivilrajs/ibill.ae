import { Navigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/primitives";
import { Media } from "@/components/site/media";
import { CtaBand } from "@/components/site/cta-band";
import { Button } from "@/components/ui/button";
import { Seo } from "@/lib/seo";
import { useProduct } from "@/lib/queries";

export default function ProductDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug);

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (isError || !product || product.published === false) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <Seo
        title={product.name}
        description={product.tagline || product.description}
        path={`/products/${product.slug}`}
      />
      <PageHero
        kicker="Product"
        title={product.name}
        body={product.tagline}
        crumbs={[
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />

      <Section>
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {product.features.length > 0 && (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span className="grid size-5 place-items-center rounded-full bg-brand-50 text-brand-600">
                      <Check className="size-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {product.externalUrl && (
              <Button
                asChild
                className="mt-8 bg-gradient-brand text-white hover:opacity-95"
              >
                <a
                  href={product.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open {product.name} <ArrowUpRight className="size-4" />
                </a>
              </Button>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Media src={product.image} className="aspect-[4/3] w-full" />
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading font-semibold text-brand-ink">
                Interested in {product.name}?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Get a walkthrough and pricing for your business.
              </p>
              <Button asChild className="mt-4 w-full">
                <Link to="/contact">Request a demo</Link>
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
