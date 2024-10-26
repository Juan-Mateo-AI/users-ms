-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_companyId_fkey";

-- AlterTable
ALTER TABLE "UserRole" ALTER COLUMN "companyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
