import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/nav";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/primitives";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { Media } from "@/components/site/media";
import { CtaBand } from "@/components/site/cta-band";
import { Seo } from "@/lib/seo";
import { useProjects } from "@/lib/queries";

export default function ProjectsPage() {
  const { t } = useTranslation("projects");
  const projects = useProjects().data ?? [];

  return (
    <>
      <Seo pageKey="projects" path="/projects" />
      <PageHero
        kicker={t("listHeroKicker")}
        title={t("listHeroTitle")}
        body={t("listHeroBody")}
        image="/images/it.jpg"
        crumbs={[{ label: t("listHeroKicker") }]}
      />

      <Section>
        <div className="container-x">
          {projects.length > 0 ? (
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <StaggerItem key={p.id}>
                  <Link
                    to={`/projects/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-soft"
                  >
                    <Media
                      src={p.coverImage}
                      className="aspect-[16/10] w-full"
                      rounded="rounded-none"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      {p.client ? (
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
                          {p.client}
                          {p.year ? ` · ${p.year}` : ""}
                        </p>
                      ) : null}
                      <h2 className="mt-2 font-heading text-xl font-semibold text-brand-ink group-hover:text-brand-600">
                        {p.title}
                      </h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {p.summary}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                        {t("viewProject")}{" "}
                        <ArrowRight className="size-4 transition-transform rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              {t("empty")}
            </p>
          )}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
