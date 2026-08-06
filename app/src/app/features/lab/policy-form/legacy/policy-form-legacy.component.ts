import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PolicyFormValue } from '../policy-form.model';

/**
 * Versión legacy (Angular 14-18): validación manual imperativa, duplicada
 * entre `canSubmit()` (lo que deshabilita el botón) y `submit()` (lo que
 * realmente decide si emitir). Bug real: alguien agregó la validación de
 * `holderName` en `canSubmit()` pero se olvidó de replicarla en
 * `submit()` — quedaron desincronizadas. Llamar a `submit()` directo
 * (como hace un test, o un doble-click, o un Enter en el form) deja pasar
 * una póliza sin titular.
 *
 * No editar: es la referencia de "lo que hay en producción".
 */
@Component({
  selector: 'app-policy-form-legacy',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
      <a
        routerLink="/lab"
        class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
            clip-rule="evenodd"
          />
        </svg>
        Refactor Lab
      </a>
      <a
        routerLink="/lab/policy-form"
        class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100"
      >
        ← Volver a tu implementación moderna
      </a>
    </div>

    <div class="rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
      <span
        class="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800"
      >
        Legacy (read-only)
      </span>
      <form class="mt-4 flex flex-col gap-3">
        <input
          name="holderName"
          [(ngModel)]="holderName"
          placeholder="Titular"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none"
        />
        <input
          name="premium"
          type="number"
          [(ngModel)]="premium"
          placeholder="Prima"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none"
        />
        <button
          type="button"
          [disabled]="!canSubmit()"
          (click)="submit()"
          class="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          Emitir
        </button>
      </form>
    </div>
  `,
})
export class PolicyFormLegacyComponent {
  @Output() issue = new EventEmitter<PolicyFormValue>();

  holderName = '';
  premium = 0;

  canSubmit(): boolean {
    return this.holderName.trim().length > 0 && this.premium > 0;
  }

  submit(): void {
    // BUG: no revisa holderName acá, solo premium — desincronizado de canSubmit().
    if (this.premium > 0) {
      this.issue.emit({ holderName: this.holderName, premium: this.premium });
    }
  }
}
