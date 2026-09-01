import { Link } from "react-router-dom";
import { ArrowRight, Newspaper } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, IconTile } from "@/components/site/primitives";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { Media } from "@/components/site/media";
import { CtaBand } from "@/components/site/cta-band";
import { BLOG_INTRO } from "@/lib/pages-content";



function fmt(d: string | Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
import { Seo } from "@/lib/seo";
import { usePosts } from "@/lib/queries";


export default function BlogPage() {
  const posts = usePosts().data ?? [];
  const [feature, ...rest] = posts;

  return (
    <>
      <Seo title="Blog" path="/blog" />
      <PageHero
        kicker="Our Blog"
        title="Blog & Articles"
        body={BLOG_INTRO}
        crumbs={[{ label: "Blog" }]}
      />

      <Section>
        <div className="container-x">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-md rounded-3xl border border-dashed border-border bg-card p-10 text-center">
              <IconTile size="lg" className="mx-auto">
                <Newspaper />
              </IconTile>
              <h2 className="mt-5 font-heading text-lg font-semibold text-brand-ink">
                Articles are on the way
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;re preparing news and guidance on accounting, tax and
                software. Check back soon.
              </p>
            </div>
          ) : (
            <>
              <Link
                to={`/blog/${feature.slug}`}
                className="group grid overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-2"
              >
                <Media src={feature.coverImage} className="aspect-[16/10] md:aspect-auto" rounded="rounded-none" />
                <div className="p-8">
                  <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                    {fmt(feature.publishedAt)}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold text-brand-ink group-hover:text-brand-600">
                    {feature.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {feature.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                    Read more <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>

              {rest.length > 0 && (
                <Stagger className="mt-8 grid gap-6 md:grid-cols-3">
                  {rest.map((p) => (
                    <StaggerItem key={p.id}>
                      <Link
                        to={`/blog/${p.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-border bg-card p-2"
                      >
                        <Media src={p.coverImage} className="aspect-[16/10]" rounded="rounded-xl" />
                        <div className="flex flex-1 flex-col p-4">
                          <p className="text-xs text-muted-foreground">
                            {fmt(p.publishedAt)}
                          </p>
                          <h3 className="mt-1.5 font-heading font-semibold text-brand-ink group-hover:text-brand-600">
                            {p.title}
                          </h3>
                          <p className="mt-1 line-clamp-3 flex-1 text-sm text-muted-foreground">
                            {p.excerpt}
                          </p>
                        </div>
                      </Link>
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </>
          )}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
