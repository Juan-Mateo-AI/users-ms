import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = ["super-admin", "admin", "agent"];

  await prisma.userRole.upsert({
    where: { name: "Super Admin" },
    update: {},
    create: { name: "Super Admin", isAdmin: true, companyId: null },
  });

  await prisma.userRole.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin", isAdmin: true, companyId: null },
  });

  await prisma.userRole.upsert({
    where: { name: "Agent" },
    update: {},
    create: { name: "Agent", isAdmin: false, companyId: null },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
