import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

/**
 * Fundamento teórico (docs oficiales de Angular — "Requirements for
 * Zoneless compatibility"): sin `zone.js`, Angular deja de "parchear" APIs
 * async como `setInterval` para saber cuándo re-chequear la vista; el
 * change detection zoneless corre solo a partir de notificaciones
 * explícitas de sus propias APIs reactivas — señales (`signal`), listeners
 * de template y `markForCheck()`. Un campo plano mutado (`this.count++`)
 * no es ninguna de esas cosas: el valor cambia en memoria, pero Angular
 * jamás se entera y el template queda desactualizado sin ningún error.
 *
 * Un `signal` sí notifica directamente al grafo reactivo de Angular en
 * cada `.set()`/`.update()`, sin depender de que algo "parchee" el timer
 * que lo dispara — por eso funciona igual sea un `setInterval`, un
 * `WebSocket` o cualquier callback async, con o sin zone.js.
 */
@Component({
  selector: 'app-live-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Nota: este template usa <a href> plano (no routerLink/RouterLink) a
  // propósito. El spec de este componente crea el fixture sin
  // TestBed.configureTestingModule ni provideRouter(), así que inyectar
  // RouterLink (que requiere ActivatedRoute/Router) haría explotar el test
  // con NG0201 apenas se crea el componente.
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
        href="/lab/live-counter/legacy"
        class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100"
      >
        Ver versión legacy →
      </a>
    </div>

    <div class="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
      <span
        class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
      >
        Signal reactivo
      </span>
      <p class="mt-4 text-sm text-slate-700">
        Pólizas emitidas hoy:
        <span class="text-2xl font-bold tabular-nums text-emerald-700">{{ count() }}</span>
      </p>
    </div>
  `,
})
export class LiveCounterComponent {
  count = signal(0);

  constructor() {
    const intervalId = setInterval(() => {
      this.count.update((v) => v + 1);
    }, 20);
    inject(DestroyRef).onDestroy(() => clearInterval(intervalId));
  }
}
