import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { InvoiceModule } from "../invoice/invoice.module";
import { TenantsService } from "./tenants.service";
import { TenantsController } from "./tenants.controller";
import { ApiKeyAuthGuard } from "./security/api-key-auth.guard";

@Module({
  imports: [DatabaseModule, InvoiceModule],
  controllers: [TenantsController],
  providers: [TenantsService, ApiKeyAuthGuard],
  exports: [TenantsService],
})
export class TenantsModule {}
