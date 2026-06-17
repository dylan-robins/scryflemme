import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="px-5 pt-5 sm:px-8 lg:px-10">
      <div
        class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-[2rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-5 py-4 shadow-[var(--theme-shadow)] backdrop-blur"
      >
        <a routerLink="/" class="group flex min-w-0 flex-col gap-1">
          <span class="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[color:var(--theme-accent)]">
            Scryflemme
          </span>
          <span class="truncate text-lg font-semibold text-[color:var(--theme-text)]">
            Card browser
          </span>
        </a>

        <div class="flex shrink-0 items-center gap-3">
          @if (isAuthenticated()) {
            <a
              routerLink="/profile"
              class="rounded-full border border-[color:color-mix(in_oklab,var(--theme-accent)_36%,transparent)] bg-[color:color-mix(in_oklab,var(--theme-accent)_14%,var(--theme-surface-strong))] px-4 py-2 text-sm font-semibold text-[color:var(--theme-text)] transition hover:border-[color:var(--theme-accent)] hover:bg-[color:color-mix(in_oklab,var(--theme-accent)_20%,var(--theme-surface-strong))]"
            >
              My profile
            </a>
            <button
              type="button"
              class="rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-strong)] px-4 py-2 text-sm font-semibold text-[color:var(--theme-text)] transition hover:border-[color:var(--theme-border-strong)] hover:bg-[color:color-mix(in_oklab,var(--theme-accent)_10%,var(--theme-surface-strong))]"
              (click)="logout()"
            >
              Log out
            </button>
          } @else {
            <button
              type="button"
              class="rounded-full border border-[color:color-mix(in_oklab,var(--theme-accent)_36%,transparent)] bg-[color:color-mix(in_oklab,var(--theme-accent)_14%,var(--theme-surface-strong))] px-4 py-2 text-sm font-semibold text-[color:var(--theme-text)] transition hover:border-[color:var(--theme-accent)] hover:bg-[color:color-mix(in_oklab,var(--theme-accent)_20%,var(--theme-surface-strong))]"
              (click)="login()"
            >
              Login
            </button>
          }
        </div>
      </div>
    </header>
  `
})
export class AppHeaderComponent {
  private readonly oidc = inject(OidcSecurityService);

  protected readonly isAuthenticated = computed(() => this.oidc.authenticated().isAuthenticated);

  protected login(): void {
    this.oidc.authorize();
  }

  protected logout(): void {
    this.oidc.logoff().subscribe({
      error: (error) => {
        console.error('Failed to log out', error);
      }
    });
  }
}
