-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "entityId" DROP NOT NULL,
ALTER COLUMN "businessName" DROP NOT NULL,
ALTER COLUMN "businessAddress" DROP NOT NULL,
ALTER COLUMN "rcNumber" DROP NOT NULL,
ALTER COLUMN "dateOfIncorporation" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."configuration_invoice_types" (
    "value" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuration_invoice_types_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "public"."configuration_payment_means" (
    "value" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuration_payment_means_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "public"."configuration_tax_categories" (
    "value" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuration_tax_categories_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "public"."configuration_currencies" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "symbol_native" TEXT NOT NULL,
    "decimal_digits" INTEGER NOT NULL,
    "rounding" INTEGER NOT NULL,
    "name_plural" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuration_currencies_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "public"."configuration_vat_exemptions" (
    "harmonized_system_code" TEXT NOT NULL,
    "heading_no" TEXT NOT NULL,
    "tariff_category" TEXT NOT NULL,
    "tariff" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuration_vat_exemptions_pkey" PRIMARY KEY ("harmonized_system_code")
);

-- CreateTable
CREATE TABLE "public"."configuration_product_codes" (
    "hscode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuration_product_codes_pkey" PRIMARY KEY ("hscode")
);

-- CreateTable
CREATE TABLE "public"."configuration_service_codes" (
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuration_service_codes_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "public"."configuration_local_governments" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state_code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuration_local_governments_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "public"."configuration_states" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuration_states_pkey" PRIMARY KEY ("code")
);
