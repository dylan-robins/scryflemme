import { Component, computed, input } from '@angular/core';

type PillTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
type PillSize = 'sm' | 'md';

@Component({
  selector: 'app-theme-pill',
  template: '<span [class]="pillClasses()"><ng-content /></span>'
})
export class ThemePillComponent {
  readonly tone = input<PillTone>('neutral');
  readonly size = input<PillSize>('sm');

  protected readonly pillClasses = computed(() => {
    const toneClasses: Record<PillTone, string> = {
      neutral:
        'border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] text-[color:var(--theme-text-muted)]',
      accent:
        'border-[color:color-mix(in_oklab,var(--theme-accent)_38%,transparent)] bg-[color:color-mix(in_oklab,var(--theme-accent)_12%,transparent)] text-[color:var(--theme-accent)]',
      success:
        'border-[color:color-mix(in_oklab,var(--theme-accent-success)_38%,transparent)] bg-[color:color-mix(in_oklab,var(--theme-accent-success)_12%,transparent)] text-[color:var(--theme-accent-success)]',
      warning:
        'border-[color:color-mix(in_oklab,var(--theme-accent-warm)_38%,transparent)] bg-[color:color-mix(in_oklab,var(--theme-accent-warm)_12%,transparent)] text-[color:var(--theme-accent-warm)]',
      danger:
        'border-[color:color-mix(in_oklab,var(--theme-accent-danger)_38%,transparent)] bg-[color:color-mix(in_oklab,var(--theme-accent-danger)_12%,transparent)] text-[color:var(--theme-accent-danger)]'
    };

    const sizeClasses: Record<PillSize, string> = {
      sm: 'px-3 py-1 text-[0.64rem] tracking-[0.24em]',
      md: 'px-4 py-1.5 text-xs tracking-[0.22em]'
    };

    return [
      'inline-flex items-center gap-2 rounded-full border font-semibold uppercase',
      toneClasses[this.tone()],
      sizeClasses[this.size()]
    ].join(' ');
  });
}
