import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-callback-page',
  template: `
    <main class="px-5 pb-8 pt-6 sm:px-8 lg:px-10">
      <section
        class="mx-auto flex w-full max-w-7xl flex-col gap-4 rounded-[2rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-6 py-8 shadow-[var(--theme-shadow)] backdrop-blur"
      >
        <div class="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-accent)]">
          Logto callback
        </div>
        <h1 class="text-3xl font-semibold tracking-tight text-[color:var(--theme-text)]">
          Completing sign-in
        </h1>
        <p class="max-w-2xl text-base leading-7 text-[color:var(--theme-text-muted)]">
          We are validating your login response and loading your session.
        </p>
      </section>
    </main>
  `
})
export class AuthCallbackPageComponent {}
