import { Component, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Versión legacy (Angular 14-18, con zone.js): un campo plano mutado desde
 * `setInterval` "simplemente funcionaba" porque zone.js parcheaba
 * `setInterval` y disparaba un chequeo de cambios después de cada
 * callback. Esta app YA NO TIENE zone.js (zoneless es el default desde
 * Angular v21) — este mismo código acá nunca actualiza la pantalla.
 *
 * No editar: en un proyecto CON zone.js, este código es correcto. Es la
 * referencia de "lo que hay en producción" (de un repo viejo).
 */
@Component({
  selector: 'app-live-counter-legacy',
  imports: [RouterLink],
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
        routerLink="/lab/live-counter"
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
      <p class="mt-4 text-sm text-slate-700">
        Pólizas emitidas hoy: <span class="text-2xl font-bold tabular-nums text-amber-700">{{ count }}</span>
      </p>
    </div>
  `,
})
export class LiveCounterLegacyComponent {
  count = 0;

  constructor() {
    const intervalId = setInterval(() => {
      this.count++;
    }, 20);
    inject(DestroyRef).onDestroy(() => clearInterval(intervalId));
  }
}
