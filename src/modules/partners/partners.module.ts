import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { ApiKeyAuthGuard } from './security/api-key-auth.guard';

@Module({
  imports: [DatabaseModule, InvoiceModule],
  controllers: [PartnersController],
  providers: [PartnersService, ApiKeyAuthGuard],
  exports: [PartnersService],
})
export class PartnersModule {}


