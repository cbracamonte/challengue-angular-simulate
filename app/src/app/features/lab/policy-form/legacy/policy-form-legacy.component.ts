import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [FormsModule],
  template: `
    <form>
      <input name="holderName" [(ngModel)]="holderName" placeholder="Titular" />
      <input name="premium" type="number" [(ngModel)]="premium" placeholder="Prima" />
      <button type="button" [disabled]="!canSubmit()" (click)="submit()">Emitir</button>
    </form>
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
