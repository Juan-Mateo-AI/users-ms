import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = ["super-admin", "admin", "agent"];

  const defaultSuperAdminRole = await prisma.userRole.upsert({
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

  const company = await prisma.company.upsert({
    where: { email: "test_company@gmail.com" },
    update: {},
    create: {
      name: "Test Company",
      email: "test_company@gmail.com",
    },
  });

  await prisma.companyPreference.create({
    data: {
      companyId: company.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "msalazar9742@gmail.com" },
    update: {},
    create: {
      name: "Test User",
      email: "msalazar9742@gmail.com",
      companyId: company.id,
      userRoleId: defaultSuperAdminRole.id,
    },
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
