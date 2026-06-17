import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OidcSecurityService } from 'angular-auth-oidc-client';

import { ProfilePageComponent } from './profile-page.component';

describe('ProfilePageComponent', () => {
  const userData = signal({
    userData: {
      email: 'alex@example.com',
      name: 'Alex Doe',
      preferred_username: 'alex',
      sub: 'user-123'
    },
    allUserData: []
  });

  const authenticated = signal({
    isAuthenticated: true,
    allConfigsAuthenticated: []
  });

  beforeEach(async () => {
    authenticated.set({
      isAuthenticated: true,
      allConfigsAuthenticated: []
    });
    userData.set({
      userData: {
        email: 'alex@example.com',
        name: 'Alex Doe',
        preferred_username: 'alex',
        sub: 'user-123'
      },
      allUserData: []
    });

    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [
        provideRouter([]),
        {
          provide: OidcSecurityService,
          useValue: {
            authenticated,
            userData
          }
        }
      ]
    }).compileComponents();
  });

  it('renders profile claims for an authenticated user', () => {
    const fixture = TestBed.createComponent(ProfilePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('My profile');
    expect(compiled.textContent).toContain('Alex Doe');
    expect(compiled.textContent).toContain('Logged in with alex@example.com.');
    expect(compiled.textContent).toContain('Email');
    expect(compiled.textContent).toContain('alex@example.com');
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
});
