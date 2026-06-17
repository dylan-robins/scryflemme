import "dotenv/config";

import { prisma } from "../src/lib/prisma.js";

const main = async (): Promise<void> => {
  await prisma.card.findFirst({
    select: {
      cardID: true
    }
  });

  console.log("✅ Connected.");
};

await main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
