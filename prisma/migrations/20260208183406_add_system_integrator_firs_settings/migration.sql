-- CreateTable
CREATE TABLE "public"."system_integrator_firs_settings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "firs_public_key_base64" TEXT,
    "firs_certificate_base64" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_integrator_firs_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_integrator_firs_settings_userId_key" ON "public"."system_integrator_firs_settings"("userId");

-- AddForeignKey
ALTER TABLE "public"."system_integrator_firs_settings" ADD CONSTRAINT "system_integrator_firs_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
