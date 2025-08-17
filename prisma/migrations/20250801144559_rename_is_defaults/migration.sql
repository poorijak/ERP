/*
  Warnings:

  - You are about to drop the column `isDeafault` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "isDeafault",
ADD COLUMN     "isDefault" BOOLEAN;
