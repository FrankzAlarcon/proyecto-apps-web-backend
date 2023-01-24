/*
  Warnings:

  - You are about to drop the column `time` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `hour` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "time",
ADD COLUMN     "hour" TIME(0) NOT NULL;
