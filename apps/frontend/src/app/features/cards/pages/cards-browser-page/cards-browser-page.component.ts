import { Component, computed, effect, inject, signal } from '@angular/core';

import { CardsApiService } from '../../data-access/cards-api.service';
import type { CardRecord, CatalogMeta, CatalogSet } from '../../models/card.model';
import { CardsHeaderComponent } from '../../ui/cards-header.component';
import { CardsGridComponent } from '../../ui/cards-grid.component';
import { PaginationControlsComponent } from '../../ui/pagination-controls.component';
import { SetFilterBarComponent } from '../../ui/set-filter-bar.component';

@Component({
  selector: 'app-cards-browser-page',
  imports: [
    CardsHeaderComponent,
    CardsGridComponent,
    PaginationControlsComponent,
    SetFilterBarComponent
  ],
  templateUrl: './cards-browser-page.component.html',
  styleUrl: './cards-browser-page.component.css'
})
export class CardsBrowserPageComponent {
  private readonly cardsApi = inject(CardsApiService);

  protected readonly pageSize = signal(12);
  protected readonly page = signal(1);
  protected readonly meta = signal<CatalogMeta | null>(null);
  protected readonly sets = signal<CatalogSet[]>([]);
  protected readonly activeSetCode = signal<string | null>(null);
  protected readonly cards = signal<CardRecord[]>([]);
  protected readonly total = signal(0);
  protected readonly totalPages = signal(1);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly startIndex = computed(() => {
    if (this.total() === 0) {
      return 0;
    }

    return (this.page() - 1) * this.pageSize() + 1;
  });

  protected readonly endIndex = computed(() =>
    Math.min(this.total(), this.page() * this.pageSize())
  );

  protected readonly statusLabel = computed(() => {
    if (this.loading()) {
      return 'Catalog';
    }

    return 'Catalog';
  });

  protected readonly statusValue = computed(() => {
    if (this.loading()) {
      return 'Loading cards';
    }

    if (this.error()) {
      return 'Needs attention';
    }

    return `${this.total()} cards`;
  });

  protected readonly statusHelper = computed(() => {
    if (this.loading()) {
      return 'Fetching the current catalog from the backend.';
    }

    if (this.error()) {
      return 'Reload the page or check the backend service.';
    }

    const meta = this.meta();
    if (!meta) {
      return `Page ${this.page()} of ${this.totalPages()}`;
    }

    const setLabel =
      this.activeSetCode() === null
        ? 'All sets'
        : this.sets().find((set) => set.code === this.activeSetCode())?.name ?? this.activeSetCode();

    return `${setLabel} · extracted ${meta.extractedAt}`;
  });

  constructor() {
    effect((onCleanup) => {
      const page = this.page();
      const pageSize = this.pageSize();
      const setCode = this.activeSetCode();

      this.loading.set(true);
      this.error.set(null);

      const subscription = this.cardsApi.getCards(page, pageSize, setCode).subscribe({
        next: (response) => {
          this.meta.set(response.meta);
          this.sets.set(response.sets);
          this.activeSetCode.set(response.activeSetCode);
          this.cards.set(response.cards);
          this.page.set(response.page);
          this.pageSize.set(response.pageSize);
          this.total.set(response.total);
          this.totalPages.set(response.totalPages);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to load card list', error);
          this.error.set('Unable to load the card catalog right now.');
          this.loading.set(false);
        }
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected previousPage(): void {
    if (this.page() > 1) {
      this.page.update((currentPage) => currentPage - 1);
    }
  }

  protected nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update((currentPage) => currentPage + 1);
    }
  }

  protected goToPage(page: number): void {
    this.page.set(page);
  }

  protected selectSet(setCode: string | null): void {
    if (setCode === this.activeSetCode()) {
      return;
    }

    this.activeSetCode.set(setCode);
    this.page.set(1);
  }
}
