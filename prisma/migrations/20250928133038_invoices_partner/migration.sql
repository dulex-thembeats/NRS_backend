/*
  Warnings:

  - Added the required column `businessId` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentCurrencyCode` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceTypeCode` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueDate` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."invoices" ADD COLUMN     "accountingCost" TEXT,
ADD COLUMN     "actualDeliveryDate" TIMESTAMP(3),
ADD COLUMN     "businessId" TEXT NOT NULL,
ADD COLUMN     "buyerReference" TEXT,
ADD COLUMN     "documentCurrencyCode" TEXT NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "invoiceTypeCode" TEXT NOT NULL,
ADD COLUMN     "issueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "issueTime" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "orderReference" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "paymentTermsNote" TEXT,
ADD COLUMN     "taxCurrencyCode" TEXT,
ADD COLUMN     "taxPointDate" TIMESTAMP(3),
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "dateOfIncorporation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."directors" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "nin" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "directors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoice_delivery_periods" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_delivery_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounting_supplier_parties" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "partyName" TEXT NOT NULL,
    "tin" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "businessDescription" TEXT,

    CONSTRAINT "accounting_supplier_parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounting_customer_parties" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "partyName" TEXT NOT NULL,
    "tin" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "businessDescription" TEXT,

    CONSTRAINT "accounting_customer_parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."postal_addresses" (
    "id" SERIAL NOT NULL,
    "streetName" TEXT NOT NULL,
    "cityName" TEXT NOT NULL,
    "postalZone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "supplierPartyId" INTEGER,
    "customerPartyId" INTEGER,

    CONSTRAINT "postal_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."billing_references" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "irn" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."document_references" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "irn" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dispatch_document_references" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "irn" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dispatch_document_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."receipt_document_references" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "irn" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipt_document_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."originator_document_references" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "irn" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "originator_document_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_document_references" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "irn" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_document_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment_means" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "paymentMeansCode" TEXT NOT NULL,
    "paymentDueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_means_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."allowance_charges" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "chargeIndicator" BOOLEAN NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "allowance_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tax_totals" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "tax_totals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tax_subtotals" (
    "id" SERIAL NOT NULL,
    "taxTotalId" INTEGER NOT NULL,
    "taxableAmount" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "tax_subtotals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tax_categories" (
    "id" SERIAL NOT NULL,
    "taxSubtotalId" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "tax_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."legal_monetary_totals" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "lineExtensionAmount" DOUBLE PRECISION NOT NULL,
    "taxExclusiveAmount" DOUBLE PRECISION NOT NULL,
    "taxInclusiveAmount" DOUBLE PRECISION NOT NULL,
    "payableAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "legal_monetary_totals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoice_lines" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "hsnCode" TEXT NOT NULL,
    "productCategory" TEXT NOT NULL,
    "discountRate" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "feeRate" DOUBLE PRECISION NOT NULL,
    "feeAmount" DOUBLE PRECISION NOT NULL,
    "invoicedQuantity" DOUBLE PRECISION NOT NULL,
    "lineExtensionAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "invoice_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."items" (
    "id" SERIAL NOT NULL,
    "invoiceLineId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sellersItemIdentification" TEXT,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prices" (
    "id" SERIAL NOT NULL,
    "invoiceLineId" INTEGER NOT NULL,
    "priceAmount" DOUBLE PRECISION NOT NULL,
    "baseQuantity" DOUBLE PRECISION NOT NULL,
    "priceUnit" TEXT NOT NULL,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."entities" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "custom_settings" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "app_reference" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."businesses" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "custom_settings" TEXT,
    "tin" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "annual_turnover" TEXT NOT NULL,
    "support_peppol" BOOLEAN NOT NULL DEFAULT false,
    "is_realtime_reporting" BOOLEAN NOT NULL DEFAULT false,
    "notification_channels" TEXT NOT NULL,
    "erp_system" TEXT NOT NULL,
    "irn_template" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "entityId" TEXT NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."partner_api_credentials" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "apiKey" TEXT NOT NULL,
    "apiSecret" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_api_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."partner_api_logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "requestBody" TEXT,
    "responseStatus" INTEGER NOT NULL,
    "responseBody" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_api_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoice_delivery_periods_invoiceId_key" ON "public"."invoice_delivery_periods"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_supplier_parties_invoiceId_key" ON "public"."accounting_supplier_parties"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_customer_parties_invoiceId_key" ON "public"."accounting_customer_parties"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "postal_addresses_supplierPartyId_key" ON "public"."postal_addresses"("supplierPartyId");

-- CreateIndex
CREATE UNIQUE INDEX "postal_addresses_customerPartyId_key" ON "public"."postal_addresses"("customerPartyId");

-- CreateIndex
CREATE UNIQUE INDEX "dispatch_document_references_invoiceId_key" ON "public"."dispatch_document_references"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "receipt_document_references_invoiceId_key" ON "public"."receipt_document_references"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "originator_document_references_invoiceId_key" ON "public"."originator_document_references"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "contract_document_references_invoiceId_key" ON "public"."contract_document_references"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "tax_categories_taxSubtotalId_key" ON "public"."tax_categories"("taxSubtotalId");

-- CreateIndex
CREATE UNIQUE INDEX "legal_monetary_totals_invoiceId_key" ON "public"."legal_monetary_totals"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "items_invoiceLineId_key" ON "public"."items"("invoiceLineId");

-- CreateIndex
CREATE UNIQUE INDEX "prices_invoiceLineId_key" ON "public"."prices"("invoiceLineId");

-- CreateIndex
CREATE UNIQUE INDEX "entities_userId_key" ON "public"."entities"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "partner_api_credentials_userId_key" ON "public"."partner_api_credentials"("userId");

-- AddForeignKey
ALTER TABLE "public"."directors" ADD CONSTRAINT "directors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice_delivery_periods" ADD CONSTRAINT "invoice_delivery_periods_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounting_supplier_parties" ADD CONSTRAINT "accounting_supplier_parties_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounting_customer_parties" ADD CONSTRAINT "accounting_customer_parties_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."postal_addresses" ADD CONSTRAINT "postal_addresses_supplierPartyId_fkey" FOREIGN KEY ("supplierPartyId") REFERENCES "public"."accounting_supplier_parties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."postal_addresses" ADD CONSTRAINT "postal_addresses_customerPartyId_fkey" FOREIGN KEY ("customerPartyId") REFERENCES "public"."accounting_customer_parties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."billing_references" ADD CONSTRAINT "billing_references_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."document_references" ADD CONSTRAINT "document_references_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dispatch_document_references" ADD CONSTRAINT "dispatch_document_references_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."receipt_document_references" ADD CONSTRAINT "receipt_document_references_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."originator_document_references" ADD CONSTRAINT "originator_document_references_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_document_references" ADD CONSTRAINT "contract_document_references_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment_means" ADD CONSTRAINT "payment_means_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."allowance_charges" ADD CONSTRAINT "allowance_charges_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tax_totals" ADD CONSTRAINT "tax_totals_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tax_subtotals" ADD CONSTRAINT "tax_subtotals_taxTotalId_fkey" FOREIGN KEY ("taxTotalId") REFERENCES "public"."tax_totals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tax_categories" ADD CONSTRAINT "tax_categories_taxSubtotalId_fkey" FOREIGN KEY ("taxSubtotalId") REFERENCES "public"."tax_subtotals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."legal_monetary_totals" ADD CONSTRAINT "legal_monetary_totals_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice_lines" ADD CONSTRAINT "invoice_lines_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_invoiceLineId_fkey" FOREIGN KEY ("invoiceLineId") REFERENCES "public"."invoice_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prices" ADD CONSTRAINT "prices_invoiceLineId_fkey" FOREIGN KEY ("invoiceLineId") REFERENCES "public"."invoice_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."entities" ADD CONSTRAINT "entities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."businesses" ADD CONSTRAINT "businesses_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "public"."entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."partner_api_credentials" ADD CONSTRAINT "partner_api_credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."partner_api_logs" ADD CONSTRAINT "partner_api_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
