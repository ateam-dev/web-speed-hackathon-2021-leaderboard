/*
  Warnings:

  - Added the required column `message` to the `Measurement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Measurement" ADD COLUMN     "message" TEXT NOT NULL;
