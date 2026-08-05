import { Component, DestroyRef, inject } from '@angular/core';

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
  template: `<p>Pólizas emitidas hoy: {{ count }}</p>`,
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
