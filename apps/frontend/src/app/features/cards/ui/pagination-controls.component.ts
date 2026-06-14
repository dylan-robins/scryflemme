import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination-controls',
  template: `
    <nav
      aria-label="Card pagination"
      class="flex flex-col gap-4 rounded-[2rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-5 shadow-[var(--theme-shadow)] backdrop-blur sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="text-sm text-[color:var(--theme-text-muted)]">
        Page {{ page() }} of {{ totalPages() }}
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-strong)] px-4 py-2 text-sm font-medium text-[color:var(--theme-text)] transition hover:border-[color:var(--theme-border-strong)] hover:bg-[color:color-mix(in_oklab,var(--theme-accent)_12%,var(--theme-surface-strong))] disabled:cursor-not-allowed disabled:opacity-40"
          [disabled]="!hasPreviousPage() || loading()"
          (click)="previous.emit()"
        >
          Previous
        </button>

        <div class="flex flex-wrap items-center gap-2">
          @for (pageNumber of visiblePages(); track pageNumber) {
            <button
              type="button"
              [class]="pageButtonClasses(pageNumber === page())"
              [disabled]="loading() || pageNumber === page()"
              (click)="pageSelected.emit(pageNumber)"
            >
              {{ pageNumber }}
            </button>
          }
        </div>

        <button
          type="button"
          class="rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-strong)] px-4 py-2 text-sm font-medium text-[color:var(--theme-text)] transition hover:border-[color:var(--theme-border-strong)] hover:bg-[color:color-mix(in_oklab,var(--theme-accent)_12%,var(--theme-surface-strong))] disabled:cursor-not-allowed disabled:opacity-40"
          [disabled]="!hasNextPage() || loading()"
          (click)="next.emit()"
        >
          Next
        </button>
      </div>
    </nav>
  `
})
export class PaginationControlsComponent {
  readonly page = input(1);
  readonly totalPages = input(1);
  readonly loading = input(false);

  readonly previous = output<void>();
  readonly next = output<void>();
  readonly pageSelected = output<number>();

  protected readonly visiblePages = computed(() => {
    const totalPages = this.totalPages();
    const currentPage = this.page();
    const windowSize = 5;

    if (totalPages <= windowSize) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const halfWindow = Math.floor(windowSize / 2);
    let start = Math.max(1, currentPage - halfWindow);
    const end = Math.min(totalPages, start + windowSize - 1);

    start = Math.max(1, end - windowSize + 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });

  protected readonly hasPreviousPage = computed(() => this.page() > 1);
  protected readonly hasNextPage = computed(() => this.page() < this.totalPages());

  protected pageButtonClasses(isActive: boolean): string {
    const base =
      'min-w-11 rounded-full border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40';
    const active =
      'border-[color:var(--theme-accent)] bg-[color:color-mix(in_oklab,var(--theme-accent)_16%,var(--theme-surface-strong))] text-[color:var(--theme-text)]';
    const inactive =
      'border-[color:var(--theme-border)] bg-[color:var(--theme-surface-strong)] text-[color:var(--theme-text-muted)] hover:border-[color:var(--theme-border-strong)] hover:bg-[color:color-mix(in_oklab,var(--theme-accent)_10%,var(--theme-surface-strong))]';

    return [base, isActive ? active : inactive].join(' ');
  }
}
