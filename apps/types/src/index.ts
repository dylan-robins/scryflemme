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
  copiesInProduct: number;
  name: string;
  cardClass: string;
  value: number | string | null;
  type: string | null;
  archetype: string | null;
  rarity: string;
  effect: string | null;
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
