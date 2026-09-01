import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { SettingsModule } from './settings/settings.module';
import { LeadsModule } from './leads/leads.module';
import { ContactModule } from './contact/contact.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.MONGODB_URI ||
          'mongodb://127.0.0.1:27017/ibill-unconfigured',
        dbName: process.env.MONGODB_DB || 'ibill',
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 10,
        retryAttempts: 3,
        retryDelay: 2000,
      }),
    }),
    AuthModule,
    ContentModule,
    SettingsModule,
    LeadsModule,
    ContactModule,
    HealthModule,
  ],
})
export class AppModule {}
