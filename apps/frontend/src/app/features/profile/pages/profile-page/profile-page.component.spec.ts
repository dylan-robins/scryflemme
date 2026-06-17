import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { OidcSecurityService } from 'angular-auth-oidc-client';

import { SessionApiService } from '../../../auth/data-access/session-api.service';
import { ProfilePageComponent } from './profile-page.component';

describe('ProfilePageComponent', () => {
  const authenticated = signal({
    isAuthenticated: true,
    allConfigsAuthenticated: []
  });

  const oidcMock = {
    authenticated
  };

  const sessionApiMock = {
    getCurrentUser: () =>
      of({
        userID: 7,
        logtoSubject: 'user-123',
        email: 'ada@example.com',
        name: 'Ada Lovelace'
      })
  };

  beforeEach(async () => {
    authenticated.set({
      isAuthenticated: true,
      allConfigsAuthenticated: []
    });

    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [
        provideRouter([]),
        {
          provide: OidcSecurityService,
          useValue: oidcMock
        },
        {
          provide: SessionApiService,
          useValue: sessionApiMock
        }
      ]
    }).compileComponents();
  });

  it('renders profile details from the backend user record', () => {
    const fixture = TestBed.createComponent(ProfilePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Ada Lovelace');
    expect(compiled.textContent).toContain('ada@example.com');
    expect(compiled.textContent).toContain('user-123');
    expect(compiled.textContent).toContain('User ID');
  });

  it('shows a signed-out message when unauthenticated', () => {
    authenticated.set({
      isAuthenticated: false,
      allConfigsAuthenticated: []
    });

    const fixture = TestBed.createComponent(ProfilePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('You are not signed in');
  });

  it('shows an error when the backend session is rejected', () => {
    TestBed.overrideProvider(SessionApiService, {
      useValue: {
        getCurrentUser: () => throwError(() => ({ status: 401 }))
      }
    });

    const fixture = TestBed.createComponent(ProfilePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Your backend session is not authorized');
  });
});
