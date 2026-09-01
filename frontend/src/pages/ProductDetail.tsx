import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { Link, Navigate } from "@/lib/nav";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/primitives";
import { Media } from "@/components/site/media";
import { CtaBand } from "@/components/site/cta-band";
import { Button } from "@/components/ui/button";
import { Seo } from "@/lib/seo";
import { useProduct } from "@/lib/queries";

export default function ProductDetailPage() {
  const { t } = useTranslation("products");
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
        kicker={t("detailHeroKicker")}
        title={product.name}
        body={product.tagline}
        image={product.heroImage || undefined}
        crumbs={[
          { label: t("listHeroKicker"), href: "/products" },
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
                  {t("detailOpen", { name: product.name })}{" "}
                  <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                </a>
              </Button>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Media src={product.image} className="aspect-[4/3] w-full" />
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading font-semibold text-brand-ink">
                {t("detailInterestedTitle", { name: product.name })}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("detailInterestedBody")}
              </p>
              <Button asChild className="mt-4 w-full">
                <Link to="/contact">{t("detailRequestDemo")}</Link>
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      {product.gallery && product.gallery.length > 0 && (
        <Section className="pt-0">
          <div className="container-x">
            <h2 className="font-heading text-2xl font-semibold text-brand-ink">
              {t("screenshots")}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {product.gallery.map((src, i) => (
                <Media
                  key={src}
                  src={src}
                  alt={t("screenshotAlt", { name: product.name, index: i + 1 })}
                  className="aspect-[16/10] w-full"
                />
              ))}
            </div>
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
