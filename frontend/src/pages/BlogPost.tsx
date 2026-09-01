import { Navigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/primitives";
import { Media } from "@/components/site/media";
import { CtaBand } from "@/components/site/cta-band";
import { Seo } from "@/lib/seo";
import { usePost } from "@/lib/queries";

export default function BlogPostPage() {
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

  const paragraphs = post.body.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <Seo title={post.title} description={post.excerpt} path={`/blog/${post.slug}`} />
      <PageHero
        title={post.title}
        body={new Date(post.publishedAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        crumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
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
            <ArrowLeft className="size-4" /> Back to all articles
          </Link>
        </article>
      </Section>

      <CtaBand />
    </>
  );
}
