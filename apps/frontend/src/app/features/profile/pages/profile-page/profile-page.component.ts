import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OidcSecurityService } from 'angular-auth-oidc-client';

import { ThemePillComponent } from '../../../../shared/ui/theme-pill.component';
import { SessionApiService, type BackendUser } from '../../../auth/data-access/session-api.service';

type ProfileField = {
  label: string;
  value: string;
};

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, ThemePillComponent],
  template: `
    <main class="px-5 pb-8 pt-6 sm:px-8 lg:px-10">
      <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section
          class="rounded-[2rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-6 py-8 shadow-[var(--theme-shadow)] backdrop-blur sm:px-8"
        >
          <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div class="max-w-3xl">
              <app-theme-pill tone="success">Profile</app-theme-pill>
              <h1 class="mt-5 text-4xl font-semibold tracking-tight text-[color:var(--theme-text)] sm:text-5xl">
                My profile
              </h1>
              <p class="mt-4 max-w-2xl text-base leading-7 text-[color:var(--theme-text-muted)] sm:text-lg">
                Your backend session resolves the logged-in identity and links it to the local user table.
              </p>
            </div>

            <a
              routerLink="/"
              class="inline-flex items-center justify-center rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-strong)] px-4 py-2 text-sm font-semibold text-[color:var(--theme-text)] transition hover:border-[color:var(--theme-border-strong)] hover:bg-[color:color-mix(in_oklab,var(--theme-accent)_10%,var(--theme-surface-strong))]"
            >
              Back to catalog
            </a>
          </div>
        </section>

        @if (loading()) {
          <section
            class="rounded-[2rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-6 py-8 shadow-[var(--theme-shadow)] backdrop-blur"
          >
            <h2 class="text-2xl font-semibold text-[color:var(--theme-text)]">Loading your account</h2>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--theme-text-muted)]">
              We are asking the backend to resolve the current access token and link it to a local user record.
            </p>
          </section>
        } @else if (isAuthenticated()) {
          <section
            class="grid gap-6 rounded-[2rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-[var(--theme-shadow)] backdrop-blur lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]"
          >
            <div>
              <div class="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-text-muted)]">
                Account details
              </div>

              <h2 class="mt-3 text-2xl font-semibold text-[color:var(--theme-text)]">
                {{ displayName() }}
              </h2>

              <p class="mt-2 text-sm leading-6 text-[color:var(--theme-text-muted)]">
                {{ summary() }}
              </p>

              <dl class="mt-6 grid gap-4 sm:grid-cols-2">
                @for (field of profileFields(); track field.label) {
                  <div class="rounded-[1.35rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-strong)] p-4">
                    <dt class="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-text-muted)]">
                      {{ field.label }}
                    </dt>
                    <dd class="mt-2 break-words text-sm leading-6 text-[color:var(--theme-text)]">
                      {{ field.value }}
                    </dd>
                  </div>
                }
              </dl>
            </div>

            <aside
              class="rounded-[1.5rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-strong)] p-5"
            >
              <div class="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-text-muted)]">
                Session
              </div>
              <div class="mt-3 text-xl font-semibold text-[color:var(--theme-text)]">
                Authenticated
              </div>
              <p class="mt-2 text-sm leading-6 text-[color:var(--theme-text-muted)]">
                The backend verified your token, resolved the Logto subject, and upserted the corresponding user row.
              </p>
            </aside>
          </section>
        } @else {
          <section
            class="rounded-[2rem] border border-[color:color-mix(in_oklab,var(--theme-accent-danger)_34%,transparent)] bg-[color:color-mix(in_oklab,var(--theme-accent-danger)_10%,var(--theme-surface))] px-6 py-8 text-[color:var(--theme-text)]"
          >
            <h2 class="text-2xl font-semibold">You are not signed in</h2>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--theme-text-muted)]">
              Use the login button in the header to start a Logto session, then come back here so the backend can
              create or load your linked user record.
            </p>
          </section>
        }

        @if (error()) {
          <section
            class="rounded-[2rem] border border-[color:color-mix(in_oklab,var(--theme-accent-danger)_34%,transparent)] bg-[color:color-mix(in_oklab,var(--theme-accent-danger)_10%,var(--theme-surface))] px-6 py-8 text-[color:var(--theme-text)]"
          >
            <h2 class="text-2xl font-semibold">Could not load account</h2>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--theme-text-muted)]">
              {{ error() }}
            </p>
          </section>
        }
      </div>
    </main>
  `
})
export class ProfilePageComponent {
  private readonly oidc = inject(OidcSecurityService);
  private readonly sessionApi = inject(SessionApiService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly user = signal<BackendUser | null>(null);

  protected readonly isAuthenticated = computed(() => this.user() !== null);

  protected readonly profileFields = computed<ProfileField[]>(() => {
    const user = this.user();

    if (!user) {
      return [];
    }

    return [
      {
        label: 'User ID',
        value: String(user.userID)
      },
      {
        label: 'Logto subject',
        value: user.logtoSubject
      },
      {
        label: 'Email',
        value: user.email ?? 'Not provided'
      },
      {
        label: 'Name',
        value: user.name ?? 'Not provided'
      }
    ];
  });

  protected readonly displayName = computed(() => {
    const user = this.user();

    if (!user) {
      return 'Signed-out user';
    }

    if (user.name && user.name.trim() !== '') {
      return user.name;
    }

    if (user.email && user.email.trim() !== '') {
      return user.email;
    }

    return 'Signed-in user';
  });

  protected readonly summary = computed(() => {
    const user = this.user();

    if (!user) {
      return 'The backend did not return a linked user record for this session.';
    }

    if (user.email) {
      return `The backend matched your Logto subject to ${user.email}.`;
    }

    return 'The backend matched your Logto subject and created a local user entry without an email claim.';
  });

  constructor() {
    effect((onCleanup) => {
      const isAuthenticated = this.oidc.authenticated().isAuthenticated;

      if (!isAuthenticated) {
        this.loading.set(false);
        this.user.set(null);
        this.error.set(null);
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      const subscription = this.sessionApi.getCurrentUser().subscribe({
        next: (user) => {
          this.user.set(user);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to load backend-linked profile', error);
          this.user.set(null);
          this.loading.set(false);

          if (error?.status === 401) {
            this.error.set('Your backend session is not authorized. Sign in again.');
            return;
          }

          this.error.set('Unable to load your backend-linked profile right now.');
        }
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
