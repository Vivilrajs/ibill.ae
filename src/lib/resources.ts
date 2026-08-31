import { z } from "zod";
import type { Model } from "mongoose";
import {
  Service,
  Product,
  Post,
  TeamMember,
  Testimonial,
  Faq,
} from "@/lib/models";
import { SERVICES } from "@/lib/content/services";
import { PRODUCTS } from "@/lib/content/products";
import { POSTS } from "@/lib/content/posts";
import { TEAM } from "@/lib/content/team";
import { TESTIMONIALS } from "@/lib/content/testimonials";
import { FAQS } from "@/lib/content/faqs";
import type { Resource } from "@/lib/crud";

const M = <T,>(m: Model<T>) => m as unknown as Model<Record<string, unknown>>;

const slug = z.string().min(1).max(90).regex(/^[a-z0-9-]+$/, "lowercase, digits and hyphens only");
const strArr = z.array(z.string().max(200)).max(30);

const serviceCreate = z.object({
  slug,
  title: z.string().min(1).max(140),
  shortDescription: z.string().min(1).max(400),
  longDescription: z.string().max(4000).optional().default(""),
  category: z.enum(["accounting", "it"]),
  icon: z.string().max(40).optional().default("Sparkles"),
  image: z.string().max(500).optional().default(""),
  features: strArr.optional().default([]),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

const productCreate = z.object({
  slug,
  name: z.string().min(1).max(140),
  tagline: z.string().max(200).optional().default(""),
  description: z.string().max(4000).optional().default(""),
  externalUrl: z.string().max(500).optional().default(""),
  icon: z.string().max(40).optional().default("Sparkles"),
  image: z.string().max(500).optional().default(""),
  features: strArr.optional().default([]),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

const postCreate = z.object({
  slug,
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional().default(""),
  body: z.string().max(20000).optional().default(""),
  coverImage: z.string().max(500).optional().default(""),
  author: z.string().max(120).optional().default("IBILL"),
  publishedAt: z.string().optional(),
  published: z.boolean().optional().default(false),
});

const teamCreate = z.object({
  name: z.string().min(1).max(140),
  role: z.string().max(140).optional().default(""),
  photo: z.string().max(500).optional().default(""),
  bio: z.string().max(1000).optional().default(""),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

const testimonialCreate = z.object({
  quote: z.string().min(1).max(2000),
  authorName: z.string().min(1).max(140),
  authorTitle: z.string().max(140).optional().default(""),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

const faqCreate = z.object({
  question: z.string().min(1).max(300),
  answer: z.string().max(3000).optional().default(""),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

const partial = (s: z.ZodObject<z.ZodRawShape>) => s.partial();

export const RESOURCES: Record<string, Resource> = {
  services: {
    collection: "services",
    model: M(Service),
    seed: SERVICES as unknown as Record<string, unknown>[],
    createSchema: serviceCreate,
    updateSchema: partial(serviceCreate),
  },
  products: {
    collection: "products",
    model: M(Product),
    seed: PRODUCTS as unknown as Record<string, unknown>[],
    createSchema: productCreate,
    updateSchema: partial(productCreate),
  },
  posts: {
    collection: "posts",
    model: M(Post),
    seed: POSTS as unknown as Record<string, unknown>[],
    createSchema: postCreate,
    updateSchema: partial(postCreate),
    sort: { publishedAt: -1 },
  },
  team: {
    collection: "team",
    model: M(TeamMember),
    seed: TEAM as unknown as Record<string, unknown>[],
    createSchema: teamCreate,
    updateSchema: partial(teamCreate),
  },
  testimonials: {
    collection: "testimonials",
    model: M(Testimonial),
    seed: TESTIMONIALS as unknown as Record<string, unknown>[],
    createSchema: testimonialCreate,
    updateSchema: partial(testimonialCreate),
  },
  faqs: {
    collection: "faqs",
    model: M(Faq),
    seed: FAQS as unknown as Record<string, unknown>[],
    createSchema: faqCreate,
    updateSchema: partial(faqCreate),
  },
};

export type ResourceKey = keyof typeof RESOURCES;
