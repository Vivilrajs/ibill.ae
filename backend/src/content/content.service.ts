import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { MODELS } from '../schemas/schemas';
import { RESOURCES, type ResourceKey } from './registry';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

const CACHE_TTL_MS = 60_000;

@Injectable()
export class ContentService {
  private cache = new Map<string, { data: Doc[]; exp: number }>();

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(MODELS.Service) private readonly service: Model<Doc>,
    @InjectModel(MODELS.Product) private readonly product: Model<Doc>,
    @InjectModel(MODELS.Post) private readonly post: Model<Doc>,
    @InjectModel(MODELS.TeamMember) private readonly team: Model<Doc>,
    @InjectModel(MODELS.Testimonial) private readonly testimonial: Model<Doc>,
    @InjectModel(MODELS.Faq) private readonly faq: Model<Doc>,
  ) {}

  private modelFor(key: ResourceKey): Model<Doc> {
    switch (key) {
      case 'services':
        return this.service;
      case 'products':
        return this.product;
      case 'posts':
        return this.post;
      case 'team':
        return this.team;
      case 'testimonials':
        return this.testimonial;
      case 'faqs':
        return this.faq;
      default:
        throw new NotFoundException('Unknown resource');
    }
  }

  private get connected(): boolean {
    return this.connection?.readyState === 1;
  }

  private static norm(row: Doc): Doc {
    const id = String(row?._id ?? row?.id ?? '');
    return { ...row, id, _id: id };
  }

  private fromSeed(key: ResourceKey, admin: boolean): Doc[] {
    const { seed, sort } = RESOURCES[key];
    const rows = admin ? seed : seed.filter((r) => r.published !== false);
    const [field, dir] = Object.entries(sort)[0] as [string, number];
    return [...rows]
      .sort(
        (a, b) =>
          (((a as Doc)[field] ?? 0) > ((b as Doc)[field] ?? 0) ? 1 : -1) * dir,
      )
      .map((r, i) => ContentService.norm({ ...r, _id: `seed_${i}` }));
  }

  /** Public/admin list. */
  async list(key: ResourceKey, admin: boolean): Promise<Doc[]> {
    const def = RESOURCES[key];
    if (!def) throw new NotFoundException('Unknown resource');

    if (!this.connected) {
      if (admin) {
        throw new ServiceUnavailableException(
          'Database unavailable. Check MONGODB_URI and Atlas network access.',
        );
      }
      return this.fromSeed(key, false);
    }

    const cacheKey = `${key}:${admin ? 'admin' : 'pub'}`;
    if (!admin) {
      const hit = this.cache.get(cacheKey);
      if (hit && hit.exp > Date.now()) return hit.data;
    }

    const model = this.modelFor(key);
    try {
      if ((await model.estimatedDocumentCount()) === 0 && def.seed.length) {
        await model.insertMany(def.seed);
      }
      const rows = (await model
        .find(admin ? {} : { published: true })
        .sort(def.sort)
        .lean()) as Doc[];
      const data = rows.map(ContentService.norm);
      if (!admin) this.cache.set(cacheKey, { data, exp: Date.now() + CACHE_TTL_MS });
      return data;
    } catch (err) {
      console.error(`content.list(${key}) failed:`, err);
      if (admin) throw new ServiceUnavailableException('Database unavailable');
      return this.fromSeed(key, false);
    }
  }

  async publicBySlug(key: ResourceKey, slug: string): Promise<Doc> {
    const rows = await this.list(key, false);
    const found = rows.find((r) => r.slug === slug);
    if (!found) throw new NotFoundException('Not found');
    return found;
  }

  private bust(key: ResourceKey) {
    this.cache.delete(`${key}:pub`);
    this.cache.delete(`${key}:admin`);
  }

  async create(key: ResourceKey, data: Doc): Promise<Doc> {
    if (!this.connected) {
      throw new ServiceUnavailableException(
        'Database unavailable. Check MONGODB_URI and Atlas network access.',
      );
    }
    const created = await this.modelFor(key).create(data);
    this.bust(key);
    return ContentService.norm(created.toObject());
  }

  async update(key: ResourceKey, id: string, data: Doc): Promise<Doc> {
    if (!this.connected) {
      throw new ServiceUnavailableException('Database unavailable.');
    }
    const updated = (await this.modelFor(key)
      .findByIdAndUpdate(id, data, { new: true })
      .lean()) as Doc | null;
    if (!updated) throw new NotFoundException('Not found');
    this.bust(key);
    return ContentService.norm(updated);
  }

  async remove(key: ResourceKey, id: string): Promise<{ ok: true }> {
    if (!this.connected) {
      throw new ServiceUnavailableException('Database unavailable.');
    }
    await this.modelFor(key).findByIdAndDelete(id);
    this.bust(key);
    return { ok: true };
  }
}
