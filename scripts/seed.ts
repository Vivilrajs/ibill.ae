/**
 * Seeds MongoDB with the initial ibill.ae content. Safe to re-run: it only
 * inserts into collections that are currently empty.
 *
 *   npm run seed
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();
import mongoose from "mongoose";
import {
  Service,
  Product,
  Post,
  TeamMember,
  Testimonial,
  Faq,
  SiteSettings,
} from "../src/lib/models";
import { SERVICES } from "../src/lib/content/services";
import { PRODUCTS } from "../src/lib/content/products";
import { POSTS } from "../src/lib/content/posts";
import { TEAM } from "../src/lib/content/team";
import { TESTIMONIALS } from "../src/lib/content/testimonials";
import { FAQS } from "../src/lib/content/faqs";
import { SITE_SETTINGS } from "../src/lib/content/settings";

async function seedCollection(
  name: string,
  model: mongoose.Model<Record<string, unknown>>,
  rows: unknown[],
) {
  const count = await model.estimatedDocumentCount();
  if (count > 0) {
    console.log(`- ${name}: ${count} existing docs, skipped`);
    return;
  }
  if (!rows.length) {
    console.log(`- ${name}: no seed rows`);
    return;
  }
  await model.insertMany(rows as Record<string, unknown>[]);
  console.log(`- ${name}: inserted ${rows.length}`);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Add it to .env.local first.");
    process.exit(1);
  }
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "ibill" });
  console.log(`Connected to MongoDB (db: ${process.env.MONGODB_DB || "ibill"})`);

  await seedCollection("services", Service as never, SERVICES);
  await seedCollection("products", Product as never, PRODUCTS);
  await seedCollection("posts", Post as never, POSTS);
  await seedCollection("team", TeamMember as never, TEAM);
  await seedCollection("testimonials", Testimonial as never, TESTIMONIALS);
  await seedCollection("faqs", Faq as never, FAQS);

  const settings = await SiteSettings.findOne({ key: "default" });
  if (!settings) {
    await SiteSettings.create(SITE_SETTINGS);
    console.log("- settings: created default document");
  } else {
    console.log("- settings: already exists, skipped");
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
