/*
  Warnings:

  - You are about to drop the column `accepted_invitation` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "expiredAt" SET DEFAULT now() + interval '48 hours';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accepted_invitation",
ADD COLUMN     "acceptedInvitation" BOOLEAN NOT NULL DEFAULT false;
