import { type Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput = {
  email: "example@gmail.com",
  name: "John Doe",
  hashedPassword: "",
  gymChecks: {
    create: [
      {
        description: "Academia 1",
        date: new Date("2025-01-02T00:00:00"),
      },
      {
        description: "Academia 2",
        date: new Date("2025-01-03T00:00:00"),
      },
      {
        description: "Academia 3",
        date: new Date("2025-01-06T00:00:00"),
      },
      {
        description: "Academia 4",
        date: new Date("2025-01-07T00:00:00"),
      },
      {
        description: "Academia 5",
        date: new Date("2025-01-08T00:00:00"),
      },
    ],
  },
  cheatMeals: {
    create: [
      {
        name: "Chipotle",
        date: new Date("2025-04-02T00:00:00"),
      },
      {
        name: "Mcdonalds",
        date: new Date("2025-01-09T00:00:00"),
      },
      {
        name: "Chicken popcorn",
        date: new Date("2025-03-23T00:00:00"),
      },
      {
        name: "Hot dot",
        date: new Date("2025-01-07T00:00:00"),
      },
      {
        name: "Hamburg",
        date: new Date("2025-08-08T00:00:00"),
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
