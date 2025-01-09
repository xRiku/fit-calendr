import { type Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput = {
  email: "example@gmail.com",
  name: "John Doe",
  hashedPassword: "",
  cheatMeals: {
    create: [
      {
        name: "Academia 1",
        createdAt: new Date("2025-01-02T00:00:00"),
      },
      {
        name: "Academia 2",
        createdAt: new Date("2025-01-03T00:00:00"),
      },
      {
        name: "Academia 3",
        createdAt: new Date("2025-01-06T00:00:00"),
      },
      {
        name: "Academia 4",
        createdAt: new Date("2025-01-07T00:00:00"),
      },
      {
        name: "Academia 5",
        createdAt: new Date("2025-01-08T00:00:00"),
      },
    ],
  },
};

async function main() {
  console.log("Start seeding ...");

  const hashedPassword = await bcrypt.hash("example", 10);
  userData.hashedPassword = hashedPassword;

  await prisma.user.create({
    data: userData,
  });

  console.log("Seeding finished.");
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
