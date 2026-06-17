import { describe, expect, it, vi } from 'vitest';

const { mockCards, mockSeries, mockPrisma } = vi.hoisted(() => {
  const mockCards = Array.from({ length: 124 }, (_, index) => {
    const cardNumber = String(index + 1).padStart(2, '0');
    const setCode = index < 48 ? 'S1' : index < 80 ? 'S2' : index < 112 ? 'S3' : 'S4';

    return {
      copiesInProduct: 1,
      series: {
        code: setCode,
        label: `Set ${setCode.slice(1)}`,
        name: `Series ${setCode.slice(1)}`
      },
      seriesId: Number(setCode.slice(1)),
      slug: `${setCode.toLowerCase()}-${cardNumber}`,
      number: Number(cardNumber),
      name: `Card ${setCode}-${cardNumber}`,
      cardClass: 'Magie',
      value: null,
      type: null,
      archetype: null,
      rarity: 'COMMON',
      effect: null
    };
  });

  const mockSeries = ['S1', 'S2', 'S3', 'S4'].map((code) => {
    const cards = mockCards.filter((card) => card.series.code === code);

    return {
      seriesID: Number(code.slice(1)),
      code,
      label: `Set ${code.slice(1)}`,
      name: `Series ${code.slice(1)}`,
      cards
    };
  });

  const mockPrisma = {
    series: {
      findMany: vi.fn(async () => mockSeries)
    },
    card: {
      findMany: vi.fn(async () => mockCards)
    }
  };

  return {
    mockCards,
    mockSeries,
    mockPrisma
  };
});

vi.mock('./lib/prisma.js', () => ({
  prisma: mockPrisma
}));

import { getHealthPayload, getHelloPayload, getMePayload } from './app.js';
import { getCardsPage, getCardsPageFromQuery } from './cards.js';

describe('backend payloads', () => {
  it('health payload includes the service name and timestamp', () => {
    const payload = getHealthPayload();

    expect(payload.ok).toBe(true);
    expect(payload.service).toBe('backend');
    expect(payload.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('hello payload returns the greeting message', () => {
    expect(getHelloPayload()).toEqual({
      message: 'Hello from Express'
    });
  });

  it('me payload passes through the authenticated user record', () => {
    expect(
      getMePayload({
        userID: 42,
        logtoSubject: 'subject-123',
        email: 'ada@example.com',
        name: 'Ada Lovelace'
      })
    ).toEqual({
      userID: 42,
      logtoSubject: 'subject-123',
      email: 'ada@example.com',
      name: 'Ada Lovelace'
    });
  });

  it('cards pagination returns a bounded slice with metadata', async () => {
    const payload = await getCardsPage(2, 5);
    const ids = payload.cards.map((card) => card.id);

    expect(payload.page).toBe(2);
    expect(payload.pageSize).toBe(5);
    expect(payload.total).toBe(124);
    expect(payload.totalPages).toBe(25);
    expect(payload.cards).toHaveLength(5);
    expect(payload.cards[0]?.id).toBe('s1-06');
    expect(ids).toEqual([...ids].sort((left, right) => left.localeCompare(right, 'en', { numeric: true })));
    expect(payload.meta.cardCount).toBe(124);
    expect(payload.sets).toHaveLength(4);
    expect(payload.activeSetCode).toBeNull();
  });

  it('cards query parsing clamps invalid values', async () => {
    const payload = await getCardsPageFromQuery({
      page: '-3',
      pageSize: '100'
    });

    expect(payload.page).toBe(1);
    expect(payload.pageSize).toBe(48);
  });

  it('cards can be filtered by set code before pagination', async () => {
    const payload = await getCardsPage(1, 12, 's2');

    expect(payload.activeSetCode).toBe('S2');
    expect(payload.total).toBe(32);
    expect(payload.totalPages).toBe(3);
    expect(payload.cards.every((card) => card.setCode === 'S2')).toBe(true);
  });
});
