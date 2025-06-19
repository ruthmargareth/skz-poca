import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("ajuy123", 10);

  console.log("Password hash:", hashedPassword);

  await prisma.user.createMany({
    data: [
      {
        name: "Ajuy",
        email: "juy@gmail.com",
        password: hashedPassword,
      },
    ],
  });

  await prisma.card.create({
    data: {
      id: "example-id",
      name: "Felix",
      era: "Oddinary",
      title: "Mask Off",
      type: "Album",
      imageUrlFront: "https://example.com/front.jpg",
      imageUrlBack: "https://example.com/back.jpg",
    },
  });
   console.log("✅ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
