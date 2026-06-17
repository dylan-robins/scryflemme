import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OidcSecurityService } from 'angular-auth-oidc-client';

import { ThemePillComponent } from '../../../../shared/ui/theme-pill.component';

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
                Claims and identity data returned by your Logto session.
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

        @if (isAuthenticated()) {
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
                    <dd class="mt-2 text-sm leading-6 text-[color:var(--theme-text)] break-words">
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
                The header uses the same auth state, so it will show your profile entry while the session is active.
              </p>
            </aside>
          </section>
        } @else {
          <section
            class="rounded-[2rem] border border-[color:color-mix(in_oklab,var(--theme-accent-danger)_34%,transparent)] bg-[color:color-mix(in_oklab,var(--theme-accent-danger)_10%,var(--theme-surface))] px-6 py-8 text-[color:var(--theme-text)]"
          >
            <h2 class="text-2xl font-semibold">You are not signed in</h2>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--theme-text-muted)]">
              Use the login button in the header to start a Logto session, then return here to inspect your profile claims.
            </p>
          </section>
        }
      </div>
    </main>
  `
})
export class ProfilePageComponent {
  private readonly oidc = inject(OidcSecurityService);

  protected readonly isAuthenticated = computed(() => this.oidc.authenticated().isAuthenticated);

  protected readonly profileFields = computed<ProfileField[]>(() => {
    const userData = this.oidc.userData().userData;

    if (!userData || typeof userData !== 'object') {
      return [];
    }

    const entries = Object.entries(userData)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => ({
        label: this.toLabel(key),
        value: this.toValue(value)
      }));

    const preferredOrder = ['Name', 'Email', 'Subject', 'Username', 'Given name', 'Family name'];

    return entries.sort((left, right) => {
      const leftIndex = preferredOrder.indexOf(left.label);
      const rightIndex = preferredOrder.indexOf(right.label);

      if (leftIndex === -1 && rightIndex === -1) {
        return left.label.localeCompare(right.label);
      }

      if (leftIndex === -1) {
        return 1;
      }

      if (rightIndex === -1) {
        return -1;
      }

      return leftIndex - rightIndex;
    });
  });

  protected readonly displayName = computed(() => {
    const userData = this.oidc.userData().userData;

    if (userData && typeof userData === 'object') {
      const candidate =
        (userData as Record<string, unknown>)['name'] ??
        (userData as Record<string, unknown>)['preferred_username'] ??
        (userData as Record<string, unknown>)['nickname'] ??
        (userData as Record<string, unknown>)['email'];

      if (typeof candidate === 'string' && candidate.trim() !== '') {
        return candidate;
      }
    }

    return 'Signed-in user';
  });

  protected readonly summary = computed(() => {
    const userData = this.oidc.userData().userData as Record<string, unknown> | undefined;

    if (!userData) {
      return 'Your session is active, but the identity payload did not include any profile claims.';
    }

    const email = userData['email'];
    if (typeof email === 'string' && email.trim() !== '') {
      return `Logged in with ${email}.`;
    }

    return 'Your session is active and profile claims are available below.';
  });

  private toLabel(key: string): string {
    return key
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  private toValue(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    return JSON.stringify(value, null, 2);
  }
}
