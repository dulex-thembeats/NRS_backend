/*
  Warnings:

  - You are about to drop the column `name` on the `configuration_invoice_types` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `configuration_payment_means` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `configuration_tax_categories` table. All the data in the column will be lost.
  - Added the required column `code` to the `configuration_invoice_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `configuration_payment_means` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `configuration_tax_categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."configuration_invoice_types" DROP COLUMN "name",
ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."configuration_payment_means" DROP COLUMN "name",
ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."configuration_tax_categories" DROP COLUMN "name",
ADD COLUMN     "code" TEXT NOT NULL;
