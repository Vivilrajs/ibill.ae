import { Injectable, Logger } from '@nestjs/common';

export interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}

/**
 * Best-effort lead notification. Uses Resend if RESEND_API_KEY is set, otherwise
 * logs to the server console. Swap in SMTP here if the client prefers.
 */
@Injectable()
export class EmailService {
  private readonly log = new Logger('EmailService');

  async sendLeadNotification(lead: LeadPayload): Promise<void> {
    const siteUrl = process.env.SITE_URL || 'https://ibill.ae';
    const to = process.env.CONTACT_NOTIFY_EMAIL || 'info@ibill.ae';
    const key = process.env.RESEND_API_KEY;

    const text = [
      `New enquiry from ${siteUrl}`,
      `Source: ${lead.source || 'contact'}`,
      '',
      `Name:  ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone || '-'}`,
      '',
      lead.message,
    ].join('\n');

    if (!key) {
      this.log.log(`[lead] would email ${to}:\n${text}`);
      return;
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:
          process.env.CONTACT_FROM_EMAIL ||
          'IBILL Website <onboarding@resend.dev>',
        to: [to],
        reply_to: lead.email,
        subject: `New enquiry: ${lead.name}`,
        text,
      }),
    });

    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  }
}
