/*
  Warnings:

  - You are about to drop the column `userId` on the `UserRole` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userRoleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userRoleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- DropIndex
DROP INDEX "UserRole_userId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userRoleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserRole" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "User_userRoleId_key" ON "User"("userRoleId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userRoleId_fkey" FOREIGN KEY ("userRoleId") REFERENCES "UserRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
