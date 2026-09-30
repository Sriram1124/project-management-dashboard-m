-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WorkItemType" AS ENUM ('EPIC', 'STORY', 'TASK', 'SUBTASK', 'BUG');

-- CreateEnum
CREATE TYPE "WorkItemStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "WorkItemPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("project_id","user_id")
);

-- CreateTable
CREATE TABLE "project_documents" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_items" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "project_id" TEXT,
    "parent_id" TEXT,
    "created_by" TEXT NOT NULL,
    "type" "WorkItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "WorkItemStatus" NOT NULL DEFAULT 'TODO',
    "priority" "WorkItemPriority" NOT NULL DEFAULT 'MEDIUM',
    "start_date" TIMESTAMP(3),
    "due_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "work_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_item_assignees" (
    "work_item_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "work_item_assignees_pkey" PRIMARY KEY ("work_item_id","user_id")
);

-- CreateTable
CREATE TABLE "work_item_attachments" (
    "id" TEXT NOT NULL,
    "work_item_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_item_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "work_items_organization_id_idx" ON "work_items"("organization_id");

-- CreateIndex
CREATE INDEX "work_items_project_id_idx" ON "work_items"("project_id");

-- CreateIndex
CREATE INDEX "work_items_created_by_idx" ON "work_items"("created_by");

-- CreateIndex
CREATE INDEX "work_items_parent_id_idx" ON "work_items"("parent_id");

-- CreateIndex
CREATE INDEX "work_item_attachments_work_item_id_idx" ON "work_item_attachments"("work_item_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "work_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_item_assignees" ADD CONSTRAINT "work_item_assignees_work_item_id_fkey" FOREIGN KEY ("work_item_id") REFERENCES "work_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_item_assignees" ADD CONSTRAINT "work_item_assignees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_item_attachments" ADD CONSTRAINT "work_item_attachments_work_item_id_fkey" FOREIGN KEY ("work_item_id") REFERENCES "work_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
