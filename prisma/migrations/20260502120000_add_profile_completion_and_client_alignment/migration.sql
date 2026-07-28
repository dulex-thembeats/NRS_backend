-- Align database schema with the current onboarding and client model.
-- Rewritten to be fully idempotent: every step is guarded so it is a no-op
-- when already applied. The previous version renamed constraints/indexes to
-- their own names (Postgres error 42P07 "relation already exists") whenever the
-- partner->client rename had already happened, and used a hand-written
-- BEGIN/COMMIT that conflicts with Prisma's own migration transaction.

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "isProfileComplete" BOOLEAN NOT NULL DEFAULT false;

-- Rename client API tables from the previous partner naming (only if still named partner_*).
DO $$
BEGIN
  IF to_regclass('public.client_api_credentials') IS NULL
     AND to_regclass('public.partner_api_credentials') IS NOT NULL THEN
    ALTER TABLE "public"."partner_api_credentials" RENAME TO "client_api_credentials";
  END IF;

  IF to_regclass('public.client_api_logs') IS NULL
     AND to_regclass('public.partner_api_logs') IS NOT NULL THEN
    ALTER TABLE "public"."partner_api_logs" RENAME TO "client_api_logs";
  END IF;
END $$;

-- Rename primary-key / FK constraints from partner_* to client_* (only if the old name still exists).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'partner_api_credentials_pkey') THEN
    ALTER TABLE "public"."client_api_credentials" RENAME CONSTRAINT "partner_api_credentials_pkey" TO "client_api_credentials_pkey";
  END IF;

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'partner_api_logs_pkey') THEN
    ALTER TABLE "public"."client_api_logs" RENAME CONSTRAINT "partner_api_logs_pkey" TO "client_api_logs_pkey";
  END IF;

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'partner_api_credentials_userId_fkey') THEN
    ALTER TABLE "public"."client_api_credentials" RENAME CONSTRAINT "partner_api_credentials_userId_fkey" TO "client_api_credentials_userId_fkey";
  END IF;

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'partner_api_logs_userId_fkey') THEN
    ALTER TABLE "public"."client_api_logs" RENAME CONSTRAINT "partner_api_logs_userId_fkey" TO "client_api_logs_userId_fkey";
  END IF;
END $$;

-- Rename the unique index from partner_* to client_* (only if the old name still exists).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i'
      AND c.relname = 'partner_api_credentials_userId_key'
      AND n.nspname = 'public'
  ) THEN
    ALTER INDEX "public"."partner_api_credentials_userId_key" RENAME TO "client_api_credentials_userId_key";
  END IF;
END $$;

-- AlterEnum: fold PARTNER into CLIENT. Guarded so it only runs while 'PARTNER'
-- still exists on the Role enum; skipped entirely once already migrated.
-- No explicit BEGIN/COMMIT: Prisma already wraps this migration in a transaction.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'Role' AND e.enumlabel = 'PARTNER'
  ) THEN
    ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
    CREATE TYPE "public"."Role_new" AS ENUM ('USER', 'ADMIN', 'CLIENT');
    ALTER TABLE "public"."users" ALTER COLUMN "role" TYPE "public"."Role_new" USING (
      CASE
        WHEN "role"::text IN ('CLIENT', 'PARTNER') THEN 'CLIENT'
        ELSE "role"::text
      END::"public"."Role_new"
    );
    ALTER TYPE "public"."Role" RENAME TO "Role_old";
    ALTER TYPE "public"."Role_new" RENAME TO "Role";
    DROP TYPE "public"."Role_old";
    ALTER TABLE "public"."users" ALTER COLUMN "role" SET DEFAULT 'USER';
  END IF;
END $$;
