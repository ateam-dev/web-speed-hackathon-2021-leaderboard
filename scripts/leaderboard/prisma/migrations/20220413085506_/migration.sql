/*
  Warnings:

  - The `status` column on the `Queue` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "queue_status" AS ENUM ('WAITING', 'RUNNING', 'FAILED', 'DONE');

-- AlterTable
-- https://github.com/supabase/realtime/issues/211
ALTER TABLE "Queue" DROP COLUMN "status",
ADD COLUMN     "status" queue_status NOT NULL DEFAULT E'WAITING';

-- DropEnum
DROP TYPE "QueueStatus";
