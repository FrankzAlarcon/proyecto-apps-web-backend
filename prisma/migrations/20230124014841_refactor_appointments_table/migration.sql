/*
  Warnings:

  - You are about to drop the column `hour` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `time` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `date` on the `appointments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "hour",
ADD COLUMN     "time" TIME(0) NOT NULL,
DROP COLUMN "date",
ADD COLUMN     "date" DATE NOT NULL;
