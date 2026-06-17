import { describe, expect, it } from 'vitest';

import { AuthError, parseBearerToken, resolveAuthenticatedUserFields } from './logto.js';

describe('Logto auth helpers', () => {
  it('parses bearer tokens from the Authorization header', () => {
    expect(parseBearerToken('Bearer abc.def.ghi')).toBe('abc.def.ghi');
  });

  it('rejects missing bearer tokens', () => {
    expect(() => parseBearerToken(undefined)).toThrow(AuthError);
  });

  it('maps claims to the backend user identity fields', () => {
    expect(
      resolveAuthenticatedUserFields({
        sub: 'subject-123',
        email: 'ada@example.com',
        name: 'Ada Lovelace'
      })
    ).toEqual({
      logtoSubject: 'subject-123',
      email: 'ada@example.com',
      name: 'Ada Lovelace'
    });
  });

  it('falls back to preferred_username when no name is present', () => {
    expect(
      resolveAuthenticatedUserFields({
        sub: 'subject-123',
        preferred_username: 'ada'
      })
    ).toEqual({
      logtoSubject: 'subject-123',
      email: null,
      name: 'ada'
    });
  });
});
