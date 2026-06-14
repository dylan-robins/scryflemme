import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  template: `
    <section [class]="containerClasses()">
      <div class="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-text-muted)]">
        {{ label() }}
      </div>
      <div class="mt-2 text-2xl font-semibold text-[color:var(--theme-text)]">
        {{ value() }}
      </div>
      @if (helper()) {
        <p class="mt-2 text-sm leading-6 text-[color:var(--theme-text-muted)]">
          {{ helper() }}
        </p>
      }
    </section>
  `
})
export class MetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly helper = input<string | null>(null);
  readonly tone = input<'neutral' | 'accent'>('neutral');

  protected readonly containerClasses = computed(() => {
    const toneClasses: Record<'neutral' | 'accent', string> = {
      neutral:
        'rounded-[1.5rem] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-strong)] px-5 py-4 shadow-[var(--theme-shadow)]',
      accent:
        'rounded-[1.5rem] border border-[color:color-mix(in_oklab,var(--theme-accent)_28%,transparent)] bg-[color:color-mix(in_oklab,var(--theme-accent)_10%,var(--theme-surface-strong))] px-5 py-4 shadow-[var(--theme-shadow)]'
    };

    return toneClasses[this.tone()];
  });
}
