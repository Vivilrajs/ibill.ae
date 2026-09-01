import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import type { ZodType } from 'zod';
import { AuthGuard } from '../auth/auth.guard';
import { ContentService } from './content.service';
import { RESOURCES, type ResourceKey } from './registry';

function resolve(resource: string): ResourceKey {
  if (!(resource in RESOURCES)) throw new NotFoundException('Unknown resource');
  return resource as ResourceKey;
}

function validate(schema: ZodType, body: unknown): Record<string, unknown> {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join(', ');
    throw new BadRequestException(`Invalid input - ${msg}`);
  }
  return parsed.data as Record<string, unknown>;
}

@Controller('admin/content')
@UseGuards(AuthGuard)
export class AdminContentController {
  constructor(private readonly content: ContentService) {}

  @Get(':resource')
  async list(@Param('resource') resource: string) {
    return { items: await this.content.list(resolve(resource), true) };
  }

  @Post(':resource')
  async create(@Param('resource') resource: string, @Body() body: unknown) {
    const key = resolve(resource);
    const data = validate(RESOURCES[key].createSchema, body);
    return { item: await this.content.create(key, data) };
  }

  @Put(':resource/:id')
  async update(
    @Param('resource') resource: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const key = resolve(resource);
    const data = validate(RESOURCES[key].updateSchema, body);
    return { item: await this.content.update(key, id, data) };
  }

  @Delete(':resource/:id')
  async remove(@Param('resource') resource: string, @Param('id') id: string) {
    return this.content.remove(resolve(resource), id);
  }
}
