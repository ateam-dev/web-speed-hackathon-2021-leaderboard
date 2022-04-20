/*
  Warnings:

  - A unique constraint covering the columns `[queueId]` on the table `Measurement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `queueId` to the `Measurement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Measurement" ADD COLUMN     "queueId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Measurement_queueId_key" ON "Measurement"("queueId");

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
