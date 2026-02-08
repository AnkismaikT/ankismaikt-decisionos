const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

(async () => {
  const prisma = new PrismaClient();

  const email = "pradeepmeghwal1111@gmail.com";
  const plainPassword = "Injalkinshu@900";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  console.log("✅ Admin user created");

  await prisma.$disconnect();
})();

