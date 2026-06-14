import { Component, computed, input } from '@angular/core';

import { ThemePillComponent } from '../../../shared/ui/theme-pill.component';
import type { CardRecord } from '../models/card.model';
import { formatCardValue, formatOwnedStatus, rarityTone } from '../util/card-formatters';

@Component({
  selector: 'app-card-tile',
  imports: [ThemePillComponent],
  template: `
    <article
      class="flex h-full flex-col rounded-[1.75rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-strong)] p-5 shadow-[var(--theme-shadow)] transition duration-200 hover:-translate-y-0.5 hover:border-[color:var(--theme-border-strong)]"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-accent)]">
            {{ card().setCode }}-{{ card().number }}
          </p>
          <h2 class="mt-2 text-2xl font-semibold leading-tight text-[color:var(--theme-text)]">
            {{ card().name }}
          </h2>
          <p class="mt-2 text-sm leading-6 text-[color:var(--theme-text-muted)]">
            {{ card().setLabel }} · {{ card().setName }}
          </p>
        </div>

        <app-theme-pill [tone]="rarityTone()" size="md">
          {{ card().rarity }}
        </app-theme-pill>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <app-theme-pill tone="accent">
          {{ card().cardClass }}
        </app-theme-pill>

        <app-theme-pill tone="neutral">
          {{ formatValue() }}
        </app-theme-pill>

        @if (card().type) {
          <app-theme-pill tone="neutral">
            {{ card().type }}
          </app-theme-pill>
        }

        @if (card().archetype) {
          <app-theme-pill tone="success">
            {{ card().archetype }}
          </app-theme-pill>
        }

        <app-theme-pill tone="neutral">
          {{ card().copiesInProduct }} in product
        </app-theme-pill>
      </div>

      <div class="mt-4 rounded-[1.25rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-4">
        <div class="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-text-muted)]">
          Effect
        </div>
        <p class="mt-2 text-base leading-7 text-[color:var(--theme-text)]">
          {{ card().effect ?? 'No effect text provided.' }}
        </p>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <app-theme-pill [tone]="ownedClassicTone()">
          Classic {{ formatOwnedStatus(card().ownedClassic) }}
        </app-theme-pill>

        <app-theme-pill [tone]="ownedGoldTone()">
          Gold {{ formatOwnedStatus(card().ownedGold) }}
        </app-theme-pill>
      </div>

      <div class="mt-4 text-xs uppercase tracking-[0.24em] text-[color:var(--theme-text-muted)]">
        <span>{{ card().slug }}</span>
        <span class="mx-2">•</span>
        <span>{{ card().rawNumber }}</span>
      </div>
    </article>
  `
})
export class CardTileComponent {
  readonly card = input.required<CardRecord>();

  protected readonly rarityTone = computed(() => rarityTone(this.card().rarity));

  protected readonly ownedClassicTone = computed(() =>
    this.card().ownedClassic ? 'success' : 'neutral'
  );

  protected readonly ownedGoldTone = computed(() =>
    this.card().ownedGold === true ? 'success' : this.card().ownedGold === false ? 'danger' : 'warning'
  );

  protected readonly formatValue = computed(() => formatCardValue(this.card().value));

  protected readonly formatOwnedStatus = formatOwnedStatus;
}
