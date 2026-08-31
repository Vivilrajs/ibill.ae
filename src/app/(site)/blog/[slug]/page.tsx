import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/primitives";
import { Media } from "@/components/site/media";
import { CtaBand } from "@/components/site/cta-band";
import { getPosts, getPostBySlug } from "@/lib/data";

export async function generateStaticParams() {
  const posts = await getPosts({ admin: true });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const paragraphs = post.body.split(/\n{2,}/).filter(Boolean);

  return (
    <>
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
            href="/blog"
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
