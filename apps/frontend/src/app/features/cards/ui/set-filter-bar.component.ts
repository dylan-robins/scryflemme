import { Component, input, output } from '@angular/core';

import type { CatalogSet } from '@scryflemme/types';

@Component({
  selector: 'app-set-filter-bar',
  template: `
    <section
      class="rounded-[1.75rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-5 shadow-[var(--theme-shadow)] backdrop-blur"
      aria-label="Set filters"
    >
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-text-muted)]">
            Filter by set
          </div>
          <p class="mt-2 text-sm leading-6 text-[color:var(--theme-text-muted)]">
            Narrow the catalog to one set and keep pagination in sync with the filtered result.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            [class]="buttonClasses(isAllSelected())"
            [attr.aria-pressed]="isAllSelected()"
            (click)="setSelected.emit(null)"
          >
            All sets
          </button>

          @for (set of sets(); track set.code) {
            <button
              type="button"
              [class]="buttonClasses(selectedSetCode() === set.code)"
              [attr.aria-pressed]="selectedSetCode() === set.code"
              (click)="setSelected.emit(set.code)"
            >
              {{ set.code }} · {{ set.uniqueCards }}
            </button>
          }
        </div>
      </div>
    </section>
  `
})
export class SetFilterBarComponent {
  readonly sets = input<CatalogSet[]>([]);
  readonly selectedSetCode = input<string | null>(null);
  readonly setSelected = output<string | null>();

  protected isAllSelected(): boolean {
    return this.selectedSetCode() === null;
  }

  protected buttonClasses(isActive: boolean): string {
    const base =
      'rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--theme-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--theme-bg)]';
    const active =
      'border-[color:var(--theme-accent)] bg-[color:color-mix(in_oklab,var(--theme-accent)_16%,var(--theme-surface-strong))] text-[color:var(--theme-text)]';
    const inactive =
      'border-[color:var(--theme-border)] bg-[color:var(--theme-surface-strong)] text-[color:var(--theme-text-muted)] hover:border-[color:var(--theme-border-strong)] hover:bg-[color:color-mix(in_oklab,var(--theme-accent)_10%,var(--theme-surface-strong))]';

    return [base, isActive ? active : inactive].join(' ');
  }
}
