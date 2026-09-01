import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { AuthGuard } from '../auth/auth.guard';
import { LeadsService } from './leads.service';

const patchSchema = z.object({ handled: z.boolean() });

@Controller('admin/leads')
@UseGuards(AuthGuard)
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Get()
  async list() {
    return { items: await this.leads.list() };
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() body: unknown) {
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException('Invalid input');
    return { item: await this.leads.setHandled(id, parsed.data.handled) };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.leads.remove(id);
  }
}
