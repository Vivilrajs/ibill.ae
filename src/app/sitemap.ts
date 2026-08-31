import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getServices, getProducts, getPosts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/services/accounting",
    "/services/it",
    "/products",
    "/blog",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const [products, posts] = await Promise.all([getProducts(), getPosts()]);
  await getServices();

  return [
    ...staticRoutes,
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: new Date(),
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
    })),
  ];
}
