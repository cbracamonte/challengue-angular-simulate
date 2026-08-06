import { Component, ElementRef, computed, effect, viewChild, viewChildren } from '@angular/core';

/**
 * Fundamento teórico (docs oficiales de Angular — API `viewChild`/
 * `viewChildren` y guía "Component queries"): a diferencia de
 * `@ViewChild`/`@ViewChildren`, que solo se resuelven después de
 * `ngAfterViewInit` (leerlos antes, como en la versión legacy con
 * `ngOnInit`, da `undefined`/una `QueryList` vacía), las signal queries
 * devuelven un `Signal` que existe desde el constructor: vale `undefined`
 * (o `[]` para `viewChildren`) hasta que la vista se resuelve, y cambia de
 * valor solo — sin que el componente tenga que "saber" en qué lifecycle
 * hook consultarlo.
 *
 * Esto elimina la pregunta de qué hook usar: en vez de acoplarse a
 * `ngAfterViewInit`, un `effect()` se re-ejecuta automáticamente cada vez
 * que alguna signal que lee cambia de valor — acá, apenas `searchInput()`
 * deja de ser `undefined`, sin importar el momento exacto del ciclo de
 * vida en que eso ocurra.
 */
@Component({
  selector: 'app-recent-policies',
  // Nota: <a href> plano (no routerLink/RouterLink) a propósito. El spec de
  // este componente crea el fixture sin TestBed.configureTestingModule ni
  // provideRouter(), así que RouterLink (que inyecta ActivatedRoute/Router)
  // haría explotar el test con NG0201 apenas se crea el componente.
  template: `
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
      <a
        href="/lab"
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
        href="/lab/recent-policies/legacy"
        class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100"
      >
        Ver versión legacy →
      </a>
    </div>

    <div class="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
      <span
        class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
      >
        viewChild() + effect()
      </span>
      <input
        #searchInput
        type="text"
        placeholder="Buscar póliza..."
        class="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
      />
      <ul class="mt-4 flex flex-col gap-2 text-sm">
        @for (policy of policies; track policy.id) {
          <li #policyRow class="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
            {{ policy.holderName }}
          </li>
        }
      </ul>
      <p class="mt-4 border-t border-emerald-100 pt-3 text-xs font-medium text-slate-500">
        Filas encontradas: <span class="font-semibold text-slate-800">{{ rowCount() }}</span>
      </p>
    </div>
  `,
})
export class RecentPoliciesComponent {
  readonly policies = [
    { id: 'POL-1', holderName: 'Ana Beatriz Ríos' },
    { id: 'POL-2', holderName: 'Tomás Vera' },
  ];

  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  readonly policyRows = viewChildren<ElementRef>('policyRow');

  readonly rowCount = computed(() => this.policyRows().length);

  constructor() {
    effect(() => {
      const input = this.searchInput();
      if (input) {
        input.nativeElement.focus();
      }
    });
  }
}
