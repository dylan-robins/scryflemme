import type {
  CardCatalog,
  CardRecord,
  CardsPage,
  CatalogMeta,
  CatalogSet
} from '@scryflemme/types';

import type { PrismaClient } from '../generated/prisma/client.js';

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 48;
const CATALOG_EXTRACTED_AT = '2026-06-14T01:02:15+00:00';

const clampPage = (page: number, totalPages: number): number => {
  if (totalPages === 0) {
    return 1;
  }

  return Math.min(Math.max(page, 1), totalPages);
};

const clampPageSize = (pageSize: number): number => {
  if (!Number.isFinite(pageSize)) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(Math.max(Math.trunc(pageSize), 1), MAX_PAGE_SIZE);
};

const normalizeSetCode = (setCode: string | null | undefined): string | null => {
  if (typeof setCode !== 'string') {
    return null;
  }

  const trimmed = setCode.trim();

  return trimmed.length > 0 ? trimmed.toUpperCase() : null;
};

const sortCardsById = (cards: CardRecord[]): CardRecord[] =>
  [...cards].sort((left, right) => left.id.localeCompare(right.id, 'en', { numeric: true }));

const formatCardId = (setCode: string, number: number): string =>
  `${setCode.toLowerCase()}-${String(number).padStart(2, '0')}`;

const formatRarity = (rarity: string): string => {
  switch (rarity) {
    case 'COMMON':
      return 'Commune';
    case 'RARE':
      return 'Rare';
    case 'LEGENDARY':
      return 'Légendaire';
    case 'SECRET':
      return 'Secrète';
    default:
      return rarity;
  }
};

const loadCatalogFromDatabase = async (prisma: PrismaClient): Promise<CardCatalog> => {
  const [seriesRows, cardRows] = await Promise.all([
    prisma.series.findMany({
      include: {
        cards: {
          select: {
            copiesInProduct: true
          }
        }
      },
      orderBy: {
        seriesID: 'asc'
      }
    }),
    prisma.card.findMany({
      include: {
        series: {
          select: {
            code: true,
            label: true,
            name: true
          }
        }
      }
    })
  ]);

  const sets = seriesRows.map((series): CatalogSet => ({
    code: series.code,
    label: series.label,
    name: series.name,
    uniqueCards: series.cards.length,
    totalCopiesInProduct: series.cards.reduce((total, card) => total + card.copiesInProduct, 0)
  }));

  const cards = cardRows.map((card): CardRecord => {
    const cardId = formatCardId(card.series.code, card.number);

    return {
      id: cardId,
      slug: card.slug,
      setCode: card.series.code,
      setLabel: card.series.label,
      setName: card.series.name,
      number: String(card.number).padStart(2, '0'),
      copiesInProduct: card.copiesInProduct,
      name: card.name,
      cardClass: card.cardClass,
      value: card.value,
      type: card.type,
      archetype: card.archetype,
      rarity: formatRarity(card.rarity),
      effect: card.effect
    };
  });

  return {
    meta: {
      sourceFile: 'Prisma Postgres',
      extractedAt: CATALOG_EXTRACTED_AT,
      cardCount: cards.length,
      notes: [
        'Catalog content is served from Prisma Postgres.',
        'Local JSON is only used for seed data.'
      ]
    },
    sets,
    cards
  };
};

export const getCardsPage = async (
  prisma: PrismaClient,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  setCode: string | null = null
): Promise<CardsPage> => {
  const catalog = await loadCatalogFromDatabase(prisma);
  const safePageSize = clampPageSize(pageSize);
  const activeSetCode = normalizeSetCode(setCode);
  const filteredCards =
    activeSetCode === null
      ? catalog.cards
      : catalog.cards.filter((card) => card.setCode.toUpperCase() === activeSetCode);
  const sortedCards = sortCardsById(filteredCards);
  const total = sortedCards.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = clampPage(Math.trunc(page), totalPages);
  const start = (safePage - 1) * safePageSize;

  return {
    activeSetCode,
    meta: catalog.meta,
    sets: catalog.sets,
    cards: sortedCards.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages
  };
};

export const parseIntegerQueryValue = (
  value: unknown,
  fallback: number,
  minimum: number,
  maximum: number
): number => {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (candidate === undefined || candidate === null || candidate === '') {
    return fallback;
  }

  const numeric = typeof candidate === 'number' ? candidate : Number(candidate);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.min(Math.max(Math.trunc(numeric), minimum), maximum);
};

export const getCardsPageFromQuery = async (query: {
  page?: unknown;
  pageSize?: unknown;
  setCode?: unknown;
}, prisma: PrismaClient): Promise<CardsPage> => {
  const page = parseIntegerQueryValue(query.page, 1, 1, Number.MAX_SAFE_INTEGER);
  const pageSize = parseIntegerQueryValue(query.pageSize, DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE);
  const setCode = Array.isArray(query.setCode) ? query.setCode[0] : query.setCode;

  return getCardsPage(prisma, page, pageSize, typeof setCode === 'string' ? setCode : null);
};
