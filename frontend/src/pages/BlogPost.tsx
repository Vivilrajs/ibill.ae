import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, Navigate } from "@/lib/nav";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/primitives";
import { Media } from "@/components/site/media";
import { CtaBand } from "@/components/site/cta-band";
import { Seo } from "@/lib/seo";
import { usePost } from "@/lib/queries";

export default function BlogPostPage() {
  const { t, i18n } = useTranslation("blog");
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = usePost(slug);

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (isError || !post || post.published === false) {
    return <Navigate to="/404" replace />;
  }

  const dateLocale = i18n.language === "ar" ? "ar-AE" : "en-GB";
  const paragraphs = post.body.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <Seo title={post.title} description={post.excerpt} path={`/blog/${post.slug}`} />
      <PageHero
        title={post.title}
        body={new Date(post.publishedAt).toLocaleDateString(dateLocale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        crumbs={[{ label: t("heroKicker"), href: "/blog" }, { label: post.title }]}
      />

      <Section>
        <article className="container-x max-w-3xl">
          {post.coverImage ? (
            <Media src={post.coverImage} className="mb-10 aspect-[16/9] w-full" />
          ) : null}
          <div className="space-y-5 text-base leading-relaxed text-foreground/90">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Link
            to="/blog"
            className="mt-12 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
          >
            <ArrowLeft className="size-4 rtl:-scale-x-100" /> {t("back")}
          </Link>
        </article>
      </Section>

      <CtaBand />
    </>
  );
}
