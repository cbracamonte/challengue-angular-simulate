import { Component, computed, effect, linkedSignal, signal, untracked } from '@angular/core';
import {
  DEDUCTIBLE_LOAD_FACTOR,
  POLICY_TIERS,
  PREMIUM_CALCULATOR_STORAGE_KEY,
  PolicyTier,
  TIER_PRICING,
} from './premium-calculator.model';

/**
 * Fundamento teórico (docs oficiales de Angular — guía "Deriving state with
 * linked signals" y referencia de API `linkedSignal`): `deductible` no
 * puede ser un `computed()` porque el usuario necesita poder pisarlo a mano
 * (una cotización real permite negociar el deducible), y `computed()` es de
 * solo lectura por diseño. Tampoco puede ser un `signal()` plano
 * sincronizado "a mano" con un `effect()` — ese es exactamente el
 * anti-patrón de `legacy/premium-calculator-legacy.component.ts` (ver su
 * comentario para el bug concreto que produce).
 *
 * `linkedSignal(() => this.recommendedDeductible())` resuelve ambos
 * requisitos con una sola API: es un `WritableSignal`, así que
 * `deductible.set(valorManual)` funciona igual que en un signal común — pero
 * a diferencia de un signal común, cuando la señal fuente que lee su
 * `computation` (acá, `recommendedDeductible`, que a su vez depende de
 * `selectedTier`) cambia de valor, Angular vuelve a ejecutar la
 * `computation` y el override manual se descarta, quedando otra vez atado
 * al valor recomendado del nuevo tier. Documentado explícitamente en los
 * docs: "the linkedSignal automatically re-syncs with its computation"
 * cuando cambia el signal fuente, pero admite `.set()`/`.update()` en el
 * medio — la señal "recuerda" el último valor escrito hasta que el fuente
 * fuerza un recálculo.
 */
