import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ContentService } from './content.service';
import { CacheControlInterceptor } from '../common/cache-control.interceptor';

@Controller()
@UseInterceptors(CacheControlInterceptor)
export class PublicContentController {
  constructor(private readonly content: ContentService) {}

  @Get('services')
  async services(@Query('category') category?: string) {
    const items = await this.content.list('services', false);
    return {
      items:
        category === 'accounting' || category === 'it'
          ? items.filter((i) => i.category === category)
          : items,
    };
  }

  @Get('products')
  async products() {
    return { items: await this.content.list('products', false) };
  }

  @Get('products/:slug')
  async product(@Param('slug') slug: string) {
    return { item: await this.content.publicBySlug('products', slug) };
  }

  @Get('posts')
  async posts() {
    return { items: await this.content.list('posts', false) };
  }

  @Get('posts/:slug')
  async post(@Param('slug') slug: string) {
    return { item: await this.content.publicBySlug('posts', slug) };
  }

  @Get('team')
  async team() {
    return { items: await this.content.list('team', false) };
  }

  @Get('testimonials')
  async testimonials() {
    return { items: await this.content.list('testimonials', false) };
  }

  @Get('faqs')
  async faqs() {
    return { items: await this.content.list('faqs', false) };
  }
}
