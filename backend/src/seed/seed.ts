/**
 * Seeds MongoDB with the initial ibill.ae content. Safe to re-run: only inserts
 * into collections that are currently empty.
 *
 *   npm run seed
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
loadEnv();

import mongoose from 'mongoose';
import {
  ServiceSchema,
  ProductSchema,
  PostSchema,
  TeamMemberSchema,
  TestimonialSchema,
  FaqSchema,
  SiteSettingsSchema,
} from '../schemas/schemas';
import { SERVICES } from './content/services';
import { PRODUCTS } from './content/products';
import { POSTS } from './content/posts';
import { TEAM } from './content/team';
import { TESTIMONIALS } from './content/testimonials';
import { FAQS } from './content/faqs';
import { SITE_SETTINGS } from './content/settings';

async function seedCollection(
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: mongoose.Model<any>,
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
    console.error('MONGODB_URI is not set. Add it to .env / .env.local first.');
    process.exit(1);
  }
  const dbName = process.env.MONGODB_DB || 'ibill';
  await mongoose.connect(uri, { dbName });
  console.log(`Connected to MongoDB (db: ${dbName})`);

  const m = <T>(name: string, schema: mongoose.Schema) =>
    mongoose.model<T>(name, schema);

  await seedCollection('services', m('Service', ServiceSchema), SERVICES);
  await seedCollection('products', m('Product', ProductSchema), PRODUCTS);
  await seedCollection('posts', m('Post', PostSchema), POSTS);
  await seedCollection('team', m('TeamMember', TeamMemberSchema), TEAM);
  await seedCollection(
    'testimonials',
    m('Testimonial', TestimonialSchema),
    TESTIMONIALS,
  );
  await seedCollection('faqs', m('Faq', FaqSchema), FAQS);

  const Settings = m('SiteSettings', SiteSettingsSchema);
  if (!(await Settings.findOne({ key: 'default' }))) {
    await Settings.create(SITE_SETTINGS);
    console.log('- settings: created default document');
  } else {
    console.log('- settings: already exists, skipped');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
