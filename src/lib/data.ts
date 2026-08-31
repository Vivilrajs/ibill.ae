import { connectDB, hasMongo } from "@/lib/mongodb";
import {
  Service,
  Product,
  Post,
  TeamMember,
  Testimonial,
  Faq,
  SiteSettings,
  Lead,
  type IService,
  type IProduct,
  type IPost,
  type ITeamMember,
  type ITestimonial,
  type IFaq,
  type ISiteSettings,
  type ILead,
} from "@/lib/models";
import type { Model } from "mongoose";
import {
  readCollection,
  seedLocalIfEmpty,
  getLocalSingleton,
} from "@/lib/local-db";
import { SERVICES } from "@/lib/content/services";
import { PRODUCTS } from "@/lib/content/products";
import { POSTS } from "@/lib/content/posts";
import { TEAM } from "@/lib/content/team";
import { TESTIMONIALS } from "@/lib/content/testimonials";
import { FAQS } from "@/lib/content/faqs";
import { SITE_SETTINGS } from "@/lib/content/settings";

export type WithId<T> = T & { id: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

function normalize<T>(row: Any): WithId<T> {
  const id = String(row?._id ?? row?.id ?? "");
  return { ...(row as T), id };
}

const sortByOrder = (rows: Any[]) =>
  [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

function fromSeed<T>(seed: Any[], admin: boolean): WithId<T>[] {
  const filtered = admin ? seed : seed.filter((r) => r.published !== false);
  return sortByOrder(filtered).map((r, i) =>
    normalize<T>({ ...r, _id: `seed_${i}` }),
  );
}

interface ListOpts {
  admin?: boolean;
}

/**
 * Read a collection.
 * - MONGODB_URI set  -> MongoDB is the source of truth. On a transient failure
 *   we serve the read-only seed content so the public site stays up, but we
 *   never read the local file store (avoids a stale split brain).
 * - MONGODB_URI unset -> local file store (`.data/*.json`), for local dev only.
 */
async function list<T>(
  collection: string,
  Mdl: Model<Any>,
  seed: Any[],
  { admin = false }: ListOpts = {},
): Promise<WithId<T>[]> {
  if (hasMongo) {
    try {
      const conn = await connectDB();
      if (!conn) throw new Error("no connection");
      if ((await Mdl.estimatedDocumentCount()) === 0 && seed.length) {
        await Mdl.insertMany(seed);
      }
      const query = admin ? {} : { published: true };
      const rows = await Mdl.find(query)
        .sort({ order: 1, createdAt: -1 })
        .lean();
      return (rows as Any[]).map((r) => normalize<T>(r));
    } catch (err) {
      console.error(
        `data.list(${collection}) MongoDB unavailable - serving seed content:`,
        err,
      );
      return fromSeed<T>(seed, admin);
    }
  }

  try {
    const rows = seedLocalIfEmpty(collection, seed) as Any[];
    const filtered = admin ? rows : rows.filter((r) => r.published !== false);
    return sortByOrder(filtered).map((r) => normalize<T>(r));
  } catch {
    return fromSeed<T>(seed, admin);
  }
}

export const getServices = (o?: ListOpts) =>
  list<IService>("services", Service as Model<Any>, SERVICES as Any[], o);

export const getProducts = (o?: ListOpts) =>
  list<IProduct>("products", Product as Model<Any>, PRODUCTS as Any[], o);

export const getPosts = (o?: ListOpts) =>
  list<IPost>("posts", Post as Model<Any>, POSTS as Any[], o);

export const getTeam = (o?: ListOpts) =>
  list<ITeamMember>("team", TeamMember as Model<Any>, TEAM as Any[], o);

export const getTestimonials = (o?: ListOpts) =>
  list<ITestimonial>(
    "testimonials",
    Testimonial as Model<Any>,
    TESTIMONIALS as Any[],
    o,
  );

export const getFaqs = (o?: ListOpts) =>
  list<IFaq>("faqs", Faq as Model<Any>, FAQS as Any[], o);

export async function getServiceBySlug(slug: string) {
  return (await getServices({ admin: true })).find((s) => s.slug === slug) ?? null;
}
export async function getProductBySlug(slug: string) {
  return (await getProducts({ admin: true })).find((p) => p.slug === slug) ?? null;
}
export async function getPostBySlug(slug: string) {
  return (await getPosts({ admin: true })).find((p) => p.slug === slug) ?? null;
}

export async function getSettings(): Promise<ISiteSettings> {
  if (hasMongo) {
    try {
      const conn = await connectDB();
      if (!conn) throw new Error("no connection");
      const existing = await SiteSettings.findOne({ key: "default" }).lean();
      if (existing) return existing as unknown as ISiteSettings;
      const created = await SiteSettings.create(SITE_SETTINGS);
      return created.toObject() as unknown as ISiteSettings;
    } catch (err) {
      console.error("getSettings MongoDB unavailable - serving defaults:", err);
      return SITE_SETTINGS as unknown as ISiteSettings;
    }
  }
  try {
    return getLocalSingleton(
      "settings",
      SITE_SETTINGS as unknown as Record<string, unknown>,
    ) as unknown as ISiteSettings;
  } catch {
    return SITE_SETTINGS as unknown as ISiteSettings;
  }
}

export async function getLeads(): Promise<WithId<ILead>[]> {
  if (hasMongo) {
    try {
      const conn = await connectDB();
      if (!conn) throw new Error("no connection");
      const rows = await Lead.find({}).sort({ createdAt: -1 }).lean();
      return (rows as Any[]).map((r) => normalize<ILead>(r));
    } catch (err) {
      console.error("getLeads MongoDB unavailable:", err);
      return [];
    }
  }
  return (readCollection("leads") as Any[])
    .map((r) => normalize<ILead>(r))
    .reverse();
}
