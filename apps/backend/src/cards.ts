import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface CatalogMeta {
  sourceFile: string;
  extractedAt: string;
  cardCount: number;
  notes: string[];
}

export interface CatalogSet {
  code: string;
  label: string;
  name: string;
  uniqueCards: number;
  totalCopiesInProduct: number;
}

export interface CardRecord {
  id: string;
  slug: string;
  setCode: string;
  setLabel: string;
  setName: string;
  number: string;
  rawNumber: string;
  copiesInProduct: number;
  name: string;
  cardClass: string;
  value: number | string | null;
  type: string | null;
  archetype: string | null;
  rarity: string;
  effect: string | null;
  ownedClassic: boolean;
  ownedGold: boolean | null;
}

export interface CardCatalog {
  meta: CatalogMeta;
  sets: CatalogSet[];
  cards: CardRecord[];
}

export interface CardsPage extends CardCatalog {
  activeSetCode: string | null;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 48;

const cardsFileUrl = new URL('../src/data/seed.json', import.meta.url);
const cardsFilePath = fileURLToPath(cardsFileUrl);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === 'string');

const isCatalogMeta = (value: unknown): value is CatalogMeta => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.sourceFile === 'string' &&
    typeof candidate.extractedAt === 'string' &&
    typeof candidate.cardCount === 'number' &&
    Number.isInteger(candidate.cardCount) &&
    isStringArray(candidate.notes)
  );
};

const isCatalogSet = (value: unknown): value is CatalogSet => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.code === 'string' &&
    typeof candidate.label === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.uniqueCards === 'number' &&
    Number.isInteger(candidate.uniqueCards) &&
    typeof candidate.totalCopiesInProduct === 'number' &&
    Number.isInteger(candidate.totalCopiesInProduct)
  );
};

const isCardRecord = (value: unknown): value is CardRecord => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.slug === 'string' &&
    typeof candidate.setCode === 'string' &&
    typeof candidate.setLabel === 'string' &&
    typeof candidate.setName === 'string' &&
    typeof candidate.number === 'string' &&
    typeof candidate.rawNumber === 'string' &&
    typeof candidate.copiesInProduct === 'number' &&
    Number.isInteger(candidate.copiesInProduct) &&
    typeof candidate.name === 'string' &&
    typeof candidate.cardClass === 'string' &&
    (typeof candidate.value === 'number' ||
      typeof candidate.value === 'string' ||
      candidate.value === null) &&
    (typeof candidate.type === 'string' || candidate.type === null) &&
    (typeof candidate.archetype === 'string' || candidate.archetype === null) &&
    typeof candidate.rarity === 'string' &&
    (typeof candidate.effect === 'string' || candidate.effect === null) &&
    typeof candidate.ownedClassic === 'boolean' &&
    (typeof candidate.ownedGold === 'boolean' || candidate.ownedGold === null)
  );
};

const loadCatalog = (): CardCatalog => {
  const raw = readFileSync(cardsFilePath, 'utf-8');
  const parsed: unknown = JSON.parse(raw);

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error(`Invalid catalog data in ${cardsFilePath}`);
  }

  const candidate = parsed as Record<string, unknown>;

  if (
    !isCatalogMeta(candidate.meta) ||
    !Array.isArray(candidate.sets) ||
    !candidate.sets.every(isCatalogSet) ||
    !Array.isArray(candidate.cards) ||
    !candidate.cards.every(isCardRecord)
  ) {
    throw new Error(`Invalid catalog data in ${cardsFilePath}`);
  }

  return {
    meta: candidate.meta,
    sets: candidate.sets,
    cards: candidate.cards
  };
};

export const catalog = loadCatalog();

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

const sortCardsById = (cards: CardRecord[]): CardRecord[] =>
  [...cards].sort((left, right) => left.id.localeCompare(right.id, 'en', { numeric: true }));

const normalizeSetCode = (setCode: string | null | undefined): string | null => {
  if (typeof setCode !== 'string') {
    return null;
  }

  const trimmed = setCode.trim();

  return trimmed.length > 0 ? trimmed.toUpperCase() : null;
};

export const getCardsPage = (
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  setCode: string | null = null
): CardsPage => {
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

export const getCardsPageFromQuery = (query: {
  page?: unknown;
  pageSize?: unknown;
  setCode?: unknown;
}): CardsPage => {
  const page = parseIntegerQueryValue(query.page, 1, 1, Number.MAX_SAFE_INTEGER);
  const pageSize = parseIntegerQueryValue(query.pageSize, DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE);
  const setCode = Array.isArray(query.setCode) ? query.setCode[0] : query.setCode;

  return getCardsPage(page, pageSize, typeof setCode === 'string' ? setCode : null);
};
