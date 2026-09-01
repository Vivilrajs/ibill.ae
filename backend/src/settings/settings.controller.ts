import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { z } from 'zod';
import { AuthGuard } from '../auth/auth.guard';
import { SettingsService } from './settings.service';
import { CacheControlInterceptor } from '../common/cache-control.interceptor';

const schema = z.object({
  phone: z.string().max(60).optional(),
  email: z.string().max(200).optional(),
  address: z.string().max(400).optional(),
  mapQuery: z.string().max(400).optional(),
  companyBlurb: z.string().max(1000).optional(),
  workHours: z.array(z.string().max(120)).max(10).optional(),
  facebook: z.string().max(300).optional(),
  instagram: z.string().max(300).optional(),
  twitter: z.string().max(300).optional(),
  youtube: z.string().max(300).optional(),
  statExperienceYears: z.number().int().min(0).max(200).optional(),
  statProjectsDone: z.number().int().min(0).max(100000).optional(),
  statHappyClients: z.number().int().min(0).max(100000).optional(),
});

@Controller()
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get('settings')
  @UseInterceptors(CacheControlInterceptor)
  async publicGet() {
    return { settings: await this.settings.get(false) };
  }

  @Get('admin/settings')
  @UseGuards(AuthGuard)
  async adminGet() {
    return { settings: await this.settings.get(true) };
  }

  @Put('admin/settings')
  @UseGuards(AuthGuard)
  async put(@Body() body: unknown) {
    const parsed = schema.safeParse(body);
    if (!parsed.success) throw new BadRequestException('Invalid input');
    return { settings: await this.settings.update(parsed.data) };
  }
}
