import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { CardClass, Rarity } from "../generated/prisma/client.js";
import { prisma } from "../src/lib/prisma.js";

type SeedSet = {
  code: string;
  label: string;
  name: string;
};

type SeedCard = {
  slug: string;
  setCode: string;
  number: string;
  copiesInProduct: number;
  name: string;
  cardClass: string;
  value: number | string | null;
  type: string | null;
  archetype: string | null;
  rarity: string;
  effect: string | null;
};

type SeedCatalog = {
  sets: SeedSet[];
  cards: SeedCard[];
};

const catalogPath = fileURLToPath(new URL("seed.json", import.meta.url));
const rarityMap: Record<string, Rarity> = {
  Commune: Rarity.COMMON,
  Rare: Rarity.RARE,
  Légendaire: Rarity.LEGENDARY,
  Secrète: Rarity.SECRET
};

const cardClassMap: Record<string, CardClass> = {
  "N/A": CardClass.Esbroufe,
  Esbroufe: CardClass.Esbroufe,
  Magie: CardClass.Magie,
  Agilité: CardClass.Agilité,
  Soutien: CardClass.Soutien,
  Force: CardClass.Force,
  Épique: CardClass.Épique
};

const toStoredValue = (value: number | string | null): number | null => {
  if (value === null) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isNaN(parsedValue) ? null : parsedValue;
};

const toStoredNumber = (value: string): number => {
  const parsedNumber = Number.parseInt(value, 10);

  if (Number.isNaN(parsedNumber)) {
    throw new Error(`Invalid card number ${value}`);
  }

  return parsedNumber;
};

const loadCatalog = (): SeedCatalog => {
  const raw = readFileSync(catalogPath, "utf-8");
  return JSON.parse(raw) as SeedCatalog;
};

const main = async (): Promise<void> => {
  const catalog = loadCatalog();

  for (const set of catalog.sets) {
    await prisma.series.upsert({
      where: { code: set.code },
      create: {
        code: set.code,
        label: set.label,
        name: set.name
      },
      update: {
        label: set.label,
        name: set.name
      }
    });
  }

  const seriesByCode = new Map(
    (await prisma.series.findMany({ select: { seriesID: true, code: true } })).map((series) => [
      series.code,
      series.seriesID
    ])
  );

  for (const card of catalog.cards) {
    const seriesId = seriesByCode.get(card.setCode);

    if (seriesId === undefined) {
      throw new Error(`Missing series for set code ${card.setCode}`);
    }

    const rarity = rarityMap[card.rarity];

    if (rarity === undefined) {
      throw new Error(`Unsupported rarity ${card.rarity} for card ${card.slug}`);
    }

    const cardClass = cardClassMap[card.cardClass];

    if (cardClass === undefined) {
      throw new Error(`Unsupported card class ${card.cardClass} for card ${card.slug}`);
    }

    await prisma.card.upsert({
      where: { slug: card.slug },
      create: {
        seriesId,
        slug: card.slug,
        number: toStoredNumber(card.number),
        copiesInProduct: card.copiesInProduct,
        name: card.name,
        cardClass,
        value: toStoredValue(card.value),
        type: card.type,
        archetype: card.archetype,
        rarity,
        effect: card.effect
      },
      update: {
        seriesId,
        number: toStoredNumber(card.number),
        copiesInProduct: card.copiesInProduct,
        name: card.name,
        cardClass,
        value: toStoredValue(card.value),
        type: card.type,
        archetype: card.archetype,
        rarity,
        effect: card.effect
      }
    });
  }
};

await main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
