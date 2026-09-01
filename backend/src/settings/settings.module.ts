import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';

@Module({
  imports: [ContentModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
