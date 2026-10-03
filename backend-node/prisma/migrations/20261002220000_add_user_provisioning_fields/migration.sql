-- AlterTable
ALTER TABLE "users" ADD COLUMN "user_code" TEXT,
ADD COLUMN "must_change_password" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "users_organization_id_user_code_key" ON "users"("organization_id", "user_code");
