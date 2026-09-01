export interface PostSeed {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  published: boolean;
}

/**
 * The live site's blog only holds the default "Hello world!" placeholder, which
 * is dropped. Seeded empty - the client publishes articles from /admin/blog and
 * the blog index shows an empty state until then.
 */
export const POSTS: PostSeed[] = [];

export const BLOG_INTRO =
  "Stay ahead of the curve with our latest news. Get updates on industry developments. Stay informed.";
