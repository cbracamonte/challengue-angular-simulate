import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Versión legacy (Angular 14-18): usa @ViewChild/@ViewChildren, pero los
 * lee en ngOnInit() — ANTES de que la vista termine de inicializarse. Acá
 * `searchInput` todavía es `undefined` y `policyRows` está vacío.
 *
 * No editar: es la referencia de "lo que hay en producción", con el bug
 * real incluido (explota apenas se crea el componente).
 */
@Component({
  selector: 'app-recent-policies-legacy',
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
        routerLink="/lab/recent-policies"
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
      <input
        #searchInput
        type="text"
        placeholder="Buscar póliza..."
        class="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none"
      />
      <ul class="mt-4 flex flex-col gap-2 text-sm">
        @for (policy of policies; track policy.id) {
          <li #policyRow class="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
            {{ policy.holderName }}
          </li>
        }
      </ul>
      <p class="mt-4 border-t border-amber-100 pt-3 text-xs font-medium text-slate-500">
        Filas encontradas: <span class="font-semibold text-slate-800">{{ rowCount }}</span>
      </p>
    </div>
  `,
})
export class RecentPoliciesLegacyComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChildren('policyRow') policyRows!: QueryList<ElementRef>;

  readonly policies = [
    { id: 'POL-1', holderName: 'Ana Beatriz Ríos' },
    { id: 'POL-2', holderName: 'Tomás Vera' },
  ];

  rowCount = 0;

  ngOnInit(): void {
    // BUG: la vista todavía no existe acá. @ViewChild/@ViewChildren recién
    // se resuelven después de ngAfterViewInit.
    this.searchInput.nativeElement.focus();
    this.rowCount = this.policyRows.length;
  }
}
