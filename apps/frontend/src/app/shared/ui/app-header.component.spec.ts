import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { OidcSecurityService } from 'angular-auth-oidc-client';

import { AppHeaderComponent } from './app-header.component';

describe('AppHeaderComponent', () => {
  const authenticated = signal({
    isAuthenticated: false,
    allConfigsAuthenticated: []
  });

  let authorizeCalls = 0;
  let logoffCalls = 0;

  const oidcMock = {
    authenticated,
    authorize: () => {
      authorizeCalls += 1;
    },
    logoff: () => {
      logoffCalls += 1;
      return of(undefined);
    }
  };

  beforeEach(async () => {
    authenticated.set({
      isAuthenticated: false,
      allConfigsAuthenticated: []
    });
    authorizeCalls = 0;
    logoffCalls = 0;

    await TestBed.configureTestingModule({
      imports: [AppHeaderComponent],
      providers: [
        provideRouter([]),
        {
          provide: OidcSecurityService,
          useValue: oidcMock
        }
      ]
    }).compileComponents();
  });

  it('shows login when unauthenticated and starts the login flow', () => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Login');

    const loginButton = Array.from(compiled.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Login'
    ) as HTMLButtonElement;

    loginButton.click();

    expect(authorizeCalls).toBe(1);
  });

  it('shows profile actions when authenticated and logs out', () => {
    authenticated.set({
      isAuthenticated: true,
      allConfigsAuthenticated: []
    });

    const fixture = TestBed.createComponent(AppHeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('My profile');
    expect(compiled.textContent).toContain('Log out');

    const logoutButton = Array.from(compiled.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Log out'
    ) as HTMLButtonElement;

    logoutButton.click();

    expect(logoffCalls).toBe(1);
  });
});
