import { z, type ZodType } from 'zod';
import { MODELS } from '../schemas/schemas';
import { SERVICES } from '../seed/content/services';
import { PRODUCTS } from '../seed/content/products';
import { POSTS } from '../seed/content/posts';
import { TEAM } from '../seed/content/team';
import { TESTIMONIALS } from '../seed/content/testimonials';
import { FAQS } from '../seed/content/faqs';

const slug = z
  .string()
  .min(1)
  .max(90)
  .regex(/^[a-z0-9-]+$/, 'lowercase, digits and hyphens only');
const strArr = z.array(z.string().max(200)).max(30);

const serviceCreate = z.object({
  slug,
  title: z.string().min(1).max(140),
  shortDescription: z.string().min(1).max(400),
  longDescription: z.string().max(4000).optional().default(''),
  category: z.enum(['accounting', 'it']),
  icon: z.string().max(40).optional().default('Sparkles'),
  image: z.string().max(500).optional().default(''),
  features: strArr.optional().default([]),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

const productCreate = z.object({
  slug,
  name: z.string().min(1).max(140),
  tagline: z.string().max(200).optional().default(''),
  description: z.string().max(4000).optional().default(''),
  externalUrl: z.string().max(500).optional().default(''),
  icon: z.string().max(40).optional().default('Sparkles'),
  image: z.string().max(500).optional().default(''),
  features: strArr.optional().default([]),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

const postCreate = z.object({
  slug,
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional().default(''),
  body: z.string().max(20000).optional().default(''),
  coverImage: z.string().max(500).optional().default(''),
  author: z.string().max(120).optional().default('IBILL'),
  publishedAt: z.string().optional(),
  published: z.boolean().optional().default(false),
});

const teamCreate = z.object({
  name: z.string().min(1).max(140),
  role: z.string().max(140).optional().default(''),
  photo: z.string().max(500).optional().default(''),
  bio: z.string().max(1000).optional().default(''),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

const testimonialCreate = z.object({
  quote: z.string().min(1).max(2000),
  authorName: z.string().min(1).max(140),
  authorTitle: z.string().max(140).optional().default(''),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

const faqCreate = z.object({
  question: z.string().min(1).max(300),
  answer: z.string().max(3000).optional().default(''),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const partial = (s: any) => s.partial();

export interface ResourceDef {
  model: string;
  seed: Record<string, unknown>[];
  createSchema: ZodType;
  updateSchema: ZodType;
  sort: Record<string, 1 | -1>;
}

export const RESOURCES: Record<string, ResourceDef> = {
  services: {
    model: MODELS.Service,
    seed: SERVICES as unknown as Record<string, unknown>[],
    createSchema: serviceCreate,
    updateSchema: partial(serviceCreate),
    sort: { order: 1, createdAt: -1 },
  },
  products: {
    model: MODELS.Product,
    seed: PRODUCTS as unknown as Record<string, unknown>[],
    createSchema: productCreate,
    updateSchema: partial(productCreate),
    sort: { order: 1, createdAt: -1 },
  },
  posts: {
    model: MODELS.Post,
    seed: POSTS as unknown as Record<string, unknown>[],
    createSchema: postCreate,
    updateSchema: partial(postCreate),
    sort: { publishedAt: -1 },
  },
  team: {
    model: MODELS.TeamMember,
    seed: TEAM as unknown as Record<string, unknown>[],
    createSchema: teamCreate,
    updateSchema: partial(teamCreate),
    sort: { order: 1, createdAt: -1 },
  },
  testimonials: {
    model: MODELS.Testimonial,
    seed: TESTIMONIALS as unknown as Record<string, unknown>[],
    createSchema: testimonialCreate,
    updateSchema: partial(testimonialCreate),
    sort: { order: 1, createdAt: -1 },
  },
  faqs: {
    model: MODELS.Faq,
    seed: FAQS as unknown as Record<string, unknown>[],
    createSchema: faqCreate,
    updateSchema: partial(faqCreate),
    sort: { order: 1, createdAt: -1 },
  },
};

export type ResourceKey = keyof typeof RESOURCES;
export const RESOURCE_KEYS = Object.keys(RESOURCES) as ResourceKey[];
