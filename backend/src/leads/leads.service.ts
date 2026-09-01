import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { MODELS } from '../schemas/schemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

export interface LeadInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}

@Injectable()
export class LeadsService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(MODELS.Lead) private readonly model: Model<Doc>,
  ) {}

  private get connected() {
    return this.connection?.readyState === 1;
  }

  /** Returns true if persisted to Mongo. */
  async record(lead: LeadInput): Promise<boolean> {
    if (!this.connected) return false;
    try {
      await this.model.create(lead);
      return true;
    } catch (err) {
      console.error('leads.record failed:', err);
      return false;
    }
  }

  async list(): Promise<Doc[]> {
    if (!this.connected) {
      throw new ServiceUnavailableException('Database unavailable');
    }
    const rows = (await this.model
      .find({})
      .sort({ createdAt: -1 })
      .lean()) as Doc[];
    return rows.map((r) => ({ ...r, id: String(r._id) }));
  }

  async setHandled(id: string, handled: boolean): Promise<Doc | null> {
    if (!this.connected) {
      throw new ServiceUnavailableException('Database unavailable');
    }
    return this.model
      .findByIdAndUpdate(id, { handled }, { new: true })
      .lean() as Promise<Doc | null>;
  }

  async remove(id: string): Promise<{ ok: true }> {
    if (!this.connected) {
      throw new ServiceUnavailableException('Database unavailable');
    }
    await this.model.findByIdAndDelete(id);
    return { ok: true };
  }
}
