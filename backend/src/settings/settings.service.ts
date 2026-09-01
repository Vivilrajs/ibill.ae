import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { MODELS } from '../schemas/schemas';
import { SITE_SETTINGS } from '../seed/content/settings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

@Injectable()
export class SettingsService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(MODELS.SiteSettings) private readonly model: Model<Doc>,
  ) {}

  private get connected() {
    return this.connection?.readyState === 1;
  }

  async get(admin: boolean): Promise<Doc> {
    if (!this.connected) {
      if (admin) {
        throw new ServiceUnavailableException(
          'Database unavailable. Check MONGODB_URI and Atlas network access.',
        );
      }
      return SITE_SETTINGS;
    }
    try {
      const existing = await this.model.findOne({ key: 'default' }).lean();
      if (existing) return existing as Doc;
      const created = await this.model.create(SITE_SETTINGS);
      return created.toObject();
    } catch (err) {
      console.error('settings.get failed:', err);
      if (admin) throw new ServiceUnavailableException('Database unavailable');
      return SITE_SETTINGS;
    }
  }

  async update(patch: Doc): Promise<Doc> {
    if (!this.connected) {
      throw new ServiceUnavailableException('Save failed - database unavailable.');
    }
    const updated = await this.model
      .findOneAndUpdate(
        { key: 'default' },
        { $set: patch },
        { new: true, upsert: true },
      )
      .lean();
    return updated as Doc;
  }
}
