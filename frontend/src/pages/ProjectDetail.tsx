import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Navigate } from "@/lib/nav";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/primitives";
import { Media } from "@/components/site/media";
import { CtaBand } from "@/components/site/cta-band";
import { Button } from "@/components/ui/button";
import { Seo } from "@/lib/seo";
import { useProject } from "@/lib/queries";

export default function ProjectDetailPage() {
  const { t } = useTranslation("projects");
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useProject(slug);

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (isError || !project || project.published === false) {
    return <Navigate to="/404" replace />;
  }

  const meta = [
    { label: t("meta.client"), value: project.client },
    { label: t("meta.category"), value: project.category },
    { label: t("meta.year"), value: project.year },
    { label: t("meta.tags"), value: project.tags?.join(", ") },
  ].filter((m) => m.value);

  return (
    <>
      <Seo
        title={project.title}
        description={project.summary || project.description}
        path={`/projects/${project.slug}`}
      />
      <PageHero
        kicker={t("detailHeroKicker")}
        title={project.title}
        body={project.summary}
        image={project.coverImage || undefined}
        crumbs={[
          { label: t("listHeroKicker"), href: "/projects" },
          { label: project.title },
        ]}
      />

      <Section>
        <div className="container-x grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-brand-ink">
              {t("overview")}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
              {project.description
                .split(/\n{2,}/)
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
            {project.externalUrl && (
              <Button asChild className="mt-8">
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("visit")} <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                </a>
              </Button>
            )}
          </div>

          {meta.length > 0 && (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <dl className="grid gap-4 rounded-2xl border border-border bg-card p-6">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
                      {m.label}
                    </dt>
                    <dd className="mt-1 text-sm text-brand-ink">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}
        </div>
      </Section>

      {project.gallery && project.gallery.length > 0 && (
        <Section className="pt-0">
          <div className="container-x">
            <h2 className="font-heading text-2xl font-semibold text-brand-ink">
              {t("gallery")}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((src, i) => (
                <Media
                  key={src}
                  src={src}
                  alt={t("galleryAlt", { title: project.title, index: i + 1 })}
                  className="aspect-[16/10] w-full"
                />
              ))}
            </div>
          </div>
        </Section>
      )}

      <CtaBand
        title={t("detailCtaTitle")}
        body={t("detailCtaBody")}
        cta={t("detailCtaButton")}
      />
    </>
  );
}
