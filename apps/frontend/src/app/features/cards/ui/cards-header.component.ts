import { Component, input } from '@angular/core';

import { ThemePillComponent } from '../../../shared/ui/theme-pill.component';
import { MetricCardComponent } from '../../../shared/ui/metric-card.component';
import type { CatalogSet } from '@scryflemme/types';

@Component({
  selector: 'app-cards-header',
  imports: [ThemePillComponent, MetricCardComponent],
  template: `
    <header
      class="rounded-[2rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-6 py-6 shadow-[var(--theme-shadow)] backdrop-blur sm:px-8"
    >
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          <app-theme-pill tone="success">
            Donjons et Procrastination card index
          </app-theme-pill>

          <h1
            class="mt-5 text-4xl font-semibold tracking-tight text-[color:var(--theme-text)] sm:text-5xl"
          >
            {{ title() }}
          </h1>

          <p class="mt-4 max-w-2xl text-base leading-7 text-[color:var(--theme-text-muted)] sm:text-lg">
            {{ subtitle() }}
          </p>

          <div class="mt-5 flex flex-wrap gap-2">
            @for (set of sets(); track set.code) {
              <app-theme-pill tone="neutral">
                {{ set.code }} · {{ set.uniqueCards }}
              </app-theme-pill>
            }
          </div>
        </div>

        <app-metric-card
          tone="accent"
          [label]="statusLabel()"
          [value]="statusValue()"
          [helper]="statusHelper()"
        />
      </div>
    </header>
  `
})
export class CardsHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly statusLabel = input.required<string>();
  readonly statusValue = input.required<string>();
  readonly statusHelper = input<string | null>(null);
  readonly sets = input<CatalogSet[]>([]);
}
