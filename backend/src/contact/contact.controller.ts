import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodBody } from '../common/zod.pipe';
import { LeadsService } from '../leads/leads.service';
import { EmailService } from './email.service';

const schema = z.object({
  name: z.string().min(1).max(140),
  email: z.string().email().max(200),
  phone: z.string().max(60).optional().default(''),
  message: z.string().min(1).max(4000),
  source: z.string().max(60).optional().default('contact'),
  // honeypot - bots fill hidden fields
  company: z.string().max(0).optional(),
});
type ContactDto = z.infer<typeof schema>;

@Controller('contact')
export class ContactController {
  private readonly log = new Logger('ContactController');

  constructor(
    private readonly leads: LeadsService,
    private readonly email: EmailService,
  ) {}

  @Post()
  @HttpCode(200)
  async submit(@Body(new ZodBody(schema)) body: ContactDto) {
    const { company: _hp, ...lead } = body;

    const stored = await this.leads.record(lead);
    if (!stored) {
      this.log.error(
        `Lead NOT persisted (DB unavailable). Relying on email notification: ${lead.email}`,
      );
    }

    await this.email
      .sendLeadNotification(lead)
      .catch((err) => this.log.warn(`email notification failed: ${err}`));

    return { ok: true };
  }
}
