/*
  Warnings:

  - The values [STATUS_CHANGED,PRIORITY_CHANGED,ASSIGNEE_CHANGED,REPORTER_CHANGED,SPRINT_CHANGED] on the enum `ActivityType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityType_new" AS ENUM ('CHANGED_STATUS', 'CHANGED_PRIORITY', 'CHANGED_ASSIGNEE', 'CHANGED_REPORTER');
ALTER TABLE "IssueActivity" ALTER COLUMN "type" TYPE "ActivityType_new" USING ("type"::text::"ActivityType_new");
ALTER TYPE "ActivityType" RENAME TO "ActivityType_old";
ALTER TYPE "ActivityType_new" RENAME TO "ActivityType";
DROP TYPE "public"."ActivityType_old";
COMMIT;
