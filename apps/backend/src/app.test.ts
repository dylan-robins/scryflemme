import { describe, expect, it } from 'vitest';

import { getHealthPayload, getHelloPayload } from './app.js';
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

  it('cards pagination returns a bounded slice with metadata', async () => {
    const payload = await getCardsPage(2, 5);
    const ids = payload.cards.map((card) => card.id);

    expect(payload.page).toBe(2);
    expect(payload.pageSize).toBe(5);
    expect(payload.total).toBe(124);
    expect(payload.totalPages).toBe(25);
    expect(payload.cards).toHaveLength(5);
    expect(payload.cards[0]?.id).toBe('s1-05');
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
