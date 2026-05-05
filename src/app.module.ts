import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { EmailModule } from './shared/email/mail.module';
import { FirsModule } from './modules/firs/firs.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PartnersModule } from './modules/partners/partners.module';
import { SystemIntegratorModule } from './modules/system-integrator/system-integrator.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    EmailModule,
    FirsModule,
    InvoiceModule,
    ConfigurationModule,
    DashboardModule,
    PartnersModule,
    SystemIntegratorModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
