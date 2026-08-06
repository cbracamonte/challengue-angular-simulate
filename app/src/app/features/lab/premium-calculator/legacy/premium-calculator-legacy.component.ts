import { Component, computed, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { POLICY_TIERS, PolicyTier, TIER_PRICING } from '../premium-calculator.model';

/**
 * Versión legacy: `deductible` es un `signal()` plano que se mantiene "en
 * sincro" con `selectedTier` a mano, dentro de un `effect()` que llama
 * `this.deductible.set(...)`. Por qué esto está mal (docs oficiales de
 * Angular — guía "Effects", sección "Use cases for effects"):
 *
 * 1. Redundante con la API que ya existe para esto. Los docs son
 *    explícitos: para "derived values" usá `computed()`, y para valores
 *    "that can be both derived and manually set" usá `linkedSignal()` —
 *    exactamente el caso de `deductible`. Reimplementar esa semántica a
 *    mano con `effect()` + `signal()` es más código para el mismo
 *    resultado (cuando sale bien) o un resultado peor (cuando no).
 * 2. Ciclos de change detection de más. Los docs advierten literalmente
 *    que "using effects to propagate state changes can lead to infinite
 *    circular updates or change detection errors" — acá no llega a
 *    infinito, pero cada `.set()` dentro del effect dispara un ciclo de
 *    reactividad adicional que un `linkedSignal` no necesita: su
 *    `computation` se re-evalúa como parte del mismo grafo de signals, sin
 *    un effect intermedio escribiendo a otro signal.
 * 3. BUG CONCRETO, no solo un problema de estilo: la `computation` de un
 *    `linkedSignal` declara sus dependencias por lo que LEE, nada más
 *    —`linkedSignal(() => this.recommendedDeductible())` depende
 *    únicamente de `recommendedDeductible` (y transitivamente de
 *    `selectedTier`), sin posibilidad de "colarse" otra dependencia sin
 *    querer. Un `effect()` no tiene ese resguardo: es un bloque imperativo
 *    cualquiera, y CUALQUIER signal que se lea adentro (a propósito o por
 *    descuido) pasa a ser una dependencia más. Abajo, el effect lee
 *    `extraCoverage()` "solo para loguear" sin envolverlo en `untracked()`
 *    — eso alcanza para que cambiar la cobertura extra (que no debería
 *    tener nada que ver con el deducible) dispare este effect entero y
 *    PISE el override manual del usuario con el valor recomendado del
 *    tier. El usuario escribe un deducible a medida, toca cualquier otro
 *    campo, y su valor desaparece sin ningún cambio de tier de por medio.
 *
 * No editar: es la referencia de "lo que hay en producción" (de un repo
 * viejo). La versión corregida — con `linkedSignal()` y `untracked()` bien
 * usados — está en `../premium-calculator.component.ts`.
 */
@Component({
  selector: 'app-premium-calculator-legacy',
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
        routerLink="/lab/premium-calculator"
        class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100"
      >
        ← Volver a tu implementación moderna
      </a>
    </div>

    <div class="rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
      <span
        class="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800"
      >
        Legacy (read-only) — signal + effect "a mano"
      </span>

      <div class="mt-4 flex flex-col gap-3">
        <label class="flex flex-col gap-1 text-sm text-slate-700">
          Nivel de cobertura
          <select
            (change)="onTierChange($event)"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none"
          >
            @for (tier of tiers; track tier) {
              <option [value]="tier" [selected]="tier === selectedTier()">{{ tier }}</option>
            }
          </select>
        </label>

        <label class="flex flex-col gap-1 text-sm text-slate-700">
          Deducible — probá escribir un valor y después tocar "Cobertura extra"
          <input
            type="number"
            [value]="deductible()"
            (input)="onDeductibleInput($event)"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none"
          />
        </label>

        <label class="flex flex-col gap-1 text-sm text-slate-700">
          Cobertura extra (no debería afectar el deducible — pero lo afecta: ese es el bug)
          <input
            type="number"
            [value]="extraCoverage()"
            (input)="onExtraCoverageInput($event)"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none"
          />
        </label>

        <p class="mt-1 rounded-lg border border-amber-200 bg-white px-3 py-2.5 text-sm text-slate-600 shadow-sm">
          Prima total
          <span class="block text-2xl font-bold tabular-nums text-amber-700">\${{ totalPremium() }}</span>
        </p>
      </div>
    </div>
  `,
})
export class PremiumCalculatorLegacyComponent {
  protected readonly tiers = POLICY_TIERS;

  readonly selectedTier = signal<PolicyTier>('estandar');
  readonly extraCoverage = signal(0);

  readonly basePremium = computed(() => TIER_PRICING[this.selectedTier()].base);
  readonly recommendedDeductible = computed(() => TIER_PRICING[this.selectedTier()].deductible);

  // Anti-patrón: signal plano "sincronizado" a mano en vez de linkedSignal().
  readonly deductible = signal(TIER_PRICING['estandar'].deductible);

  readonly totalPremium = computed(() => this.basePremium() + this.deductible() * 0.1 + this.extraCoverage());

  constructor() {
    effect(() => {
      // BUG: `extraCoverage()` se lee sin `untracked()`, así que queda
      // como dependencia del effect igual que `recommendedDeductible()`.
      // Cualquier cambio en la cobertura extra dispara este callback y
      // resetea `deductible` al valor recomendado, borrando el override
      // manual del usuario aunque el tier no haya cambiado.
      console.debug('[premium-calculator-legacy] extraCoverage:', this.extraCoverage());
      this.deductible.set(this.recommendedDeductible());
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
