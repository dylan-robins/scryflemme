import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { OidcSecurityService } from 'angular-auth-oidc-client';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: OidcSecurityService,
          useValue: {
            authenticated: signal({
              isAuthenticated: false,
              allConfigsAuthenticated: []
            }),
            checkAuth: () =>
              of({
                isAuthenticated: false,
                allConfigsAuthenticated: []
              }),
            authorize: () => undefined,
            logoff: () => of(undefined)
          }
        }
      ]
    }).compileComponents();
  });

  it('creates the app shell', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });
});
