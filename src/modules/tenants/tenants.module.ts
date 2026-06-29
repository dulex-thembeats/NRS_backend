import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { InvoiceModule } from "../invoice/invoice.module";
import { FirsModule } from "../firs/firs.module";
import { TenantsService } from "./tenants.service";
import { TenantsController } from "./tenants.controller";
import { ApiKeyAuthGuard } from "./security/api-key-auth.guard";

@Module({
  imports: [DatabaseModule, InvoiceModule, FirsModule],
  controllers: [TenantsController],
  providers: [TenantsService, ApiKeyAuthGuard],
  exports: [TenantsService],
})
export class TenantsModule {}
