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
  template: `<p>Pólizas emitidas hoy: {{ count() }}</p>`,
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
