import { routes } from './app.routes';

describe('app routes', () => {
  it('registers the auth callback and profile pages', () => {
    expect(routes.map((route) => route.path)).toEqual(['callback', 'profile', '', '**']);
  });
});
