import { describe, expect, it } from 'vitest';

import { getHealthPayload, getHelloPayload } from './app.js';

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
});
