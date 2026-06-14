import { Component, input } from '@angular/core';

import { CardTileComponent } from './card-tile.component';
import type { CardRecord } from '../models/card.model';

@Component({
  selector: 'app-cards-grid',
  imports: [CardTileComponent],
  template: `
    @if (error()) {
      <section
        class="rounded-[1.75rem] border border-[color:color-mix(in_oklab,var(--theme-accent-danger)_34%,transparent)] bg-[color:color-mix(in_oklab,var(--theme-accent-danger)_10%,var(--theme-surface))] px-6 py-5 text-[color:var(--theme-text)]"
      >
        <p class="font-medium">{{ error() }}</p>
      </section>
    } @else if (loading()) {
      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        @for (_ of skeletonRows; track _) {
          <div
            class="h-56 animate-pulse rounded-[1.75rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]"
          ></div>
        }
      </section>
    } @else if (cards().length === 0) {
      <section
        class="rounded-[1.75rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-6 py-12 text-center text-[color:var(--theme-text-muted)]"
      >
        No cards found for this page.
      </section>
    } @else {
      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        @for (card of cards(); track card.id) {
          <app-card-tile [card]="card" />
        }
      </section>
    }
  `
})
export class CardsGridComponent {
  readonly cards = input<CardRecord[]>([]);
  readonly loading = input(false);
  readonly error = input<string | null>(null);

  protected readonly skeletonRows = [1, 2, 3, 4, 5, 6];
}