@Component({
  selector: 'app-premium-calculator',
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
        href="/lab/premium-calculator/legacy"
        class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100"
      >
        Ver versión legacy →
      </a>
    </div>

    <div class="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
      <span
        class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
      >
        linkedSignal() + effect()
      </span>

      <div class="mt-4 flex flex-col gap-3">
        <label class="flex flex-col gap-1 text-sm text-slate-700">
          Nivel de cobertura (signal)
          <select
            (change)="onTierChange($event)"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          >
            <!-- [selected] por <option> en vez de [value] en el <select>: el
                 binding [value] del <select> se evalúa antes de que el @for
                 termine de crear las <option>, así que el browser no
                 encuentra ningún <option> con ese value todavía y cae al
                 primero (selectedIndex 0) — desincronizado del signal desde
                 el primer render. [selected] en cada <option> no tiene ese
                 problema de orden porque se resuelve sobre el propio nodo
                 recién creado. -->
            @for (tier of tiers; track tier) {
              <option [value]="tier" [selected]="tier === selectedTier()">{{ tier }}</option>
            }
          </select>
        </label>

        <div class="grid grid-cols-2 gap-3 text-sm">
          <p class="rounded-lg bg-white px-3 py-2 text-slate-600 shadow-sm">
            Prima base (computed)
            <span class="block text-lg font-semibold text-slate-900">\${{ basePremium() }}</span>
          </p>
          <p class="rounded-lg bg-white px-3 py-2 text-slate-600 shadow-sm">
            Deducible recomendado (computed)
            <span class="block text-lg font-semibold text-slate-900">\${{ recommendedDeductible() }}</span>
          </p>
        </div>

        <label class="flex flex-col gap-1 text-sm text-slate-700">
          Deducible — editable (linkedSignal, se resetea solo al cambiar de tier)
          <input
            type="number"
            [value]="deductible()"
            (input)="onDeductibleInput($event)"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </label>

        <label class="flex flex-col gap-1 text-sm text-slate-700">
          Cobertura extra (signal)
          <input
            type="number"
            [value]="extraCoverage()"
            (input)="onExtraCoverageInput($event)"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </label>

        <p class="mt-1 rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-slate-600 shadow-sm">
          Prima total (computed — diamante sobre computed + signal)
          <span class="block text-2xl font-bold tabular-nums text-emerald-700">\${{ totalPremium() }}</span>
        </p>
      </div>
    </div>
  `,
})
export class PremiumCalculatorComponent {
  protected readonly tiers = POLICY_TIERS;

  // Fundamento teórico (docs oficiales de Angular — guía "Signals"):
  // `signal()` crea el estado reactivo más básico, de lectura (`()`) y
  // escritura (`.set()`/`.update()`) explícitas. `selectedTier` y
  // `extraCoverage` son la única fuente de verdad del formulario: nada más
  // en este componente guarda estado por su cuenta, todo lo demás se
  // deriva de estos dos signals (más el override manual de `deductible`).
  readonly selectedTier = signal<PolicyTier>('estandar');
  readonly extraCoverage = signal(0);

  // Fundamento teórico (docs oficiales de Angular — guía "Signals",
  // sección "Computed signals"): `computed()` deriva un valor de lectura a
  // partir de otros signals y memoiza el resultado — solo se vuelve a
  // evaluar cuando `selectedTier` efectivamente cambia, no en cada change
  // detection. Dos computed distintos pueden leer el mismo signal fuente
  // sin acoplarse entre sí ni duplicar el lookup.
  readonly basePremium = computed(() => TIER_PRICING[this.selectedTier()].base);
  readonly recommendedDeductible = computed(() => TIER_PRICING[this.selectedTier()].deductible);

  // linkedSignal(): ver el fundamento teórico completo en el comentario de
  // clase, arriba del @Component. Es el punto central de este ejercicio.
  readonly deductible = linkedSignal(() => this.recommendedDeductible());

  // Fundamento teórico (docs oficiales de Angular — guía "Signals",
  // sección "Computed signals"): esto arma un "diamante" de dependencias —
  // `totalPremium` depende de dos computed (`basePremium`,
  // `recommendedDeductible` vía `deductible`) y de un signal plano
  // (`extraCoverage`). Angular resuelve el grafo y memoiza cada nodo por
  // separado: cambiar `extraCoverage` NO vuelve a ejecutar `basePremium` ni
  // `recommendedDeductible`, solo recalcula `totalPremium` con los valores
  // ya cacheados de los demás.
  readonly totalPremium = computed(
    () => this.basePremium() + this.deductible() * DEDUCTIBLE_LOAD_FACTOR + this.extraCoverage(),
  );

  constructor() {
    // Fundamento teórico (docs oficiales de Angular — guía "Effects",
    // sección "Use cases for effects"): los docs son explícitos en que
    // `effect()` está pensado para sincronizar estado de signals con APIs
    // imperativas NO reactivas — logging, `localStorage`, DOM custom — y
    // que "using effects to propagate state changes can lead to infinite
    // circular updates or change detection errors". Este es exactamente
    // ese caso sancionado por la documentación: `localStorage` vive fuera
    // del grafo reactivo de Angular, así que un `effect()` es la
    // herramienta correcta (no un computed, que debe ser puro y sin
    // side-effects; no otro linkedSignal, que sería estado, no un efecto).
    effect(() => {
      const snapshot = { tier: this.selectedTier(), deductible: this.deductible() };

      // Fundamento teórico (docs oficiales de Angular — API `untracked`):
      // `untracked()` ejecuta la función que recibe en un contexto NO
      // reactivo — cualquier signal leído adentro NO se registra como
      // dependencia del effect que lo contiene. Acá queremos loguear
      // `extraCoverage()` para debug, pero SIN que cada tecla tipeada en
      // ese input dispare este effect (que solo debe reaccionar a
      // `selectedTier`/`deductible`, no a la cobertura extra). Sin
      // `untracked()`, leer `extraCoverage()` directo acá adentro la
      // volvería una dependencia más — el effect se re-ejecutaría (y
      // reescribiría `localStorage`) en cada cambio de cobertura extra,
      // trabajo redundante que además ensucia el storage con escrituras
      // que no cambiaron ni tier ni deducible.
      const extraForDebug = untracked(() => this.extraCoverage());
      console.debug('[premium-calculator] cobertura extra actual (solo debug):', extraForDebug);

      localStorage.setItem(PREMIUM_CALCULATOR_STORAGE_KEY, JSON.stringify(snapshot));
    });
  }

  onTierChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as PolicyTier;
    this.selectedTier.set(value);
  }

  onDeductibleInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (!Number.isNaN(value)) {
      this.deductible.set(value);
    }
  }

  onExtraCoverageInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (!Number.isNaN(value)) {
      this.extraCoverage.set(value);
    }
  }
}
