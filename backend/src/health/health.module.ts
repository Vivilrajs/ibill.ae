import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { HealthController } from './health.controller';

@Module({
  imports: [ContentModule],
  controllers: [HealthController],
})
export class HealthModule {}
