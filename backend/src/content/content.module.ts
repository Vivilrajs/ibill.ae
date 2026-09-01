import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGOOSE_FEATURES } from '../schemas/schemas';
import { ContentService } from './content.service';
import { PublicContentController } from './public-content.controller';
import { AdminContentController } from './admin-content.controller';

@Module({
  imports: [MongooseModule.forFeature(MONGOOSE_FEATURES)],
  controllers: [PublicContentController, AdminContentController],
  providers: [ContentService],
  exports: [ContentService, MongooseModule],
})
export class ContentModule {}
