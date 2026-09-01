import { Module } from '@nestjs/common';
import { LeadsModule } from '../leads/leads.module';
import { EmailService } from './email.service';
import { ContactController } from './contact.controller';

@Module({
  imports: [LeadsModule],
  controllers: [ContactController],
  providers: [EmailService],
})
export class ContactModule {}
